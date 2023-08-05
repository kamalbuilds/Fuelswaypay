use fuels::{prelude::*, types::{ContractId, Identity, SizedAsciiString}};

// Load abi from json
abigen!(Contract(
    name = "MyContract",
    abi = "out/debug/dao-contract-abi.json"
));


async fn get_contract_instance() -> (MyContract<WalletUnlocked>, ContractId, Vec<WalletUnlocked>) {
    // Launch a local network and deploy the contract
    let wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(6),             /* 6 wallets */
            Some(6),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None
    )
    .await;
    let wallet = wallets.get(0).unwrap().clone();

    let id = Contract::load_from(
        "./out/debug/dao-contract.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet, TxParameters::default())
    .await
    .unwrap();

    let instance = MyContract::new(id.clone(), wallet);

    (instance, id.into(), wallets)
}

async fn get_contract_instance_1() -> (MyContract<WalletUnlocked>, ContractId, Vec<WalletUnlocked>) {
    let wallets = launch_custom_provider_and_get_wallets(
        WalletsConfig::new(
            Some(1),             /* 1 wallets */
            Some(1),             /* Single coin (UTXO) */
            Some(1_000_000_000), /* Amount per coin */
        ),
        None,
        None
    )
    .await;
    let wallet = wallets.get(0).unwrap().clone();

    let id = Contract::load_from(
        "./out/debug/dao-contract.bin",
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
async fn can_initialize() {
    let (instance, _id, wallets) = get_contract_instance().await;
    let (_instance_1, _id_1, _) = get_contract_instance_1().await;
    // get access to a test wallet
    let wallet_1 = wallets.get(0).unwrap();
    let wallet_2 = wallets.get(1).unwrap();
    let wallet_3 = wallets.get(2).unwrap();
    let wallet_4 = wallets.get(3).unwrap();
    let wallet_5 = wallets.get(4).unwrap();
    // Now you have an instance of your contract you can use to test each function
    
    let config: DaoConfig = DaoConfig {
        quorum: 20,
        open: false,
        dao_type: 1
    };
  
    let members: [Address;5] = [
        wallet_1.address().into(),
        wallet_2.address().into(),
        wallet_3.address().into(),
        wallet_4.address().into(),
        wallet_5.address().into(),
    ];

    let whitelist_contributors: [Identity;5] = [
        Identity::Address(wallet_1.address().into()),
        Identity::Address(wallet_2.address().into()),
        Identity::Address(wallet_3.address().into()),
        Identity::Address(wallet_4.address().into()),
        Identity::Address(wallet_5.address().into())
    ];


    //initialize wallet_1 as the owner
    let _ = instance
        .with_account(wallet_1.clone())
        .unwrap()
        .methods()
        .initialize(
            config.clone(),
            members.clone(),
            whitelist_contributors.clone()
        )
        .call()
        .await;

    let (_config, _, _, _, _, _, _) = instance
        .methods()
        .get_dao_info()
        .call()
        .await
        .unwrap().value;

  
    // make sure the returned config title is correct
    assert_eq!(_config.quorum, 20);

    // Check is_member function
    let is_member = instance.methods().is_member(wallet_3.address().into()).call().await.unwrap().value;
    
    assert_eq!(is_member, true);

    // Create Proposal and check the proposal's information.
    let _ = instance
    .with_account(wallet_2.clone())
    .unwrap()
    .methods()
    .create_proposal(
        1,
        Identity::Address(wallet_3.address().into()),
        1000,
        1,
        20,
        true
    )
    .call()
    .await;

    let proposal = instance.methods()
    .get_proposal_by_id(0)
    .call()
    .await
    .unwrap().value;

    // Check proposal amount
    assert_eq!(proposal.unwrap().amount, 1000);

    // Start funding DAO

    // Setup call params
    let amount = 20_000;
    let call_params = CallParameters::default().set_amount(amount);
    // Call send funds
    let _ = instance
        .with_account(wallet_2.clone())
        .unwrap()
        .methods()
        .send_fund()
        .call_params(call_params)
        .unwrap()
        .call()
        .await;

    // Check DAO balance
    let balance = instance.methods()
    .get_balance()
    .call()
    .await
    .unwrap().value;

    assert_eq!(balance, 20_000);

    // Init another DAO & Funding proposal
    // Init instance_1
    let _ = _instance_1
        .with_account(wallet_2.clone())
        .unwrap()
        .methods()
        .initialize(
            config.clone(),
            members.clone(),
            whitelist_contributors.clone()
        )
        .call()
        .await;

    // Create a funding proposal

    let _ = instance
    .with_account(wallet_2.clone())
    .unwrap()
    .methods()
    .create_proposal(
        2,
        Identity::ContractId(_id_1),
        2000,
        1,
        20,
        true
    )
    .call()
    .await;

    let proposal_1 = instance.methods()
    .get_proposal_by_id(1)
    .call()
    .await
    .unwrap().value;

    // Check proposal_1 amount

    assert_eq!(proposal_1.unwrap().amount, 2000);

    // Voting for proposal 01

    let _ = instance
    .with_account(wallet_1.clone())
    .unwrap()
    .methods()
    .vote(
        0,
        true
    )
    .call()
    .await;

    let _ = instance
    .with_account(wallet_2.clone())
    .unwrap()
    .methods()
    .vote(
        0,
        true
    )
    .call()
    .await;

    // Execute payout proposal
    // let wallet_3_balance_before: u64 = wallet_3.get_asset_balance(&BASE_ASSET_ID).await.unwrap();
    let _ = instance
    .with_account(wallet_1.clone())
    .unwrap()
    .methods()
    .execute_proposal(
        0
    )
    .call()
    .await;

    // Check balance of recipient
    // let wallet_3_balance_after: u64 = wallet_3.get_asset_balance(&BASE_ASSET_ID).await.unwrap();
    let balance = instance.methods()
    .get_balance()
    .call()
    .await
    .unwrap().value;

    // Check DAO balance after
    // Up to SDK version, this can make error
    assert_eq!(balance, 19_000);   

    // Execute funding proposal

    let _ = instance
    .with_account(wallet_1.clone())
    .unwrap()
    .methods()
    .vote(
        1,
        true
    )
    .call()
    .await;
    
    // Execute funding proposal
    let balance_before: u64 = _instance_1.methods()
    .get_balance()
    .call()
    .await
    .unwrap().value;

    let _ = instance
    .with_account(wallet_1.clone())
    .unwrap()
    .methods()
    .execute_proposal(
        1
    )
    .call()
    .await;

    // Check balance of DAO.

    let balance_after: u64 = _instance_1.methods()
    .get_balance()
    .call()
    .await
    .unwrap().value;

    // Up to SDK version, this can make error
    assert_eq!(balance_after - balance_before, 2000);

}
