"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AGENT_COLORS, AGENT_LABELS, AgentType } from "@/lib/constants";
import { Message, AgentMetrics } from "@/lib/types";
import { Network } from "lucide-react";

interface AgentNetworkProps {
  messages: Message[];
  agentMetrics: AgentMetrics[];
  isProcessing?: boolean;
}

interface GraphNode {
  id: string;
  name: string;
  color: string;
  status?: "idle" | "thinking" | "done" | "error";
  metrics?: AgentMetrics;
}

export default function AgentNetwork({
  messages,
  agentMetrics,
  isProcessing = false,
}: AgentNetworkProps) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);

  useEffect(() => {
    if (messages.length === 0) {
      setNodes([]);
      return;
    }

    const agentIds: AgentType[] = [
      "coordinator",
      "analyst",
      "specialist_math",
      "specialist_text",
      "super_critic",
    ];

    const graphNodes: GraphNode[] = agentIds.map((agentId) => {
      const metric = agentMetrics.find((m) => m.agentId === agentId);
      return {
        id: agentId,
        name: AGENT_LABELS[agentId],
        color: AGENT_COLORS[agentId],
        status: metric?.status || "idle",
        metrics: metric,
      };
    });

    setNodes(graphNodes);
  }, [messages, agentMetrics]);

  const getStatusEmoji = (status?: string) => {
    switch (status) {
      case "thinking":
        return "⏳";
      case "done":
        return "✓";
      case "error":
        return "✗";
      default:
        return "○";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "thinking":
        return "#fbbf24";
      case "done":
        return "#10b981";
      case "error":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="space-y-4">
      {nodes.length === 0 ? (
        <Card
          className="flex items-center justify-center"
          style={{
            height: "600px",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          }}
        >
          <div className="text-center space-y-3">
            <Network className="mx-auto h-16 w-16 text-gray-600 opacity-50" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Waiting for agents to activate...
              </p>
              <p className="text-sm text-gray-600">
                Run a task to see the network visualization
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
          <div className="mb-4">
            <h3 className="text-xl font-bold">Agent Network</h3>
            {isProcessing && (
              <Badge className="mt-2 animate-pulse bg-primary">Processing...</Badge>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map((node) => (
              <Card
                key={node.id}
                className="border-2 p-4 hover:shadow-lg transition-shadow"
                style={{ borderColor: node.color }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                    <h4 className="font-bold">{node.name}</h4>
                  </div>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: getStatusColor(node.status),
                      color: getStatusColor(node.status),
                    }}
                  >
                    <span className="mr-1">{getStatusEmoji(node.status)}</span>
                    {node.status}
                  </Badge>
                </div>

                {node.metrics && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">LLM Calls:</span>
                      <span className="font-semibold">{node.metrics.llmCalls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tokens:</span>
                      <span className="font-semibold">
                        {node.metrics.tokens.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="font-semibold">
                        ${node.metrics.cost.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Messages:</span>
                      <span className="font-semibold">{node.metrics.messagesSent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-semibold">
                        {(node.metrics.processingTime / 1000).toFixed(2)}s
                      </span>
                    </div>
                  </div>
                )}

                {!node.metrics && (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No activity yet
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          {Object.entries(AGENT_LABELS).map(([id, label]) => (
            <div key={id} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: AGENT_COLORS[id as AgentType] }}
              />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
