import React, { useEffect, useState } from "react";

export const AverageRatingComponent = () => {
    const [averageRating, setAverageRating] = useState(0);

    const loadReviews = async () => {
        try {
            const response = await reviewSvc.getReviewsForLandlord(landlordSlug);

            if (response.data) {
                setAverageRating(response.data.averageRating);
            }
        } catch (error) {}
    };

    console.log();
    

    useEffect(() => {
        loadReviews();
    }, []);
    return <p className="text-sm text-gray-600 dark:text-gray-400">({averageRating} / 5)</p>;
};
