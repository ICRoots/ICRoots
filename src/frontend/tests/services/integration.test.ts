import { describe, it, expect, beforeAll } from 'vitest';
import { icRootsService } from '../../src/services/icRootsService';

describe('ICRoots Integration Tests', () => {
  const testUserId = '2vxsx-fae';

  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  it('should perform health check on all services', async () => {
    const health = await icRootsService.healthCheck();
    
    expect(health).toHaveProperty('loans');
    expect(health).toHaveProperty('eventBus');
    expect(health).toHaveProperty('repute');
    expect(health).toHaveProperty('collateral');
    expect(health).toHaveProperty('trustAi');
    
    // At least some services should be healthy
    const healthyServices = Object.values(health).filter(Boolean);
    expect(healthyServices.length).toBeGreaterThan(0);
  });

  it('should get complete user profile', async () => {
    const profile = await icRootsService.getUserProfile(testUserId);
    
    expect(profile).toHaveProperty('userId');
    expect(profile).toHaveProperty('level');
    expect(profile).toHaveProperty('collateral');
    expect(profile).toHaveProperty('summary');
    expect(profile.userId).toBe(testUserId);
  });

  it('should process loan application end-to-end', async () => {
    // First, set up user with some collateral and reputation
    await icRootsService.depositCollateral(testUserId, BigInt(50000));
    await icRootsService.setUserLevel(testUserId, BigInt(3));
    
    // Process loan application
    const result = await icRootsService.processLoanApplication(
      testUserId,
      BigInt(20000)
    );
    
    expect(result).toHaveProperty('recommendation');
    expect(result).toHaveProperty('userProfile');
    expect(result.userProfile.collateral).toBeGreaterThan(BigInt(0));
    expect(result.recommendation.decision).toBeDefined();
  });
});