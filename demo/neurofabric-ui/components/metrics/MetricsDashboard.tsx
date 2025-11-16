"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentMetrics } from "@/lib/types";
import { AGENT_COLORS, AGENT_LABELS } from "@/lib/constants";
import { Clock, DollarSign, MessageSquare, Zap } from "lucide-react";

interface MetricsDashboardProps {
  metrics: AgentMetrics[];
  totalTime?: number;
  totalCost?: number;
  totalTokens?: number;
}

export default function MetricsDashboard({
  metrics,
  totalTime = 0,
  totalCost = 0,
  totalTokens = 0,
}: MetricsDashboardProps) {
  const tokensPerSecond = totalTime > 0 ? (totalTokens / (totalTime / 1000)).toFixed(1) : "0";

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Time"
          value={`${(totalTime / 1000).toFixed(2)}s`}
          icon={Clock}
          color="#3b82f6"
        />
        <MetricCard
          title="Total Cost"
          value={`$${totalCost.toFixed(4)}`}
          icon={DollarSign}
          color="#10b981"
        />
        <MetricCard
          title="Total Tokens"
          value={totalTokens.toLocaleString()}
          icon={MessageSquare}
          color="#f59e0b"
        />
        <MetricCard
          title="Processing Rate"
          value={`${tokensPerSecond} tok/s`}
          icon={Zap}
          color="#8b5cf6"
        />
      </div>

      {/* Agent Breakdown */}
      {metrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Agent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.map((metric) => (
                <AgentMetricRow key={metric.agentId} metric={metric} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-lg font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AgentMetricRow({ metric }: { metric: AgentMetrics }) {
  const color = AGENT_COLORS[metric.agentId as keyof typeof AGENT_COLORS] || "#6366f1";
  const label = AGENT_LABELS[metric.agentId as keyof typeof AGENT_LABELS] || metric.agentId;

  const statusColors = {
    idle: "bg-gray-500",
    thinking: "bg-yellow-500 animate-pulse",
    done: "bg-green-500",
    error: "bg-red-500",
  };

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div>
          <p className="font-medium text-sm">{label}</p>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>{metric.tokens.total.toLocaleString()} tokens</span>
            <span>•</span>
            <span>${metric.cost.toFixed(4)}</span>
            <span>•</span>
            <span>{metric.messagesSent} messages</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${statusColors[metric.status]}`} />
        <Badge variant="outline">{metric.status}</Badge>
      </div>
    </div>
  );
}
