import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import canisterIds from '../utils/canisterIds';

// Direct imports from declarations
import { loans_backend } from '../../../declarations/loans_backend';
import { event_bus_backend } from '../../../declarations/event_bus_backend';
import { repute_backend } from '../../../declarations/repute_backend';
import { collateral_backend } from '../../../declarations/collateral_backend';
import { trust_ai_backend } from '../../../declarations/trust_ai_backend';

// Type definitions
export type UserProfile = {
  userId: string;
  level: bigint;
  collateral: bigint;
  summary: {
    loans: any[];
    total_borrowed: bigint;
    total_repaid?: bigint;
  };
};

export type LoanRecommendation = {
  decision: string;
  score: number;
  reasons: string[];
};

export type LoanApplicationResult = {
  recommendation: LoanRecommendation;
  userProfile: UserProfile;
};

export class ICRootsService {
  private agent: HttpAgent;

  constructor() {
    const host = this.getHost();
    
    this.agent = new HttpAgent({
      host,
      ...(canisterIds.network === 'local' && { fetchRootKey: true })
    });

    if (canisterIds.network === 'local') {
      this.agent.fetchRootKey().catch(console.error);
    }
  }

  private getHost(): string {
    switch (canisterIds.network) {
      case 'local':
        return 'http://127.0.0.1:4943';
      case 'playground':
        return 'https://playground.dfinity.network';
      case 'ic':
        return 'https://ic0.app';
      default:
        return 'http://127.0.0.1:4943';
    }
  }

  private createPrincipal(userId: string): Principal {
    try {
      return Principal.fromText(userId);
    } catch (error) {
      // If userId is not a valid principal, create one from the string
      return Principal.anonymous();
    }
  }

  // Test all canister connections
  async healthCheck(): Promise<Record<string, boolean>> {
    const health: Record<string, boolean> = {};
    
    // Test each service individually with better error handling
    const services = [
      { name: 'loans', test: () => loans_backend.ping() },
      { name: 'eventBus', test: () => event_bus_backend.list_recent(1n) },
      { name: 'repute', test: () => repute_backend.get_level(Principal.anonymous()) },
      { name: 'collateral', test: () => collateral_backend.get_collateral(Principal.anonymous()) },
      { name: 'trustAi', test: () => trust_ai_backend.recommend(Principal.anonymous(), 1000n, 1n) }
    ];

    for (const service of services) {
      try {
        await service.test();
        health[service.name] = true;
        console.log(`✅ ${service.name} service is healthy`);
      } catch (error) {
        health[service.name] = false;
        console.warn(`⚠️ ${service.name} service is not available:`, error);
      }
    }

    return health;
  }

  // ========== Event Bus Service with Fallback ==========
  async emitEvent(event: string): Promise<void> {
    try {
      await event_bus_backend.emit(event);
    } catch (error) {
      // For development, log locally if event bus is not available
      console.warn("Event bus not available, logging locally:", event);
      console.error("Event bus error:", error);
      // Don't throw - let the application continue without events
    }
  }

  async getRecentEvents(limit: bigint = BigInt(10)): Promise<string[]> {
    try {
      return await event_bus_backend.list_recent(limit);
    } catch (error) {
      console.warn("Event bus not available for recent events:", error);
      return []; // Return empty array instead of throwing
    }
  }

  // ========== Reputation Service ==========
  async getUserLevel(userId: string): Promise<bigint> {
    try {
      const principal = this.createPrincipal(userId);
      return await repute_backend.get_level(principal);
    } catch (error) {
      console.error(`Failed to get user level for ${userId}:`, error);
      throw new Error(`Could not retrieve user level: ${error}`);
    }
  }

  async setUserLevel(userId: string, level: bigint): Promise<void> {
    try {
      const principal = this.createPrincipal(userId);
      await repute_backend.set_level(principal, level);
    } catch (error) {
      console.error(`Failed to set user level for ${userId}:`, error);
      throw new Error(`Could not update user level: ${error}`);
    }
  }

  // ========== Collateral Service ==========
  async depositCollateral(userId: string, amount: bigint): Promise<void> {
    try {
      const principal = this.createPrincipal(userId);
      await collateral_backend.deposit_mock(principal, amount);
      
      // Emit event for successful deposit
      await this.emitEvent(`Collateral deposited: ${amount} by ${userId}`);
    } catch (error) {
      console.error(`Failed to deposit collateral for ${userId}:`, error);
      throw new Error(`Collateral deposit failed: ${error}`);
    }
  }

  async getUserCollateral(userId: string): Promise<bigint> {
    try {
      const principal = this.createPrincipal(userId);
      return await collateral_backend.get_collateral(principal);
    } catch (error) {
      console.error(`Failed to get collateral for ${userId}:`, error);
      throw new Error(`Could not retrieve collateral: ${error}`);
    }
  }

  // ========== Trust AI Service ==========
  async getTrustRecommendation(
    userId: string,
    collateral: bigint,
    trust: bigint
  ): Promise<LoanRecommendation> {
    try {
      const principal = this.createPrincipal(userId);
      const result = await trust_ai_backend.recommend(principal, collateral, trust);
      
      return {
        decision: result.decision,
        score: Number(result.score),
        reasons: result.reasons,
      };
    } catch (error) {
      console.error(`Failed to get trust recommendation for ${userId}:`, error);
      throw new Error(`Trust recommendation failed: ${error}`);
    }
  }

  // ========== Loans Service ==========
  async pingLoansService(): Promise<string> {
    try {
      return await loans_backend.ping();
    } catch (error) {
      console.error("Failed to ping loans service:", error);
      throw new Error(`Loans service not available: ${error}`);
    }
  }

  async registerUser(): Promise<void> {
    try {
      await loans_backend.register_user();
    } catch (error) {
      console.error("Failed to register user:", error);
      throw new Error(`User registration failed: ${error}`);
    }
  }

  async getUserSummary(userId: string): Promise<any> {
    try {
      const principal = this.createPrincipal(userId);
      return await loans_backend.get_summary(principal);
    } catch (error) {
      console.error(`Failed to get user summary for ${userId}:`, error);
      // Return empty summary instead of throwing for non-critical data
      return { loans: [], total_borrowed: BigInt(0), total_repaid: BigInt(0) };
    }
  }

  async requestLoan(amount: bigint): Promise<void> {
    try {
      await loans_backend.request_loan(amount);
      
      // Emit event for loan request
      await this.emitEvent(`Loan requested: ${amount}`);
    } catch (error) {
      console.error("Failed to request loan:", error);
      throw new Error(`Loan request failed: ${error}`);
    }
  }

  async repayLoan(loanId: bigint, amount: bigint): Promise<void> {
    try {
      await loans_backend.repay(loanId, amount);
      
      // Emit event for loan repayment
      await this.emitEvent(`Loan repayment: ${amount} for loan ${loanId}`);
    } catch (error) {
      console.error("Failed to repay loan:", error);
      throw new Error(`Loan repayment failed: ${error}`);
    }
  }

  // ========== Combined Operations ==========
  /**
   * Get complete user profile including reputation, collateral, and loan data
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      // Use Promise.allSettled to handle partial failures gracefully
      const [levelResult, collateralResult, summaryResult] = await Promise.allSettled([
        this.getUserLevel(userId),
        this.getUserCollateral(userId),
        this.getUserSummary(userId),
      ]);

      return {
        userId,
        level: levelResult.status === 'fulfilled' ? levelResult.value : BigInt(0),
        collateral: collateralResult.status === 'fulfilled' ? collateralResult.value : BigInt(0),
        summary: summaryResult.status === 'fulfilled' ? summaryResult.value : { loans: [], total_borrowed: BigInt(0) },
      };
    } catch (error) {
      console.error(`Failed to get user profile for ${userId}:`, error);
      throw new Error(`Could not load user profile: ${error}`);
    }
  }

  /**
   * Process a loan application with AI recommendation
   */
  async processLoanApplication(
    userId: string,
    requestedAmount: bigint
  ): Promise<LoanApplicationResult> {
    try {
      // Get user profile first
      const userProfile = await this.getUserProfile(userId);

      // Get AI recommendation based on user's current state
      const recommendation = await this.getTrustRecommendation(
        userId,
        userProfile.collateral,
        userProfile.level
      );

      // Log the application event
      await this.emitEvent(
        `Loan application processed: User ${userId}, Amount: ${requestedAmount}, Decision: ${recommendation.decision}`
      );

      return { recommendation, userProfile };
    } catch (error) {
      console.error(`Failed to process loan application for ${userId}:`, error);
      throw new Error(`Loan application processing failed: ${error}`);
    }
  }
}

// Export singleton instance
export const icRootsService = new ICRootsService();