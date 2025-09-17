import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Event = string;
export interface _SERVICE {
  'emit' : ActorMethod<[Event], undefined>,
  'list_recent' : ActorMethod<[bigint], Array<Event>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
