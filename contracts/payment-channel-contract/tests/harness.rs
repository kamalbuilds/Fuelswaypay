use fuels::{prelude::*, accounts::fuel_crypto::{Signature}, types::{ContractId, Bits256, B512}};
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

    // Send fund
    let amount = 20_000;
    let call_params = CallParameters::default().set_amount(amount);
    let _ = instance
    .with_account(wallet_1.clone())
    .unwrap()
    .methods()
    .send_fund()
    .call_params(call_params)
    .unwrap()
    .call()
    .await;


    let hex_str = "0101010101010101010101010101010101010101010101010101010101010101";

    let bits256: Result<Bits256> = Bits256::from_hex_str(hex_str);
    if let Result::Ok(b256) = bits256 {
        // Error with version 0.38.1 : Expected `Result<Signature, Error>`, found `Result<Signature, WalletError>`
        let result: Result<Signature, WalletError>  = wallet_1.sign_message(hex_str).await;

        let mut sign = B512 {
            bytes: [b256, b256],
        };
    
        if let Result::Ok(signature) = result {
            sign = signature;
        };
    
        let _ = instance
            .with_account(wallet_2.clone())
            .unwrap()
            .methods()
            .claim_payment(
                b256,
                1000, 
                0,
                sign
            )
            .call()
            .await;
    
         // Check balance again
         let new_balance = instance.methods()
         .get_balance()
         .call()
         .await
         .unwrap().value;
    
    
         // Up to SDK version, this can make error
         assert_eq!(new_balance, 19_000);
    
    } else {
        assert_eq!(0, 1)
    }

    
}
