import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
// search and return avaiable flight schedules 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);  // read serach parameters from url

  const orig = searchParams.get("orig");
  const dest = searchParams.get("dest");
  const date1 = searchParams.get("date1");
  const date2 = searchParams.get("date2");
  // build MongoDB search query 
  const query: any = {};
  // filter by origin airport
  if (orig) query.origin = orig;
  if (dest) query.destination = dest; // filter by depature data range
  // filter by departure date range
  if (date1 || date2) {
    query.departure = {};
    if (date1) query.departure.$gte = new Date(date1);
    if (date2) query.departure.$lte = new Date(date2 + "T23:59:59");
  }
  // connect to MongoDB database
  const client = await clientPromise;
  const db = client.db("airline-booking");
  // retrieve matching flight schedules
  const schedules = await db
    .collection("schedules")
    .find(query)
    .sort({ departure: 1 }) // sort by earliest departure first
    .toArray();
  // return search results
  return NextResponse.json({
    success: true,
    schedules,
  });
}