import { AgentType } from "./constants";

export interface Message {
  id: string;
  from: AgentType;
  fromInstanceId?: string; // e.g., "coordinator-1", "analyst-2"
  to: AgentType | "user" | "system";
  toInstanceId?: string;
  content: string;
  timestamp: number;
  type: "request" | "response" | "info";
  parentMessageId?: string; // For threading
}

export interface AgentMetrics {
  agentId: AgentType;
  llmCalls: number;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost: number;
  messagesSent: number;
  processingTime: number; // milliseconds
  status: "idle" | "thinking" | "done" | "error";
}

export interface SessionMetrics {
  sessionId: string;
  mode: "fabric" | "traditional";
  totalProcessingTime: number;
  totalTokens: number;
  totalCost: number;
  workflowSteps: number;
  agents: AgentMetrics[];
  startTime: number;
  endTime?: number;
}

export interface ComparisonData {
  fabricSession: SessionMetrics;
  traditionalSession: SessionMetrics;
  improvements: {
    timeSaved: number; // percentage
    costSaved: number; // percentage
    tokenEfficiency: number;
  };
}

export interface SessionState {
  sessionId: string;
  mode: "fabric" | "traditional" | "comparison";
  status: "idle" | "running" | "completed" | "error";
  input: string;
  output: string;
  messages: Message[];
  metrics: SessionMetrics | null;
  error?: string;
}
