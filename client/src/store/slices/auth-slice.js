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
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isLoggedIn = false;
                state.error = action.payload;
            });
    },
});

export const { setOtp, setOtpError, setIsOtpModalOpen, clearAuthState, setLoggedIn } = authSlice.actions;

export default authSlice.reducer;
