import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        landlordId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        landlordSlug: {
            type: String,
            required: true,
        },
        reviewBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rate: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        review: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        autoCreate: true,
        autoIndex: true,
    }
);

export const reviewModel = mongoose.model("Review", reviewSchema);
