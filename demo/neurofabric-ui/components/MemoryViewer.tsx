"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Brain,
  Clock,
  DollarSign,
  HelpCircle,
  MessageSquare,
  Search,
  TrendingDown,
  TrendingUp,
  Trash2,
} from "lucide-react";

interface Memory {
  id: string;
  task: string;
  timestamp: string;
  metrics: {
    totalTime: number;
    totalCost: number;
    totalTokens: number;
    agents: number;
  };
  result: string;
  similarity?: number;
}

// Mock data - will be replaced with API call
const mockMemories: Memory[] = [
  {
    id: "mem-1",
    task: "Analyze Q4 sales data and provide insights",
    timestamp: "2024-01-15T14:30:00Z",
    metrics: {
      totalTime: 8.5,
      totalCost: 0.0045,
      totalTokens: 12500,
      agents: 4,
    },
    result:
      "Q4 sales increased 23% YoY with strong performance in digital channels...",
    similarity: 0.95,
  },
  {
    id: "mem-2",
    task: "Calculate ROI for marketing campaigns",
    timestamp: "2024-01-14T09:15:00Z",
    metrics: {
      totalTime: 6.2,
      totalCost: 0.0032,
      totalTokens: 8900,
      agents: 3,
    },
    result:
      "Marketing ROI averaged 3.2x with email campaigns performing best...",
    similarity: 0.87,
  },
  {
    id: "mem-3",
    task: "Summarize customer feedback from last month",
    timestamp: "2024-01-13T16:45:00Z",
    metrics: {
      totalTime: 12.3,
      totalCost: 0.0067,
      totalTokens: 18200,
      agents: 5,
    },
    result:
      "Customer satisfaction increased to 4.2/5 stars with main praise for speed...",
    similarity: 0.72,
  },
  {
    id: "mem-4",
    task: "Generate content ideas for blog",
    timestamp: "2024-01-12T11:20:00Z",
    metrics: {
      totalTime: 5.8,
      totalCost: 0.0028,
      totalTokens: 7500,
      agents: 2,
    },
    result:
      "10 content ideas focused on AI automation, including tutorials and case studies...",
    similarity: 0.65,
  },
];

export function MemoryViewer() {
  const [memories] = useState<Memory[]>(mockMemories);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "similarity" | "cost">(
    "recent"
  );

  // Filter and sort memories
  const filteredMemories = memories
    .filter(
      (mem) =>
        mem.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mem.result.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "recent") {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } else if (sortBy === "similarity") {
        return (b.similarity || 0) - (a.similarity || 0);
      } else {
        return b.metrics.totalCost - a.metrics.totalCost;
      }
    });

  // Calculate aggregate stats
  const stats = {
    total: memories.length,
    totalCost: memories.reduce((sum, m) => sum + m.metrics.totalCost, 0),
    totalTokens: memories.reduce((sum, m) => sum + m.metrics.totalTokens, 0),
    avgTime:
      memories.reduce((sum, m) => sum + m.metrics.totalTime, 0) /
      memories.length,
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Long-Term Memory</h2>
            <p className="text-sm text-muted-foreground">
              Last {stats.total} processed tasks
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(139, 92, 246, 0.125)" }}
                >
                  <Brain
                    className="h-5 w-5"
                    style={{ color: "rgb(139, 92, 246)" }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">
                      Total Memories
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Number of tasks stored in long-term memory for future
                          reference
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-lg font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(16, 185, 129, 0.125)" }}
                >
                  <DollarSign
                    className="h-5 w-5"
                    style={{ color: "rgb(16, 185, 129)" }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">Total Cost</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Cumulative API cost for all stored memory tasks
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-lg font-bold">
                    ${stats.totalCost.toFixed(4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(245, 158, 11, 0.125)" }}
                >
                  <MessageSquare
                    className="h-5 w-5"
                    style={{ color: "rgb(245, 158, 11)" }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">
                      Total Tokens
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Total tokens processed across all memory tasks (input
                          + output)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-lg font-bold">
                    {stats.totalTokens.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(59, 130, 246, 0.125)" }}
                >
                  <Clock
                    className="h-5 w-5"
                    style={{ color: "rgb(59, 130, 246)" }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Average processing time per task across all memories
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-lg font-bold">
                    {stats.avgTime.toFixed(1)}s
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "recent" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("recent")}
            >
              Recent
            </Button>
            <Button
              variant={sortBy === "similarity" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("similarity")}
            >
              Similar
            </Button>
            <Button
              variant={sortBy === "cost" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("cost")}
            >
              Cost
            </Button>
          </div>
        </div>

        {/* Memory List */}
        <div className="space-y-4">
          {filteredMemories.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center p-4">
                <div className="text-center">
                  <Brain className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? "No memories found matching your search"
                      : "No memories yet. Process some tasks to build memory!"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredMemories.map((memory) => (
              <Card
                key={memory.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedMemory(memory)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <p className="font-medium leading-tight">
                          {memory.task}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(memory.timestamp)}
                        </p>
                      </div>
                      {memory.similarity && (
                        <Badge variant="secondary" className="shrink-0">
                          {(memory.similarity * 100).toFixed(0)}% match
                        </Badge>
                      )}
                    </div>

                    {/* Result Preview */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {memory.result}
                    </p>

                    {/* Metrics */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>{memory.metrics.totalTime.toFixed(1)}s</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-3 w-3" />
                        <span>${memory.metrics.totalCost.toFixed(4)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-3 w-3" />
                        <span>
                          {memory.metrics.totalTokens.toLocaleString()} tokens
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Brain className="h-3 w-3" />
                        <span>{memory.metrics.agents} agents</span>
                      </div>
                      {memory.metrics.totalCost < 0.005 ? (
                        <Badge
                          variant="outline"
                          className="gap-1 text-green-600"
                        >
                          <TrendingDown className="h-3 w-3" />
                          Low cost
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="gap-1 text-amber-600"
                        >
                          <TrendingUp className="h-3 w-3" />
                          High cost
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Memory Detail Modal */}
        {selectedMemory && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedMemory(null)}
          >
            <Card
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Memory Details</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedMemory.timestamp)} • ID:{" "}
                      {selectedMemory.id}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMemory(null)}
                  >
                    ✕
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Task</h4>
                    <p className="text-sm">{selectedMemory.task}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Result</h4>
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedMemory.result}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Processing Time
                        </p>
                        <p className="text-lg font-bold">
                          {selectedMemory.metrics.totalTime.toFixed(1)}s
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Total Cost
                        </p>
                        <p className="text-lg font-bold">
                          ${selectedMemory.metrics.totalCost.toFixed(4)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Tokens Used
                        </p>
                        <p className="text-lg font-bold">
                          {selectedMemory.metrics.totalTokens.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Agents Involved
                        </p>
                        <p className="text-lg font-bold">
                          {selectedMemory.metrics.agents}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedMemory.similarity && (
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <h4 className="font-semibold">Similarity Score</h4>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              How similar this memory is to your current query
                              (0-100%). Higher scores mean more relevant past
                              experiences.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{
                              width: `${selectedMemory.similarity * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold">
                          {(selectedMemory.similarity * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
