import { backend } from "../../../declarations/backend";
import { icRootsService, ICRootsService } from "./icRootsService";

/**
 * Enhanced backend service that combines original backend functionality with ICRoots features
 */
export class BackendService {
  private icRoots: ICRootsService;

  constructor() {
    this.icRoots = icRootsService;
  }

  // ========== Original Backend Functions ==========
  async greet(name: string): Promise<string> {
    try {
      return await backend.greet(name);
    } catch (error) {
      console.error("Failed to greet:", error);
      throw new Error(`Greeting failed: ${error}`);
    }
  }

  async getCount(): Promise<bigint> {
    try {
      return await backend.get_count();
    } catch (error) {
      console.error("Failed to get count:", error);
      throw new Error(`Could not retrieve count: ${error}`);
    }
  }

  async incrementCounter(): Promise<bigint> {
    try {
      const newCount = await backend.increment();
      
      // Log the increment event
      await this.icRoots.emitEvent(`Counter incremented to: ${newCount}`);
      
      return newCount;
    } catch (error) {
      console.error("Failed to increment counter:", error);
      throw new Error(`Counter increment failed: ${error}`);
    }
  }

  async sendPrompt(prompt: string): Promise<string> {
    try {
      const response = await backend.prompt(prompt);
      
      // Log AI interaction
      await this.icRoots.emitEvent(`AI prompt processed: "${prompt.substring(0, 50)}..."`);
      
      return response;
    } catch (error) {
      console.error("Failed to send prompt:", error);
      throw new Error(`AI prompt failed: ${error}`);
    }
  }

  async setCount(count: bigint): Promise<bigint> {
    try {
      const result = await backend.set_count(count);
      
      // Log count change
      await this.icRoots.emitEvent(`Counter set to: ${count}`);
      
      return result;
    } catch (error) {
      console.error("Failed to set count:", error);
      throw new Error(`Could not set count: ${error}`);
    }
  }

  // ========== ICRoots Integration ==========
  // Use methods instead of property binding to avoid initialization issues
  async getUserLevel(userId: string): Promise<bigint> {
    return this.icRoots.getUserLevel(userId);
  }

  async setUserLevel(userId: string, level: bigint): Promise<void> {
    return this.icRoots.setUserLevel(userId, level);
  }

  async getUserCollateral(userId: string): Promise<bigint> {
    return this.icRoots.getUserCollateral(userId);
  }

  async depositCollateral(userId: string, amount: bigint): Promise<void> {
    return this.icRoots.depositCollateral(userId, amount);
  }

  async getTrustRecommendation(userId: string, collateral: bigint, trust: bigint) {
    return this.icRoots.getTrustRecommendation(userId, collateral, trust);
  }

  async getUserProfile(userId: string) {
    return this.icRoots.getUserProfile(userId);
  }

  async processLoanApplication(userId: string, requestedAmount: bigint) {
    return this.icRoots.processLoanApplication(userId, requestedAmount);
  }

  async requestLoan(amount: bigint): Promise<void> {
    return this.icRoots.requestLoan(amount);
  }

  async repayLoan(loanId: bigint, amount: bigint): Promise<void> {
    return this.icRoots.repayLoan(loanId, amount);
  }

  async emitEvent(event: string): Promise<void> {
    return this.icRoots.emitEvent(event);
  }

  async getRecentEvents(limit?: bigint): Promise<string[]> {
    return this.icRoots.getRecentEvents(limit);
  }

  async healthCheck(): Promise<Record<string, boolean>> {
    return this.icRoots.healthCheck();
  }

  // ========== Combined Operations ==========
  /**
   * Initialize a new user in the system
   */
  async initializeUser(name: string): Promise<{
    greeting: string;
    profile: any;
    services: Record<string, boolean>;
  }> {
    try {
      // Greet the user
      const greeting = await this.greet(name);
      
      // Register in loans system - using the method instead of direct access
      await this.icRoots.registerUser();
      
      // Get initial profile (might be empty for new users)
      const profile = await this.icRoots.getUserProfile("anonymous");
      
      // Check service health
      const services = await this.icRoots.healthCheck();
      
      // Log user initialization
      await this.icRoots.emitEvent(`User initialized: ${name}`);
      
      return { greeting, profile, services };
    } catch (error) {
      console.error("Failed to initialize user:", error);
      throw new Error(`User initialization failed: ${error}`);
    }
  }
}

// Export singleton instance
export const backendService = new BackendService();

// Also export the default interface for backward compatibility
export default backendService;
