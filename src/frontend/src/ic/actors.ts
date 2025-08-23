import { HttpAgent, Actor } from "@dfinity/agent";
import ids from "../../../../.dfx/local/canister_ids.json";

import { idlFactory as eventBusIDL }    from "../idl/event_bus_backend.did.js";
import { idlFactory as reputeIDL }       from "../idl/repute_backend.did.js";
import { idlFactory as collateralIDL }   from "../idl/collateral_backend.did.js";
import { idlFactory as trustAiIDL }      from "../idl/trust_ai_backend.did.js";
import { idlFactory as loansIDL }        from "../idl/loans_backend.did.js";

export const EVENT_BUS_ID   = (ids as any).event_bus_backend.local as string;
export const REPUTE_ID      = (ids as any).repute_backend.local as string;
export const COLLATERAL_ID  = (ids as any).collateral_backend.local as string;
export const TRUST_AI_ID    = (ids as any).trust_ai_backend.local as string;
export const LOANS_ID       = (ids as any).loans_backend.local as string;

type Opts = { host?: string };

function makeAgent(host?: string) {
  const agent = new HttpAgent({ host });
  // Local dev: fetch root key to validate certs
  if (!host || host.includes("127.0.0.1") || host.includes("localhost")) {
    agent.fetchRootKey().catch(() =>
      console.warn("fetchRootKey failed (is local replica running?)")
    );
  }
  return agent;
}

export const createEventBusActor = (opts: Opts = {}) =>
  Actor.createActor(eventBusIDL, { agent: makeAgent(opts.host), canisterId: EVENT_BUS_ID });

export const createReputeActor = (opts: Opts = {}) =>
  Actor.createActor(reputeIDL, { agent: makeAgent(opts.host), canisterId: REPUTE_ID });

export const createCollateralActor = (opts: Opts = {}) =>
  Actor.createActor(collateralIDL, { agent: makeAgent(opts.host), canisterId: COLLATERAL_ID });

export const createTrustAIActor = (opts: Opts = {}) =>
  Actor.createActor(trustAiIDL, { agent: makeAgent(opts.host), canisterId: TRUST_AI_ID });

export const createLoansActor = (opts: Opts = {}) =>
  Actor.createActor(loansIDL, { agent: makeAgent(opts.host), canisterId: LOANS_ID });
