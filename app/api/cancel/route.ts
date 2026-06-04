import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingRef } = body;

    if (!bookingRef) {
      return NextResponse.json(
        { success: false, message: "Booking reference is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("airline-booking");

    const result = await db.collection("bookings").updateOne(
      { bookingRef },
      { $set: { status: "cancelled", cancelledAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Cancel failed", error: String(error) },
      { status: 500 }
    );
  }
}