import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './Routes/userRouter.js';
import clinicRouter from './Routes/clinicRouter.js';
import shopRouter from './Routes/shopRouter.js';
import listingRouter from './Routes/listingRouter.js';
import cors from 'cors';
import { seedClinics } from './Data/seedDatabase.js';

dotenv.config();

const app = express();

const { MONGO_DB_URL, PORT = 5000 } = process.env;

if (!MONGO_DB_URL) {
  throw new Error("MONGO_DB_URL is not set in the environment");
}

// Configure CORS - MUST be before routes
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Remove trailing slash
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

mongoose
  .connect(MONGO_DB_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // Seed clinics after successful connection
    seedClinics();
  })
  .catch((err) => console.error("❌ Connection error:", err));

const db = mongoose.connection;
  
db.on("error", (err) => {
  console.error("Connection error:", err);
});

db.once("open", () => {
  console.log("Database connected.");
});

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Pet Owners Hub API" });
});

app.use("/api/users", userRouter);
app.use("/api/clinics", clinicRouter);
app.use("/api/shops", shopRouter);
app.use("/api/listings", listingRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});