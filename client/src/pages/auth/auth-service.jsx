import HttpService from "../../services/http-service";

class AuthService extends HttpService {
    registerUser = async (data) => {
        try {
            const response = await this.postRequest("/auth/register", data, { file: true });

            return response;
        } catch (error) {
            throw error;
        }
    };

    activateUserByOtp = async (data) => {
        try {
            const response = await this.postRequest("/auth/activate-user", data);

            return response;
        } catch (error) {
            throw error;
        }
    };

    loginUser = async (credential) => {
        try {
            const response = await this.postRequest("/auth/login", credential);

            return response;
        } catch (exception) {
            throw exception;
        }
    };

    refreshToken = async () => {
        try {
            const response = await this.getRequest("/auth/refresh-token", { refresh: true });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("refresh", response.data.refreshToken);

            return response;
        } catch (exception) {
            throw exception;
        }
    };

    getLoggedInUserDetails = async () => {
        try {
            const response = await this.getRequest("/auth/me", { auth: true });

            return response;
        } catch (exception) {
            if (exception.data.status === "TOKEN_EXPIRED") {
                await this.refreshToken();
                return await this.getLoggedInUserDetails();
            } else {
                throw exception;
            }
        }
    };

    updateUser = async (userId, data) => {
        try {
            const response = await this.putRequest("/auth/update/" + userId, data, { auth: true, file: true });

            return response;
        } catch (error) {
            throw error;
        }
    };

    getLandlords = async () => {
        try {
            const response = await this.getRequest("/auth/all-landlords", { auth: true });

            return response;
        } catch (error) {
            throw error;
        }
    };

    getLandlordBySlug = async (slug) => {
        try {
            const response = await this.getRequest(`/auth/${slug}/by-slug`, { auth: true });

            return response;
        } catch (error) {
            throw error;
        }
    };

    getAllUsers = async () => {
        try {
            const response = await this.getRequest("/auth/all-users", { auth: true });

            return response;
        } catch (error) {
            throw error;
        }
    };
}

export const authSvc = new AuthService();
