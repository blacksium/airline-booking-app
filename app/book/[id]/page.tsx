// Name - Da Na Aung Shan
// ID - 25014362
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { redirect } from "next/navigation";
// display selected flight and create booking
export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // get flight ID from URL
  // connect to MongoDB database
  const client = await clientPromise;
  const db = client.db("airline-booking");
  // retrieve selected flight schedule
  const flight = await db.collection("schedules").findOne({
    _id: new ObjectId(id),
  });
  // display message if flight does not exist
  if (!flight) {
    return <main className="p-8">Flight not found.</main>;
  }
  // create booking when form is submitted
  async function createBooking(formData: FormData) {
    "use server";
    // get passenger details from form
    const passengerName = formData.get("passengerName")?.toString();
    const passengerEmail = formData.get("passengerEmail")?.toString();
    // connect to database
    const client = await clientPromise;
    const db = client.db("airline-booking");
     // retrieve flight schedule again for validation
    const schedule = await db.collection("schedules").findOne({
      _id: new ObjectId(id),
    });
     // ensure flight still exists
    if (!schedule) {
      throw new Error("Flight not found");
    }
     // count confirmed bookings for this flight
    const activeBookings = await db.collection("bookings").countDocuments({
      scheduleId: id,
      status: "confirmed",
    });
     // prevent booking if flight is already full
    if (activeBookings >= schedule.capacity) {
      throw new Error("This flight is full");
    }
      // generate booking reference number
    const bookingRef =
      "DF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      // save booking information into database
    await db.collection("bookings").insertOne({
      bookingRef,
      scheduleId: id,
      passengerName,
      passengerEmail,
      status: "confirmed",
      createdAt: new Date(),
      flightNo: schedule.flightNo,  // store flight information with booking
      origin: schedule.origin,
      destination: schedule.destination,
      departure: schedule.departure,
      arrival: schedule.arrival,
      price: schedule.price,
    });
     // redirect usr to confirmation page
    redirect(`/confirmation/${bookingRef}`);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-4 text-3xl font-bold text-slate-900">
          Book Flight {flight.flightNo}
        </h1>
          {/*display flight details*/}
        <div className="mb-6 text-slate-700">
          <p>
            <strong>Route:</strong> {flight.origin} → {flight.destination}
          </p>
          <p>
            <strong>Departure:</strong>{" "}
            {new Date(flight.departure).toLocaleString()}
          </p>
          <p>
            <strong>Arrival:</strong>{" "}
            {new Date(flight.arrival).toLocaleString()}
          </p>
          <p>
            <strong>Price:</strong> ${flight.price}
          </p>
        </div>
          {/*booking form*/}
        <form action={createBooking} className="space-y-4">
          <div>
            <label className="mb-1 block font-semibold text-slate-800">
              Passenger Name
            </label>
            <input
              name="passengerName"
              required
              className="w-full rounded-lg border p-3 text-slate-900"
              placeholder="Enter passenger name"
            />
          </div>
           {/*passenger email input*/}
          <div>
            <label className="mb-1 block font-semibold text-slate-800">
              Passenger Email
            </label>
            <input
              name="passengerEmail"
              type="email"
              required
              className="w-full rounded-lg border p-3 text-slate-900"
              placeholder="Enter passenger email"
            />
          </div>
           {/*submit booking*/}
          <button className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">
            Confirm Booking
          </button>
        </form>
      </div>
    </main>
  );
}