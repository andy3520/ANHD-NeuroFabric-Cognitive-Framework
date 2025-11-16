import { create } from "zustand";
import { SessionState, Message, AgentMetrics } from "@/lib/types";

interface SessionStore {
  fabricSession: SessionState | null;
  traditionalSession: SessionState | null;
  comparisonMode: boolean;

  // Actions
  createFabricSession: (input: string) => void;
  createTraditionalSession: (input: string) => void;
  createComparisonSession: (input: string) => void;
  
  addMessage: (sessionId: string, message: Message) => void;
  updateAgentMetrics: (sessionId: string, metrics: AgentMetrics) => void;
  completeSession: (sessionId: string, output: string) => void;
  setError: (sessionId: string, error: string) => void;
  
  resetSessions: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  fabricSession: null,
  traditionalSession: null,
  comparisonMode: false,

  createFabricSession: (input: string) =>
    set({
      fabricSession: {
        sessionId: `fabric-${Date.now()}`,
        mode: "fabric",
        status: "running",
        input,
        output: "",
        messages: [],
        metrics: {
          sessionId: `fabric-${Date.now()}`,
          mode: "fabric",
          totalProcessingTime: 0,
          totalTokens: 0,
          totalCost: 0,
          workflowSteps: 0,
          agents: [],
          startTime: Date.now(),
        },
      },
    }),

  createTraditionalSession: (input: string) =>
    set({
      traditionalSession: {
        sessionId: `traditional-${Date.now()}`,
        mode: "traditional",
        status: "running",
        input,
        output: "",
        messages: [],
        metrics: {
          sessionId: `traditional-${Date.now()}`,
          mode: "traditional",
          totalProcessingTime: 0,
          totalTokens: 0,
          totalCost: 0,
          workflowSteps: 1,
          agents: [],
          startTime: Date.now(),
        },
      },
    }),

  createComparisonSession: (input: string) => {
    set({ comparisonMode: true });
    // Create both sessions
    const store = useSessionStore.getState();
    store.createFabricSession(input);
    store.createTraditionalSession(input);
  },

  addMessage: (sessionId: string, message: Message) =>
    set((state) => {
      if (state.fabricSession?.sessionId === sessionId) {
        return {
          fabricSession: {
            ...state.fabricSession,
            messages: [...state.fabricSession.messages, message],
          },
        };
      }
      if (state.traditionalSession?.sessionId === sessionId) {
        return {
          traditionalSession: {
            ...state.traditionalSession,
            messages: [...state.traditionalSession.messages, message],
          },
        };
      }
      return state;
    }),

  updateAgentMetrics: (sessionId: string, metrics: AgentMetrics) =>
    set((state) => {
      const updateMetrics = (session: SessionState | null) => {
        if (!session || session.sessionId !== sessionId) return session;

        const existingAgentIndex = session.metrics?.agents.findIndex(
          (a) => a.agentId === metrics.agentId
        );

        const updatedAgents =
          existingAgentIndex !== -1
            ? session.metrics!.agents.map((a, i) =>
                i === existingAgentIndex ? metrics : a
              )
            : [...(session.metrics?.agents || []), metrics];

        return {
          ...session,
          metrics: session.metrics
            ? {
                ...session.metrics,
                agents: updatedAgents,
                totalTokens: updatedAgents.reduce(
                  (sum, a) => sum + a.tokens.total,
                  0
                ),
                totalCost: updatedAgents.reduce((sum, a) => sum + a.cost, 0),
              }
            : null,
        };
      };

      return {
        fabricSession: updateMetrics(state.fabricSession),
        traditionalSession: updateMetrics(state.traditionalSession),
      };
    }),

  completeSession: (sessionId: string, output: string) =>
    set((state) => {
      const completeSession = (session: SessionState | null) => {
        if (!session || session.sessionId !== sessionId) return session;

        return {
          ...session,
          status: "completed" as const,
          output,
          metrics: session.metrics
            ? {
                ...session.metrics,
                endTime: Date.now(),
                totalProcessingTime: Date.now() - session.metrics.startTime,
              }
            : null,
        };
      };

      return {
        fabricSession: completeSession(state.fabricSession),
        traditionalSession: completeSession(state.traditionalSession),
      };
    }),

  setError: (sessionId: string, error: string) =>
    set((state) => {
      const setSessionError = (session: SessionState | null) => {
        if (!session || session.sessionId !== sessionId) return session;
        return {
          ...session,
          status: "error" as const,
          error,
        };
      };

      return {
        fabricSession: setSessionError(state.fabricSession),
        traditionalSession: setSessionError(state.traditionalSession),
      };
    }),

  resetSessions: () =>
    set({
      fabricSession: null,
      traditionalSession: null,
      comparisonMode: false,
    }),
}));
