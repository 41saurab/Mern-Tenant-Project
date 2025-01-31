import HttpService from "@/services/http-service";

class TenantService extends HttpService {
    getUsers = async ({ page = 1, search = null }) => {
        try {
            let params = {};

            if (search) {
                params = {
                    ...params,
                    keyword: search,
                };
            }
            const response = await this.getRequest("/auth/all-tenants", { auth: true, params: { ...params, page: page } });

            return response;
        } catch (error) {
            throw error;
        }
    };

    deleteUser = async (id) => {
        try {
            const response = await this.deleteRequest("/auth/" + id, { auth: true });

            return response;
        } catch (error) {
            throw error;
        }
    };
}

export const tenantSvc = new TenantService();
