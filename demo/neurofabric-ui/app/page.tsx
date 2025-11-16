"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Sparkles } from "lucide-react";

export default function Home() {
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
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Hero Section */}
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Multi-Agent AI Framework</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight">
              Visualize AI Intelligence
            </h2>
            <p className="text-lg text-muted-foreground">
              Watch specialized AI agents collaborate in real-time. Compare
              multi-agent efficiency vs traditional AI.
            </p>
          </div>

          {/* Mode Selection */}
          <Tabs defaultValue="comparison" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fabric">NeuroFabric Only</TabsTrigger>
              <TabsTrigger value="comparison">Side-by-Side</TabsTrigger>
              <TabsTrigger value="traditional">Traditional Only</TabsTrigger>
            </TabsList>

            <TabsContent value="fabric" className="space-y-4">
              <Card className="p-6">
                <p className="text-center text-muted-foreground">
                  NeuroFabric mode - Multi-agent collaboration
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-4">
              <Card className="p-6">
                <p className="text-center text-muted-foreground">
                  Comparison mode - See both approaches side-by-side
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="traditional" className="space-y-4">
              <Card className="p-6">
                <p className="text-center text-muted-foreground">
                  Traditional mode - Single AI model
                </p>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Coming Soon Notice */}
          <Card className="border-primary/50 bg-primary/5 p-8">
            <div className="space-y-4 text-center">
              <Brain className="mx-auto h-12 w-12 text-primary" />
              <h3 className="text-2xl font-bold">UI Under Construction</h3>
              <p className="text-muted-foreground">
                The complete dashboard with 3D agent visualization, real-time
                metrics, and interactive comparison is being built.
              </p>
              <div className="flex justify-center gap-4">
                <Button>View Roadmap</Button>
                <Button variant="outline">Python Demo</Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
