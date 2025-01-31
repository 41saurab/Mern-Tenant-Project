import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            unqiue: true,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "tenant", "landlord"],
            required: true,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive",
        },
        image: {
            type: String,
        },
        activationToken: String,
        forgotToken: String,
        expiryTime: Date,
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
        autoCreate: true,
        autoIndex: true,
    }
);

export const userModel = mongoose.model("User", userSchema);
