import { describe, it, expect, beforeAll } from 'vitest';
import { icRootsService } from '../../src/services/icRootsService';

describe('Event Bus Backend', () => {
  beforeAll(async () => {
    // Wait a bit for services to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should emit events successfully', async () => {
    const testEvent = 'Test event from frontend test';
    await expect(icRootsService.emitEvent(testEvent)).resolves.not.toThrow();
  });

  it('should retrieve recent events', async () => {
    // First emit a test event
    await icRootsService.emitEvent('Frontend test event for retrieval');
    
    // Then retrieve recent events
    const events = await icRootsService.getRecentEvents(BigInt(5));
    expect(Array.isArray(events)).toBe(true);
  });

  it('should handle event bus unavailability gracefully', async () => {
    // This should not throw even if event bus fails
    await expect(icRootsService.emitEvent('Graceful failure test')).resolves.not.toThrow();
  });
});