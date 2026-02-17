import { NextResponse } from "next/server";
import { spawn } from "child_process";

const BUILD_SECRET = "rajan";

export async function POST(request) {
  const secret = request.headers.get("x-build-secret");
  if (secret !== BUILD_SECRET) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  // Create a ReadableStream to stream logs
  const stream = new ReadableStream({
    start(controller) {
      // Use spawn for real-time streaming
      // Cross-platform way to set NODE_ENV
      const buildProcess = spawn(
        "npm",
        ["run", "build"], // make sure package.json script has cross-env NODE_ENV=production
        {
          shell: true,
          env: { ...process.env, NODE_ENV: "production" }, // ensure NODE_ENV
        }
      );

      buildProcess.stdout.on("data", (data) => {
        controller.enqueue(data.toString());
      });

      buildProcess.stderr.on("data", (data) => {
        controller.enqueue(data.toString());
      });

      buildProcess.on("close", (code) => {
        controller.enqueue(`\nBuild process exited with code ${code}`);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
