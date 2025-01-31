import { httpResponseCode, httpResponseStatus } from "../../constants/http-response.js";
import FileUploadService from "../../services/cloudinary-service.js";
import { roomModel } from "./room-model.js";

class RoomService {
    tramsformRoomCreateDTO = async (req) => {
        try {
            let data = req.body;

            let files = req.files;

            let images = [];
            if (!files || files.length === 0) {
                throw {
                    statusCode: httpResponseCode.BAD_REQUEST,
                    message: "Provide room image/s",
                    status: httpResponseStatus.badRequest,
                };
            }
            if (files && files.length > 0) {
                for (let image of files) {
                    let uploadImage = await FileUploadService.uploadFile(image.path, "/rooms");
                    images.push(uploadImage);
                }
            }

            data.images = images;

            data.rentPrice = data.rentPrice * 100;

            data.owner = req.loggedInUser._id;

            return data;
        } catch (error) {
            throw error;
        }
    };

    transformRoomUpdateDTO = async (req, oldValue) => {
        try {
            let data = req.body;
            let files = req.files;

            let images = [];

            if (files && files.length > 0) {
                for (let image of files) {
                    let uploadImage = await FileUploadService.uploadFile(image.path, "/rooms");
                    images.push(uploadImage);
                }
            } else {
                images = oldValue.images;
            }

            data.images = images;

            data.rentPrice = data.rentPrice ? data.rentPrice * 100 : oldValue.rentPrice;

            data.owner = req.loggedInUser._id;

            return data;
        } catch (error) {
            throw error;
        }
    };

    createRoom = async (data) => {
        try {
            const roomObj = new roomModel(data);

            return await roomObj.save();
        } catch (error) {
            throw error;
        }
    };

    listAllRooms = async ({ limit = 10, skip = 0, filter = {} }) => {
        try {
            const data = await roomModel.find(filter).populate("owner", ["_id", "fullName", "gender", "role", "image"]).sort({ createdAt: "desc" }).skip(skip).limit(limit);

            return data;
        } catch (error) {
            throw error;
        }
    };

    countRooms = async (filter) => {
        try {
            const totalCount = await roomModel.countDocuments(filter);

            return totalCount;
        } catch (error) {
            throw error;
        }
    };

    getRoomById = async (roomId) => {
        try {
            const room = await roomModel.findById(roomId).populate("owner", ["_id", "fullName", "role"]);

            if (!room) {
                throw {
                    statusCode: httpResponseCode.NOT_FOUND,
                    message: "Room does not exist",
                    status: httpResponseStatus.notFound,
                };
            }

            return room;
        } catch (error) {
            throw error;
        }
    };

    deleteRoomById = async (roomId) => {
        try {
            const result = await roomModel.findByIdAndDelete(roomId);
            if (!result) {
                throw {
                    statusCode: 404,
                    message: "Room not found",
                };
            }
            return result;
        } catch (error) {
            throw error;
        }
    };

    updateRoomById = async (id, data) => {
        try {
            const roomUpdate = await roomModel.findByIdAndUpdate(id, { $set: data }, { new: true });

            if (!roomUpdate) {
                throw {
                    statusCode: httpResponseCode.NOT_FOUND,
                    message: "Room not found",
                    status: httpResponseStatus.notFound,
                };
            }

            return roomUpdate;
        } catch (error) {
            console.error("Error in updateRoomById:", error); // Log detailed error
            throw error;
        }
    };
}

export const roomSvc = new RoomService();
