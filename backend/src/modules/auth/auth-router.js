import express from "express";
import { bodyValidator } from "../../middlewares/requestValidator-middleware.js";
import { uploadFile } from "../../middlewares/multipartParser-middleware.js";
import { activationDTO, loginDTO, resendActivationDTO, userRegistrationDTO, userUpdateDTO } from "./auth-request.js";
import { authCtrl } from "./auth-controller.js";
import { checkLogin, refreshToken } from "../../middlewares/auth-middleware.js";
import { checkPermission } from "../../middlewares/rbac-middleware.js";

const authRouter = express.Router();

authRouter.post("/register", uploadFile("image").single("image"), bodyValidator(userRegistrationDTO), authCtrl.register);

authRouter.get("/:slug/by-slug", authCtrl.getUserBySlug);

authRouter.post("/activate-user", bodyValidator(activationDTO), authCtrl.activateUser);

authRouter.post("/resend-token", bodyValidator(resendActivationDTO), authCtrl.resendOTP);

authRouter.post("/login", bodyValidator(loginDTO), authCtrl.login);

authRouter.get("/me", checkLogin, authCtrl.getLoggedInUser);

authRouter.get("/refresh-token", refreshToken, authCtrl.refreshToken);

authRouter.get("/all-users", checkLogin, checkPermission(["admin"]), authCtrl.getOtherUsers);

authRouter.get("/all-tenants", checkLogin, checkPermission(["admin"]), authCtrl.getTenants);

authRouter.get("/all-landlords", checkLogin, authCtrl.getLandlords);

authRouter.get("/:id", checkLogin, authCtrl.getUserById);

authRouter.put("/update/:id", checkLogin, uploadFile().single("image"), bodyValidator(userUpdateDTO), authCtrl.updateUserById);

authRouter.delete("/:id", checkLogin, checkPermission(["admin"]), authCtrl.deleteUser);
export default authRouter;
