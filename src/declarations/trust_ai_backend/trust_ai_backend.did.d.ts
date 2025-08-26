import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface InitArgs {
  trust_cap: [] | [bigint];
  min_trust: [] | [bigint];
  min_collateral: [] | [bigint];
}
export interface Recommendation {
  reasons: Array<string>;
  decision: string;
  score: bigint;
}
export interface _SERVICE {
  recommend: ActorMethod<[Principal, bigint, bigint], Recommendation>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
