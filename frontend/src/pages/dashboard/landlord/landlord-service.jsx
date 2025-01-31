import HttpService from "@/services/http-service";

class LandlordService extends HttpService {
    getLandlords = async ({ page = 1, search = null }) => {
        try {
            let params = {};

            if (search) {
                params = {
                    ...params,
                    keyword: search,
                };
            }
            const response = await this.getRequest("/auth/all-landlords", { auth: true, params: { ...params, page: page } });

            return response;
        } catch (error) {
            throw error;
        }
    };

    deleteLandlord = async (id) => {
        try {
            const response = await this.deleteRequest("/auth/" + id, { auth: true });

            return response;
        } catch (error) {
            throw error;
        }
    };
}

export const landlordSvc = new LandlordService();
