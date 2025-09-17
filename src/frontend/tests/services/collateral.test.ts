import { describe, it, expect, beforeAll } from 'vitest';
import { icRootsService } from '../../src/services/icRootsService';

describe('Collateral Backend', () => {
  const testUserId = '2vxsx-fae';

  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should get initial collateral (defaults to 0)', async () => {
    const collateral = await icRootsService.getUserCollateral(testUserId);
    expect(typeof collateral).toBe('bigint');
    expect(collateral >= BigInt(0)).toBe(true);
  });

  it('should deposit and verify collateral', async () => {
    const depositAmount = BigInt(25000);
    const initialCollateral = await icRootsService.getUserCollateral(testUserId);
    
    // Deposit collateral
    await icRootsService.depositCollateral(testUserId, depositAmount);
    
    // Verify deposit
    const newCollateral = await icRootsService.getUserCollateral(testUserId);
    expect(newCollateral).toBe(initialCollateral + depositAmount);
  });

  it('should handle multiple deposits', async () => {
    const deposit1 = BigInt(10000);
    const deposit2 = BigInt(15000);
    
    const initialCollateral = await icRootsService.getUserCollateral(testUserId);
    
    await icRootsService.depositCollateral(testUserId, deposit1);
    await icRootsService.depositCollateral(testUserId, deposit2);
    
    const finalCollateral = await icRootsService.getUserCollateral(testUserId);
    expect(finalCollateral).toBe(initialCollateral + deposit1 + deposit2);
  });
});