import { FormInputComponent, FormLabelComponent } from "@/component/form/form-component";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { setErrorInfo } from "@/helper/helper";
import { useContext, useEffect, useState } from "react";
import { LoadingBtnComponent, SubmitButtonComponent } from "@/component/buttons/button-state-component";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import { authSvc } from "./auth-service";

const LoginPage = () => {
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loginDTO = Yup.object({
        phoneNumber: Yup.string().required("Phone number is required."),
        password: Yup.string().required("Password is required."),
    });

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginDTO),
    });

    const submitLogin = async (data) => {
        setLoading(true);
        try {
            const response = await authSvc.loginUser(data);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("refresh ", response.data.refreshToken);

            auth.setAuth({
                loggedInUser: response.data.detail,
            });

            toast.success("Logged in successfully!");
            navigate("/home");
        } catch (exception) {
            setErrorInfo(exception, setError);
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
            setErrorInfo(exception, setError);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token") || null;
        if (token) {
            checkLogin();
        }
    }, []);

    return (
        <>
            <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 md:p-10">
                <div className="w-full max-w-md rounded-lg bg-white shadow-xl ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
                    <div className="border-b border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Login to Your Account</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit(submitLogin)} className="grid gap-2">
                            <div className="grid grid-cols-1 gap-2">
                                <div>
                                    <FormLabelComponent htmlFor="phoneNumber" label="Phone" />
                                    <FormInputComponent type="tel" name="phoneNumber" placeholder="+977-98XXXXXXXX" control={control} errorMsg={errors?.phoneNumber?.message} />
                                </div>

                                <div>
                                    <FormLabelComponent htmlFor="password" label="Password" />
                                    <FormInputComponent type="password" name="password" placeholder="Enter password" control={control} errorMsg={errors?.password?.message} />
                                </div>
                            </div>

                            <div className="mt-2 grid">{loading ? <LoadingBtnComponent /> : <SubmitButtonComponent label="Login" />}</div>

                            <div className="mt-4 text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <NavLink to={"/sign-up"} className="underline underline-offset-4">
                                    Sign up
                                </NavLink>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
