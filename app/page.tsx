import Link from "next/link";
// homepage of the Dairy flat air booking system
export default function Home() {
  const schedules = [
    {
      route: "NZNE → YSSY",
      days: "Friday",
      aircraft: "SyberJet SJ30i",
      seats: 6,
      price: 1200,
    },
    {
      route: "YSSY → NZNE",
      days: "Sunday",
      aircraft: "SyberJet SJ30i",
      seats: 6,
      price: 1200,
    },
    {
      route: "NZNE → NZRO",
      days: "Monday to Friday",
      aircraft: "Cirrus SF50",
      seats: 4,
      price: 280,
    },
    {
      route: "NZNE → NZGB",
      days: "Monday, Wednesday, Friday",
      aircraft: "Cirrus SF50",
      seats: 4,
      price: 220,
    },
    {
      route: "NZNE → NZCI",
      days: "Tuesday, Friday",
      aircraft: "HondaJet Elite",
      seats: 5,
      price: 650,
    },
    {
      route: "NZNE → NZTL",
      days: "Monday",
      aircraft: "HondaJet Elite",
      seats: 5,
      price: 500,
    },
  ];

  return (
    <main className="min-h-[calc(100vh-160px)] bg-gradient-to-b from-slate-100 to-slate-200">
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="relative overflow-hidden rounded-[32px] p-8 shadow-2xl">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/plane-bg.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-slate-950/35" />

          <div className="relative rounded-[28px] bg-slate-950/55 p-10 text-white backdrop-blur-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-200">
              Dairy Flat Airport Airline Booking
            </p>

            <h1 className="mb-4 max-w-3xl text-5xl font-bold leading-tight">
              Book private point-to-point flights from Dairy Flat Airport
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-slate-200">
              Search scheduled flights, book your seat, and manage trips using
              your booking reference.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/search"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700"
              >
                Search Flights
              </Link>

              <Link
                href="/bookings"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 shadow hover:bg-slate-100"
              >
                View Passenger Bookings
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-7 shadow-lg">
            <div className="mb-4 text-3xl">✈️</div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              Search Flights
            </h2>
            <p className="text-slate-600">
              Find flights by origin, destination, and date range.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-lg">
            <div className="mb-4 text-3xl">🎫</div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              Make A Trip
            </h2>
            <p className="text-slate-600">
              Select a scheduled flight and receive a booking reference.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-lg">
            <div className="mb-4 text-3xl">📋</div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              Manage Booking
            </h2>
            <p className="text-slate-600">
              Search or cancel bookings by booking reference and email.
            </p>
          </div>
        </div>

        <section className="mt-10 rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="mb-2 text-3xl font-bold text-slate-900">
            Weekly Flight Schedule
          </h2>

          <p className="mb-6 text-slate-600">
            These routes operate on selected days from Dairy Flat Airport and
            partner destinations.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b text-sm uppercase text-slate-500">
                  <th className="py-3">Route</th>
                  <th className="py-3">Flying Days</th>
                  <th className="py-3">Aircraft</th>
                  <th className="py-3">Seats</th>
                  <th className="py-3">Price</th>
                </tr>
              </thead>

              <tbody>
                {schedules.map((item) => (
                  <tr key={item.route} className="border-b last:border-none">
                    <td className="py-4 font-semibold text-slate-900">
                      {item.route}
                    </td>
                    <td className="py-4 text-slate-700">{item.days}</td>
                    <td className="py-4 text-slate-700">{item.aircraft}</td>
                    <td className="py-4 text-slate-700">
                      {item.seats} passengers
                    </td>
                    <td className="py-4 font-bold text-green-700">
                      ${item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}