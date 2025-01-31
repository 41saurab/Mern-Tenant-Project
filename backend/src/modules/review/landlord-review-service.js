import { httpResponseCode, httpResponseStatus } from "../../constants/http-response.js";
import { userModel } from "../user/user-model.js";
import { reviewModel } from "./landlord-review.model.js";
import mongoose from "mongoose";

class ReviewService {
    transformReviewCreateDTO = async (req) => {
        try {
            const data = req.body;
            const { landlordId, reviewBy } = data;

            if (!mongoose.Types.ObjectId.isValid(landlordId)) {
                throw {
                    statusCode: httpResponseCode.NOT_FOUND,
                    message: "Landlord not found",
                    status: httpResponseStatus.notFound,
                };
            }

            if (!mongoose.Types.ObjectId.isValid(reviewBy)) {
                throw {
                    statusCode: httpResponseCode.NOT_FOUND,
                    message: "Reviewer not found",
                    status: httpResponseStatus.notFound,
                };
            }

            if (landlordId === reviewBy) {
                throw {
                    statusCode: httpResponseCode.BAD_REQUEST,
                    message: "Cannot review yourself",
                    status: httpResponseStatus.badRequest,
                };
            }

            // Fetch landlord's slug
            const landlord = await userModel.findById(landlordId);
            if (!landlord) {
                throw {
                    statusCode: httpResponseCode.NOT_FOUND,
                    message: "Landlord not found",
                    status: httpResponseStatus.notFound,
                };
            }

            data.landlordSlug = landlord.slug; // Add landlord's slug to data
            return data;
        } catch (error) {
            throw error;
        }
    };

    createReview = async (data) => {
        try {
            const { landlordId, landlordSlug, reviewBy } = data;

            // Check for existing review
            const existingReview = await reviewModel.findOne({ landlordId, reviewBy });

            if (existingReview) {
                // Update existing review
                existingReview.rate = data.rate;
                existingReview.review = data.review || existingReview.review;
                existingReview.updatedAt = new Date();
                return await existingReview.save();
            } else {
                // Create new review
                const newReview = new reviewModel(data);
                return await newReview.save();
            }
        } catch (error) {
            throw error;
        }
    };

    getLandlordReviews = async (slug) => {
        try {
            const reviews = await reviewModel.aggregate([
                { $match: { landlordSlug: slug } }, // Match by landlordSlug

                {
                    $group: {
                        _id: "$landlordSlug", // Group by landlordSlug
                        averageRating: { $avg: "$rate" }, // Calculate the average rating
                        totalReviews: { $sum: 1 }, // Count the total number of reviews
                        reviews: { $push: "$$ROOT" }, // Push all reviews for detailed data
                    },
                },
            ]);

            if (reviews.length === 0) {
                return null;
            }

            const result = {
                landlordSlug: reviews[0]._id,
                averageRating: reviews[0].averageRating,
                totalReviews: reviews[0].totalReviews,
                reviews: reviews[0].reviews,
            };

            return result;
        } catch (error) {
            console.error("Error fetching reviews with aggregation:", error);
            throw error;
        }
    };

    getRatings = async () => {
        try {
            const ratings = await reviewModel.find();
            return ratings;
        } catch (error) {
            throw error;
        }
    };
}

export const reviewSvc = new ReviewService();
