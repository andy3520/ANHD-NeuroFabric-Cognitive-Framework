"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SessionMetrics } from "@/lib/types";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface ComparisonPanelProps {
  fabricMetrics: SessionMetrics | null;
  traditionalMetrics: SessionMetrics | null;
}

export default function ComparisonPanel({
  fabricMetrics,
  traditionalMetrics,
}: ComparisonPanelProps) {
  if (!fabricMetrics || !traditionalMetrics) {
    return (
      <Card className="p-8">
        <p className="text-center text-muted-foreground">
          Run a task in comparison mode to see efficiency analysis
        </p>
      </Card>
    );
  }

  const timeDiff = fabricMetrics.totalProcessingTime - traditionalMetrics.totalProcessingTime;
  const timePercent = ((timeDiff / traditionalMetrics.totalProcessingTime) * 100).toFixed(1);
  
  const costDiff = fabricMetrics.totalCost - traditionalMetrics.totalCost;
  const costPercent = ((costDiff / traditionalMetrics.totalCost) * 100).toFixed(1);
  
  const tokenDiff = fabricMetrics.totalTokens - traditionalMetrics.totalTokens;
  const tokenPercent = ((tokenDiff / traditionalMetrics.totalTokens) * 100).toFixed(1);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ComparisonCard
        title="Processing Time"
        fabricValue={`${(fabricMetrics.totalProcessingTime / 1000).toFixed(2)}s`}
        traditionalValue={`${(traditionalMetrics.totalProcessingTime / 1000).toFixed(2)}s`}
        difference={Number(timePercent)}
        unit="s"
      />
      
      <ComparisonCard
        title="Total Cost"
        fabricValue={`$${fabricMetrics.totalCost.toFixed(4)}`}
        traditionalValue={`$${traditionalMetrics.totalCost.toFixed(4)}`}
        difference={Number(costPercent)}
        unit="$"
      />
      
      <ComparisonCard
        title="Total Tokens"
        fabricValue={fabricMetrics.totalTokens.toLocaleString()}
        traditionalValue={traditionalMetrics.totalTokens.toLocaleString()}
        difference={Number(tokenPercent)}
        unit="tok"
      />
    </div>
  );
}

interface ComparisonCardProps {
  title: string;
  fabricValue: string;
  traditionalValue: string;
  difference: number;
  unit: string;
}

function ComparisonCard({
  title,
  fabricValue,
  traditionalValue,
  difference,
  _unit // eslint-disable-line @typescript-eslint/no-unused-vars
}: ComparisonCardProps) {
  const isLower = difference < 0;
  const isEqual = Math.abs(difference) < 1;
  
  const Icon = isEqual ? Minus : isLower ? TrendingDown : TrendingUp;
  const badgeColor = isEqual
    ? "bg-gray-500"
    : isLower
    ? "bg-green-500"
    : "bg-red-500";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs text-muted-foreground">NeuroFabric</p>
            <p className="text-2xl font-bold text-primary">{fabricValue}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Traditional</p>
            <p className="text-2xl font-bold">{traditionalValue}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={`gap-1 ${badgeColor}`}>
            <Icon className="h-3 w-3" />
            {Math.abs(difference).toFixed(1)}%
          </Badge>
          <p className="text-xs text-muted-foreground">
            {isLower ? "More efficient" : isEqual ? "Same" : "Less efficient"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
