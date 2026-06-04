import { NextResponse} from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
// generate a unique booking reference
function makeBookingRef() {
    return "DF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}
// Create a new booking
export async function POST(request: Request) {
  try {
    // get booking details from request body
    const body = await request.json();

    const { scheduleId, passengerName, passengerEmail } = body;
    // validate required fields
    if (!scheduleId || !passengerName || !passengerEmail) {
      return NextResponse.json(
        { success: false, message: "Missing booking details" },
        { status: 400 }
      );
    }
     // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("airline-booking");
    // find selected flight schedule
    const schedule = await db.collection("schedules").findOne({
      _id: new ObjectId(scheduleId),
    });
     // check if flight exists
    if (!schedule) {
      return NextResponse.json(
        { success: false, message: "Flight not found" },
        { status: 404 }
      );
    }
    // count confirmed bookings for this flight
    const activeBookings = await db.collection("bookings").countDocuments({
      scheduleId,
      status: "confirmed",
    });
     // prevent overbooking if flight is full 
    if (activeBookings >= schedule.capacity) {
      return NextResponse.json(
        { success: false, message: "This flight is full" },
        { status: 400 }
      );
    }
    //create booking object
    const booking = {
      bookingRef: makeBookingRef(),
      scheduleId,
      passengerName,
      passengerEmail,
      status: "confirmed",
      createdAt: new Date(),
      flightNo: schedule.flightNo,  // store flight details with booking
      origin: schedule.origin,
      destination: schedule.destination,
      departure: schedule.departure,
      arrival: schedule.arrival,
      price: schedule.price,
    };
      // save booking into database
    await db.collection("bookings").insertOne(booking);
    // return successful reponse 
    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    // handle unexpected server errors
    return NextResponse.json(
      {
        success: false,
        message: "Booking failed",
        error: String(error),
      },
      { status: 500 }
    );
  }
}