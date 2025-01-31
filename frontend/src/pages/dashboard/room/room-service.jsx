import HttpService from "@/services/http-service";

class RoomService extends HttpService {
    getRooms = async () => {
        try {
            const response = await this.getRequest("/room/all-rooms", { auth: true });

            return response;
        } catch (error) {
            throw error;
        }
    };

    getMyRooms = async () => {
        try {
            const response = await this.getRequest("/room/my-room", { auth: true });

            return response;
        } catch (error) {
            throw error;
        }
    };

    createRoom = async (data) => {
        try {
            const response = await this.postRequest("/room/create", data, { auth: true, file: true });

            return response;
        } catch (error) {
            throw error;
        }
    };

    getRoomDetailById = async (id) => {
        try {
            const response = await this.getRequest("/room/" + id, {
                auth: true,
            });

            return response;
        } catch (exception) {
            throw exception;
        }
    };

    editRoom = async (id, data) => {
        try {
            const response = await this.putRequest("/room/edit/" + id, data, { auth: true, file: true });

            return response;
        } catch (error) {
            throw error;
        }
    };
}

export const roomSvc = new RoomService();
