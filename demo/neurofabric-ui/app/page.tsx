"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Brain, Sparkles, BarChart3, ChevronDown, ChevronUp, Loader2, FileDown, FileJson, FileText, Info } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";
import MessageList from "@/components/chat/MessageList";
import MetricsDashboard from "@/components/metrics/MetricsDashboard";
import TraditionalView from "@/components/traditional/TraditionalView";
import { Skeleton } from "@/components/ui/skeleton";
import { Message, AgentMetrics } from "@/lib/types";
import { exportToJSON, exportToMarkdown } from "@/lib/export";
import Link from "next/link";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [agentMetrics, setAgentMetrics] = useState<AgentMetrics[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(true);
  const [isMessagesOpen, setIsMessagesOpen] = useState(true);
  const [messagesHeight, setMessagesHeight] = useState(400);
  
  // Traditional AI state
  const [traditionalTask, setTraditionalTask] = useState("");
  const [traditionalProcessing, setTraditionalProcessing] = useState(false);
  const [traditionalResponse, setTraditionalResponse] = useState("");
  const [traditionalMetrics, setTraditionalMetrics] = useState<{
    time: number;
    cost: number;
    tokens: number;
  } | null>(null);
  
  // Final answer state
  const [finalAnswer, setFinalAnswer] = useState("");
  
  // Side-by-side comparison state
  const [comparisonTask, setComparisonTask] = useState("");
  const [comparisonProcessing, setComparisonProcessing] = useState(false);

  // Reset function for tab changes
  const resetAllStates = () => {
    setMessages([]);
    setAgentMetrics([]);
    setIsProcessing(false);
    setFinalAnswer("");
    setTraditionalTask("");
    setTraditionalProcessing(false);
    setTraditionalResponse("");
    setTraditionalMetrics(null);
    setComparisonTask("");
    setComparisonProcessing(false);
  };

  const handleExport = (format: "json" | "markdown") => {
    const exportData = {
      task: messages[0]?.content || "",
      messages,
      metrics: agentMetrics,
      finalAnswer,
      timestamp: Date.now(),
    };

    if (format === "json") {
      exportToJSON(exportData);
    } else {
      exportToMarkdown(exportData);
    }
  };

  const handleTaskSubmit = async (task: string) => {
    setIsProcessing(true);
    setFinalAnswer(""); // Clear previous answer
    
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
    
    // Detect task scale
    const isLargeScale = task.toLowerCase().includes("500 reviews") || 
                         task.toLowerCase().includes("500 customer");
    const isMediumScale = task.toLowerCase().includes("50 reviews") || 
                          task.toLowerCase().includes("50 customer");
    const isMultiDoc = task.toLowerCase().includes("legal contracts") ||
                       task.toLowerCase().includes("contract");
    const isResearch = task.toLowerCase().includes("research papers") ||
                       task.toLowerCase().includes("5 research");
    
    const mockMessages: Message[] = isLargeScale ? [
      {
        id: msg1Id,
        from: "coordinator" as any,
        fromInstanceId: "coordinator-1",
        to: "system",
        content: "Large-scale analysis detected. Decomposing into 500 review analysis subtasks and distributing workload across specialist agents...",
        timestamp: baseTime + 500,
        type: "info",
      },
      {
        id: msg2Id,
        from: "coordinator" as any,
        fromInstanceId: "coordinator-1",
        to: "specialist_math" as any,
        toInstanceId: "specialist_math-1",
        content: "Calculate statistics for 500 reviews: ratings distribution, average scores, variance, trends over time, correlation analysis",
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
        content: "Perform deep sentiment analysis on 500 reviews: extract themes, categorize feedback, identify patterns, analyze language sentiment",
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
        content: "Statistical analysis complete: Average 4.2/5, 78% 4-5 stars, 15% 3 stars, 7% 1-2 stars. Upward trend detected (+0.3 over 6 months). Strong correlation between service quality and overall rating (r=0.87)",
        timestamp: baseTime + 3500,
        type: "response",
        parentMessageId: msg2Id,
      },
      {
        id: `msg-${baseTime}-5`,
        from: "specialist_text" as any,
        fromInstanceId: "specialist_text-1",
        to: "analyst" as any,
        toInstanceId: "analyst-1",
        content: "Sentiment analysis complete: 78% positive, 15% neutral, 7% negative. Top themes: Quality (85% mention), Service (92% mention), Value (67% mention), Delivery (45% mention). Key insights: Customers highly praise customer service, mixed feedback on product consistency.",
        timestamp: baseTime + 4000,
        type: "response",
        parentMessageId: msg3Id,
      },
      {
        id: `msg-${baseTime}-6`,
        from: "analyst" as any,
        fromInstanceId: "analyst-1",
        to: "super_critic" as any,
        toInstanceId: "super_critic-1",
        content: "Comprehensive synthesis: 500 reviews analyzed showing strong overall performance (4.2/5) with improving trends. Service quality is the key differentiator (92% positive mentions). Main improvement area: product quality consistency (mixed feedback in 23% of reviews). Recommend: implement quality control measures while maintaining excellent service standards.",
        timestamp: baseTime + 4500,
        type: "response",
        parentMessageId: `msg-${baseTime}-4`,
      },
      {
        id: `msg-${baseTime}-7`,
        from: "super_critic" as any,
        fromInstanceId: "super_critic-1",
        to: "system",
        content: "✓ Quality check passed. Large-scale analysis is comprehensive, statistically sound, and actionable. All 500 reviews properly processed.",
        timestamp: baseTime + 5000,
        type: "info",
        parentMessageId: `msg-${baseTime}-6`,
      },
    ] : [
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

    const mockMetrics: AgentMetrics[] = isLargeScale ? [
      // 500 reviews = ~150K tokens input, distributed processing
      {
        agentId: "coordinator" as any,
        llmCalls: 3,
        tokens: { prompt: 15000, completion: 3500, total: 18500 },  // Orchestration only
        cost: 0.0148,
        messagesSent: 12,
        processingTime: 8500,
        status: "done",
      },
      {
        agentId: "specialist_math" as any,
        llmCalls: 5,
        tokens: { prompt: 35000, completion: 8500, total: 43500 },  // Statistical analysis chunk
        cost: 0.0348,
        messagesSent: 8,
        processingTime: 12000,
        status: "done",
      },
      {
        agentId: "specialist_text" as any,
        llmCalls: 8,
        tokens: { prompt: 42000, completion: 12000, total: 54000 },  // Sentiment analysis chunk
        cost: 0.0432,
        messagesSent: 10,
        processingTime: 15000,
        status: "done",
      },
      {
        agentId: "analyst" as any,
        llmCalls: 4,
        tokens: { prompt: 25000, completion: 8000, total: 33000 },  // Synthesis only
        cost: 0.0264,
        messagesSent: 6,
        processingTime: 10000,
        status: "done",
      },
      {
        agentId: "super_critic" as any,
        llmCalls: 2,
        tokens: { prompt: 12000, completion: 4500, total: 16500 },  // Quality check only
        cost: 0.0132,
        messagesSent: 4,
        processingTime: 6000,
        status: "done",
      },
    ] : isMediumScale ? [
      // 50 reviews = ~15K tokens input
      {
        agentId: "coordinator" as any,
        llmCalls: 2,
        tokens: { prompt: 3500, completion: 800, total: 4300 },
        cost: 0.0034,
        messagesSent: 8,
        processingTime: 3500,
        status: "done",
      },
      {
        agentId: "specialist_math" as any,
        llmCalls: 3,
        tokens: { prompt: 8500, completion: 2200, total: 10700 },
        cost: 0.0086,
        messagesSent: 5,
        processingTime: 5000,
        status: "done",
      },
      {
        agentId: "specialist_text" as any,
        llmCalls: 4,
        tokens: { prompt: 9500, completion: 3500, total: 13000 },
        cost: 0.0104,
        messagesSent: 6,
        processingTime: 6500,
        status: "done",
      },
      {
        agentId: "analyst" as any,
        llmCalls: 2,
        tokens: { prompt: 6500, completion: 2800, total: 9300 },
        cost: 0.0074,
        messagesSent: 4,
        processingTime: 4500,
        status: "done",
      },
      {
        agentId: "super_critic" as any,
        llmCalls: 1,
        tokens: { prompt: 3500, completion: 1200, total: 4700 },
        cost: 0.0038,
        messagesSent: 3,
        processingTime: 2500,
        status: "done",
      },
    ] : [
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
    
    // Set final answer
    const heavyAnswer = `Comprehensive Analysis of 500 Customer Reviews

Executive Summary:
Our analysis of 500 customer reviews reveals strong overall performance with a 4.2/5 average rating and an encouraging upward trend. The data shows significant improvement over the past 6 months (+0.3 rating increase), indicating positive momentum in customer satisfaction.

Detailed Rating Distribution:
• 5 Stars: 58% (290 reviews) - Excellent performance
• 4 Stars: 20% (100 reviews) - Very good
• 3 Stars: 15% (75 reviews) - Satisfactory
• 2 Stars: 4% (20 reviews) - Below expectations
• 1 Star: 3% (15 reviews) - Poor performance

Sentiment Analysis Results:
Our deep learning sentiment analysis processed all 500 reviews and identified:
• Positive Sentiment: 78% (390 reviews)
• Neutral Sentiment: 15% (75 reviews)
• Negative Sentiment: 7% (35 reviews)

Key Themes Identified (with mention frequency):
1. Service Quality: 92% mention rate (460 reviews)
   - Overwhelmingly positive feedback
   - Staff helpfulness and responsiveness highly praised
   - Quick resolution of issues noted

2. Product Quality: 85% mention rate (425 reviews)
   - Mixed feedback patterns detected
   - 77% positive, 23% expressing concerns
   - Main issue: consistency across different product lines

3. Value for Money: 67% mention rate (335 reviews)
   - Generally perceived as fair pricing
   - Good value proposition acknowledged

4. Delivery & Logistics: 45% mention rate (225 reviews)
   - Fast delivery appreciated
   - Packaging quality mentioned positively

Statistical Insights:
• Strong correlation (r=0.87) between service quality and overall rating
• Moderate correlation (r=0.64) between product quality and rating
• Temporal analysis shows steady improvement trend
• Variance analysis indicates consistent performance with occasional outliers

Customer Segments:
• Loyal Advocates (65%): Highly satisfied, likely to recommend
• Satisfied Users (20%): Happy but less enthusiastic
• Neutral Observers (8%): Indifferent, may switch
• Detractors (7%): Dissatisfied, need attention

Recommendations:
1. Maintain Excellence in Service: Continue investing in customer service training and support infrastructure
2. Address Quality Consistency: Implement stricter quality control measures across all product lines
3. Leverage Positive Momentum: Use improving trends in marketing materials
4. Focus on Detractors: Reach out to the 7% negative reviewers to understand and address concerns
5. Scale Success Factors: Replicate successful service practices across all touchpoints

Risk Assessment:
• Low Risk: Service quality degradation (currently excellent)
• Medium Risk: Product quality issues if not addressed (23% mixed feedback)
• Low Risk: Price competitiveness (strong value perception)

Conclusion:
The analysis of 500 reviews demonstrates strong market position with exceptional service quality. Addressing product consistency while maintaining service excellence will drive continued growth. The upward trend indicates current strategies are effective.`;

    const standardAnswer = `Based on analyzing the reviews, here's my assessment:

Average Rating: 3.8 out of 5 stars
The overall rating suggests generally positive customer satisfaction, though there is room for improvement.

Sentiment Analysis:
• 60% Positive feedback
• 20% Neutral comments
• 20% Negative feedback

Key Findings:
1. Service Quality: Customers consistently praise the excellent service and helpful staff.
2. Value for Money: Many reviewers mention good value and fair pricing.
3. Product Quality: This appears to be the main area of concern, with mixed opinions. Some customers love the quality while others found it inconsistent.

Recommendation: Focus on improving quality consistency while maintaining the strong service standards and competitive pricing that customers appreciate.`;

    setFinalAnswer(isLargeScale ? largeScaleAnswer : isMediumScale ? mediumScaleAnswer : standardAnswer);
  };

  const handleTraditionalTaskSubmit = async (task: string) => {
    setTraditionalProcessing(true);
    setTraditionalTask(task);
    setTraditionalResponse("");
    setTraditionalMetrics(null);

    // Detect task scale for traditional AI
    const isLargeScale = task.toLowerCase().includes("500 reviews") || task.toLowerCase().includes("500 customer");
    const isMediumScale = task.toLowerCase().includes("50 reviews") || task.toLowerCase().includes("50 customer");

    // Traditional AI needs entire context in one call - expensive!
    const waitTime = isLargeScale ? 18000 : isMediumScale ? 8000 : 3000;
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    const mockResponse = `Based on analyzing the reviews, here's my assessment:

Average Rating: 3.8 out of 5 stars
The overall rating suggests generally positive customer satisfaction, though there is room for improvement.

Sentiment Analysis:
- 60% Positive feedback
- 20% Neutral comments  
- 20% Negative feedback

Key Findings:
1. Service Quality: Customers consistently praise the excellent service and helpful staff.
2. Value for Money: Many reviewers mention good value and fair pricing.
3. Product Quality: This appears to be the main area of concern, with mixed opinions. Some customers love the quality while others found it inconsistent.

Recommendation: Focus on improving quality consistency while maintaining the strong service standards and competitive pricing that customers appreciate.`;

    setTraditionalResponse(mockResponse);
    setTraditionalMetrics(
      isLargeScale ? {
        time: 73000,  // Much slower - single model processing everything
        cost: 0.2840,  // EXPENSIVE - entire 500 reviews in context window
        tokens: 178500,  // Massive token count - no parallelization
      } : isMediumScale ? {
        time: 22000,  
        cost: 0.0524,  // Higher than multi-agent
        tokens: 32800,  // Entire 50 reviews in one context
      } : {
        time: 8500,
        cost: 0.0024,
        tokens: 6800,
      }
    );
    setTraditionalProcessing(false);
  };

  const handleComparisonTaskSubmit = async (task: string) => {
    setComparisonProcessing(true);
    setComparisonTask(task);
    
    // Reset both sides
    setMessages([]);
    setAgentMetrics([]);
    setFinalAnswer("");
    setTraditionalResponse("");
    setTraditionalMetrics(null);

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

    // Run both in parallel
    const [_, __] = await Promise.all([
      simulateAgentProcessing(task),
      new Promise(async (resolve) => {
        await new Promise((r) => setTimeout(r, 3000));
        const mockResponse = `Based on analyzing the reviews, here's my assessment:

Average Rating: 3.8 out of 5 stars
The overall rating suggests generally positive customer satisfaction, though there is room for improvement.

Sentiment Analysis:
- 60% Positive feedback
- 20% Neutral comments  
- 20% Negative feedback

Key Findings:
1. Service Quality: Customers consistently praise the excellent service and helpful staff.
2. Value for Money: Many reviewers mention good value and fair pricing.
3. Product Quality: This appears to be the main area of concern, with mixed opinions. Some customers love the quality while others found it inconsistent.

Recommendation: Focus on improving quality consistency while maintaining the strong service standards and competitive pricing that customers appreciate.`;
        
        setTraditionalResponse(mockResponse);
        setTraditionalMetrics({
          time: 8500,
          cost: 0.0024,
          tokens: 6800,
        });
        resolve(null);
      })
    ]);

    setComparisonProcessing(false);
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
          <Tabs defaultValue="fabric" className="w-full" onValueChange={resetAllStates}>
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="fabric" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">
                <span className="hidden sm:inline">NeuroFabric Demo</span>
                <span className="sm:hidden">Demo</span>
              </TabsTrigger>
              <TabsTrigger value="comparison" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">
                <span className="hidden sm:inline">Side-by-Side Comparison</span>
                <span className="sm:hidden">Compare</span>
              </TabsTrigger>
              <TabsTrigger value="traditional" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4">
                <span className="hidden sm:inline">Traditional AI</span>
                <span className="sm:hidden">Traditional</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fabric" className="space-y-6 mt-6">
              {/* Chat Interface */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Enter Your Task</h3>
                <ChatInterface onSubmit={handleTaskSubmit} isProcessing={isProcessing} />
              </div>

              <Separator />

              {/* Final Answer Section */}
              {(messages.length > 0 || isProcessing) && (
                <>
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Final Answer</h3>
                      </div>
                      {finalAnswer && !isProcessing && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport("json")}
                            className="gap-2"
                          >
                            <FileJson className="h-4 w-4" />
                            <span className="hidden sm:inline">JSON</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport("markdown")}
                            className="gap-2"
                          >
                            <FileDown className="h-4 w-4" />
                            <span className="hidden sm:inline">Markdown</span>
                          </Button>
                        </div>
                      )}
                    </div>
                    <Card className="p-6 border-2 border-primary/20 bg-primary/5">
                      {isProcessing && !finalAnswer ? (
                        <div className="space-y-4 py-8">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                            <div className="space-y-2 flex-1">
                              <p className="text-sm text-muted-foreground">
                                Agents are collaborating to generate the final answer...
                              </p>
                              <div className="space-y-2">
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-primary animate-pulse w-2/3 transition-all" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : finalAnswer ? (
                        <div className="prose prose-sm max-w-none">
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {finalAnswer}
                          </p>
                        </div>
                      ) : null}
                    </Card>
                  </div>

                  <Separator />
                </>
              )}

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

              {/* Performance Metrics - Collapsible - Always visible */}
              <Separator />
              <Collapsible open={isMetricsOpen} onOpenChange={setIsMetricsOpen}>
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="flex w-full justify-between p-0 hover:bg-transparent">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Performance Metrics</h3>
                      </div>
                      {isMetricsOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-3">
                  <MetricsDashboard
                    metrics={agentMetrics}
                    messages={messages}
                    totalTime={totalMetrics.time}
                    totalCost={totalMetrics.cost}
                    totalTokens={totalMetrics.tokens}
                    isLoading={messages.length > 0 && agentMetrics.length === 0}
                  />
                </CollapsibleContent>
              </Collapsible>

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

            <TabsContent value="traditional" className="space-y-6 mt-6">
              {/* Chat Interface */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Enter Your Task</h3>
                <ChatInterface onSubmit={handleTraditionalTaskSubmit} isProcessing={traditionalProcessing} />
              </div>

              <Separator />

              {/* Traditional AI Response */}
              <TraditionalView
                task={traditionalTask}
                isProcessing={traditionalProcessing}
                response={traditionalResponse}
                metrics={traditionalMetrics}
              />

              {/* Info Notice */}
              {!traditionalTask && (
                <Card className="border-primary/50 bg-primary/5 p-6">
                  <div className="space-y-2 text-center">
                    <Brain className="mx-auto h-10 w-10 text-primary" />
                    <h3 className="text-lg font-bold">Try Traditional AI</h3>
                    <p className="text-sm text-muted-foreground">
                      See how a single large language model processes the same task.
                      Compare the speed, cost, and results with the multi-agent approach.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Note: Currently using mock data. Backend integration coming soon.
                    </p>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6 mt-6">
              {/* Chat Interface */}
              <div>
                <h3 className="mb-3 text-lg font-semibold">Enter Your Task</h3>
                <ChatInterface onSubmit={handleComparisonTaskSubmit} isProcessing={comparisonProcessing} />
              </div>

              <Separator />

              {/* Side-by-Side Comparison */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* NeuroFabric Side */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">NeuroFabric (Multi-Agent)</h3>
                    {comparisonProcessing && !finalAnswer && (
                      <Badge variant="secondary" className="ml-auto animate-pulse">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Processing
                      </Badge>
                    )}
                    {finalAnswer && !comparisonProcessing && (
                      <Badge variant="default" className="ml-auto bg-green-500">
                        ✓ Complete
                      </Badge>
                    )}
                  </div>
                  
                  <Card className="p-6 border-2 border-primary/20 bg-primary/5">
                    {comparisonProcessing && !finalAnswer ? (
                      <div className="space-y-4 py-8">
                        <div className="flex items-start gap-3">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <div className="space-y-2 flex-1">
                            <p className="text-sm text-muted-foreground">
                              Agents collaborating...
                            </p>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary animate-pulse w-2/3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : finalAnswer ? (
                      <>
                        <div className="prose prose-sm max-w-none mb-4">
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                            {finalAnswer}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Time</p>
                            <p className="text-sm font-bold">{(totalMetrics.time / 1000).toFixed(2)}s</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Cost</p>
                            <p className="text-sm font-bold">${totalMetrics.cost.toFixed(4)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Tokens</p>
                            <p className="text-sm font-bold">{totalMetrics.tokens.toLocaleString()}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground text-sm">
                        Waiting for task...
                      </div>
                    )}
                  </Card>
                </div>

                {/* Traditional AI Side */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-semibold">Traditional AI (Single Model)</h3>
                    {comparisonProcessing && !traditionalResponse && (
                      <Badge variant="secondary" className="ml-auto animate-pulse">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Processing
                      </Badge>
                    )}
                    {traditionalResponse && !comparisonProcessing && (
                      <Badge variant="default" className="ml-auto bg-green-500">
                        ✓ Complete
                      </Badge>
                    )}
                  </div>
                  
                  <Card className="p-6 border-2 border-orange-500/20 bg-orange-500/5">
                    {comparisonProcessing && !traditionalResponse ? (
                      <div className="space-y-4 py-8">
                        <div className="flex items-start gap-3">
                          <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                          <div className="space-y-2 flex-1">
                            <p className="text-sm text-muted-foreground">
                              Single model processing...
                            </p>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-orange-500 animate-pulse w-2/3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : traditionalResponse ? (
                      <>
                        <div className="prose prose-sm max-w-none mb-4">
                          <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                            {traditionalResponse}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Time</p>
                            <p className="text-sm font-bold">{traditionalMetrics ? (traditionalMetrics.time / 1000).toFixed(2) : '0'}s</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Cost</p>
                            <p className="text-sm font-bold">${traditionalMetrics ? traditionalMetrics.cost.toFixed(4) : '0.0000'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Tokens</p>
                            <p className="text-sm font-bold">{traditionalMetrics ? traditionalMetrics.tokens.toLocaleString() : '0'}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground text-sm">
                        Waiting for task...
                      </div>
                    )}
                  </Card>
                </div>
              </div>

              {/* Comparison Summary */}
              {comparisonTask && (
                <Card className="p-6 bg-gradient-to-r from-primary/5 to-orange-500/5">
                  <h3 className="text-lg font-semibold mb-4">📊 Performance Comparison</h3>
                  {comparisonProcessing ? (
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Speed Improvement</p>
                        <Skeleton className="h-8 w-32" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Cost Savings</p>
                        <Skeleton className="h-8 w-32" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Token Efficiency</p>
                        <Skeleton className="h-8 w-32" />
                      </div>
                    </div>
                  ) : finalAnswer && traditionalResponse && traditionalMetrics ? (
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Speed Improvement</p>
                        <p className="text-2xl font-bold text-green-600">
                          {((1 - totalMetrics.time / traditionalMetrics.time) * 100).toFixed(1)}% faster
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Cost Savings</p>
                        <p className="text-2xl font-bold text-green-600">
                          {((1 - totalMetrics.cost / traditionalMetrics.cost) * 100).toFixed(1)}% cheaper
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Token Efficiency</p>
                        <p className="text-2xl font-bold text-green-600">
                          {((1 - totalMetrics.tokens / traditionalMetrics.tokens) * 100).toFixed(1)}% fewer tokens
                        </p>
                      </div>
                    </div>
                  ) : null}
                </Card>
              )}

              {/* Info Notice */}
              {!comparisonTask && (
                <Card className="border-primary/50 bg-primary/5 p-6">
                  <div className="space-y-2 text-center">
                    <Brain className="mx-auto h-10 w-10 text-primary" />
                    <h3 className="text-lg font-bold">Compare Both Approaches</h3>
                    <p className="text-sm text-muted-foreground">
                      Run the same task through both NeuroFabric multi-agent system and traditional single AI model.
                      See the performance differences side-by-side in real-time.
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
