import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

async function main() {
  await client.connect();

  const db = client.db("airline-booking");

  // Clear existing data
  await db.collection("airports").deleteMany({});
  await db.collection("schedules").deleteMany({});
  await db.collection("bookings").deleteMany({});

  // Airports
  const airports = [
    { code: "NZNE", city: "Auckland", name: "Dairy Flat Airport" },
    { code: "YSSY", city: "Sydney", name: "Sydney Kingsford Smith Airport" },
    { code: "NZRO", city: "Rotorua", name: "Rotorua Airport" },
    { code: "NZGB", city: "Great Barrier Island", name: "Claris Airport" },
    { code: "NZCI", city: "Chatham Islands", name: "Tuuta Airport" },
    { code: "NZTL", city: "Lake Tekapo", name: "Lake Tekapo Airport" },
  ];

  await db.collection("airports").insertMany(airports);

  // Flight templates
  const templates = [
    {
      flightNo: "DF101",
      origin: "NZNE",
      destination: "YSSY",
      aircraftCode: "SJ30i",
      price: 1200,
      capacity: 6,
      days: [5], // Friday
      depHour: 6,
      depMinute: 0,
      durationHours: 4.5,
    },
    {
      flightNo: "DF102",
      origin: "YSSY",
      destination: "NZNE",
      aircraftCode: "SJ30i",
      price: 1200,
      capacity: 6,
      days: [0], // Sunday
      depHour: 13,
      depMinute: 0,
      durationHours: 4,
    },
    {
      flightNo: "DF201",
      origin: "NZNE",
      destination: "NZRO",
      aircraftCode: "SF50-1",
      price: 280,
      capacity: 4,
      days: [1, 2, 3, 4, 5], // Mon-Fri
      depHour: 15,
      depMinute: 0,
      durationHours: 1,
    },
    {
      flightNo: "DF301",
      origin: "NZNE",
      destination: "NZGB",
      aircraftCode: "SF50-1",
      price: 220,
      capacity: 4,
      days: [1, 3, 5], // Mon, Wed, Fri
      depHour: 5,
      depMinute: 30,
      durationHours: 0.75,
    },
    {
      flightNo: "DF401",
      origin: "NZNE",
      destination: "NZCI",
      aircraftCode: "HONDA-1",
      price: 650,
      capacity: 5,
      days: [2, 5], // Tue, Fri
      depHour: 8,
      depMinute: 0,
      durationHours: 2,
    },
    {
      flightNo: "DF501",
      origin: "NZNE",
      destination: "NZTL",
      aircraftCode: "HONDA-2",
      price: 500,
      capacity: 5,
      days: [1], // Monday
      depHour: 10,
      depMinute: 0,
      durationHours: 1.5,
    },
  ];

  const schedules: any[] = [];

  // Start from June 1, 2026
  const startDate = new Date("2026-06-01");

  // Generate 4 weeks (28 days) of flights
  for (let i = 0; i < 28; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const dayOfWeek = currentDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

    for (const template of templates) {
      if (template.days.includes(dayOfWeek)) {
        const departure = new Date(currentDate);
        departure.setHours(template.depHour, template.depMinute, 0, 0);

        const arrival = new Date(departure);
        arrival.setMinutes(
          arrival.getMinutes() + template.durationHours * 60
        );

        schedules.push({
          flightNo: template.flightNo,
          origin: template.origin,
          destination: template.destination,
          aircraftCode: template.aircraftCode,
          departure,
          arrival,
          capacity: template.capacity,
          price: template.price,
        });
      }
    }
  }

  await db.collection("schedules").insertMany(schedules);

  console.log(`Inserted ${airports.length} airports`);
  console.log(`Inserted ${schedules.length} scheduled flights`);
  console.log("Seed data inserted successfully.");

  await client.close();
}

main().catch(console.error);