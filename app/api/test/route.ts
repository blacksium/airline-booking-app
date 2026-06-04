import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("airline-booking");

    // Test the connection
    await db.command({ ping: 1 });

    return NextResponse.json({
      success: true,
      message: "Connected to MongoDB Atlas successfully!"
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: String(error)
    });
  }
}