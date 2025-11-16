"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Message } from "@/lib/types";
import { AGENT_COLORS, AGENT_LABELS } from "@/lib/constants";
import { Bot, User, Info } from "lucide-react";

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <Card className="flex h-[400px] items-center justify-center p-8">
        <div className="text-center space-y-2">
          <Info className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No messages yet. Select an example task or enter your own to start.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[400px]">
      <ScrollArea className="h-full p-4">
        <div className="space-y-3">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function MessageItem({ message }: { message: Message }) {
  const isUser = message.from === "user";
  const agentColor = isUser
    ? "#6366f1"
    : AGENT_COLORS[message.from as keyof typeof AGENT_COLORS] || "#6366f1";

  const agentLabel = isUser
    ? "You"
    : AGENT_LABELS[message.from as keyof typeof AGENT_LABELS] || message.from;

  const Icon = isUser ? User : Bot;

  return (
    <div className="flex gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${agentColor}20` }}
      >
        <Icon className="h-4 w-4" style={{ color: agentColor }} />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{agentLabel}</span>
          <Badge
            variant="outline"
            className="h-5 text-xs"
            style={{ borderColor: agentColor, color: agentColor }}
          >
            {message.type}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
}
