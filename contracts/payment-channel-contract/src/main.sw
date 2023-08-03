contract;

mod abi_structs;

use { 
        abi_structs::*,
        std::{
            block::{ height, timestamp },
            auth::{
                AuthError,
                msg_sender
            },
            call_frames::{
                msg_asset_id,
                contract_id
            },
            constants::{
                BASE_ASSET_ID,
                ZERO_B256
            },
            context::{
                msg_amount,
                this_balance
            },
            storage::StorageMap,
            storage::StorageVec,
            token::transfer,
            hash::{keccak256, sha256},
            b512::B512, 
            ecr::{ec_recover, ec_recover_address, EcRecoverError}
    }
};


enum InvalidError {
    CannotReinitialize: (),
    SenderIsNotOwner: (),
    ChannelIsNotActive: (),
    IncorrectAssetId: ContractId,
    ChannelBalanceNotEnough: (),
    NotChannelPayee: (),
    NotChannelPayer: (),
    IsUsedNonce: u64
}

storage {
    payee: Address = Address::from(ZERO_B256),
    payer: Address = Address::from(ZERO_B256),
    status: u64 = 0,
    total_fund: u64 = 0,
    use_nonces: StorageMap<u64, bool> = StorageMap {}
}

pub fn get_msg_sender_address_or_panic() -> Address {
    let sender: Result<Identity, AuthError> = msg_sender();
    if let Identity::Address(address) = sender.unwrap() {
        address
    } else {
        revert(0);
    }
}

#[storage(read)]
fn validate_owner() {
    let sender = get_msg_sender_address_or_panic();
    require(storage.payer == sender, InvalidError::SenderIsNotOwner);
}

impl Channel for Contract {

    #[storage(read, write)]
    fn initialize(payee: Address) {
        require(storage.payer.into() == ZERO_B256, InvalidError::CannotReinitialize);
        storage.payee = payee;
        storage.payer = get_msg_sender_address_or_panic();
        storage.status = 1;
    }

    #[storage(read, write)]
    fn claim_payment(hash: b256, amount: u64, nonce: u64, signature: B512) {
        require(storage.status == 1, InvalidError::ChannelIsNotActive);
        require(storage.use_nonces.get(nonce).is_none(), InvalidError::IsUsedNonce(nonce));
        require(this_balance(BASE_ASSET_ID) >= amount, InvalidError::ChannelBalanceNotEnough);

        let sender = get_msg_sender_address_or_panic();
        require(sender == storage.payee, InvalidError::NotChannelPayee);

        // Fuel Wallet creates a signature from a string by h256(message as a string), but sha256 creates a hash from bytes. So this made an issue.
        // This code block is expected logic:
        // let message =  keccak256((sender, amount, nonce, contract_id()));
        // let hash = sha256(message);
        // let result_address: Result<Address, EcRecoverError> = ec_recover_address(signature, hash);

        let result_address: Result<Address, EcRecoverError> = ec_recover_address(signature, hash);
   
        if let Result::Ok(address) = result_address {
            require(storage.payer == address, InvalidError::NotChannelPayer);
        } else {
            revert(0);
        }
       
        storage.use_nonces.insert(nonce, true);
        transfer(amount, BASE_ASSET_ID, Identity::Address(storage.payee));
    }

    #[storage(read, write), payable]
    fn send_fund() {
        validate_owner();
        require(storage.status == 1, InvalidError::ChannelIsNotActive);
        let asset_id = msg_asset_id();
        require(asset_id == BASE_ASSET_ID, InvalidError::IncorrectAssetId(asset_id));
        let amount = msg_amount();
        storage.total_fund += amount;
    }

    fn get_balance() -> u64 {
        this_balance(BASE_ASSET_ID)
    }

    #[storage(read)]
    fn get_channel_info() -> (Address, Address, u64, u64, u64) {
        (
            storage.payer,
            storage.payee,
            storage.status,
            storage.total_fund,
            this_balance(BASE_ASSET_ID)
        )
    }
    #[storage(read)]
    fn get_hash(amount: u64, nonce:u64, payee: Address) -> b256 {
        require(storage.use_nonces.get(nonce).is_none(), InvalidError::IsUsedNonce(nonce));
        keccak256((payee, amount, nonce, contract_id()))
    }

    #[storage(read, write)]
    fn close() {
        validate_owner();
        require(storage.status == 1, InvalidError::ChannelIsNotActive);
        storage.status = 2;
        transfer(this_balance(BASE_ASSET_ID), BASE_ASSET_ID, Identity::Address(storage.payer));
    }

}
