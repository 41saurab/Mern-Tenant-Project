import mongoose from "mongoose";
import { httpResponseStatus } from "../../constants/http-response.js";
import { roomSvc } from "./room-service.js";

class RoomController {
    createRoom = async (req, res, next) => {
        try {
            let data = await roomSvc.tramsformRoomCreateDTO(req);
            let room = await roomSvc.createRoom(data);

            res.json({
                status: httpResponseStatus.success,
                message: "Room created successfully",
                data: room,
            });
        } catch (error) {
            next(error);
        }
    };

    getAllRooms = async (req, res, next) => {
        try {
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            let skip = (page - 1) * limit;

            let filter = {};
            if (req.query.keyword) {
                filter = {
                    $or: [{ title: new RegExp(req.query.keyword, "i") }, { description: new RegExp(req.query.keyword, "i") }, { location: new RegExp(req.query.keyword, "i") }],
                };
            }

            let data = await roomSvc.listAllRooms({
                limit: limit,
                skip: skip,
                filter: filter,
            });

            let totalRooms = await roomSvc.countRooms(filter);

            res.json({
                status: httpResponseStatus.success,
                message: "List of rooms",
                options: {
                    page: page,
                    limit: limit,
                    totalRooms: totalRooms,
                },
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    getAvailableRooms = async (req, res, next) => {
        try {
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            let skip = (page - 1) * limit;

            let filter = { status: "available" };

            let data = await roomSvc.listAllRooms({
                limit: 16,
                skip: skip,
                page: 1,
                filter: filter,
            });

            let totalRooms = await roomSvc.countRooms(filter);

            res.json({
                status: httpResponseStatus.success,
                message: "List of available rooms",
                options: {
                    page: page,
                    limit: limit,
                    totalRooms: totalRooms,
                },
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    getMyRoom = async (req, res, next) => {
        try {
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            let skip = (page - 1) * limit;

            let filter = { owner: req.loggedInUser._id }; // Filter by logged-in user's ID

            if (req.query.keyword) {
                filter = {
                    ...filter,
                    $or: [{ title: new RegExp(req.query.keyword, "i") }, { description: new RegExp(req.query.keyword, "i") }, { location: new RegExp(req.query.keyword, "i") }],
                };
            }
            // Fetch user's rooms with pagination
            let data = await roomSvc.listAllRooms({
                limit: limit,
                skip: skip,
                filter: filter,
            });

            // Count total rooms for the user
            let totalRooms = await roomSvc.countRooms(filter);

            res.json({
                status: httpResponseStatus.success,
                message: "List of your rooms",
                options: {
                    page: page,
                    limit: limit,
                    totalRooms: totalRooms,
                },
                data: data,
            });
        } catch (error) {
            next(error);
        }
    };

    getRoomById = async (req, res, next) => {
        try {
            const { roomId } = req.params;

            // Validate roomId
            if (!mongoose.Types.ObjectId.isValid(roomId)) {
                return res.status(400).json({
                    status: httpResponseStatus.failure,
                    message: "Invalid Room ID",
                    data: null,
                });
            }

            const room = await roomSvc.getRoomById(roomId);

            res.status(200).json({
                status: httpResponseStatus.success,
                message: "Room details",
                data: room,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteRoom = async (req, res, next) => {
        try {
            const { roomId } = req.params;
            // Validate roomId
            if (!mongoose.Types.ObjectId.isValid(roomId)) {
                return res.status(400).json({
                    status: httpResponseStatus.failure,
                    message: "Invalid Room ID",
                    data: null,
                });
            }
            // Check user permissions
            const user = req.loggedInUser;

            // Admins can delete any room
            if (user.role === "admin") {
                await roomSvc.deleteRoomById(roomId);
            } else if (user.role === "landlord") {
                // Landlords can delete only their own rooms
                const room = await roomSvc.getRoomById(roomId);
                if (!room) {
                    return res.status(404).json({
                        status: httpResponseStatus.notFound,
                        message: "Room not found",
                    });
                }

                if (room.owner._id.toString() !== user._id.toString()) {
                    return res.status(403).json({
                        status: httpResponseStatus.forbidden,
                        message: "You are not authorized to delete this room",
                    });
                }

                await roomSvc.deleteRoomById(roomId);
            } else {
                return res.status(403).json({
                    status: httpResponseStatus.forbidden,
                    message: "You are not authorized to delete this room",
                });
            }

            res.json({
                status: httpResponseStatus.success,
                message: "Room deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    updateRoom = async (req, res, next) => {
        try {
            const room = await roomSvc.getRoomById(req.params.roomId);
            const data = await roomSvc.transformRoomUpdateDTO(req, room);

            const update = await roomSvc.updateRoomById(req.params.roomId, data);

            res.json({
                status: httpResponseStatus.success,
                message: "Room updated successfully",
                data: update,
            });
        } catch (error) {
            next(error);
        }
    };
}

export const roomCtrl = new RoomController();
