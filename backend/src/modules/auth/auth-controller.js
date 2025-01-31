import dotenv from "dotenv";
import { httpResponseCode, httpResponseStatus } from "../../constants/http-response.js";
import { authSvc } from "./auth-service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

class AuthController {
    register = async (req, res, next) => {
        try {
            const formattedData = await authSvc.transformRegisterUser(req);

            const user = await authSvc.registerUser(formattedData);

            // await authSvc.sendActivationEmail(user);
            res.json({
                status: httpResponseStatus.success,
                message: "Register request",
                data: user,
                options: null,
            });
        } catch (error) {
            next(error);
        }
    };

    activateUser = async (req, res, next) => {
        try {
            const { email, otp } = req.body;
            const user = await authSvc.getUserByFilter({ email: email });

            if (user.status !== "inactive") {
                throw {
                    statusCode: httpResponseCode.BAD_REQUEST,
                    message: "User already activated",
                    status: httpResponseStatus.validationFailed,
                };
            }

            if (user.activationToken !== otp) {
                throw {
                    statusCode: httpResponseCode.BAD_REQUEST,
                    message: "Incorrect OTP",
                    status: httpResponseStatus.validationFailed,
                };
            }

            let today = new Date();
            today = today.getTime();
            let otpExpiryTime = user.expiryTime;
            otpExpiryTime = otpExpiryTime.getTime();

            if (today - otpExpiryTime > 0) {
                throw {
                    statusCode: httpResponseCode.BAD_REQUEST,
                    message: "OTP expired",
                    status: httpResponseStatus.validationFailed,
                };
            }

            const updatedData = await authSvc.updateUserById(
                {
                    status: "active",
                    expiryTime: null,
                    activationToken: null,
                },
                user._id
            );

            res.json({
                status: httpResponseStatus.success,
                message: "Account activated. Please login to continue",
                data: updatedData,
                options: null,
            });
        } catch (error) {
            next(error);
        }
    };

    resendOTP = async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await authSvc.getUserByFilter({ email: email });

            let today = new Date();
            today = today.getTime();
            let otpExpiryTime = user.expiryTime;
            otpExpiryTime = otpExpiryTime.getTime();

            if (today - otpExpiryTime < 0) {
                throw {
                    statusCode: httpResponseCode.BAD_REQUEST,
                    message: "OTP is still valid. Please wait until it expires before requesting a new one",
                    status: httpResponseStatus.validationFailed,
                };
            }

            if (user.status !== "inactive") {
                throw {
                    statusCode: httpResponseCode.BAD_REQUEST,
                    message: "User already activated",
                    status: httpResponseStatus.validationFailed,
                };
            }

            const newOTP = authSvc.generateActivationOTP();

            const updatedData = await authSvc.updateUserById(newOTP, user._id);

            await authSvc.resendActivationEmail({ email: user.email, otp: newOTP.activationToken, name: user.name });

            res.json({
                status: httpResponseStatus.success,
                message: "New OPT code delivered to your email",
                data: {
                    email: updatedData.email,
                    activationToken: updatedData.activationToken,
                },
                options: null,
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const { phoneNumber, password } = req.body;

            const user = await authSvc.getUserByFilter({ phoneNumber: phoneNumber });

            if (user.status !== "active") {
                throw {
                    statusCode: httpResponseCode.BAD_REQUEST,
                    message: "User not activated",
                    status: httpResponseStatus.user.notActive,
                };
            } else {
                if (bcrypt.compareSync(password, user.password)) {
                    const payload = {
                        sub: user._id,
                    };

                    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10h" });

                    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15d" });

                    res.json({
                        status: httpResponseStatus.success,
                        message: "Login success",
                        data: {
                            token: token,
                            refreshToken: refreshToken,
                            detail: {
                                _id: user._id,
                                fullName: user.fullName,
                                slug: user.slug,
                                email: user.email,
                                role: user.role,
                                image: user.image,
                                phoneNumber: user.phoneNumber,
                                gender: user.gender,
                            },
                        },
                        options: null,
                    });
                } else {
                    throw {
                        statusCode: httpResponseCode.BAD_REQUEST,
                        message: "Invalid credentials",
                        status: httpResponseStatus.user.credientialNotMatch,
                    };
                }
            }
        } catch (error) {
            next(error);
        }
    };

    getLoggedInUser = async (req, res, next) => {
        try {
            res.json({
                status: httpResponseStatus.success,
                message: "My details",
                data: req.loggedInUser,
                options: null,
            });
        } catch (error) {
            next(error);
        }
    };

    refreshToken = async (req, res, next) => {
        try {
            const loggedInUser = req.loggedInUser;

            const payload = {
                sub: loggedInUser._id,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10h" });

            const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15d" });

            res.json({
                status: httpResponseStatus.success,
                message: "Refresh token",
                data: {
                    token: token,
                    refreshToken: refreshToken,
                },
                options: null,
            });
        } catch (error) {
            next(error);
        }
    };

    getOtherUsers = async (req, res, next) => {
        try {
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            let skip = (page - 1) * limit;

            const role = req?.query?.role || null;

            let filter = {
                _id: { $ne: req.loggedInUser._id },
            };

            if (req.query.keyword) {
                filter = {
                    ...filter,
                    $or: [
                        {
                            fullName: new RegExp(req.query.keyword, "i"),
                        },
                    ],
                };
            }

            if (role) {
                filter = {
                    ...filter,
                    role: role,
                };
            }

            const usersList = await authSvc.getListOfOtherUsers({ limit: limit, skip: skip, filter: filter });

            const numberOfUsers = await authSvc.numberOfUsersExceptMe(filter);

            res.json({
                status: httpResponseStatus.success,
                message: "List of other users",
                options: {
                    page: page,
                    limit: limit,
                    totalUsers: numberOfUsers,
                },
                data: usersList,
            });
        } catch (error) {
            next(error);
        }
    };

    getUserById = async (req, res, next) => {
        try {
            const { userId } = req.params.id;
            const user = await authSvc.getUserByFilter({ userId });

            res.json({
                status: httpResponseStatus.success,
                message: "My detail by id",
                data: user,
                options: null,
            });
        } catch (error) {
            next(error);
        }
    };

    updateUserById = async (req, res, next) => {
        try {
            if (req.loggedInUser._id.toString() !== req.params.id) {
                throw {
                    status: httpResponseStatus.unauthorized,
                    message: "User not found",
                    statusCode: httpResponseCode.UNAUTHORIZED,
                };
            }

            const existingUser = await authSvc.getUserByFilter({ _id: req.params.id });
            if (!existingUser) {
                throw {
                    status: httpResponseStatus.notFound,
                    message: "User not found",
                    statusCode: httpResponseCode.NOT_FOUND,
                };
            }

            const updatedData = await authSvc.transformUpdateUser(req, existingUser);
            const updatedUser = await authSvc.updateUserById(updatedData, req.params.id);

            res.json({
                status: httpResponseStatus.success,
                message: "User updated successfully",
                data: updatedUser,
            });
        } catch (error) {
            next(error);
        }
    };

    getLandlords = async (req, res, next) => {
        try {
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            let skip = (page - 1) * limit;

            let filter = {
                // _id: { $ne: req.loggedInUser._id },
                role: "landlord",
            };
            if (req.query.keyword) {
                filter = {
                    ...filter,
                    $or: [
                        {
                            fullName: new RegExp(req.query.keyword, "i"),
                        },
                    ],
                };
            }

            const usersList = await authSvc.getListOfOtherLandlords({
                limit: limit,
                skip: skip,
                filter: filter,
            });

            const numberOfUsers = await authSvc.numberOfUsersExceptMe(filter);

            res.json({
                status: httpResponseStatus.success,
                message: "List of landlords",
                options: {
                    page: page,
                    limit: limit,
                    totalLandlords: numberOfUsers,
                },
                data: usersList,
            });
        } catch (error) {
            next(error);
        }
    };

    getTenants = async (req, res, next) => {
        try {
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            let skip = (page - 1) * limit;

            let filter = {
                // _id: { $ne: req.loggedInUser._id },
                role: "tenant",
            };
            if (req.query.keyword) {
                filter = {
                    ...filter,
                    $or: [
                        {
                            fullName: new RegExp(req.query.keyword, "i"),
                        },
                    ],
                };
            }

            const usersList = await authSvc.getListOfTenants({
                limit: limit,
                skip: skip,
                filter: filter,
            });

            const numberOfUsers = await authSvc.numberOfUsersExceptMe(filter);

            res.json({
                status: httpResponseStatus.success,
                message: "List of tenants",
                options: {
                    page: page,
                    limit: limit,
                    totalTenants: numberOfUsers,
                },
                data: usersList,
            });
        } catch (error) {
            next(error);
        }
    };

    getUserBySlug = async (req, res, next) => {
        try {
            const slug = req.params.slug;
            const user = await authSvc.getUserByFilter({ slug });

            res.json({
                status: httpResponseStatus.success,
                message: "My detail by slug",
                data: user,
                options: null,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            const userId = req.params.id;
            const user = await authSvc.getUserByFilter({ _id: userId });

            let deleteData = await authSvc.deleteById(user);

            res.json({
                status: httpResponseStatus.success,
                message: "User deleted successfully",
                data: deleteData,
            });
        } catch (error) {
            next(error);
        }
    };
}

export const authCtrl = new AuthController();
