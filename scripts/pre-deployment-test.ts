import { Principal } from '@dfinity/principal';
import { createActor as createLoansActor } from '../src/declarations/loans_backend';
import { createActor as createEventBusActor } from '../src/declarations/event_bus_backend';
import { createActor as createReputeActor } from '../src/declarations/repute_backend';
import { createActor as createCollateralActor } from '../src/declarations/collateral_backend';
import { createActor as createTrustAiActor } from '../src/declarations/trust_ai_backend';

async function testCanisterConnections() {
  console.log('🧪 Testing canister connections...');
  
  const network = process.env.DFX_NETWORK || 'local';
  const host = network === 'local' ? 'http://127.0.0.1:4943' : 
               network === 'playground' ? 'https://playground.dfinity.network' : 
               'https://ic0.app';

  try {
    // Test each canister
    console.log('📡 Testing Event Bus...');
    const eventBus = createEventBusActor(process.env.CANISTER_ID_EVENT_BUS_BACKEND!, {
      agentOptions: { host }
    });
    await eventBus.emit('test-connection');
    console.log('✅ Event Bus connected');

    console.log('🎯 Testing Repute Backend...');
    const repute = createReputeActor(process.env.CANISTER_ID_REPUTE_BACKEND!, {
      agentOptions: { host }
    });
    const level = await repute.get_level(Principal.anonymous());
    console.log('✅ Repute Backend connected, level:', level);

    console.log('💰 Testing Collateral Backend...');
    const collateral = createCollateralActor(process.env.CANISTER_ID_COLLATERAL_BACKEND!, {
      agentOptions: { host }
    });
    const balance = await collateral.get_collateral(Principal.anonymous());
    console.log('✅ Collateral Backend connected, balance:', balance);

    console.log('🤖 Testing Trust AI Backend...');
    const trustAi = createTrustAiActor(process.env.CANISTER_ID_TRUST_AI_BACKEND!, {
      agentOptions: { host }
    });
    const recommendation = await trustAi.recommend(Principal.anonymous(), 1000n, 1);
    console.log('✅ Trust AI Backend connected, recommendation:', recommendation);

    console.log('🏦 Testing Loans Backend...');
    const loans = createLoansActor(process.env.CANISTER_ID_LOANS_BACKEND!, {
      agentOptions: { host }
    });
    const ping = await loans.ping();
    console.log('✅ Loans Backend connected, ping:', ping);

    console.log('🎉 All canisters are working correctly!');
    return true;
  } catch (error) {
    console.error('❌ Canister test failed:', error);
    return false;
  }
}

if (require.main === module) {
  testCanisterConnections().then(success => {
    process.exit(success ? 0 : 1);
  });
}