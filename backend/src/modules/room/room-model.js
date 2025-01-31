import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available",
        },
        rentPrice: {
            type: Number,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        images: [
            {
                type: String,
                required: true,
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        autoCreate: true,
        autoIndex: true,
    }
);

export const roomModel = mongoose.model("Room", roomSchema);
