import clientPromise from "@/lib/mongodb";

export default async function CancelPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; cancelled?: string }>;
}) {
  const params = await searchParams;
  const ref = params.ref || "";

  let booking: any = null;

  if (ref) {
    const client = await clientPromise;
    const db = client.db("airline-booking");

    booking = await db.collection("bookings").findOne({
      bookingRef: ref,
    });
  }

  async function cancelBooking(formData: FormData) {
    "use server";

    const bookingRef = formData.get("bookingRef")?.toString();

    const client = await clientPromise;
    const db = client.db("airline-booking");

    await db.collection("bookings").updateOne(
      { bookingRef },
      { $set: { status: "cancelled", cancelledAt: new Date() } }
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-4xl font-bold text-slate-900">
          Cancel Booking
        </h1>

        <p className="mb-8 text-slate-600">
          Enter your booking reference to find and cancel a booking.
        </p>

        <form className="mb-8 flex gap-4 rounded-2xl bg-white p-6 shadow">
          <input
            name="ref"
            defaultValue={ref}
            placeholder="Example: DF-NMUEKB"
            className="flex-1 rounded-lg border p-3 text-slate-900"
          />

          <button className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white">
            Find Booking
          </button>
        </form>

        {ref && !booking && (
          <div className="rounded-2xl bg-white p-6 shadow text-slate-700">
            Booking not found.
          </div>
        )}

        {booking && (
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold text-blue-700">
              {booking.flightNo}
            </h2>

            <p className="mb-2">
              <strong>Booking Reference:</strong> {booking.bookingRef}
            </p>
            <p className="mb-2">
              <strong>Passenger:</strong> {booking.passengerName}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {booking.passengerEmail}
            </p>
            <p className="mb-2">
              <strong>Route:</strong> {booking.origin} → {booking.destination}
            </p>
            <p className="mb-2">
              <strong>Status:</strong> {booking.status}
            </p>

            {booking.status !== "cancelled" && (
              <form action={cancelBooking} className="mt-6">
                <input type="hidden" name="bookingRef" value={booking.bookingRef} />
                <button className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white">
                  Cancel This Booking
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}