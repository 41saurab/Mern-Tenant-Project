export const httpResponseCode = {
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    UNAUTHENTICATED: 401,
    UNAUTHORIZED: 401,

    user: {
        ACCESS_DENIED: 403,
    },
};

export const httpResponseStatus = {
    notFound: "NOT_FOUND",
    internalServerError: "INTERNAL_SERVER_ERROR",
    validationFailed: "VALIDATION_FAILED",
    tokenExpired: "TOKEN_EXPIRED",
    tokenError: "TOKEN_ERROR",
    unauthenticated: "UNAUTHENTICATED",
    success: "SUCCESS_OK",
    badRequest: "BAD_REQUEST",

    user: {
        emptyRole: "ROLE_NOT_FOUND",
        roleShouldBeArray: "ROLE_SHOULD_BE_IN_ARRAY",
        accessDenied: "ACCESS_DENIED",
        notActive: "USER_NOT_ACTIVATED",
        credientialNotMatch: "CREDENTIAL_NOT_MATCH",
        unauthorized: "UNAUTHORIZED",
    },
};
