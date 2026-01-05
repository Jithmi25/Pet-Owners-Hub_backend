import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './Routes/userRouter.js';

dotenv.config();

const app = express();

const { MONGO_DB_URL, PORT = 5000 } = process.env;

if (!MONGO_DB_URL) {
  throw new Error("MONGO_DB_URL is not set in the environment");
}



mongoose
  .connect(MONGO_DB_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Connection error:", err));

const db = mongoose.connection; 
  
db.on("error", (err) => {
  console.error("Connection error:", err);
});

db.once("open", () => {
  console.log("Database connected.");
});
 
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Pet Owners Hub API" });
});

app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
