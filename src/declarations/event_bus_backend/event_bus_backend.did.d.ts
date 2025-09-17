import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Event { 'message' : string, 'timestamp' : bigint }
export interface _SERVICE {
  'emit' : ActorMethod<[string], undefined>,
  'get_events' : ActorMethod<[], Array<Event>>,
  'list_recent' : ActorMethod<[bigint], Array<string>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
