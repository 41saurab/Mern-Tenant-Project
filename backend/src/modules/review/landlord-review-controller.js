import { httpResponseStatus } from "../../constants/http-response.js";
import { reviewSvc } from "./landlord-review-service.js";

class ReviewController {
    createReview = async (req, res, next) => {
        try {
            const data = await reviewSvc.transformReviewCreateDTO(req);
            const review = await reviewSvc.createReview(data);

            res.json({
                status: httpResponseStatus.success,
                message: "Review created successfully",
                data: review,
            });
        } catch (error) {
            next(error);
        }
    };

    getReviewsBySlug = async (req, res, next) => {
        try {
            const { slug } = req.params;
            const response = await reviewSvc.getLandlordReviews(slug);

            if (!response || response.length === 0) {
                return res.status(404).json({
                    status: httpResponseStatus.success,
                    message: "No reviews found for this landlord",
                    data: [],
                });
            }

            res.json({
                status: httpResponseStatus.success,
                message: "List of landlord reviews",
                data: response,
            });
        } catch (error) {
            next(error);
        }
    };

    getLandlordRatings = async (req, res, next) => {
        try {
            const response = await reviewSvc.getRatings();

            const landlordRatings = {};

            response.forEach((review) => {
                const { landlordId, rate } = review;

                if (!landlordRatings[landlordId]) {
                    landlordRatings[landlordId] = {
                        totalRate: 0,
                        count: 0,
                    };
                }

                landlordRatings[landlordId].totalRate += rate;
                landlordRatings[landlordId].count++;
            });

            const averageRatings = Object.keys(landlordRatings).map((landlordId) => {
                const { totalRate, count } = landlordRatings[landlordId];
                const averageRate = totalRate / count;

                return {
                    landlordId,
                    averageRating: averageRate.toFixed(1),
                };
            });

            // Sort the averageRatings by averageRating in descending order
            averageRatings.sort((a, b) => b.averageRating - a.averageRating);

            res.json({
                status: httpResponseStatus.success,
                message: "Landlord ratings with average rating",
                data: averageRatings,
            });
        } catch (error) {
            next(error);
        }
    };
}

export const reviewCtrl = new ReviewController();
