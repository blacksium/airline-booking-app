import Link from "next/link";
import clientPromise from "@/lib/mongodb";
// display and search avaiable flight schedules
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    orig?: string;
    dest?: string;
    date1?: string;
    date2?: string;
  }>;
}) {
  const params = await searchParams; // get search filters from URL
  // connect to MongoDB database
  const client = await clientPromise;
  const db = client.db("airline-booking");
  // build search query 
  const query: any = {};
  // filter by destination airport 
  if (params.orig) query.origin = params.orig; // filter by departure airport
  if (params.dest) query.destination = params.dest; // filter by depature date range

  if (params.date1 || params.date2) {
    query.departure = {};
    if (params.date1) query.departure.$gte = new Date(params.date1);
    if (params.date2) query.departure.$lte = new Date(params.date2 + "T23:59:59");
  }
  // retrueve matching flight schedules
  const schedules = await db
    .collection("schedules")
    .find(query)
    .sort({ departure: 1 })
    .toArray();
   // retrieve airport list for dropdown menus 
  const airports = await db.collection("airports").find({}).toArray();

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-bold text-slate-900"> {/* page heading */}
          Search Flights
        </h1>

        <p className="mb-8 text-slate-600">
          Search scheduled flights by route and date range.
        </p>

        <form className="mb-8 grid gap-4 rounded-2xl bg-white p-6 shadow md:grid-cols-5">
          <div>
            <label className="mb-1 block font-semibold text-slate-800">From</label>
            <select
              name="orig"
              defaultValue={params.orig || ""}
              className="w-full rounded-lg border p-3 text-slate-900"
            >
              <option value="">Any</option>
              {airports.map((airport: any) => (
                <option key={airport.code} value={airport.code}>
                  {airport.code} - {airport.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-800">To</label>
            <select
              name="dest"
              defaultValue={params.dest || ""}
              className="w-full rounded-lg border p-3 text-slate-900"
            >
              <option value="">Any</option>
              {airports.map((airport: any) => (
                <option key={airport.code} value={airport.code}>
                  {airport.code} - {airport.city}
                </option>
              ))}
            </select>
          </div>
          {/* Date range filters */}
          <div>
            <label className="mb-1 block font-semibold text-slate-800">
              Start Date
            </label>
            <input
              name="date1"
              type="date"
              defaultValue={params.date1 || ""}
              className="w-full rounded-lg border p-3 text-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-800">
              End Date
            </label>
            <input
              name="date2"
              type="date"
              defaultValue={params.date2 || ""}
              className="w-full rounded-lg border p-3 text-slate-900"
            />
          </div>

          <div className="flex items-end">
            <button className="w-full rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">
              Search
            </button>
          </div>
        </form>

        <div className="grid gap-6">
          {schedules.length === 0 && (
            <div className="rounded-2xl bg-white p-6 shadow">
              No flights found for this search.
            </div>
          )}

          {schedules.map((flight: any) => (
            <div
              key={flight._id.toString()}
              className="rounded-2xl bg-white p-6 shadow"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-blue-700">
                  {flight.flightNo}
                </h2>
                <span className="text-lg font-semibold text-green-600">
                  ${flight.price}
                </span>
              </div>

              <p className="mb-2 text-slate-700">
                <strong>Route:</strong> {flight.origin} → {flight.destination}
              </p>

              <p className="mb-2 text-slate-700">
                <strong>Aircraft:</strong> {flight.aircraftCode}
              </p>

              <p className="mb-2 text-slate-700">
                <strong>Departure:</strong>{" "}
                {new Date(flight.departure).toLocaleString()}
              </p>

              <p className="mb-2 text-slate-700">
                <strong>Arrival:</strong>{" "}
                {new Date(flight.arrival).toLocaleString()}
              </p>

              <p className="text-slate-700">
                <strong>Capacity:</strong> {flight.capacity} passengers
              </p>

              <Link
                href={`/book/${flight._id.toString()}`}
                className="mt-4 inline-block rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
              >
                Book This Flight
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}