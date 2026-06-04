import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import CancelBookingButton from "@/components/CancelBookingButton";
// display passenger bookings and allow booking cancellation
export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; email?: string }>;
}) {
  const params = await searchParams; // get booking reference and email from URL
  const ref = params.ref || "";
  const email = params.email || "";
  // connect to MongoDB database
  const client = await clientPromise;
  const db = client.db("airline-booking");
   // cancel an existing booking
  async function cancelBooking(formData: FormData) {
    "use server";
    // retrieve booking reference
    const bookingRef = formData.get("bookingRef")?.toString();

    const client = await clientPromise;
    const db = client.db("airline-booking");
     // update booking status to cancelled 
    await db.collection("bookings").updateOne(
      { bookingRef },
      { $set: { status: "cancelled", cancelledAt: new Date() } }
    );
    // refresh bookings page
    revalidatePath("/bookings");
  }
  // search bookings using booking reference and email
  const bookings =
    ref && email
      ? await db
          .collection("bookings")
          .find({
            bookingRef: ref.toUpperCase(),
            passengerEmail: email,
          })
          .sort({ createdAt: -1 })
          .toArray()
      : [];
  // separate active and cancelled bookings
  const currentBookings = bookings.filter(
    (booking: any) => booking.status === "confirmed"
  );

  const previousBookings = bookings.filter(
    (booking: any) => booking.status === "cancelled"
  );
   // reusable booking card component
  function BookingCard({ booking }: { booking: any }) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-700">
            {booking.flightNo}
          </h2>
           
          <span
            className={
              booking.status === "confirmed"
                ? "rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700"
                : "rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700"
            }
          >
            {booking.status}
          </span>
        </div>
          {/*display booking details*/}
        <p className="mb-2 text-slate-700">
          <strong>Booking Reference:</strong> {booking.bookingRef}
        </p>

        <p className="mb-2 text-slate-700">
          <strong>Passenger:</strong> {booking.passengerName}
        </p>

        <p className="mb-2 text-slate-700">
          <strong>Email:</strong> {booking.passengerEmail}
        </p>

        <p className="mb-2 text-slate-700">
          <strong>Route:</strong> {booking.origin} → {booking.destination}
        </p>
         
        <p className="mb-2 text-slate-700">
          <strong>Departure:</strong>{" "}
          {new Date(booking.departure).toLocaleString()}
        </p>

        <p className="mb-2 text-slate-700">
          <strong>Arrival:</strong>{" "}
          {new Date(booking.arrival).toLocaleString()}
        </p>

        <p className="text-lg font-bold text-slate-900">
          Price: ${booking.price}
        </p>

        {booking.status !== "cancelled" && (
          <form action={cancelBooking} className="mt-4">
            <input type="hidden" name="bookingRef" value={booking.bookingRef} />
            <CancelBookingButton />
          </form>
        )}
      </div>
    );
  }
   // if no search parameters, show empty page
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-4xl font-bold text-slate-900">
          Passenger Bookings
        </h1>

        <p className="mb-8 text-slate-600">
          Enter your booking reference and email to view or cancel your booking.
        </p>
          {/*booking search form*/}
        <form className="mb-8 grid gap-4 rounded-2xl bg-white p-6 shadow md:grid-cols-3">
          <input
            name="ref"
            required
            defaultValue={ref}
            placeholder="Booking reference, e.g. DF-NMUEKB"
            className="rounded-lg border p-3 text-slate-900"
          />

          <input
            name="email"
            type="email"
            required
            defaultValue={email}
            placeholder="Passenger email"
            className="rounded-lg border p-3 text-slate-900"
          />
            {/*submit search*/}
          <button className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">
            Search Booking
          </button>
        </form>

        {ref && email && bookings.length === 0 && (
          <div className="rounded-2xl bg-white p-6 text-slate-700 shadow">
            No booking found. Please check your booking reference and email.
          </div>
        )}
           
        {currentBookings.length > 0 && (
          <>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Current Bookings
            </h2>

            <div className="mb-8 grid gap-6">
              {currentBookings.map((booking: any) => (
                <BookingCard key={booking._id.toString()} booking={booking} />
              ))}
            </div>
          </>
        )}
         
        {previousBookings.length > 0 && (
          <>
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Previous / Cancelled Bookings
            </h2>
              {/*display cancelled bookings*/}
            <div className="grid gap-6">
              {previousBookings.map((booking: any) => (
                <BookingCard key={booking._id.toString()} booking={booking} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}