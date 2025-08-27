import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface InitArgs {
  event_bus: [] | [Principal];
  repute: [] | [Principal];
  admin: [] | [Principal];
  collateral: [] | [Principal];
  trust_ai: [] | [Principal];
}
export interface LoanDecision {
  reasons: Array<string>;
  loan_id: [] | [bigint];
  decision: string;
  score: bigint;
}
export interface LoanInfo {
  id: bigint;
  status: string;
  amount: bigint;
}
export interface RepayResult {
  status: string;
  repaid: bigint;
  remaining: bigint;
}
export interface Summary {
  outstanding: bigint;
  collateral: bigint;
  level: bigint;
  loans: Array<LoanInfo>;
  registered: boolean;
}
export interface _SERVICE {
  get_summary: ActorMethod<[Principal], Summary>;
  ping: ActorMethod<[], string>;
  register_user: ActorMethod<[], undefined>;
  repay: ActorMethod<[bigint, bigint], RepayResult>;
  request_loan: ActorMethod<[bigint], LoanDecision>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
