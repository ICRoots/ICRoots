import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface InitArgs {
  'event_bus' : [] | [Principal],
  'admin' : [] | [Principal],
  'loans' : [] | [Principal],
}
export interface _SERVICE {
  'get_level' : ActorMethod<[Principal], bigint>,
  'set_level' : ActorMethod<[Principal, bigint], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
