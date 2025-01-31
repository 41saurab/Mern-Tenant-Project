import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authSvc } from "../auth/auth-service";
import { toast } from "react-toastify";
import { ucFirst } from "@/helper/helper";
import { Button } from "@/components/ui/button";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { LoadingBtnComponent } from "@/component/buttons/button-state-component";
import { AuthContext } from "@/context/AuthContext";
import { reviewSvc } from "./landlord-review-service";
import ReviewFormComponent from "@/component/form/review-form-component";

const LandlordDetailPage = () => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const params = useParams();

    const [landlordId, setLandlordId] = useState("");
    const [landlordSlug, setLandlordSlug] = useState("");
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    const loadReviews = async () => {
        try {
            const response = await reviewSvc.getReviewsForLandlord(landlordSlug);

            if (response.data) {
                setReviews(response.data.reviews);
                setAverageRating(response.data.averageRating);
                setTotalReviews(response.data.totalReviews);
                setLandlordSlug(response.data.landlordSlug);
                if (response.data.reviews.length > 0) {
                    setLandlordId(response.data.reviews[0].landlordId);
                }
            }
        } catch (error) {}
    };

    const loadUser = async () => {
        setLoading(true);
        try {
            const response = await authSvc.getLandlordBySlug(params.slug);
            setLandlordSlug(response.data.slug);
            setUser(response.data);
        } catch (error) {
            toast.error("Error loading");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        loadReviews();
    }, [landlordSlug, averageRating, totalReviews, landlordId]);

    return (
        <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased min-h-screen">
            <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
                    {/* Image Section */}
                    <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
                        <img className="w-full dark:hidden" src={user?.image} alt="Landlord Profile" />
                        <img className="w-full hidden dark:block" src={user?.image} alt="Landlord Profile Dark" />
                    </div>

                    {/* Details Section */}
                    <div className="mt-6 sm:mt-8 lg:mt-0">
                        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">{user?.fullName}</h1>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, idx) => {
                                    if (averageRating >= idx + 1) {
                                        return <FaStar key={idx} className="text-yellow-400" />;
                                    } else if (averageRating >= idx + 0.5) {
                                        return <FaStarHalfAlt key={idx} className="text-yellow-400" />;
                                    } else {
                                        return <FaStar key={idx} className="text-gray-300" />;
                                    }
                                })}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">({averageRating.toFixed(1)} / 5)</p>
                            <p className="text-sm underline text-blue-500 dark:text-blue-400">
                                {totalReviews} Review{totalReviews > 1 ? "s" : ""}
                            </p>
                        </div>

                        <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

                        <p className="mb-6 text-gray-500 dark:text-gray-400">
                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Contact: {user?.phoneNumber}</h1>
                            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Gender: {ucFirst(user?.gender)}</h1>
                        </p>
                    </div>
                </div>
                <ReviewFormComponent landlordSlug={landlordSlug} landlordId={landlordId} />
            </div>
        </section>
    );
};

export default LandlordDetailPage;
