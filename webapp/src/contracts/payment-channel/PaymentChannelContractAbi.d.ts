/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.38.1
  Forc version: 0.35.5
  Fuel-Core version: 0.17.3
*/

import type {
  BigNumberish,
  BN,
  BytesLike,
  Contract,
  DecodedValue,
  FunctionFragment,
  Interface,
  InvokeFunction,
} from 'fuels';

import type { Enum } from "./common";

export type InvalidErrorInput = Enum<{ CannotReinitialize: [], SenderIsNotOwner: [], ChannelIsNotActive: [], IncorrectAssetId: ContractIdInput, ChannelBalanceNotEnough: [], NotChannelPayee: [], NotChannelPayer: [], IsUsedNonce: BigNumberish }>;
export type InvalidErrorOutput = Enum<{ CannotReinitialize: [], SenderIsNotOwner: [], ChannelIsNotActive: [], IncorrectAssetId: ContractIdOutput, ChannelBalanceNotEnough: [], NotChannelPayee: [], NotChannelPayer: [], IsUsedNonce: BN }>;

export type AddressInput = { value: string };
export type AddressOutput = AddressInput;
export type ContractIdInput = { value: string };
export type ContractIdOutput = ContractIdInput;

interface PaymentChannelContractAbiInterface extends Interface {
  functions: {
    claim_payment: FunctionFragment;
    get_balance: FunctionFragment;
    get_channel_info: FunctionFragment;
    get_hash: FunctionFragment;
    initialize: FunctionFragment;
    send_fund: FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'claim_payment', values: [string, BigNumberish, BigNumberish, string]): Uint8Array;
  encodeFunctionData(functionFragment: 'get_balance', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'get_channel_info', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'get_hash', values: [BigNumberish, BigNumberish, AddressInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'initialize', values: [AddressInput]): Uint8Array;
  encodeFunctionData(functionFragment: 'send_fund', values: []): Uint8Array;

  decodeFunctionData(functionFragment: 'claim_payment', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_balance', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_channel_info', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'get_hash', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'initialize', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'send_fund', data: BytesLike): DecodedValue;
}

export class PaymentChannelContractAbi extends Contract {
  interface: PaymentChannelContractAbiInterface;
  functions: {
    claim_payment: InvokeFunction<[hash: string, amount: BigNumberish, nonce: BigNumberish, signature: string], void>;
    get_balance: InvokeFunction<[], BN>;
    get_channel_info: InvokeFunction<[], [AddressOutput, AddressOutput, BN, BN, BN]>;
    get_hash: InvokeFunction<[amount: BigNumberish, nonce: BigNumberish, payee: AddressInput], string>;
    initialize: InvokeFunction<[payee: AddressInput], void>;
    send_fund: InvokeFunction<[], void>;
  };
}
