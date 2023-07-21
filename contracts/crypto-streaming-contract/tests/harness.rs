use fuels::{prelude::*, types::{ContractId, Identity}};

// Load abi from json
abigen!(Contract(
    name = "MyContract",
    abi = "out/debug/crypto-streaming-contract-abi.json"
));

async fn get_contract_instance() -> (MyContract<WalletUnlocked>, ContractId, Vec<WalletUnlocked>) {
    // Launch a local network and deploy the contract
    let wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(3),             /* Single wallet */
            Some(3),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await;
    let wallet = wallets.get(0).unwrap().clone();

    let id = Contract::load_from(
        "./out/debug/crypto-streaming-contract.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxParameters::default())
    .await
    .unwrap();

    let instance = MyContract::new(id.clone(), wallet);

    (instance, id.into(), wallets)
}

#[tokio::test]
async fn can_create_stream() {
    let (instance, _id, wallets) = get_contract_instance().await;

    // Now you have an instance of your contract you can use to test each function
    let wallet_1 = wallets.get(0).unwrap();
    let wallet_2 = wallets.get(1).unwrap();
    let wallet_3 = wallets.get(2).unwrap();
    // Initilize Stream

    let config: Config = Config {
        start_date: 0,
        cancel_previlege: 1,
        transfer_previlege: 1,
        recipient: Identity::Address(wallet_2.address().into()),
        unlock_number: 5,
        unlock_amount_each_time: 1000,
        unlock_every: 100,
        prepaid: 0
    };

    let _ = instance
        .with_account(wallet_1.clone())
        .unwrap()
        .methods()
        .initialize(
            config.clone()
        )
        .call()
        .await;

    let (config, _, _, _, _) = instance
        .methods()
        .get_stream_info()
        .call()
        .await
        .unwrap().value;

    assert_eq!(config.recipient, Identity::Address(wallet_2.address().into()));

    // Fund stream
    // Setup call params
    let amount = 20_000;
    let call_params = CallParameters::default().set_amount(amount);
    // Call send funds
    let _ = instance
        .with_account(wallet_1.clone())
        .unwrap()
        .methods()
        .send_fund()
        .call_params(call_params)
        .unwrap()
        .call()
        .await;

    // Check Stream balance
    let balance = instance.methods()
    .get_balance()
    .call()
    .await
    .unwrap().value;

    assert_eq!(balance, 20_000);

    // Withdraw funds

    let _ = instance
        .with_account(wallet_2.clone())
        .unwrap()
        .methods()
        .withdraw()
        .call()
        .await;
    // Check balance again
    let new_balance = instance.methods()
    .get_balance()
    .call()
    .await
    .unwrap().value;

    assert!(new_balance < balance);

}
