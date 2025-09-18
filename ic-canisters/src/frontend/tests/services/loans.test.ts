import { describe, it, expect, beforeAll } from 'vitest';
import { icRootsService } from '../../src/services/icRootsService';

describe('Loans Backend', () => {
  const testUserId = '2vxsx-fae';

  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should ping successfully', async () => {
    const response = await icRootsService.pingLoansService();
    expect(typeof response).toBe('string');
    expect(response.length > 0).toBe(true);
  });

  it('should register user', async () => {
    await expect(icRootsService.registerUser()).resolves.not.toThrow();
  });

  it('should get user summary', async () => {
    const summary = await icRootsService.getUserSummary(testUserId);
    
    expect(summary).toHaveProperty('loans');
    expect(summary).toHaveProperty('total_borrowed');
    expect(Array.isArray(summary.loans)).toBe(true);
    expect(typeof summary.total_borrowed).toBe('bigint');
  });

  it('should handle loan requests', async () => {
    const loanAmount = BigInt(10000);
    
    await expect(icRootsService.requestLoan(loanAmount)).resolves.not.toThrow();
  });
});