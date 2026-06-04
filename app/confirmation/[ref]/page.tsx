import Link from "next/link";
import clientPromise from "../../../lib/mongodb";
// display booking confirmation and invoice details
export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;  // get booking reference from URL 
   // connect to MongoDB 
  const client = await clientPromise;
  const db = client.db("airline-booking");
   //retrieve booking information 
  const booking = await db.collection("bookings").findOne({
    bookingRef: ref,
  });
  // display message if booking cannot be found 
  if (!booking) {
    return <main className="p-8">Booking not found.</main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-4 text-3xl font-bold text-green-700"> {/* Confirmation heading */}
          Booking Confirmed
        </h1>
         {/* Confirmation message */}
        <p className="mb-6 text-slate-600">
          Your booking has been created successfully.
        </p>
          {/* Booking details */}
        <div className="space-y-3 rounded-xl border p-5 text-slate-800">
          <p>
            <strong>Booking Reference:</strong> {booking.bookingRef}
          </p>
          <p>
            <strong>Passenger:</strong> {booking.passengerName}
          </p>
          <p>
            <strong>Email:</strong> {booking.passengerEmail}
          </p>
          <p>
            <strong>Flight:</strong> {booking.flightNo}
          </p>
          <p>
            <strong>Route:</strong> {booking.origin} → {booking.destination}
          </p>
          <p>
            <strong>Departure:</strong>{" "}
            {new Date(booking.departure).toLocaleString()}
          </p>
          <p>
            <strong>Arrival:</strong>{" "}
            {new Date(booking.arrival).toLocaleString()}
          </p>
          <p className="text-xl font-bold">
            Total Price: ${booking.price}
          </p>
        </div>
          {/* Booking status */}  
        <div className="mt-6 flex gap-4">
          <Link
            href="/search"
            className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white"
          >
            Search More Flights
          </Link> 
           {/* Link to home page */}
          <Link
            href="/"
            className="rounded-xl border px-5 py-3 font-semibold text-slate-800"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}