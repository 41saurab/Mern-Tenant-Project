import { FormDropdownComponent, FormImageComponent, FormInputComponent, FormLabelComponent, FormRadioComponent } from "@/component/form/form-component";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { setErrorInfo } from "@/helper/helper";
import { useEffect, useRef, useState } from "react";
import { authSvc } from "./auth-service";
import { LoadingBtnComponent, SubmitButtonComponent } from "@/component/buttons/button-state-component";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

let currentOTPIndex = 0;
const RegisterPage = () => {
    const [image, setImage] = useState();
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
    const [isModified, setIsModified] = useState(false);
    const [user, setUser] = useState({});

    const userUpdateDTO = Yup.object().shape({
        fullName: Yup.string().matches(/^([A-Za-z]+(?:\s[A-Za-z]+){1,2})$/, {
            message: "Full name must contain at least a first name and last name, and can optionally include a middle name. Only letters are allowed.",
            excludeEmptyString: true,
        }),
        phoneNumber: Yup.string().matches(/^\+977-?(98\d{8})$/, {
            message: "Phone number must follow the Nepali format, starting with +977 and followed by 10 digits (e.g., +9779801234567).",
        }),
        email: Yup.string().email("A valid email address is required (e.g., example@domain.com)."),
        oldPassword: Yup.string(),
        password: Yup.string()
            .matches(
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%&+-^])(?=.*[\d])[A-Za-z\d!@#$%&+-^]{8,25}$/,
                "Password must be 8-25 characters with uppercase, lowercase, number, and special character."
            )
            .nullable(),
    });

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
        watch,
    } = useForm({
        resolver: yupResolver(userUpdateDTO),
    });

    const gerUserDetailById = async () => {
        setLoading(true);
        try {
            const response = await authSvc.getLoggedInUserDetails(params.id);

            setUser(response.data);

            setValue("fullName", response.data.fullName);
            setValue("phoneNumber", response.data.phoneNumber);
            setValue("email", response.data.email);
            setImage(response.data.image);
        } catch (error) {
            toast.error("User can not be fetched");
            navigate("/home");
        } finally {
            setLoading(false);
        }
    };

    const profileUpdateAction = async (data) => {
        setLoading(true);
        data.image = image; // Include image if updated

        // Remove `image` field if it's unchanged
        if (typeof data.image === "string") {
            delete data.image;
        }

        // Ensure oldPassword is included only if password is provided
        if (data.password && !data.oldPassword) {
            setError("oldPassword", { message: "Old password is required" });
            setLoading(false);
            return;
        }

        try {
            await authSvc.updateUser(params.id, data);
            toast.success("Profile updated successfully");
            navigate("/home");
        } catch (exception) {
            if (exception?.response?.data?.message === "Incorrect old password") {
                setError("oldPassword", { message: "Incorrect old password" });
            } else {
                setErrorInfo(exception, setError);
            }
        } finally {
            setLoading(false);
        }
    };

    const watchFields = watch();

    useEffect(() => {
        console.log("Form Values:", watchFields);
        const isFormModified =
            watchFields.fullName !== user.fullName ||
            watchFields.phoneNumber !== user.phoneNumber ||
            watchFields.email !== user.email ||
            image !== user.image ||
            !!watchFields.password || // If the password field has any value
            !!watchFields.oldPassword;

        setIsModified(isFormModified);
    }, [watchFields, image, user]);

    useEffect(() => {
        gerUserDetailById();
    }, []);

    return (
        <>
            <div className="flex w-full items-center justify-center bg-gray-50 dark:bg-gray-900 py-3 px-4">
                <div className="w-full max-w-3xl rounded-lg bg-white shadow-2xl ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Update Account</h2>
                    </div>
                    <div className="px-8 py-3">
                        <form onSubmit={handleSubmit(profileUpdateAction)} className="grid gap-5">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div>
                                        <FormLabelComponent htmlFor="fullName" label="Full Name" />
                                        <FormInputComponent
                                            type="text"
                                            name="fullName"
                                            placeholder="Enter your full name"
                                            control={control}
                                            errorMsg={errors?.fullName?.message}
                                            className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        />
                                    </div>

                                    <div>
                                        <FormLabelComponent htmlFor="oldPassword" label="Old Password" />
                                        <FormInputComponent
                                            type="password"
                                            name="oldPassword"
                                            placeholder="Enter old password"
                                            control={control}
                                            errorMsg={errors?.oldPassword?.message}
                                            className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        />
                                    </div>

                                    <div>
                                        <FormLabelComponent htmlFor="phoneNumber" label="Phone" />
                                        <FormInputComponent
                                            type="tel"
                                            name="phoneNumber"
                                            placeholder="+977-98XXXXXXXX"
                                            control={control}
                                            errorMsg={errors?.phoneNumber?.message}
                                            className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div>
                                        <FormLabelComponent htmlFor="email" label="Email" />
                                        <FormInputComponent
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            control={control}
                                            errorMsg={errors?.email?.message}
                                            className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        />
                                    </div>

                                    <div>
                                        <FormLabelComponent htmlFor="password" label="New password" />
                                        <FormInputComponent
                                            type="password"
                                            name="password"
                                            placeholder="Enter new password"
                                            control={control}
                                            errorMsg={errors?.password?.message}
                                            className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        />
                                    </div>

                                    <div>
                                        <FormLabelComponent htmlFor="image" label="Profile Picture" />
                                        <FormImageComponent thumb={image} errorMsg={errors?.image?.message} setImage={setImage} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid">{loading ? <LoadingBtnComponent /> : <SubmitButtonComponent disabled={!isModified} label="Update account" />}</div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
