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
        call_frames::msg_asset_id,
        constants::BASE_ASSET_ID,
        constants::ZERO_B256,
        context::{
            msg_amount,
            this_balance,
        },
        storage::StorageMap,
        storage::StorageVec,
        token::transfer,
    }
};

enum InvalidError {
    CannotReinitialize: (),
    SenderIsNotOwner: (),
    StreamIsNotStart: (),
    StreamIsNotActive: (),
    // StreamHasNotRecipient: (),
    IncorrectAssetId: ContractId,
    StreamBalanceNotEnough: (),
    NotStreamRecipient: (),
    NotOwnerOrRecipient: (),
    NotAvaiableAmount: (),
    NotPermissionToCancel: (),
    NotPermissionToTransfer: ()
}

storage {
    config: Config = Config {
        start_date: 0,
        cancel_previlege: 0,
        transfer_previlege: 0,
        recipient: Identity::Address(Address::from(ZERO_B256)),
        unlock_number: 0,
        unlock_every: 0,
        unlock_amount_each_time: 0,
        prepaid: 0
    },
    status: u64 = 0,
    owner: Address = Address::from(ZERO_B256),
    withdrew: u64 = 0,
    total_fund: u64 = 0
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
    require(storage.owner == sender, InvalidError::SenderIsNotOwner);
}

#[storage(read)]
fn get_avaiable_amount() -> (u64, u64) {
        let mut total_unlocked_amount = 0;
        let mut unlocked_number = (timestamp() - storage.config.start_date) / storage.config.unlock_every;
        if (unlocked_number >= storage.config.unlock_number) {
            unlocked_number = storage.config.unlock_number;
        } 

        total_unlocked_amount = storage.config.unlock_amount_each_time * unlocked_number;

        let avaiable_amount = total_unlocked_amount + storage.config.prepaid - storage.withdrew;
        (unlocked_number, avaiable_amount)
}

impl Stream for Contract {
    #[storage(read, write)]
    fn initialize(config: Config) {
        require(storage.owner.into() == ZERO_B256, InvalidError::CannotReinitialize);
        storage.config = config;
        storage.status = 1;
        storage.owner = get_msg_sender_address_or_panic();
    }
    
    #[storage(read, write), payable]
    fn send_fund() {
        validate_owner();
        let asset_id = msg_asset_id();
        require(asset_id == BASE_ASSET_ID, InvalidError::IncorrectAssetId(asset_id));
        let amount = msg_amount();
        storage.total_fund += amount;
    }

    #[storage(read, write)]
    fn withdraw() {
        require(storage.status == 1, InvalidError::StreamIsNotActive);
        require(timestamp() >= storage.config.start_date, InvalidError::StreamIsNotStart);

        let sender = get_msg_sender_address_or_panic();
        require((Identity::Address(sender) == storage.config.recipient) || (sender == storage.owner), InvalidError::NotOwnerOrRecipient);

        let (unlocked_number, avaiable_amount) = get_avaiable_amount();

        require(avaiable_amount > 0, InvalidError::NotAvaiableAmount);

        require(this_balance(BASE_ASSET_ID) >= avaiable_amount, InvalidError::StreamBalanceNotEnough);

        storage.withdrew += avaiable_amount;
        if (unlocked_number == storage.config.unlock_number) {
            storage.status = 2;
        }
        transfer(avaiable_amount, BASE_ASSET_ID, storage.config.recipient);
    }

    #[storage(read, write)]
    fn cancel_stream() {
        let config = storage.config;
        require(storage.status != 3, InvalidError::StreamIsNotActive);
        require(config.cancel_previlege != 4, InvalidError::NotPermissionToCancel);
        let sender = get_msg_sender_address_or_panic();
        if (config.cancel_previlege == 1) {
            validate_owner();
        }
        if (config.cancel_previlege == 2) {
            require(Identity::Address(sender) == config.recipient, InvalidError::NotStreamRecipient);
        }

        let (_, avaiable_amount) = get_avaiable_amount();
        let contract_balance = this_balance(BASE_ASSET_ID);
        let remain_amount = contract_balance - avaiable_amount;
        storage.status = 3;
        if (avaiable_amount > 0) {
            if ( contract_balance >= avaiable_amount) {
                storage.withdrew += avaiable_amount;
                transfer(avaiable_amount, BASE_ASSET_ID, config.recipient);
            } else {
                if (contract_balance > 0) {
                    storage.withdrew += contract_balance;
                    transfer(contract_balance, BASE_ASSET_ID, config.recipient);
                }
            }
            
        }

        if (remain_amount > 0) {
            transfer(contract_balance, BASE_ASSET_ID, Identity::Address(storage.owner));
        }

    }

    #[storage(read, write)]
    fn transfer_stream(new_recipient: Identity) {
        let mut config = storage.config;
        require(storage.status == 1, InvalidError::StreamIsNotActive);
        require(config.transfer_previlege != 4, InvalidError::NotPermissionToTransfer);
        
        let sender = get_msg_sender_address_or_panic();
        
        if (config.transfer_previlege == 1) {
            validate_owner();
        }

        if (config.transfer_previlege == 2) {
            require(Identity::Address(sender) == config.recipient, InvalidError::NotStreamRecipient);
        }

        let (_, avaiable_amount) = get_avaiable_amount();
        let contract_balance = this_balance(BASE_ASSET_ID);
        let old_recipient = config.recipient;

        config.recipient = new_recipient;

        storage.config = config;

        if (avaiable_amount > 0) {
            if ( contract_balance >= avaiable_amount) {
                storage.withdrew += avaiable_amount;
                transfer(avaiable_amount, BASE_ASSET_ID, old_recipient);
            } else {
                if (contract_balance > 0) {
                    storage.withdrew += contract_balance;
                    transfer(contract_balance, BASE_ASSET_ID, old_recipient);
                }
            }
            
        }
    }

    #[storage(read)]
    fn get_stream_info() -> (Config, u64, u64, u64, u64) {
        (
            storage.config,
            storage.status,
            storage.withdrew,
            storage.total_fund,
            this_balance(BASE_ASSET_ID)
        )
    }

    fn get_balance() -> u64 {
        this_balance(BASE_ASSET_ID)
    }
}
