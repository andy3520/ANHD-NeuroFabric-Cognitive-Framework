"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, Search, X } from "lucide-react";
import { EXAMPLE_TASKS, CATEGORY_COLORS } from "@/lib/constants";

interface ChatInterfaceProps {
  onSubmit: (task: string) => void;
  isProcessing?: boolean;
}

export default function ChatInterface({ onSubmit, isProcessing = false }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

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

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    EXAMPLE_TASKS.forEach(task => {
      if (task.category) tags.add(task.category);
    });
    return Array.from(tags).sort();
  }, []);

  // Filter tasks based on search and selected tags
  const filteredTasks = useMemo(() => {
    return EXAMPLE_TASKS.filter(task => {
      // Filter by selected tags
      if (selectedTags.size > 0 && !selectedTags.has(task.category)) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.category.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [searchQuery, selectedTags]);

  return (
    <div className="space-y-4">
      {/* Example Tasks */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Example Tasks</h3>
          <span className="text-xs text-muted-foreground">
            ({filteredTasks.length} of {EXAMPLE_TASKS.length})
          </span>
        </div>

        {/* Search and Filter */}
        <div className="space-y-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.has(tag) ? "default" : "outline"}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedTags.has(tag) 
                    ? "" 
                    : CATEGORY_COLORS[tag as keyof typeof CATEGORY_COLORS] || ""
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
                {selectedTags.has(tag) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="grid gap-2 sm:grid-cols-2">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Card
                key={task.id}
                className="cursor-pointer border-2 p-3 transition-all hover:border-primary hover:shadow-md"
                onClick={() => handleExampleClick(task.prompt)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm flex-1">{task.title}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs shrink-0 ${
                        CATEGORY_COLORS[task.category as keyof typeof CATEGORY_COLORS] || ""
                      }`}
                    >
                      {task.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{task.description}</p>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-muted-foreground text-sm">
              No tasks found. Try adjusting your search or filters.
            </div>
          )}
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
