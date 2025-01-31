import { httpResponseCode, httpResponseStatus } from "../constants/http-response.js";

export const checkPermission = (allowebBy) => {
    return (req, res, next) => {
        if (!allowebBy || allowebBy.length === 0) {
            next({
                statusCode: httpResponseCode.user.ACCESS_DENIED,
                message: "User role is required",
                status: httpResponseStatus.user.emptyRole,
            });
        } else if (!Array.isArray(allowebBy)) {
            next({
                statusCode: httpResponseCode.user.ACCESS_DENIED,
                message: "Role should be in array",
                status: httpResponseStatus.user.roleShouldBeArray,
            });
        } else {
            const loggedInUserRole = req.loggedInUser.role;
            if (allowebBy.includes(loggedInUserRole)) {
                next();
            } else {
                next({
                    statusCode: httpResponseCode.user.ACCESS_DENIED,
                    message: "You are not allowed to access this resource",
                    status: httpResponseStatus.user.accessDenied,
                });
            }
        }
    };
};
