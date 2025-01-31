import { FormDropdownComponent, FormImageComponent, FormInputComponent, FormLabelComponent, FormRadioComponent } from "@/component/form/form-component";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { setErrorInfo } from "@/helper/helper";
import { useEffect, useRef, useState } from "react";
import { authSvc } from "./auth-service";
import { LoadingBtnComponent, SubmitButtonComponent } from "@/component/buttons/button-state-component";
import { NavLink, useNavigate } from "react-router-dom";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import { toast } from "react-toastify";

let currentOTPIndex = 0;
const RegisterPage = () => {
    const [image, setImage] = useState();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();
    const [openModel, setOpenModel] = useState(false);
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [activeOTPIndex, setActiveOTPIndex] = useState(0);
    const [otpError, setOtpError] = useState(""); // State for OTP error message
    const inputRef = useRef(null);

    const navigate = useNavigate();

    const registerDTO = Yup.object({
        fullName: Yup.string()
            .matches(/^([A-Za-z]+(?:\s[A-Za-z]+){1,2})$/, "Enter a valid full name.")
            .required("Full name is required."),
        email: Yup.string().email("Enter a valid email address.").required("Email is required."),
        phoneNumber: Yup.string()
            .matches(/^\+977-?(98\d{8})$/, "Enter a valid Nepali phone number (+97798XXXXXXXX).")
            .required("Phone number is required."),
        password: Yup.string()
            .matches(
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%&+-^])(?=.*[\d])[A-Za-z\d!@#$%&+-^]{8,25}$/,
                "Password must be 8-25 characters with uppercase, lowercase, number, and special character."
            )
            .required("Password is required."),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords do not match.")
            .required("Confirm password is required."),
        role: Yup.string().oneOf(["admin", "tenant", "landlord"], "Select a valid role.").default("customer").required("Role is required."),
        gender: Yup.string().oneOf(["male", "female", "other"], "Select a valid gender.").required("Gender is required."),
    });

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerDTO),
    });

    const submitRegsiter = async (data) => {
        setLoading(true);
        data.image = image;
        try {
            const response = await authSvc.registerUser(data);

            setUser(response.data);
            setOpenModel(true);
        } catch (exception) {
            setErrorInfo(exception, setError);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e, index) => {
        const data = e.target.value;

        const newOTP = [...otp];
        newOTP[currentOTPIndex] = data.substring(data.length - 1);

        if (!data) {
            setActiveOTPIndex(currentOTPIndex - 1);
        } else {
            setActiveOTPIndex(currentOTPIndex + 1);
        }
        setOtp(newOTP);
    };

    const handleKeyDown = (e, index) => {
        const key = e.key;
        currentOTPIndex = index;
        if (key === "Backspace") {
            setActiveOTPIndex(currentOTPIndex - 1);
        }
    };

    const activateUser = async (e) => {
        e.preventDefault();
        const enteredOTP = otp.join("");

        // Client-side OTP validation
        if (enteredOTP.length < 4 || otp.some((char) => char === "")) {
            setOtpError("Please enter a valid 4-digit OTP.");
            return; // Do not proceed if OTP is invalid
        }

        setLoading(true);
        try {
            const response = await authSvc.activateUserByOtp({
                otp: enteredOTP,
                email: user.email,
            });

            toast.success("Your account has been activated. Please log in to continue.");
            navigate("/login");
        } catch (error) {
            setOtpError("Invalid OTP. Please try again.");
            setOpenModel(true);
        } finally {
            setLoading(false);
        }
    };

    const checkLogin = () => {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                toast.info("You are already logged in!");
                navigate("/home");
            }
        } catch (exception) {
            setErrorInfo(exception);
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOTPIndex]);

    useEffect(() => {
        const token = localStorage.getItem("token") || null;
        if (token) {
            checkLogin();
        }
    }, []);

    return (
        <>
            <div className="flex min-h-svh w-full items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
                <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
                    <div className="border-b border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Create Account</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Fill in your details to get started</p>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit(submitRegsiter)} className="grid gap-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-3">
                                    <div>
                                        <FormLabelComponent htmlFor="fullName" label="Full name" />
                                        <FormInputComponent type="text" name="fullName" placeholder="Enter your full name" control={control} errorMsg={errors?.fullName?.message} />
                                    </div>

                                    <div>
                                        <FormLabelComponent htmlFor="password" label="Password" />
                                        <FormInputComponent type="password" name="password" placeholder="Enter password" control={control} errorMsg={errors?.password?.message} />
                                    </div>

                                    <div>
                                        <FormLabelComponent htmlFor="phoneNumber" label="Phone" />
                                        <FormInputComponent type="tel" name="phoneNumber" placeholder="+977-98XXXXXXXX" control={control} errorMsg={errors?.phoneNumber?.message} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <FormLabelComponent htmlFor="email" label="Email" />
                                        <FormInputComponent type="email" name="email" placeholder="Enter your email" control={control} errorMsg={errors?.email?.message} />
                                    </div>

                                    <div>
                                        <FormLabelComponent htmlFor="confirmPassword" label="Confirm password" />
                                        <FormInputComponent
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Enter confirm password"
                                            control={control}
                                            errorMsg={errors?.confirmPassword?.message}
                                        />
                                    </div>

                                    <div>
                                        <FormLabelComponent htmlFor="role" label="Role" />
                                        <FormDropdownComponent
                                            name="role"
                                            control={control}
                                            errorMsg={errors?.role?.message}
                                            defaultValue={null}
                                            options={[
                                                { label: "Tenant", value: "tenant" },
                                                { label: "Landlord", value: "landlord" },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <FormLabelComponent htmlFor="image" label="Profile picture" />
                                    <FormImageComponent errorMsg={errors?.image?.message} setImage={setImage} />
                                </div>

                                <div>
                                    <FormLabelComponent htmlFor="gender" label="Gender" />
                                    <div className="mt-1 flex items-center gap-4">
                                        <FormRadioComponent
                                            name="gender"
                                            control={control}
                                            errorMsg={errors?.gender?.message}
                                            defaultValue={null}
                                            options={[
                                                { label: "Male", value: "male" },
                                                { label: "Female", value: "female" },
                                                { label: "Other", value: "other" },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid">{loading ? <LoadingBtnComponent /> : <SubmitButtonComponent label="Create account" />}</div>
                            <div className=" text-center text-sm">
                                Already have an account?{" "}
                                <NavLink to={"/login"} className="underline underline-offset-4">
                                    Login
                                </NavLink>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <AlertDialog open={openModel} onOpenChange={setOpenModel}>
                <AlertDialogContent className="w-fit">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Enter OTP to activate account</AlertDialogTitle>
                        <div className="flex flex-col items-center">
                            <div className="flex">
                                {otp.map((_, index) => (
                                    <div key={index}>
                                        <input
                                            ref={index === activeOTPIndex ? inputRef : null}
                                            onChange={handleChange}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            value={otp[index]}
                                            type="text"
                                            id="otp"
                                            name="otp"
                                            className={`w-14 h-14 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl mx-1 ${
                                                otp[index] === "" ? "border-red-500 focus:border-red-500" : "border-gray-400 focus:border-gray-900"
                                            } focus:text-gray-700 text-gray-400`}
                                        />
                                    </div>
                                ))}
                            </div>
                            {otpError && <p className="mt-2 text-sm text-red-500">{otpError}</p>}
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
                        <AlertDialogAction className="w-full" onClick={activateUser}>
                            {loading ? <LoadingBtnComponent /> : "Activate"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default RegisterPage;
