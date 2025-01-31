import FileUploadService from "../../services/cloudinary-service.js";
import bcrypt from "bcryptjs";
import { generateDateTime, generateRandomString } from "../../utilities/helper.js";
import { userModel } from "../user/user-model.js";
import { mailSvc } from "../../services/mail-service.js";
import { httpResponseCode, httpResponseStatus } from "../../constants/http-response.js";
import slugify from "slugify";

class AuthService {
    generateActivationOTP = () => {
        return {
            activationToken: generateRandomString(4).toUpperCase(),
            expiryTime: generateDateTime(5),
        };
    };

    transformRegisterUser = async (req) => {
        try {
            const data = req.body;
            const file = req.file;

            const uploadFile = file ? await FileUploadService.uploadFile(file.path, "/users") : null;

            const formattedData = {
                fullName: data.fullName,
                email: data.email,
                role: data.role,
                gender: data.gender,
                phoneNumber: data.phoneNumber,
                status: "inactive",
                password: bcrypt.hashSync(data.password, 10),
                image: uploadFile,
                activationToken: generateRandomString(4).toUpperCase(),
                expiryTime: generateDateTime(5),
                slug: slugify(data.fullName, { lower: true }),
            };

            return formattedData;
        } catch (error) {
            throw error;
        }
    };

    transformUpdateUser = async (req, oldValue) => {
        try {
            const data = req.body;
            const file = req.file;

            let uploadFile;
            if (file) {
                uploadFile = await FileUploadService.uploadFile(file.path, "/users");
            }

            // Verify the old password if a new password is provided
            if (data.password && data.oldPassword) {
                const isMatch = bcrypt.compareSync(data.oldPassword, oldValue.password);
                if (!isMatch) {
                    throw {
                        statusCode: httpResponseCode.UNAUTHORIZED,
                        message: "Incorrect old password",
                        status: httpResponseStatus.unauthorized,
                    };
                }
            } else if (data.password && !data.oldPassword) {
                throw {
                    statusCode: httpResponseCode.BAD_REQUEST,
                    message: "Old password is required to update the password",
                    status: httpResponseStatus.badRequest,
                };
            }

            const updatedData = {
                fullName: data.fullName || oldValue.fullName,
                email: data.email || oldValue.email,
                phoneNumber: data.phoneNumber || oldValue.phoneNumber,
                password: data.password ? bcrypt.hashSync(data.password, 10) : oldValue.password,
                image: uploadFile || oldValue.image,
            };

            return updatedData;
        } catch (error) {
            throw error;
        }
    };

    registerUser = async (data) => {
        try {
            const userObj = new userModel(data);
            return await userObj.save();
        } catch (error) {
            throw error;
        }
    };

    sendActivationEmail = async (user) => {
        try {
            const msg = `Dear ${user.name}, <br>
            Your account has been successfully registered. Please use the 
            following OTP to activate your account. <br>
            Your code is: <br>
            <strong style="color:#FF0000">${user.activationToken}</strong>
            <br>
             This code is valid only for 5 minutes. <br>
            Regards, <br>
            System Admin <br>
            <small>Please do not reply to this email via mail.</small>`;

            await mailSvc.sendEmail(user.email, "Activate your account.", msg);

            return true;
        } catch (error) {
            throw error;
        }
    };

    getUserByFilter = async (filter) => {
        try {
            const user = await userModel.findOne(filter);

            if (!user) {
                throw {
                    statusCode: httpResponseCode.NOT_FOUND,
                    message: "User not found",
                    status: httpResponseStatus.notFound,
                };
            }

            return user;
        } catch (error) {
            throw error;
        }
    };

    resendActivationEmail = async (user) => {
        try {
            const msg = `Dear ${user.name}, <br>
        Your new OTP code is: <br>
        <strong style="color:#ff0000">${user.otp}</strong> <br>
        This code is valid only for 5 minutes. <br>
        Regards, <br>
        System Admin <br>
        <small>Please do not reply to this email via mail.</small>`;

            await mailSvc.sendEmail(user.email, "Re-activation OTP code.", msg);
            return true;
        } catch (error) {
            throw error;
        }
    };

    numberOfUsersExceptMe = async (filter) => {
        try {
            const count = await userModel.countDocuments(filter);

            return count;
        } catch (error) {
            throw error;
        }
    };

    getListOfOtherUsers = async ({ limit = 10, skip = 0, filter = {} }) => {
        try {
            const otherUsers = await userModel.find(filter).sort({ fullName: "asc" }).skip(skip).limit(limit);

            return otherUsers;
        } catch (error) {
            throw error;
        }
    };

    getListOfOtherLandlords = async ({ limit = 10, skip = 0, filter = {} }) => {
        try {
            const otherUsers = await userModel.find(filter).sort({ fullName: "asc" }).skip(skip).limit(limit);

            return otherUsers;
        } catch (error) {
            throw error;
        }
    };

    getListOfTenants = async ({ limit = 10, skip = 0, filter = {} }) => {
        try {
            const otherUsers = await userModel.find(filter).sort({ fullName: "asc" }).skip(skip).limit(limit);

            return otherUsers;
        } catch (error) {
            throw error;
        }
    };

    updateUserById = async (updatedData, userId) => {
        try {
            const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });

            if (!updatedUser) {
                throw {
                    statusCode: httpResponseCode.NOT_FOUND,
                    message: "User not found.",
                    status: httpResponseStatus.notFound,
                };
            }
            return updatedUser;
        } catch (exception) {
            throw exception;
        }
    };

    deleteById = async (id) => {
        try {
            const deleted = await userModel.findByIdAndDelete(id);
            if (!deleted) {
                throw {
                    statusCode: httpResponseCode.NOT_FOUND,
                    message: "User not found.",
                    status: httpResponseStatus.notFound,
                };
            }

            return deleted;
        } catch (error) {
            throw error;
        }
    };
}

export const authSvc = new AuthService();
