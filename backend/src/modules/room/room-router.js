import express from "express";
import { roomCreateDTO, roomUpdateDTO } from "./room-request.js";
import { uploadFile } from "../../middlewares/multipartParser-middleware.js";
import { checkPermission } from "../../middlewares/rbac-middleware.js";
import { checkLogin } from "../../middlewares/auth-middleware.js";
import { bodyValidator } from "../../middlewares/requestValidator-middleware.js";
import { roomCtrl } from "./room-controller.js";

const roomRouter = express.Router();

roomRouter.post("/create", checkLogin, checkPermission(["admin", "landlord"]), uploadFile().array("images"), bodyValidator(roomCreateDTO), roomCtrl.createRoom);

roomRouter.get("/all-rooms", checkLogin, checkPermission(["admin"]), roomCtrl.getAllRooms);
roomRouter.get("/available-rooms", checkLogin, roomCtrl.getAvailableRooms);
roomRouter.get("/my-room", checkLogin, checkPermission(["admin", "landlord"]), roomCtrl.getMyRoom);
roomRouter.get("/:roomId", checkLogin, roomCtrl.getRoomById);

roomRouter.delete("/:roomId", checkLogin, checkPermission(["admin", "landlord"]), roomCtrl.deleteRoom);
roomRouter.put("/edit/:roomId", checkLogin, checkPermission(["admin", "landlord"]), uploadFile().array("images"), bodyValidator(roomUpdateDTO), roomCtrl.updateRoom);

export default roomRouter;
