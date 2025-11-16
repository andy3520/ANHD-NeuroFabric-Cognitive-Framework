"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Brain, Sparkles, BarChart3, Network, ChevronDown, ChevronUp } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";
import MessageList from "@/components/chat/MessageList";
import MetricsDashboard from "@/components/metrics/MetricsDashboard";
import AgentNetwork from "@/components/graph/AgentNetwork";
import { Message, AgentMetrics } from "@/lib/types";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [agentMetrics, setAgentMetrics] = useState<AgentMetrics[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(true);
  const [isMessagesOpen, setIsMessagesOpen] = useState(true);
  const [messagesHeight, setMessagesHeight] = useState(400);

  const handleTaskSubmit = async (task: string) => {
    setIsProcessing(true);
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      from: "user" as any,
      to: "system",
      content: task,
      timestamp: Date.now(),
      type: "request",
    };
    setMessages([userMessage]);

    // Simulate agent processing with mock data
    await simulateAgentProcessing(task);
    
    setIsProcessing(false);
  };

  const simulateAgentProcessing = async (task: string) => {
    const baseTime = Date.now();
    const msg1Id = `msg-${baseTime}-1`;
    const msg2Id = `msg-${baseTime}-2`;
    const msg3Id = `msg-${baseTime}-3`;
    
    const mockMessages: Message[] = [
      {
        id: msg1Id,
        from: "coordinator" as any,
        fromInstanceId: "coordinator-1",
        to: "system",
        content: "Analyzing task and decomposing into subtasks...",
        timestamp: baseTime + 500,
        type: "info",
      },
      {
        id: msg2Id,
        from: "coordinator" as any,
        fromInstanceId: "coordinator-1",
        to: "specialist_math" as any,
        toInstanceId: "specialist_math-1",
        content: "Calculate the average rating from the reviews",
        timestamp: baseTime + 1000,
        type: "request",
        parentMessageId: msg1Id,
      },
      {
        id: msg3Id,
        from: "coordinator" as any,
        fromInstanceId: "coordinator-1",
        to: "specialist_text" as any,
        toInstanceId: "specialist_text-1",
        content: "Analyze sentiment trends in the reviews",
        timestamp: baseTime + 1500,
        type: "request",
        parentMessageId: msg1Id,
      },
      {
        id: `msg-${baseTime}-4`,
        from: "specialist_math" as any,
        fromInstanceId: "specialist_math-1",
        to: "analyst" as any,
        toInstanceId: "analyst-1",
        content: "Average rating calculated: 3.8/5 (based on ratings: 5, 3, 5, 2, 4)",
        timestamp: baseTime + 2500,
        type: "response",
        parentMessageId: msg2Id,
      },
      {
        id: `msg-${baseTime}-5`,
        from: "specialist_text" as any,
        fromInstanceId: "specialist_text-1",
        to: "analyst" as any,
        toInstanceId: "analyst-1",
        content: "Sentiment analysis: 60% positive, 20% neutral, 20% negative. Key themes: Quality (mixed), Service (positive), Value (positive)",
        timestamp: baseTime + 3000,
        type: "response",
        parentMessageId: msg3Id,
      },
      {
        id: `msg-${baseTime}-6`,
        from: "analyst" as any,
        fromInstanceId: "analyst-1",
        to: "super_critic" as any,
        toInstanceId: "super_critic-1",
        content: "Synthesized result: Average rating of 3.8/5 with generally positive sentiment (60%). Customers appreciate service and value but have mixed opinions on quality.",
        timestamp: baseTime + 3500,
        type: "response",
        parentMessageId: `msg-${baseTime}-4`,
      },
      {
        id: `msg-${baseTime}-7`,
        from: "super_critic" as any,
        fromInstanceId: "super_critic-1",
        to: "system",
        content: "✓ Quality check passed. Result is accurate and comprehensive.",
        timestamp: baseTime + 4000,
        type: "info",
        parentMessageId: `msg-${baseTime}-6`,
      },
    ];

    const mockMetrics: AgentMetrics[] = [
      {
        agentId: "coordinator" as any,
        llmCalls: 1,
        tokens: { prompt: 250, completion: 179, total: 429 },
        cost: 0.000152,
        messagesSent: 7,
        processingTime: 1200,
        status: "done",
      },
      {
        agentId: "specialist_math" as any,
        llmCalls: 1,
        tokens: { prompt: 420, completion: 417, total: 837 },
        cost: 0.000401,
        messagesSent: 2,
        processingTime: 1500,
        status: "done",
      },
      {
        agentId: "specialist_text" as any,
        llmCalls: 1,
        tokens: { prompt: 398, completion: 399, total: 797 },
        cost: 0.000372,
        messagesSent: 2,
        processingTime: 1800,
        status: "done",
      },
      {
        agentId: "analyst" as any,
        llmCalls: 1,
        tokens: { prompt: 1039, completion: 1037, total: 2076 },
        cost: 0.000593,
        messagesSent: 3,
        processingTime: 2000,
        status: "done",
      },
      {
        agentId: "super_critic" as any,
        llmCalls: 1,
        tokens: { prompt: 435, completion: 437, total: 872 },
        cost: 0.000156,
        messagesSent: 2,
        processingTime: 800,
        status: "done",
      },
    ];

    // Simulate gradual message appearance
    for (const msg of mockMessages) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessages((prev) => [...prev, msg]);
    }

    // Update metrics after processing
    setAgentMetrics(mockMetrics);
  };

  const totalMetrics = {
    time: agentMetrics.reduce((sum, m) => sum + m.processingTime, 0),
    cost: agentMetrics.reduce((sum, m) => sum + m.cost, 0),
    tokens: agentMetrics.reduce((sum, m) => sum + m.tokens.total, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">NeuroFabric</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              About
            </Button>
            <Button variant="ghost" size="sm">
              Docs
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Hero Section */}
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Multi-Agent AI Framework</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Visualize AI Intelligence
            </h2>
            <p className="text-muted-foreground">
              Watch specialized AI agents collaborate in real-time
            </p>
          </div>

          {/* Mode Selection */}
          <Tabs defaultValue="fabric" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fabric">NeuroFabric Demo</TabsTrigger>
              <TabsTrigger value="comparison" disabled>
                Side-by-Side (Coming Soon)
              </TabsTrigger>
              <TabsTrigger value="traditional" disabled>
                Traditional (Coming Soon)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fabric" className="space-y-6 mt-6">
              {/* Chat Interface */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Enter Your Task</h3>
                <ChatInterface onSubmit={handleTaskSubmit} isProcessing={isProcessing} />
              </div>

              <Separator />

              {/* 3D Agent Network - Collapsible */}
              <Collapsible open={isNetworkOpen} onOpenChange={setIsNetworkOpen}>
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex w-full justify-between p-0 hover:bg-transparent">
                      <div className="flex items-center gap-2">
                        <Network className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Agent Network</h3>
                      </div>
                      {isNetworkOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-3">
                  <AgentNetwork
                    messages={messages}
                    agentMetrics={agentMetrics}
                    isProcessing={isProcessing}
                  />
                </CollapsibleContent>
              </Collapsible>

              <Separator />

              {/* Message Flow - Collapsible */}
              <Collapsible open={isMessagesOpen} onOpenChange={setIsMessagesOpen}>
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex w-full justify-between p-0 hover:bg-transparent">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">Agent Communication</h3>
                        {messages.length > 0 && (
                          <span className="text-sm text-muted-foreground">
                            ({messages.length} messages)
                          </span>
                        )}
                      </div>
                      {isMessagesOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-3">
                  <div className="relative">
                    <MessageList messages={messages} height={messagesHeight} />
                    {/* Resize Handle */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-primary/20 hover:bg-primary/40 transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const startY = e.clientY;
                        const startHeight = messagesHeight;

                        const handleMouseMove = (e: MouseEvent) => {
                          const deltaY = e.clientY - startY;
                          const newHeight = Math.max(300, Math.min(1000, startHeight + deltaY));
                          setMessagesHeight(newHeight);
                        };

                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };

                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                      title="Drag to resize"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Metrics */}
              {agentMetrics.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Performance Metrics</h3>
                    </div>
                    <MetricsDashboard
                      metrics={agentMetrics}
                      totalTime={totalMetrics.time}
                      totalCost={totalMetrics.cost}
                      totalTokens={totalMetrics.tokens}
                    />
                  </div>
                </>
              )}

              {/* Info Notice */}
              {messages.length === 0 && (
                <Card className="border-primary/50 bg-primary/5 p-6">
                  <div className="space-y-2 text-center">
                    <Brain className="mx-auto h-10 w-10 text-primary" />
                    <h3 className="text-lg font-bold">Try the Demo</h3>
                    <p className="text-sm text-muted-foreground">
                      Select an example task or enter your own to see how 5 specialized
                      AI agents collaborate to solve complex problems.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Note: Currently using mock data. Backend integration coming soon.
                    </p>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
