import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { errorWriter } from "@/utils/errorWriter";

// Helper to convert Node.js stream to a global web ReadableStream
function nodeStreamToWebStream(
  nodeStream: fs.ReadStream
): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      nodeStream.on("data", (chunk: string | Buffer) => {
        // Check if chunk is a string, if so, convert it to a Buffer
        if (typeof chunk === "string") {
          controller.enqueue(Buffer.from(chunk));
        } else {
          controller.enqueue(chunk);
        }
      });
      nodeStream.on("end", () => {
        controller.close();
      });
      nodeStream.on("error", (err: Error) => {
        controller.error(err);
      });
    },
  });
}

export async function GET() {
  try {
    const cookie = await cookies();
    const sessionToken = cookie.get("session")?.value;

    if (!sessionToken)
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 500 }
      );

    // Define the path to your SQLite database (adjust if needed)
    const dbPath = path.join(process.cwd(), "database.sqlite");

    // Check if the database file exists
    if (!fs.existsSync(dbPath))
      return NextResponse.json(
        { error: "Database not found" },
        { status: 404 }
      );

    // Create a Node.js ReadStream
    const nodeStream = fs.createReadStream(dbPath);

    // Convert the Node.js stream to a global web ReadableStream
    const webStream = nodeStreamToWebStream(nodeStream);

    // Return the stream as a response with appropriate headers
    return new NextResponse(webStream, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": 'attachment; filename="database.sqlite"',
      },
    });
  } catch (error) {
    console.error("Error in download API:", error);
    return NextResponse.json({ error: errorWriter(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Validate session or other authentication tokens
    const cookie = await cookies();
    const sessionToken = cookie.get("session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 500 }
      );
    }

    // Read the incoming request body as an ArrayBuffer,
    // then convert it into a Node.js Buffer.
    const buffer = Buffer.from(await req.arrayBuffer());

    // Define the path to your SQLite database file
    const dbPath = path.join(process.cwd(), "database.sqlite");

    // Write the new database file to disk.
    // This will overwrite the existing file.
    fs.writeFileSync(dbPath, buffer);

    return NextResponse.json(
      { message: "Database set successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error at api/backup", error);
    return NextResponse.json({ error: errorWriter(error) }, { status: 500 });
  }
}
