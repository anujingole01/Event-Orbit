A scalable event management and ticket booking system built using the MERN Stack, featuring three fully isolated panels:

👤 User Panel – Browse events, book tickets, manage wallet

🎤 Organizer Panel – Create/manage events, monitor seats, view analytics

🛡 Admin Panel – Oversee organizers, event approvals, payments & venues

EventOrbit is designed with modular architecture, role‑based access control, and a clean folder structure suitable for production‑grade deployment.

📑 Table of Contents
Features

Tech Stack

System Architecture

Project Structure

Installation

Environment Variables

Running the Project

API Base URL

Screenshots

Future Enhancements

Author

✨ Features
👤 User Panel
Browse & search events

View event details

Seat selection with visual mapping

Ticket booking + QR generation

Wallet (add balance, transaction history)

Manage profile

View purchased tickets

Leave reviews on events

🎤 Organizer Panel
Organizer login

Dashboard with KPIs

Create and manage events

Live seat status updates

Attendee list

Revenue/booking reports

🛡 Admin Panel
User & Organizer management

Organizer verification system

Event approval workflow

Payment & refund management

Venue inventory management

Admin analytics dashboard

🧱 Tech Stack
Frontend
React (Vite)

TailwindCSS

React Router v6

Axios

Context API

Backend
Node.js + Express.js

MongoDB + Mongoose

JWT Authentication

Multer (Media upload)

bcrypt (Password hashing)

🏗 System Architecture
User → Frontend (React)
        ↓ Axios
Backend (Node + Express) → MongoDB
        ↑ JWT Auth
Organizer Panel (React)
Admin Panel (React)
Each panel is isolated for cleaner maintenance and deployment.

📂 Project Structure
event-booking-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── models/
│   ├── utils/
│   └── server.js
│
└── frontend/
    ├── user/
    ├── organizer/
    └── admin/



⚙️ Installation
1️⃣ Clone Repository
git clone https://github.com/paraspathania/EventOrbit.git
cd event-booking-system

🔧 Backend Setup

npm install
npm run dev

🌐 Frontend Setup (for each panel)
User Panel:
cd frontend/user
npm install
npm run dev

Organizer Panel:
cd frontend/organizer
npm install
npm run dev

Admin Panel:
cd frontend/admin
npm install
npm run dev

🔐 Environment Variables
Create a .env file in /backend:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
EMAIL_USER=optional_email_for_sending_notifications
EMAIL_PASS=optional_email_password
🔗 API Base URL
Frontend should call:

http://localhost:5000/api
🖼 Screenshots
(Add real screenshots later)

Home Page

Event Details

Seat Selection

Booking Confirmation

Wallet

Organizer Dashboard

Admin Panel

🚀 Future Enhancements
Realtime seat updates (Socket.io)

Razorpay/Stripe payment gateway

Push notifications + email alerts

Organizer payout settlements



