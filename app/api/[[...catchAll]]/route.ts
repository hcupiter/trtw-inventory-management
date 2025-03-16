import { NextResponse } from "next/server";

// ✅ Function to handle unknown API routes
function handleUnknownRoute(req: Request) {
  return NextResponse.json(
    { error: `API route '${req.url}' not found.` },
    { status: 404 }
  );
}

export async function GET(req: Request) {
  return handleUnknownRoute(req);
}

export async function POST(req: Request) {
  return handleUnknownRoute(req);
}

export async function PUT(req: Request) {
  return handleUnknownRoute(req);
}

export async function DELETE(req: Request) {
  return handleUnknownRoute(req);
}

export async function PATCH(req: Request) {
  return handleUnknownRoute(req);
}
