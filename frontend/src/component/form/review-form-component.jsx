import { reviewSvc } from "@/pages/landlord/landlord-review-service";
import React, { useContext, useEffect, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { LoadingBtnComponent } from "../buttons/button-state-component";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { setErrorInfo } from "@/helper/helper";

const ReviewFormComponent = ({ landlordSlug, landlordId }) => {
    const [loading, setLoading] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const {
        auth: { loggedInUser },
    } = useContext(AuthContext);

    const loadReviews = async () => {
        try {
            const response = await reviewSvc.getReviewsForLandlord(landlordSlug);

            if (response.data) {
                setReviews(response.data.reviews);
                setAverageRating(response.data.averageRating);
                setTotalReviews(response.data.totalReviews);
            }
        } catch (error) {}
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!rating) {
            toast.error("Please provide a rating!");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please write a review!");
            return;
        }
        setSubmitting(true);
        try {
            const payload = { landlordId, landlordSlug, rate: rating, review: comment };
            payload["reviewBy"] = loggedInUser._id;

            await reviewSvc.createReview(payload);
            toast.success("Review submitted successfully!");
            setRating(0);
            setComment("");
            await loadReviews(); // Refresh reviews and average rating
        } catch (exception) {
            toast.error("Can not review yourself");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [landlordSlug, submitting]);

    useEffect(() => {
        loadReviews();
    }, [landlordId, submitting]);

    return (
        <>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 mt-8 ml-12">
                {/* Leave a Review Form */}
                <div className="lg:col-span-4 ">
                    <div className="flex flex-col bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2 mb-4">Leave a Review</h2>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div className="flex items-center justify-center mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        className={`w-10 h-10 transform transition-all duration-200 hover:scale-110 
                                            ${star <= rating ? "text-yellow-500 hover:text-yellow-600" : "text-gray-300 hover:text-gray-400"}`}
                                        onClick={() => setRating(star)}
                                    >
                                        <FaStar className="w-full h-full" />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="resize-none block w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-200"
                                rows={4}
                                placeholder="Write your review here..."
                                required
                            />
                            {loading ? <LoadingBtnComponent /> : <Button className={"w-full"}>Submit Review</Button>}
                        </form>
                    </div>
                </div>
                {/* Reviews Listing */}
                <div className="lg:col-span-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md  overflow-y-auto">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-2 mb-4">Reviews</h3>
                    <div className="space-y-4">
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-blue-500"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {[...Array(5)].map((_, starIndex) => (
                                                <FaStar key={starIndex} className={`w-5 h-5 ${starIndex < review.rate ? "text-yellow-400" : "text-gray-300"}`} />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{review.review}"</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center italic">No reviews yet. Be the first to leave a review!</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReviewFormComponent;
