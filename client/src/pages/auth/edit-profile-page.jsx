import { FormImageComponent, FormInputComponent, FormLabelComponent } from "@/component/form/form-component";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { authSvc } from "./auth-service";
import { LoadingBtnComponent, SubmitButtonComponent } from "@/component/buttons/button-state-component";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loggedInUser, updateUserProfile } from "@/store/slices/auth-slice";

const EditProfilePage = () => {
    const dispatch = useDispatch();
    const { user: currentUser, loading } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [image, setImage] = useState(currentUser?.image || "");
    const [isModified, setIsModified] = useState(false);

    const userUpdateDTO = Yup.object().shape({
        fullName: Yup.string()
            .matches(/^([A-Za-z]+(?:\s[A-Za-z]+){1,2})$/, "Full name must contain first name and last name")
            .nullable(),
        phoneNumber: Yup.string()
            .matches(/^\+977-?(98\d{8})$/, "Invalid Nepali phone format")
            .nullable(),
        email: Yup.string().email("Invalid email format").nullable(),
        oldPassword: Yup.string().nullable(),
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
        defaultValues: {
            fullName: currentUser?.fullName || "",
            phoneNumber: currentUser?.phoneNumber || "",
            email: currentUser?.email || "",
        },
    });

    // Initialize form with user data
    useEffect(() => {
        if (!currentUser) {
            dispatch(loggedInUser());
        } else {
            setValue("fullName", currentUser.fullName);
            setValue("phoneNumber", currentUser.phoneNumber);
            setValue("email", currentUser.email);
            setImage(currentUser.image);
        }
    }, [currentUser, dispatch, setValue]);

    const profileUpdateAction = async (formData) => {
        const updateData = { ...formData };

        // Only include image if it's a File (new upload)
        if (image instanceof File) {
            updateData.image = image;
        }

        // Validate old password if changing password
        if (updateData.password && !updateData.oldPassword) {
            setError("oldPassword", { message: "Old password is required" });
            return;
        }

        try {
            await dispatch(updateUserProfile(updateData)).unwrap();
            toast.success("Profile updated successfully");
            navigate("/home");
        } catch (error) {
            if (error.message === "Incorrect old password") {
                setError("oldPassword", { message: error.message });
            } else {
                toast.error(error.message || "Update failed");
            }
        }
    };

    // Watch form changes for modification detection
    const formValues = watch();
    useEffect(() => {
        const isModified =
            formValues.fullName !== currentUser?.fullName ||
            formValues.phoneNumber !== currentUser?.phoneNumber ||
            formValues.email !== currentUser?.email ||
            image instanceof File || // New image uploaded
            !!formValues.password ||
            !!formValues.oldPassword;

        setIsModified(isModified);
    }, [formValues, image, currentUser]);

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

export default EditProfilePage;
