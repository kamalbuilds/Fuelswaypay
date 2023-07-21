library;

abi Stream{
    #[storage(read, write)]
    fn initialize(config: Config);
    
    #[storage(read, write), payable]
    fn send_fund();

    #[storage(read, write)]
    fn withdraw();

    #[storage(read, write)]
    fn cancel_stream();

    #[storage(read, write)]
    fn transfer_stream(new_recipient: Identity);

    #[storage(read)]
    fn get_stream_info() -> (Config, u64, u64, u64, u64);

    fn get_balance() -> u64;
}

pub struct Config {
    start_date: u64,
    cancel_previlege: u64,
    transfer_previlege: u64,
    recipient: Identity,
    unlock_number: u64,
    unlock_amount_each_time: u64,
    unlock_every: u64,
    prepaid: u64
}

