import { NextResponse } from "next/server";
import { z } from "zod";

export const checkAPISchemaError = (error: any) => {
  // Handle validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Invalid input data", details: error.errors },
      { status: 400 }
    );
  }
};

export const checkClientSchemaError = (error: any) => {
  if (error instanceof z.ZodError) {
    console.log("Invalid data", error.errors);
  }
};
