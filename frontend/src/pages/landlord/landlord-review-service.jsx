import HttpService from "@/services/http-service";

class ReviewService extends HttpService {
    createReview = async (data) => {
        try {
            const response = await this.postRequest("/review/add", data, {
                auth: true,
            });

            return response;
        } catch (exception) {
            throw exception;
        }
    };

    getReviewsForLandlord = async (landlordSlug) => {
        try {
            const response = await this.getRequest("/review/" + landlordSlug, {
                auth: true,
            });

            return response;
        } catch (error) {
            throw error;
        }
    };

    getRating = async () => {
        try {
            const response = await this.getRequest("/review/avg-ratings", { auth: true });

            return response;
        } catch (error) {
            throw error;
        }
    };
}

export const reviewSvc = new ReviewService();
