"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import mermaid from "mermaid";

export default function WhitepaperPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Initialize mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
    });
  }, []);

  useEffect(() => {
    fetch("/api/whitepaper")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load whitepaper");
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (content) {
      // Render mermaid diagrams after content is loaded
      setTimeout(() => {
        mermaid.contentLoaded();
      }, 100);
    }
  }, [content]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Demo
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {content && (
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold mb-8 mt-0">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-3xl font-bold mt-12 mb-6">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-bold mt-8 mb-4">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-xl font-bold mt-6 mb-3">{children}</h4>
              ),
              p: ({ children, node }) => {
                // Check if paragraph contains only a code block
                const hasCodeBlock = node?.children?.some(
                  (child: any) =>
                    child.type === "element" && child.tagName === "code"
                );
                if (hasCodeBlock) {
                  return <>{children}</>;
                }
                return <p className="text-base leading-relaxed mb-4">{children}</p>;
              },
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              hr: () => (
                <hr className="my-8 border-slate-300 dark:border-slate-700" />
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 italic pl-4 my-6">
                  {children}
                </blockquote>
              ),
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const lang = match ? match[1] : "";

                if (!inline && lang === "mermaid") {
                  return (
                    <div className="mermaid my-8 flex justify-center">
                      {String(children).replace(/\n$/, "")}
                    </div>
                  );
                }

                if (!inline) {
                  return (
                    <pre className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-4 rounded-lg overflow-x-auto my-4">
                      <code className="text-slate-900 dark:text-slate-100" {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                }

                return (
                  <code
                    className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              table: ({ children }) => (
                <div className="my-6 overflow-x-auto">
                  <table className="w-full border-collapse">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2 text-left font-bold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">
                  {children}
                </td>
              ),
              ul: ({ children }) => <ul className="my-4 ml-6">{children}</ul>,
              ol: ({ children }) => <ol className="my-4 ml-6">{children}</ol>,
              li: ({ children }) => <li className="my-2">{children}</li>,
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      )}
    </div>
  );
}
