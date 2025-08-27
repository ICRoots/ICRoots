import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface InitArgs {
  event_bus: [] | [Principal];
  admin: [] | [Principal];
  loans: [] | [Principal];
}
export interface _SERVICE {
  deposit_mock: ActorMethod<[Principal, bigint], undefined>;
  get_collateral: ActorMethod<[Principal], bigint>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
