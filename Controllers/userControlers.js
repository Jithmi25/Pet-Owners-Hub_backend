import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Models/user.js";

dotenv.config();

const { SECRET = "" } = process.env;
const jwtSecret = SECRET || "development-secret-key";

const sendError = (res, status, message) => res.status(status).json({ message });

export const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return sendError(res, 400, "name, email and password are required");
		}

		const existing = await User.findOne({ email });
		if (existing) {
			return sendError(res, 409, "User already exists");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashedPassword });

		return res.status(201).json({
			message: "User registered successfully",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (err) {
		console.error("Register error", err);
		return sendError(res, 500, "Unable to register user");
	}
};

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return sendError(res, 400, "email and password are required");
		}

		const user = await User.findOne({ email });
		if (!user) {
			return sendError(res, 401, "Invalid credentials");
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return sendError(res, 401, "Invalid credentials");
		}

		const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, {
			expiresIn: "7d",
		});

		return res.json({
			message: "Login successful",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (err) {
		console.error("Login error", err);
		return sendError(res, 500, "Unable to log in");
	}
};
