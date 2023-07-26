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
    // MemberNotExists: (),
    // ProposalNotInDAO: (),
    DAOIsNotOpen: (),
    // DAOMemberExisted: (),
    DAOMemberNotExisted: (),
    SenderIsNotOwner: (),
    // IsNotDAOProposal: (),
    IsNotVotesEnough: (),
    NotToEndDate: (),
    VotingIsNotStart: (),
    VotingHasEnded: (),
    // ProposalWasExecuted: (),
    ProposalIsNotActive: (),
    DAOIsNotActive: (),
    ProposalHasNotRecipient: (),
    IncorrectAssetId: ContractId,
    DaoBalanceNotEnough: (),
    NotInWhitelistContributor: ()
}

storage {
    config: DaoConfig = DaoConfig {
        quorum: 100,
        open: false,
        dao_type: 1
    },
    owner: Address = Address::from(ZERO_B256),
    status: u64 = 0,
    start_date: u64 = 0,
    members: StorageVec<Address> = StorageVec {},
    whitelist_contributors: StorageVec<Identity> = StorageVec {},
    proposals: StorageVec<Proposal> = StorageVec {},
    voters: StorageMap<(Address, u64), bool> = StorageMap {},
    funds: StorageMap<Identity, u64> = StorageMap {} 
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

impl DAO for Contract {

    #[storage(read, write)]
    fn initialize(
        config: DaoConfig,
        members: [Address; 5],
        whitelist_contributors: [Identity; 5]
    ) {
        require(storage.owner.into() == ZERO_B256, InvalidError::CannotReinitialize);
        storage.config = config;
        storage.owner = get_msg_sender_address_or_panic();
        storage.status = 1;
        storage.start_date = timestamp();
        let mut i = 0;
        while i < 5 {
            if (Address::from(ZERO_B256) != members[i]) {
                storage.members.push(members[i]);
            }        
            i += 1;
        }

        i = 0;
        while i < 5 {
            if (Identity::Address(Address::from(ZERO_B256)) != whitelist_contributors[i]) {
                storage.whitelist_contributors.push(whitelist_contributors[i]);
            }      
            i += 1;
        }


    }

    #[storage(read, write)]
    fn create_proposal(
        proposal_type: u64,
        recipient: Identity,
        amount: u64,
        start_date: u64,
        end_date: u64,
        allow_early_execution: bool,
    ) -> u64 {
        require(storage.status == 1, InvalidError::DAOIsNotActive);
        let sender = get_msg_sender_address_or_panic();
        let id = storage.proposals.len();
        let proposal: Proposal = Proposal {
            id: id,
            owner: sender,
            proposal_type: proposal_type,
            status: 1,
            recipient: recipient,
            amount: amount,
            start_date: start_date,
            end_date: end_date,
            created_date: timestamp(),
            allow_early_execution: allow_early_execution,
            agree: 0,
            disagree: 0,
            executed: false
        };
        storage.proposals.push(proposal);
        id
    }

    #[storage(read, write), payable]
    fn send_fund() {
        require(storage.status == 1, InvalidError::DAOIsNotActive);
        let sender = msg_sender().unwrap();
        let asset_id = msg_asset_id();
        //Check whitelist contributors
        let mut i = 0;
        let mut is_exist = false;
        while i < storage.whitelist_contributors.len() {
            if (storage.whitelist_contributors.get(i).unwrap() == sender) {
                is_exist = true;
            }
            i += 1;
        }
        require(is_exist, InvalidError::NotInWhitelistContributor);
        require(asset_id == BASE_ASSET_ID, InvalidError::IncorrectAssetId(asset_id));
        let amount = msg_amount();
        let contributed_amount = storage.funds.get(sender).unwrap_or(0);
        storage.funds.insert(sender, contributed_amount + amount);
    }

    #[storage(read, write)]
    fn vote(
        proposal_id: u64,
        is_agree: bool
    ) {
        require(storage.status == 1, InvalidError::DAOIsNotActive);
        let sender = get_msg_sender_address_or_panic();

        //check sender is a member 
        let mut i = 0;
        let mut is_exist = false;
        while i < storage.members.len() {
            if (storage.members.get(i).unwrap() == sender) {
                is_exist = true;
            }

            i += 1;
        }

        require(is_exist, InvalidError::DAOMemberNotExisted);

        let proposal = if storage.proposals.len() - 1 < proposal_id {
                Option::None
            } else {
                storage.proposals.get(proposal_id)
            };
    
        if (Option::is_none(proposal)) {
            revert(1);
        }

        require(proposal.unwrap().status == 1, InvalidError::ProposalIsNotActive);
        let voter = storage.voters.get((sender, proposal_id));
        let mut mut_prosal = proposal.unwrap();

        require(mut_prosal.start_date <= timestamp(), InvalidError::VotingIsNotStart);
        require(mut_prosal.end_date >= timestamp(), InvalidError::VotingHasEnded);

        if is_agree {
            if (Option::is_none(voter)) {
                
                mut_prosal.agree += 1;

            } else {
                if (Option::is_some(voter)) {
                    mut_prosal.agree += 1;
                    mut_prosal.disagree -= 1;
                }
            }
            
        } else {
            if (Option::is_none(voter)) {
                mut_prosal.disagree += 1
            } else {
                if (Option::is_some(voter)) {
                    mut_prosal.disagree += 1;
                    mut_prosal.agree -= 1;
                }
            }
            
        } 
        storage.proposals.set(proposal_id, mut_prosal);
        storage.voters.insert((sender, proposal_id), is_agree);
    }
    
    #[storage(read, write)]
    fn execute_proposal(
        proposal_id: u64
    ) {
        require(storage.status == 1, InvalidError::DAOIsNotActive);

        let proposal = if storage.proposals.len() - 1 < proposal_id {
                Option::None
            } else {
                storage.proposals.get(proposal_id)
            };
        if (Option::is_none(proposal)) {
            revert(0);
        }
        let mut unwrap_proposal = proposal.unwrap();

        require(unwrap_proposal.status == 1, InvalidError::ProposalIsNotActive);
        require(unwrap_proposal.recipient != Identity::Address(Address::from(ZERO_B256)), InvalidError::ProposalHasNotRecipient);

        let count_member = storage.members.len();
        
        let agree = unwrap_proposal.agree;
        let rate = (agree * 10000 / count_member);
        
        require(rate >= storage.config.quorum * 100, InvalidError::IsNotVotesEnough);
        require(unwrap_proposal.amount <= this_balance(BASE_ASSET_ID), InvalidError::DaoBalanceNotEnough);

        if (!unwrap_proposal.allow_early_execution) {
            require(timestamp() >= unwrap_proposal.end_date, InvalidError::NotToEndDate)
        }
        unwrap_proposal.executed = true;
        unwrap_proposal.status = 2;

        storage.proposals.set(proposal_id, unwrap_proposal);
        if (unwrap_proposal.proposal_type == 1) {
            log("start transfer");
            transfer(unwrap_proposal.amount, BASE_ASSET_ID, unwrap_proposal.recipient);
        } 
        if (unwrap_proposal.proposal_type == 2) {
            let contract_id =  match unwrap_proposal.recipient {
                Identity::Address(_) => Option::None,
                Identity::ContractId(id) => Option::Some(id),
            };
            let funding_dao = abi(DAO, Option::unwrap(contract_id).into());
            log("Calling funding dao");
            funding_dao.send_fund {gas: 5000, asset_id: BASE_ASSET_ID.into(), coins: unwrap_proposal.amount}();
        }
        
    }

    //DaoConfig, Owner, Status, Proposal length, 
    //Member length
    //Balance
    //startDate
    #[storage(read)]
    fn get_dao_info() -> (DaoConfig, Address, u64, u64, u64, u64, u64) {
        (
            storage.config,
            storage.owner,
            storage.status,
            storage.proposals.len(),
            storage.members.len(),
            this_balance(BASE_ASSET_ID),
            storage.start_date
        )
    }

    #[storage(read, write)]
    fn add_member(new_member: Address) {
        validate_owner();
        require(storage.status == 1, InvalidError::DAOIsNotActive);
        let mut i = 0;
        // let mut is_exist = false;
        while i < storage.members.len() {
            if (storage.members.get(i).unwrap() == new_member) {
                // is_exist = true;
                revert(1);
            }
            i += 1;
        }
        // require(!is_exist, InvalidError::DAOMemberExisted);
        storage.members.push(new_member);
    }

    #[storage(read, write)]
    fn remove_member(old_member: Address) {
        validate_owner();
        require(storage.status == 1, InvalidError::DAOIsNotActive);
        let mut i = 0;
        let mut is_exist = false;
        let mut index = 0;
        while i < storage.members.len() {
            if (storage.members.get(i).unwrap() == old_member) {
                is_exist = true;
                index = i;
            }
            i += 1;
        }
        if (is_exist) {
            let _ = storage.members.remove(index);
        } else {
            revert(2)
        }
        
    }

    #[storage(read, write)]
    fn add_contributor_to_whitelist(contributor: Identity) {
        validate_owner();   
        require(storage.status == 1, InvalidError::DAOIsNotActive);
        let mut i = 0;
        while i < storage.whitelist_contributors.len() {
            if (storage.whitelist_contributors.get(i).unwrap() == contributor) {
                revert(3)
            }
            i += 1;
        }
        storage.whitelist_contributors.push(contributor);
    }

    #[storage(read, write)]
    fn remove_contributor_from_whitelist(contributor: Identity) {
        validate_owner();
        require(storage.status == 1, InvalidError::DAOIsNotActive);
        let mut i = 0;
        let mut is_exist = false;
        let mut index = 0;
        while i < storage.whitelist_contributors.len() {
            if (storage.whitelist_contributors.get(i).unwrap() == contributor) {
                is_exist = true;
                index = i;
                break;
            }
            i += 1;
        }
        if (is_exist) {
            let _ = storage.whitelist_contributors.remove(index);
        } else {
            revert(4)
        }
    }


    #[storage(read, write)]
    fn join() {
        require(storage.config.open, InvalidError::DAOIsNotOpen);
        require(storage.status == 1, InvalidError::DAOIsNotActive);
        let sender = get_msg_sender_address_or_panic();
        let mut i = 0;
        while i < storage.members.len() {
            if (storage.members.get(i).unwrap() == sender) {
                revert(5)
            }
            i += 1;
        }
        storage.members.push(sender);
    }

    #[storage(read, write)]
    fn leave() {
        require(storage.config.open, InvalidError::DAOIsNotOpen);
        require(storage.status == 1, InvalidError::DAOIsNotActive);
        let sender = get_msg_sender_address_or_panic();
        let mut i = 0;
        let mut is_exist = false;
        let mut index = 0;
        while i < storage.members.len() {
            if (storage.members.get(i).unwrap() == sender) {
                is_exist = true;
                index = i;
            }
            i += 1;
        }
        if (is_exist) {
            let _ = storage.members.remove(index);
        } else {
            revert(6)
        }
    }

    #[storage(read)]
    fn get_members(offset: u64) -> (
        Option<Address>, 
        Option<Address>,
        Option<Address>, 
        Option<Address>, 
        Option<Address>, 
        Option<Address>,
        Option<Address>,
        Option<Address>,
        Option<Address>,
        Option<Address>
        ) {
        let mut vec = Vec::new();
        let mut i = 0;
        while i < 10 {
            let member = if storage.members.len() - 1 < i + offset {
                Option::None
            } else {
                storage.members.get(storage.members.len() - 1 - i - offset)
            };
            vec.push(member);
            i += 1;
        }
        (
            vec.get(0).unwrap(),
            vec.get(1).unwrap(),
            vec.get(2).unwrap(),
            vec.get(3).unwrap(),
            vec.get(4).unwrap(),
            vec.get(5).unwrap(),
            vec.get(6).unwrap(),
            vec.get(7).unwrap(),
            vec.get(8).unwrap(),
            vec.get(9).unwrap(),
        )
    }

    #[storage(read)]
    fn get_whitelist_contributors(offset: u64) -> (
        Option<Identity>, 
        Option<Identity>,
        Option<Identity>, 
        Option<Identity>, 
        Option<Identity>, 
        Option<Identity>,
        Option<Identity>,
        Option<Identity>,
        Option<Identity>,
        Option<Identity>
    ) {
        let mut vec = Vec::new();
        let mut i = 0;
        while i < 10 {
            let contributor = if storage.whitelist_contributors.len() - 1 < i + offset {
                Option::None
            } else {
                storage.whitelist_contributors.get(storage.whitelist_contributors.len() - 1 - i - offset)
            };
            vec.push(contributor);
            i += 1;
        }
        (
            vec.get(0).unwrap(),
            vec.get(1).unwrap(),
            vec.get(2).unwrap(),
            vec.get(3).unwrap(),
            vec.get(4).unwrap(),
            vec.get(5).unwrap(),
            vec.get(6).unwrap(),
            vec.get(7).unwrap(),
            vec.get(8).unwrap(),
            vec.get(9).unwrap(),
        )
    }

    fn get_balance() -> u64 {
        this_balance(BASE_ASSET_ID)
    }
    
    #[storage(read)]
    fn get_count_proposal() -> u64 {
        storage.proposals.len()
    }

    #[storage(read)]
    fn get_count_member() -> u64 {
        storage.members.len()
    }

    #[storage(read)]
    fn get_proposal_by_id(proposal_id: u64) -> Option<Proposal> {
       let proposal = if storage.proposals.len() - 1 < proposal_id {
                Option::None
            } else {
                storage.proposals.get(proposal_id)
            };

        proposal
    }

    #[storage(read)]
    fn get_proposals(offset: u64) -> (
        Option<Proposal>, 
        Option<Proposal>,
        Option<Proposal>, 
        Option<Proposal>, 
        Option<Proposal>, 
        Option<Proposal>,
        Option<Proposal>,
        Option<Proposal>,
        Option<Proposal>,
        Option<Proposal>
    ) {
        let mut vec = Vec::new();
        let mut i = 0;
        while i < 10 {
            let proposal = if storage.proposals.len() - 1 < i + offset {
                Option::None
            } else {
                storage.proposals.get(storage.proposals.len() - 1 - i - offset)
            };
            vec.push(proposal);
            i += 1;
        }

        (
            vec.get(0).unwrap(),
            vec.get(1).unwrap(),
            vec.get(2).unwrap(),
            vec.get(3).unwrap(),
            vec.get(4).unwrap(),
            vec.get(5).unwrap(),
            vec.get(6).unwrap(),
            vec.get(7).unwrap(),
            vec.get(8).unwrap(),
            vec.get(9).unwrap(),
        )
    }

     #[storage(read)]
    fn get_funds(contributors: [Identity;5]) -> (Option<u64>, Option<u64>, Option<u64>, Option<u64>, Option<u64>) {
        let mut vec = Vec::new();
        let mut i = 0;
        while i < 5 {
            vec.push(storage.funds.get(contributors[i]));
            i += 1;
        }

        (
            vec.get(0).unwrap(),
            vec.get(1).unwrap(),
            vec.get(2).unwrap(),
            vec.get(3).unwrap(),
            vec.get(4).unwrap()
        )
    }

    #[storage(read)]
    fn get_user_vote(address: Address, proposal_id: u64) -> Option<bool> {
        storage.voters.get((address, proposal_id))
    }
    #[storage(read)]
    fn is_member(member: Address) -> bool {
        let mut i = 0;
        let mut is_existed = false;
        while i < storage.members.len() {
            if (member == storage.members.get(i).unwrap()) {
                is_existed = true;
                break;
            }
            i += 1;
        }

        is_existed
    }
}
