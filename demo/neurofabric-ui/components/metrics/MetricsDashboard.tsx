"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AgentMetrics, Message } from "@/lib/types";
import { AGENT_COLORS, AGENT_LABELS } from "@/lib/constants";
import { Clock, DollarSign, MessageSquare, Zap, ChevronDown, ChevronRight, ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsDashboardProps {
  metrics: AgentMetrics[];
  messages: Message[];
  totalTime?: number;
  totalCost?: number;
  totalTokens?: number;
  isLoading?: boolean;
}

export default function MetricsDashboard({
  metrics,
  messages,
  totalTime = 0,
  totalCost = 0,
  totalTokens = 0,
  isLoading = false,
}: MetricsDashboardProps) {
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set());
  const tokensPerSecond = totalTime > 0 ? (totalTokens / (totalTime / 1000)).toFixed(1) : "0";

  const handleExpandAll = () => {
    setExpandedAgents(new Set(metrics.map(m => m.agentId)));
  };

  const handleCollapseAll = () => {
    setExpandedAgents(new Set());
  };

  const toggleAgent = (agentId: string) => {
    const newExpanded = new Set(expandedAgents);
    if (newExpanded.has(agentId)) {
      newExpanded.delete(agentId);
    } else {
      newExpanded.add(agentId);
    }
    setExpandedAgents(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Overview Cards Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Agent Performance Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20 sm:w-28" />
                <Skeleton className="h-9 w-20 sm:w-28" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">Agent Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Click on an agent to view details and message history</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExpandAll}
                  className="gap-2 flex-1 sm:flex-initial"
                >
                  <Maximize2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Expand All</span>
                  <span className="sm:hidden">Expand</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCollapseAll}
                  className="gap-2 flex-1 sm:flex-initial"
                >
                  <Minimize2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Collapse All</span>
                  <span className="sm:hidden">Collapse</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.map((metric) => (
                <AgentMetricRow 
                  key={metric.agentId} 
                  metric={metric} 
                  messages={messages}
                  isOpen={expandedAgents.has(metric.agentId)}
                  onToggle={() => toggleAgent(metric.agentId)}
                />
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
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-start">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm sm:text-xs text-muted-foreground">{title}</p>
            <p className="text-xl sm:text-lg font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AgentMetricRow({ 
  metric, 
  messages,
  isOpen,
  onToggle
}: { 
  metric: AgentMetrics; 
  messages: Message[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const color = AGENT_COLORS[metric.agentId as keyof typeof AGENT_COLORS] || "#6366f1";
  const label = AGENT_LABELS[metric.agentId as keyof typeof AGENT_LABELS] || metric.agentId;

  const statusColors = {
    idle: "bg-gray-500",
    thinking: "bg-yellow-500 animate-pulse",
    done: "bg-green-500",
    error: "bg-red-500",
  };

  // Get messages from and to this agent
  const agentMessages = messages.filter(
    (msg) => msg.from === metric.agentId || msg.to === metric.agentId
  );

  const sentMessages = messages.filter((msg) => msg.from === metric.agentId);
  const receivedMessages = messages.filter((msg) => msg.to === metric.agentId);

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <div>
              <p className="font-medium text-sm">{label}</p>
              <div className="flex gap-1 sm:gap-2 text-xs text-muted-foreground flex-wrap">
                <span className="whitespace-nowrap">{metric.tokens.total.toLocaleString()} tokens</span>
                <span className="hidden sm:inline">•</span>
                <span className="whitespace-nowrap">${metric.cost.toFixed(4)}</span>
                <span className="hidden sm:inline">•</span>
                <span className="whitespace-nowrap">{(metric.processingTime / 1000).toFixed(2)}s</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${statusColors[metric.status]}`} />
            <Badge variant="outline">{metric.status}</Badge>
          </div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="mt-2 ml-8 space-y-3 border-l-2 pl-4" style={{ borderColor: `${color}40` }}>
          {/* Detailed Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">LLM Calls</p>
              <p className="font-semibold">{metric.llmCalls}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Messages Sent</p>
              <p className="font-semibold">{metric.messagesSent}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Prompt Tokens</p>
              <p className="font-semibold">{metric.tokens.prompt.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Completion Tokens</p>
              <p className="font-semibold">{metric.tokens.completion.toLocaleString()}</p>
            </div>
          </div>

          {/* Message History */}
          {agentMessages.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Message History ({agentMessages.length})</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {sentMessages.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Sent ({sentMessages.length}):</p>
                    {sentMessages.map((msg) => (
                      <div key={msg.id} className="rounded-md bg-accent/30 p-2 text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowRight className="h-3 w-3" style={{ color }} />
                          <span className="font-medium">
                            To: {AGENT_LABELS[msg.to as keyof typeof AGENT_LABELS] || msg.to}
                          </span>
                          <Badge variant="outline" className="text-xs">{msg.type}</Badge>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {receivedMessages.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Received ({receivedMessages.length}):</p>
                    {receivedMessages.map((msg) => (
                      <div key={msg.id} className="rounded-md bg-muted/30 p-2 text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">
                            From: {AGENT_LABELS[msg.from as keyof typeof AGENT_LABELS] || msg.from}
                          </span>
                          <Badge variant="outline" className="text-xs">{msg.type}</Badge>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
