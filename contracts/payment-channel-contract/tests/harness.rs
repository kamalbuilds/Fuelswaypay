use fuels::{prelude::*, types::{ContractId, Identity, Bits256}};

// Load abi from json
abigen!(Contract(
    name = "MyContract",
    abi = "out/debug/payment-channel-contract-abi.json"
));

async fn get_contract_instance() -> (MyContract<WalletUnlocked>, ContractId, Vec<WalletUnlocked>) {
    // Launch a local network and deploy the contract
    let wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(2),             /* Single wallet */
            Some(2),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None,
    )
    .await;
    let wallet = wallets.get(0).unwrap().clone();

    let id = Contract::load_from(
        "./out/debug/payment-channel-contract.bin",
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
async fn can_create_channel() {
    let (instance, _id, wallets) = get_contract_instance().await;

    // Now you have an instance of your contract you can use to test each function

    let wallet_1 = wallets.get(0).unwrap();
    let wallet_2 = wallets.get(1).unwrap();

    // Init contract
    let _ = instance
        .with_account(wallet_1.clone())
        .unwrap()
        .methods()
        .initialize(
            wallet_2.address().into()
        )
        .call()
        .await;

    // Check contract
    
    let (payer, payee, _, _, _) = instance.methods()
    .get_channel_info()
    .call()
    .await
    .unwrap().value;

    assert_eq!(payer, wallet_1.address().into());
    assert_eq!(payee, wallet_2.address().into());

    // Get hash
    let hash = instance.methods()
    .get_hash(1000, 0, wallet_2.address().into())
    .call()
    .await
    .unwrap().value;

    // sign message

    // let signature = wallet_1.sign_message(hash).await;
    


}
