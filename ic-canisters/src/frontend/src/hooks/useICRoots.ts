import { useState, useCallback, useEffect } from "react";
import { icRootsService, UserProfile, LoanRecommendation } from "../services/icRootsService";

export interface UseICRootsState {
  userProfile: UserProfile & {
    isLoading: boolean;
    error: string | null;
  };
  events: {
    data: string[];
    isLoading: boolean;
    error: string | null;
  };
  services: {
    status: Record<string, boolean>;
    lastChecked: Date | null;
  };
}

export function useICRoots() {
  const [state, setState] = useState<UseICRootsState>({
    userProfile: {
      userId: "",
      level: BigInt(0),
      collateral: BigInt(0),
      summary: null,
      isLoading: false,
      error: null,
    },
    events: {
      data: [],
      isLoading: false,
      error: null,
    },
    services: {
      status: {},
      lastChecked: null,
    },
  });

  // ========== User Profile Management ==========
  const loadUserProfile = useCallback(async (userId: string) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, isLoading: true, error: null },
    }));
    
    try {
      const profile = await icRootsService.getUserProfile(userId);
      setState(prev => ({
        ...prev,
        userProfile: {
          ...profile,
          isLoading: false,
          error: null,
        },
      }));
      return profile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load user profile";
      setState(prev => ({
        ...prev,
        userProfile: {
          ...prev.userProfile,
          isLoading: false,
          error: errorMessage,
        },
      }));
      throw error;
    }
  }, []);

  const depositCollateral = useCallback(async (userId: string, amount: bigint) => {
    try {
      await icRootsService.depositCollateral(userId, amount);
      // Reload user profile to get updated collateral
      await loadUserProfile(userId);
      return true;
    } catch (error) {
      console.error("Failed to deposit collateral:", error);
      return false;
    }
  }, [loadUserProfile]);

  const setUserLevel = useCallback(async (userId: string, level: bigint) => {
    try {
      await icRootsService.setUserLevel(userId, level);
      // Reload user profile to get updated level
      await loadUserProfile(userId);
      return true;
    } catch (error) {
      console.error("Failed to set user level:", error);
      return false;
    }
  }, [loadUserProfile]);

  // ========== Loan Management ==========
  const processLoanApplication = useCallback(async (userId: string, amount: bigint) => {
    try {
      const result = await icRootsService.processLoanApplication(userId, amount);
      
      // Update user profile with latest data
      setState(prev => ({
        ...prev,
        userProfile: {
          ...result.userProfile,
          isLoading: false,
          error: null,
        },
      }));

      return result.recommendation;
    } catch (error) {
      console.error("Failed to process loan application:", error);
      throw error;
    }
  }, []);

  const requestLoan = useCallback(async (amount: bigint) => {
    try {
      await icRootsService.requestLoan(amount);
      // Reload user profile to get updated loan data
      if (state.userProfile.userId) {
        await loadUserProfile(state.userProfile.userId);
      }
      return true;
    } catch (error) {
      console.error("Failed to request loan:", error);
      return false;
    }
  }, [state.userProfile.userId, loadUserProfile]);

  const repayLoan = useCallback(async (loanId: bigint, amount: bigint) => {
    try {
      await icRootsService.repayLoan(loanId, amount);
      // Reload user profile to get updated loan data
      if (state.userProfile.userId) {
        await loadUserProfile(state.userProfile.userId);
      }
      return true;
    } catch (error) {
      console.error("Failed to repay loan:", error);
      return false;
    }
  }, [state.userProfile.userId, loadUserProfile]);

  // ========== Event Management ==========
  const loadRecentEvents = useCallback(async (limit: bigint = BigInt(10)) => {
    setState(prev => ({
      ...prev,
      events: { ...prev.events, isLoading: true, error: null },
    }));
    
    try {
      const recentEvents = await icRootsService.getRecentEvents(limit);
      setState(prev => ({
        ...prev,
        events: {
          data: recentEvents,
          isLoading: false,
          error: null,
        },
      }));
      return recentEvents;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load events";
      setState(prev => ({
        ...prev,
        events: {
          ...prev.events,
          isLoading: false,
          error: errorMessage,
        },
      }));
      return [];
    }
  }, []);

  const emitEvent = useCallback(async (event: string) => {
    try {
      await icRootsService.emitEvent(event);
      // Optionally reload events to show the new one
      await loadRecentEvents();
      return true;
    } catch (error) {
      console.error("Failed to emit event:", error);
      return false;
    }
  }, [loadRecentEvents]);

  // ========== Service Health ==========
  const checkServiceHealth = useCallback(async () => {
    try {
      const status = await icRootsService.healthCheck();
      setState(prev => ({
        ...prev,
        services: {
          status,
          lastChecked: new Date(),
        },
      }));
      return status;
    } catch (error) {
      console.error("Failed to check service health:", error);
      return {};
    }
  }, []);

  // ========== Initialize on mount ==========
  useEffect(() => {
    // Load initial data
    const initialize = async () => {
      await Promise.all([
        loadRecentEvents(),
        checkServiceHealth(),
      ]);
    };
    
    initialize();
  }, [loadRecentEvents, checkServiceHealth]);

  return {
    // State
    userProfile: state.userProfile,
    events: state.events,
    services: state.services,

    // User Profile Actions
    loadUserProfile,
    depositCollateral,
    setUserLevel,

    // Loan Actions
    processLoanApplication,
    requestLoan,
    repayLoan,

    // Event Actions
    loadRecentEvents,
    emitEvent,

    // Service Actions
    checkServiceHealth,

    // Direct service access for advanced use cases
    icRootsService,
  };
}