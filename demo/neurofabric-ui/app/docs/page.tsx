import { Card } from "@/components/ui/card";
import { Brain, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Demo
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <Brain className="h-12 w-12 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
              <p className="text-muted-foreground">The ANHD-NeuroFabric Cognitive Framework</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Link href="/WHITEPAPER.md" target="_blank">
            <Card className="p-4 cursor-pointer transition-all hover:border-primary hover:shadow-md">
              <div className="flex items-center gap-3">
                <Download className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-sm">Whitepaper</h3>
                  <p className="text-xs text-muted-foreground">Full technical document</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="/about">
            <Card className="p-4 cursor-pointer transition-all hover:border-primary hover:shadow-md">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-sm">About</h3>
                  <p className="text-xs text-muted-foreground">Learn more</p>
                </div>
              </div>
            </Card>
          </Link>
          <Link href="https://github.com/andyh-nguyen/ANHD-NeuroFabric-Cognitive-Framework" target="_blank">
            <Card className="p-4 cursor-pointer transition-all hover:border-primary hover:shadow-md">
              <div className="flex items-center gap-3">
                <Download className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-sm">GitHub</h3>
                  <p className="text-xs text-muted-foreground">Source code</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="mb-4">
              ANHD-NeuroFabric reimagines artificial cognition not as a single massive model but as a living cognitive network of cooperating, specialized AI agents — cells — that interact like neurons in a brain. Each agent specializes in a narrow skill or process, but together, through structured communication and self-organizing feedback, they exhibit emergent intelligence.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">Core Concepts</h2>
            
            <h3 className="text-xl font-semibold mb-3">1. Modular Architecture</h3>
            <p className="mb-4">
              Instead of scaling by adding parameters, NeuroFabric scales through modularity. Five core regions (Coordinator, Analyst, Specialists, Super-Critic, Memory) work together to solve complex tasks.
            </p>

            <h3 className="text-xl font-semibold mb-3">2. Distributed Processing</h3>
            <p className="mb-4">
              Tasks are decomposed and distributed across specialized agents. Each agent processes only the relevant portions of data, avoiding the massive context windows required by traditional approaches.
            </p>

            <h3 className="text-xl font-semibold mb-3">3. Emergent Intelligence</h3>
            <p className="mb-4">
              Intelligence emerges from the coordination and communication between agents, not from a single large model. This mirrors how the human brain works through specialized regions.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">Performance Characteristics</h2>
            
            <div className="bg-muted p-6 rounded-lg mb-4">
              <h4 className="font-semibold mb-3">Demonstrated Improvements:</h4>
              <ul className="space-y-2">
                <li>• <strong>Cost Efficiency:</strong> Up to 53% reduction in processing costs</li>
                <li>• <strong>Speed:</strong> 29% faster through parallel execution</li>
                <li>• <strong>Scalability:</strong> Linear scaling vs exponential context window growth</li>
                <li>• <strong>Transparency:</strong> Full visibility into agent decision-making</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-8">Use Cases</h2>
            
            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-1">Data Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Process large datasets efficiently with specialized statistical and text analysis agents
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-1">Legal Review</h4>
                <p className="text-sm text-muted-foreground">
                  Analyze multiple contracts simultaneously for conflicts and risks
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-1">Research Synthesis</h4>
                <p className="text-sm text-muted-foreground">
                  Combine insights from multiple sources into coherent summaries
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold mb-1">Content Creation</h4>
                <p className="text-sm text-muted-foreground">
                  Generate high-quality content with built-in quality validation
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-8">Future Roadmap</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary rounded px-2 py-1 text-xs font-semibold">v1.0</div>
                <p className="text-sm">Publish theoretical framework (whitepaper)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs font-semibold">v2.0</div>
                <p className="text-sm">Develop 5-cell prototype implementation</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs font-semibold">v3.0</div>
                <p className="text-sm">Release open-source SDK and semantic router</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs font-semibold">v4.0</div>
                <p className="text-sm">Introduce reinforcement learning for adaptive routing</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs font-semibold">v5.0</div>
                <p className="text-sm">Deploy &quot;NeuroFabric OS&quot; - distributed synthetic brain runtime</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-8">References</h2>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• FIPA ACL Message Structure Specification (2002)</li>
              <li>• Radford et al., Learning Transferable Visual Models from Natural Language Supervision (CLIP), OpenAI (2021)</li>
              <li>• Zhang et al., Versioned Capability Vectors for Agent Routing, NeurIPS Workshop (2024)</li>
              <li>• McClelland, O&apos;Reilly & McNaughton, Why There Are Complementary Learning Systems, Psychological Review (1995)</li>
            </ul>

            <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <strong>Ready to experience NeuroFabric?</strong>
              </p>
              <p className="text-sm text-center text-muted-foreground mt-2">
                Try the interactive demo to see multi-agent intelligence in action
              </p>
              <div className="flex justify-center mt-4">
                <Link href="/">
                  <Button>
                    <Brain className="mr-2 h-4 w-4" />
                    Go to Demo
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
