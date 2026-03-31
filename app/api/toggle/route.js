import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const { mode } = await request.json(); // "B2B" or "B2C"

    if (mode !== "B2B" && mode !== "B2C") {
      return NextResponse.json({ error: "Invalid mode. Use B2B or B2C." }, { status: 400 });
    }

    const configPath = path.join(process.cwd(), "public", "config.json");
    console.log("Reading config at:", configPath);
    let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    if (mode === "B2B") {
      config.IS_B2B = true;
      config.IS_B2C = false;
    } else {
      config.IS_B2B = false;
      config.IS_B2C = true;
    }

    console.log("Writing updated config...");
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    console.log("Configuration updated successfully.");

    return NextResponse.json({
      success: true,
      mode,
      details: config
    });
  } catch (error) {
    console.error("Toggle error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Support simple GET for quick testing
export async function GET() {
  const configPath = path.join(process.cwd(), "public", "config.json");
  console.log("GET Toggle: Reading config...");
  let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  const newIsB2B = !config.IS_B2B;
  config.IS_B2B = newIsB2B;
  config.IS_B2C = !newIsB2B;

  const newMode = newIsB2B ? "B2B" : "B2C";
  console.log(`GET Toggle: Flipping mode to ${newMode}`);

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

  return NextResponse.json({
    success: true,
    newMode,
    details: config
  });
}
