"use client";

// import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Clock, DollarSign, MessageSquare } from "lucide-react";

interface TraditionalViewProps {
  task: string;
  isProcessing: boolean;
  response: string;
  metrics: {
    time: number;
    cost: number;
    tokens: number;
  } | null;
}

export default function TraditionalView({ task, isProcessing, response, metrics }: TraditionalViewProps) {
  return (
    <div className="space-y-6">
      {/* Response Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Response</h3>
          {isProcessing && (
            <Badge variant="secondary" className="ml-auto animate-pulse">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Thinking...
            </Badge>
          )}
        </div>

        {!task && !isProcessing && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Enter a task above to see how traditional AI processes it</p>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-4 py-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
              <div className="space-y-2 flex-1">
                <p className="text-sm text-muted-foreground">
                  Processing your request with a single large language model...
                </p>
                <div className="space-y-2">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-pulse w-2/3 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {response && !isProcessing && (
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {response}
            </p>
          </div>
        )}
      </Card>

      {/* Metrics */}
      {metrics && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm sm:text-xs text-muted-foreground">Processing Time</p>
                <p className="text-xl sm:text-lg font-bold">{(metrics.time / 1000).toFixed(2)}s</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 shrink-0">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm sm:text-xs text-muted-foreground">Total Cost</p>
                <p className="text-xl sm:text-lg font-bold">${metrics.cost.toFixed(4)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 shrink-0">
                <MessageSquare className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm sm:text-xs text-muted-foreground">Tokens Used</p>
                <p className="text-xl sm:text-lg font-bold">{metrics.tokens.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
