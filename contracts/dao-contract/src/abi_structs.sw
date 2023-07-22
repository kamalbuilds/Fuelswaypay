library;

pub struct DaoConfig {
    quorum: u64,
    open: bool,
    dao_type: u64,
}

pub struct Proposal {
    id: u64,
    owner: Address,
    proposal_type: u64,
    status: u64,
    recipient: Identity,
    amount: u64,
    start_date: u64,
    end_date: u64,
    created_date: u64,
    allow_early_execution: bool,
    agree: u64,
    disagree: u64,
    executed: bool
}

abi DAO {
    #[storage(read, write)]
    fn initialize(
        config: DaoConfig,
        members: [Address; 5],
        whitelist_contributors: [Identity; 5]
    );

    #[storage(read, write)]
    fn create_proposal(
        proposal_type: u64,
        recipient: Identity,
        amount: u64,
        start_date: u64,
        end_date: u64,
        allow_early_execution: bool
    ) -> u64;

    #[storage(read, write), payable]
    fn send_fund();

    #[storage(read, write)]
    fn vote(
        proposal_id: u64,
        is_agree: bool
    );
    
    #[storage(read, write)]
    fn execute_proposal(
        proposal_id: u64
    );

    #[storage(read)]
    fn get_dao_info() -> (DaoConfig, Address, u64, u64, u64, u64, u64);
    
    #[storage(read, write)]
    fn add_member(new_member: Address);

    #[storage(read, write)]
    fn remove_member(old_member: Address);

    #[storage(read, write)]
    fn add_contributor_to_whitelist(contributor: Identity);

    #[storage(read, write)]
    fn remove_contributor_from_whitelist(contributor: Identity);

    #[storage(read, write)]
    fn join();

    #[storage(read, write)]
    fn leave();

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
    );

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
    ); 

    fn get_balance() -> u64;
    
    #[storage(read)]
    fn get_count_proposal() -> u64;

    #[storage(read)]
    fn get_proposal_by_id(proposal_id: u64) -> Option<Proposal>;

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
    );

    #[storage(read)]
    fn get_funds(contributors: [Identity;5]) -> (Option<u64>, Option<u64>, Option<u64>, Option<u64>, Option<u64>); 
    
    #[storage(read)]
    fn get_user_vote(address: Address, proposal_id: u64) -> Option<bool>;

}