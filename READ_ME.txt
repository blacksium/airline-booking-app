# Name - Da Na Aung Shan
# ID - 25014362
# Dairy Flat Air Booking System

## Project Overview
This project is an online booking system for a fictitious airline operating from Dairy Flat Airport. The system allows users to search scheduled flights, book a flight, view booking details, and cancel bookings.

## Technologies Used
- Next.js
- React
- TypeScript
- Tailwind CSS
- MongoDB Atlas
- Vercel

## Main Features
- Landing page with flight information
- Search flights by origin, destination, and date range
- Book a selected scheduled flight
- Generate a unique booking reference
- Display booking confirmation/invoice page
- Search booking using booking reference and passenger email
- Cancel confirmed bookings
- Prevent booking when a flight is full
- MongoDB seed data with multiple weeks of real calendar flight schedules

## Database Collections
The MongoDB Atlas database uses these collections:

### airports
Stores airport codes, names, and cities.

### schedules
Stores scheduled flight data such as:
- flight number
- origin
- destination
- aircraft
- departure time
- arrival time
- capacity
- price

### bookings
Stores passenger booking data such as:
- booking reference
- passenger name
- passenger email
- flight details
- booking status
- created date
- cancelled date

## API Routes
The project uses Next.js API routes:

### /api/test
Tests the MongoDB Atlas connection.

### /api/schedules
Searches flight schedules using origin, destination, and date range.

### /api/bookings
Creates a new booking and checks flight capacity.

### /api/cancel
Cancels a booking by changing its status to cancelled.

## How the System Works
1. The user opens the landing page.
2. The user searches for a flight.
3. The system reads matching schedules from MongoDB Atlas.
4. The user selects a flight and enters passenger details.
5. The system checks if the flight has seats available.
6. If available, the booking is saved with a unique booking reference.
7. The user is shown a confirmation/invoice page.
8. The user can later search the booking using booking reference and email.
9. The user can cancel the booking if it is still confirmed.

## Deployment
The application is designed to be deployed on Vercel. MongoDB Atlas is used as the cloud database, and the database connection is stored in the environment variable:

MONGODB_URI