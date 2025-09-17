import localIds from '../../../config/canister-ids-local.json';

export interface CanisterIds {
  network: string;
  loans_backend: string;
  collateral_backend: string;
  repute_backend: string;
  trust_ai_backend: string;
  event_bus_backend: string;
  frontend: string;
}

// Determine which canister IDs to use based on environment
function getCanisterIds(): CanisterIds {
  // Check if we're in production (IC mainnet/testnet)
  const isProduction = import.meta.env.VITE_DFX_NETWORK === 'ic' || 
                      import.meta.env.VITE_DFX_NETWORK === 'playground';
  
  if (isProduction) {
    // In production, use environment variables set by dfx
    return {
      network: import.meta.env.VITE_DFX_NETWORK || 'local',
      loans_backend: import.meta.env.VITE_CANISTER_ID_LOANS_BACKEND || '',
      collateral_backend: import.meta.env.VITE_CANISTER_ID_COLLATERAL_BACKEND || '',
      repute_backend: import.meta.env.VITE_CANISTER_ID_REPUTE_BACKEND || '',
      trust_ai_backend: import.meta.env.VITE_CANISTER_ID_TRUST_AI_BACKEND || '',
      event_bus_backend: import.meta.env.VITE_CANISTER_ID_EVENT_BUS_BACKEND || '',
      frontend: import.meta.env.VITE_CANISTER_ID_FRONTEND || '',
    };
  }
  
  // Default to local IDs for development
  return localIds as CanisterIds;
}

const canisterIds = getCanisterIds();
export default canisterIds;