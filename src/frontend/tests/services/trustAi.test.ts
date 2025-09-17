import { describe, it, expect, beforeAll } from 'vitest';
import { icRootsService } from '../../src/services/icRootsService';

describe('Trust AI Backend', () => {
  const testUserId = '2vxsx-fae';

  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should provide loan recommendations', async () => {
    const collateral = BigInt(50000);
    const trustLevel = BigInt(3);
    
    const recommendation = await icRootsService.getTrustRecommendation(
      testUserId, 
      collateral, 
      trustLevel
    );
    
    expect(recommendation).toHaveProperty('decision');
    expect(recommendation).toHaveProperty('score');
    expect(recommendation).toHaveProperty('reasons');
    expect(typeof recommendation.decision).toBe('string');
    expect(typeof recommendation.score).toBe('number');
    expect(Array.isArray(recommendation.reasons)).toBe(true);
  });

  it('should handle low collateral scenarios', async () => {
    const lowCollateral = BigInt(1000);
    const trustLevel = BigInt(1);
    
    const recommendation = await icRootsService.getTrustRecommendation(
      testUserId,
      lowCollateral,
      trustLevel
    );
    
    // Should still return a valid recommendation structure
    expect(recommendation.decision).toBeDefined();
    expect(recommendation.score).toBeDefined();
  });

  it('should handle high trust scenarios', async () => {
    const highCollateral = BigInt(100000);
    const highTrust = BigInt(5);
    
    const recommendation = await icRootsService.getTrustRecommendation(
      testUserId,
      highCollateral,
      highTrust
    );
    
    expect(recommendation.decision).toBeDefined();
    expect(typeof recommendation.score).toBe('number');
  });
});