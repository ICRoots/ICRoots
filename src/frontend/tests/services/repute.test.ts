import { describe, it, expect, beforeAll } from 'vitest';
import { icRootsService } from '../../src/services/icRootsService';

describe('Repute Backend', () => {
  const testUserId = '2vxsx-fae'; // Anonymous principal for testing

  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should get user level (defaults to 0)', async () => {
    const level = await icRootsService.getUserLevel(testUserId);
    expect(typeof level).toBe('bigint');
    expect(level >= BigInt(0)).toBe(true);
  });

  it('should set and verify user level', async () => {
    const newLevel = BigInt(3);
    
    // Set level
    await icRootsService.setUserLevel(testUserId, newLevel);
    
    // Verify level was set
    const retrievedLevel = await icRootsService.getUserLevel(testUserId);
    expect(retrievedLevel).toBe(newLevel);
  });

  it('should handle invalid user IDs gracefully', async () => {
    // Should fall back to anonymous principal
    const level = await icRootsService.getUserLevel('invalid-user-id');
    expect(typeof level).toBe('bigint');
  });
});