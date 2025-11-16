"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Message } from "@/lib/types";
import { AGENT_COLORS, AGENT_LABELS } from "@/lib/constants";
import { Bot, User, Info, ArrowRight, ChevronRight, ChevronDown } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  height?: number;
}

export default function MessageList({ messages, height = 400 }: MessageListProps) {
  const [viewMode, setViewMode] = useState<"flat" | "tree">("tree");

  if (messages.length === 0) {
    return (
      <Card className="flex items-center justify-center p-8" style={{ height: `${height}px` }}>
        <div className="text-center space-y-2">
          <Info className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No messages yet. Select an example task or enter your own to start.
          </p>
        </div>
      </Card>
    );
  }

  // Build message tree
  const rootMessages = messages.filter(m => !m.parentMessageId);
  const messageMap = new Map(messages.map(m => [m.id, m]));
  
  const getChildren = (messageId: string): Message[] => {
    return messages.filter(m => m.parentMessageId === messageId);
  };

  return (
    <Card style={{ height: `${height}px` }}>
      <div className="flex items-center justify-between border-b p-3">
        <h4 className="text-sm font-medium">Communication Log</h4>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "flat" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("flat")}
          >
            Flat View
          </Button>
          <Button
            variant={viewMode === "tree" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("tree")}
          >
            Tree View
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-4">
          <div className="space-y-3">
            {viewMode === "flat" ? (
              messages.map((message) => (
                <MessageItem key={message.id} message={message} level={0} />
              ))
            ) : (
              rootMessages.map((message) => (
                <MessageThread
                  key={message.id}
                  message={message}
                  getChildren={getChildren}
                  level={0}
                />
              ))
            )}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
}

function MessageThread({
  message,
  getChildren,
  level,
}: {
  message: Message;
  getChildren: (id: string) => Message[];
  level: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const children = getChildren(message.id);
  const hasChildren = children.length > 0;

  return (
    <div>
      <div className="flex items-start gap-2">
        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 shrink-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
        {!hasChildren && <div className="w-6 shrink-0" />}
        <MessageItem message={message} level={level} />
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-8 mt-2 space-y-2 border-l-2 border-muted pl-4">
          {children.map((child) => (
            <MessageThread
              key={child.id}
              message={child}
              getChildren={getChildren}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MessageItem({ message, level }: { message: Message; level: number }) {
  const isUser = message.from === "user";
  const agentColor = isUser
    ? "#6366f1"
    : AGENT_COLORS[message.from as keyof typeof AGENT_COLORS] || "#6366f1";

  const agentLabel = isUser
    ? "You"
    : AGENT_LABELS[message.from as keyof typeof AGENT_LABELS] || message.from;

  const toAgentLabel = message.to === "user"
    ? "You"
    : message.to === "system"
    ? "System"
    : AGENT_LABELS[message.to as keyof typeof AGENT_LABELS] || message.to;

  const toAgentColor = message.to === "user" || message.to === "system"
    ? "#6366f1"
    : AGENT_COLORS[message.to as keyof typeof AGENT_COLORS] || "#6366f1";

  const Icon = isUser ? User : Bot;

  const fromId = message.fromInstanceId || `${message.from}-1`;
  const toId = message.toInstanceId || `${message.to}-1`;

  return (
    <div className="flex-1">
      <div className="flex gap-3 items-start">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${agentColor}20` }}
        >
          <Icon className="h-4 w-4" style={{ color: agentColor }} />
        </div>
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">{agentLabel}</span>
              <Badge
                variant="secondary"
                className="h-5 text-xs font-mono shrink-0"
              >
                {fromId}
              </Badge>
            </div>
            
            <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">{toAgentLabel}</span>
              <Badge
                variant="secondary"
                className="h-5 text-xs font-mono shrink-0"
              >
                {toId}
              </Badge>
            </div>

            <Badge
              variant="outline"
              className="h-5 text-xs shrink-0"
              style={{ borderColor: agentColor, color: agentColor }}
            >
              {message.type}
            </Badge>
            
            <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-normal">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
