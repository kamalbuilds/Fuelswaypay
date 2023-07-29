library;

use std::b512::B512;

abi Channel {
    #[storage(read, write)]
    fn initialize(payee: Address);

    #[storage(read, write)]
    fn claim_payment(hash: b256, amount: u64, nonce: u64, signature: B512);

    #[storage(read, write), payable]
    fn send_fund();
    
    fn get_balance() -> u64;

    #[storage(read)]
    fn get_channel_info() -> (Address, Address, u64, u64, u64);

    #[storage(read)]
    fn get_hash(amount: u64, nonce:u64, payee: Address) -> b256;

}
