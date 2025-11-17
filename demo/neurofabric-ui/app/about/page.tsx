import { Card } from "@/components/ui/card";
import { Brain, Github, Mail, FileText } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <Brain className="h-16 w-16 text-primary" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">About NeuroFabric</h1>
          <p className="text-lg text-muted-foreground">
            A Modular Synthetic Brain Architecture for Efficient AI
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Vision */}
          <Card className="p-8">
            <h2 className="mb-4 text-2xl font-bold">Our Vision</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              ANHD-NeuroFabric reimagines artificial cognition not as a single massive model but as a <strong>living cognitive network</strong> of cooperating, specialized AI agents that interact like neurons in a brain.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Modern AI scales primarily by adding parameters and extending context windows. NeuroFabric proposes a more <strong>organic and efficient approach</strong>: scaling through modularity, cooperation, and adaptive orchestration.
            </p>
          </Card>

          {/* Architecture */}
          <Card className="p-8">
            <h2 className="mb-4 text-2xl font-bold">The Architecture</h2>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              NeuroFabric organizes cognition into five core regions, mirroring the modular architecture of the human brain:
            </p>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold">Coordinator</h3>
                <p className="text-sm text-muted-foreground">
                  Global controller that decomposes goals, delegates subtasks, and monitors progress
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">Analyst</h3>
                <p className="text-sm text-muted-foreground">
                  Interprets context, synthesizes findings, and manages feedback
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">Specialists</h3>
                <p className="text-sm text-muted-foreground">
                  Perform concrete subtasks (reasoning, coding, retrieval, perception)
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold">Super-Critic</h3>
                <p className="text-sm text-muted-foreground">
                  Evaluates and filters outputs, detects inefficiencies, enforces quality
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold">Memory & Consolidation</h3>
                <p className="text-sm text-muted-foreground">
                  Stores experiences, reinforces successful pathways, prunes failing ones
                </p>
              </div>
            </div>
          </Card>

          {/* Key Advantages */}
          <Card className="p-8">
            <h2 className="mb-4 text-2xl font-bold">Key Advantages</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold text-green-600">✓ Cost Efficiency</h3>
                <p className="text-sm text-muted-foreground">
                  Up to 53% cost reduction through distributed processing and adaptive scaling
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-green-600">✓ Faster Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Parallel agent execution reduces total processing time significantly
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-green-600">✓ Token Efficiency</h3>
                <p className="text-sm text-muted-foreground">
                  Linear scaling vs exponential growth of traditional context windows
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-green-600">✓ Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  Fully inspectable agent communication and decision-making process
                </p>
              </div>
            </div>
          </Card>

          {/* Author */}
          <Card className="p-8">
            <h2 className="mb-4 text-2xl font-bold">Author</h2>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              <strong>Nguyen Hieu Duc An (Andy H. Nguyen)</strong>
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              Independent AI systems researcher exploring modular synthetic cognition and emergent intelligence frameworks.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="mailto:nguyenhieuducan@gmail.com"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                nguyenhieuducan@gmail.com
              </Link>
              <Link
                href="https://github.com/andyh-nguyen/ANHD-NeuroFabric-Cognitive-Framework"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
                target="_blank"
              >
                <Github className="h-4 w-4" />
                GitHub Repository
              </Link>
            </div>
          </Card>

          {/* License */}
          <Card className="p-8">
            <h2 className="mb-4 text-2xl font-bold">License</h2>
            <p className="text-sm text-muted-foreground">
              Creative Commons Attribution – NonCommercial 4.0 International (CC BY-NC 4.0)
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              You may share and adapt this work with attribution for non-commercial use.
            </p>
          </Card>

          {/* Links */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/docs">
              <Card className="cursor-pointer p-6 transition-all hover:border-primary hover:shadow-md">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Documentation</h3>
                    <p className="text-xs text-muted-foreground">Read the full whitepaper</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/">
              <Card className="cursor-pointer p-6 transition-all hover:border-primary hover:shadow-md">
                <div className="flex items-center gap-3">
                  <Brain className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Try the Demo</h3>
                    <p className="text-xs text-muted-foreground">Experience NeuroFabric</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
