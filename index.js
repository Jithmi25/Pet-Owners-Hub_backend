import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './Routes/userRouter.js';
import clinicRouter from './Routes/clinicRouter.js';
import shopRouter from './Routes/shopRouter.js';
import listingRouter from './Routes/listingRouter.js';
import adminRouter from './Routes/adminRouter.js';
import authRouter from './Routes/authRouter.js';
import petRouter from './Routes/petRouter.js';
import reportsRouter from './Routes/reportsRouter.js';
import systemSettingsRouter from './Routes/systemSettingsRouter.js';
import uploadRouter from './Routes/uploadRouter.js';
import cors from 'cors';
import { seedClinics } from './Data/seedDatabase.js';
import { seedPets } from './Data/seedPets.js';
import { seedShops } from './Data/seedShops.js';

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

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

mongoose
  .connect(MONGO_DB_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // Seed data after successful connection
    seedClinics();
    seedPets();
    seedShops();
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
app.use("/api/auth", authRouter);
app.use("/api/clinics", clinicRouter);
app.use("/api/shops", shopRouter);
app.use("/api/listings", listingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/admin/pets", petRouter);
app.use("/api/admin/reports", reportsRouter);
app.use("/api/admin/settings", systemSettingsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});