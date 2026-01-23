import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		phone: {
			type: String,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		address: {
			type: String,
			trim: true,
		},
		role: {
			type: String,
			enum: ['User', 'Admin', 'Moderator'],
			default: 'User',
		},
		status: {
			type: String,
			enum: ['Active', 'Inactive', 'Suspended', 'Banned'],
			default: 'Active',
		},
		lastLogin: {
			type: Date,
			default: null,
		},
		profileImage: {
			type: String,
			default: null,
		},
		isVerified: {
			type: Boolean,
			default: false,
		}
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;