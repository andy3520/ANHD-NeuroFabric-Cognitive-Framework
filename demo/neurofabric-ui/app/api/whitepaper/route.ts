import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    // Read WHITEPAPER.md from root directory (3 levels up from demo/neurofabric-ui)
    const whitepaperPath = join(process.cwd(), "..", "..", "WHITEPAPER.md");
    const content = await readFile(whitepaperPath, "utf-8");
    
    return new Response(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error reading whitepaper:", error);
    return new Response("Failed to load whitepaper", { status: 500 });
  }
}
