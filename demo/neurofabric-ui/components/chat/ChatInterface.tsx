"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Send, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { EXAMPLE_TASKS } from "@/lib/constants";

interface ChatInterfaceProps {
  onSubmit: (task: string) => void;
  isProcessing?: boolean;
}

export default function ChatInterface({ onSubmit, isProcessing = false }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["Data Analysis"]));

  const handleSubmit = () => {
    if (input.trim() && !isProcessing) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  const handleExampleClick = (prompt: string) => {
    if (!isProcessing) {
      setInput(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Group tasks by category
  const tasksByCategory = EXAMPLE_TASKS.reduce((acc, task) => {
    const category = task.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(task);
    return acc;
  }, {} as Record<string, typeof EXAMPLE_TASKS>);

  return (
    <div className="space-y-4">
      {/* Example Tasks */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Example Tasks</h3>
        </div>
        
        <div className="space-y-2">
          {Object.entries(tasksByCategory).map(([category, tasks]) => (
            <Collapsible
              key={category}
              open={expandedCategories.has(category)}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto hover:bg-muted"
                >
                  <span className="text-sm font-medium">{category}</span>
                  {expandedCategories.has(category) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  {tasks.map((task) => (
                    <Card
                      key={task.id}
                      className="cursor-pointer border-2 p-3 transition-all hover:border-primary hover:shadow-md"
                      onClick={() => handleExampleClick(task.prompt)}
                    >
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <Card className="p-4">
        <div className="space-y-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your task here... (Cmd/Ctrl + Enter to submit)"
            className="min-h-[120px] resize-none"
            disabled={isProcessing}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {input.length} characters
            </p>
            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Run Task
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
