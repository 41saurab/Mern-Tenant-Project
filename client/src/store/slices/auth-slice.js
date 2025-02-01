import { authSvc } from "@/pages/auth/auth-service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await authSvc.registerUser(userData);

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const activateUserByOtp = createAsyncThunk("auth/activateUserByOtp", async (otpData, { rejectWithValue }) => {
    try {
        const response = await authSvc.activateUserByOtp(otpData);

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, { rejectWithValue }) => {
    try {
        const response = await authSvc.loginUser(credentials);

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const loggedInUser = createAsyncThunk("auth/loggedInUser", async (_, { rejectWithValue }) => {
    try {
        const response = await authSvc.getLoggedInUserDetails();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateUserProfile = createAsyncThunk("auth/updateProfile", async (userData, { rejectWithValue, getState }) => {
    try {
        const state = getState();

        const userId = state.auth.user?._id;
        if (!userId) throw new Error("User not found");

        const response = await authSvc.updateUser(userId, userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
        otp: new Array(4).fill(""),
        otpError: "",
        isOtpModalOpen: false,
        isLoggedIn: false,
    },

    reducers: {
        setOtp: (state, action) => {
            state.otp = action.payload;
        },
        setOtpError: (state, action) => {
            state.otpError = action.payload;
        },
        setIsOtpModalOpen: (state, action) => {
            state.isOtpModalOpen = action.payload;
        },
        clearAuthState: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
            state.otp = new Array(4).fill("");
            state.otpError = "";
            state.isOtpModalOpen = false;
            state.isLoggedIn = false;
        },
        setLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");
        },
    },

    extraReducers: (builder) => {
        builder
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isOtpModalOpen = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Activate User by OTP
            .addCase(activateUserByOtp.pending, (state) => {
                state.loading = true;
                state.otpError = "";
            })
            .addCase(activateUserByOtp.fulfilled, (state) => {
                state.loading = false;
                state.isOtpModalOpen = false;
                state.otp = new Array(4).fill("");
            })
            .addCase(activateUserByOtp.rejected, (state, action) => {
                state.loading = false;
                state.otpError = action.payload;
            })
            // Login User
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.detail;
                state.isLoggedIn = true; // Set login status to true
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("refresh", action.payload.refreshToken);
            })
            // Login User details
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isLoggedIn = false;
                state.error = action.payload;
            })
            .addCase(loggedInUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loggedInUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isLoggedIn = true;
            })
            .addCase(loggedInUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isLoggedIn = false;
                localStorage.removeItem("token");
                localStorage.removeItem("refresh");
            })
            // Update User Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = "pending";
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = "succeeded";
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload;
            });
    },
});

export const { setOtp, setOtpError, setIsOtpModalOpen, clearAuthState, setLoggedIn, logout } = authSlice.actions;

export default authSlice.reducer;
