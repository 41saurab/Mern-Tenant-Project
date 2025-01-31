import React, { useContext, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormDropdownComponent, FormImageComponent, FormInputComponent, FormLabelComponent } from "@/component/form/form-component";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { setErrorInfo } from "@/helper/helper";
import { roomSvc } from "./room-service";
import { toast } from "react-toastify";
import { PageHeaderNoUnderlineComponent } from "@/component/page-header-component";
import { LoadingBtnComponent } from "@/component/buttons/button-state-component";

const RoomCreatePage = () => {
    const {
        auth: { loggedInUser },
    } = useContext(AuthContext);

    const [images, setImages] = useState();
    const [loading, setLoading] = useState(false);

    const roomCreateDTO = Yup.object({
        title: Yup.string().min(3).required("Title is required"),
        status: Yup.string()
            .matches(/^(available|unavailable)$/, 'Status must be either "available" or "unavailable"')
            .default("available"),
        rentPrice: Yup.number().min(4000).required("Rent price is required"),
        location: Yup.string().required("Location is required"),
        description: Yup.string().nullable().default(null),
        owner: Yup.string().optional().default(loggedInUser._id),
    });

    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        resolver: yupResolver(roomCreateDTO),
    });

    const createAction = async (data) => {
        setLoading(true);
        try {
            let formData = new FormData();

            Object.keys(data).map((key) => {
                formData.append(key, data[key]);
            });

            if (images.length) {
                images.map((img) => {
                    formData.append("images", img, img.filename);
                });
            }

            await roomSvc.createRoom(formData);

            toast.success("Room added successfully");

            navigate("/dashboard/my-rooms");
        } catch (error) {
            // setErrorInfo(error, setError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <div className="border-b mb-4">
                <PageHeaderNoUnderlineComponent label={"Add new room"} />
            </div>
            <div className="max-w-full">
                <form onSubmit={handleSubmit(createAction)} className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
                    <div className="space-y-6">
                        <div>
                            <FormLabelComponent htmlFor="title" label="Room Title" />
                            <FormInputComponent name="title" control={control} placeholder="Enter room title" errorMsg={errors?.title?.message} className="w-full" />
                        </div>

                        <div>
                            <FormLabelComponent htmlFor="rentPrice" label="Rent Price" />
                            <FormInputComponent
                                name="rentPrice"
                                control={control}
                                type="number"
                                placeholder="Enter rent price"
                                errorMsg={errors?.rentPrice?.message}
                                className="w-full "
                            />
                        </div>

                        <div>
                            <FormLabelComponent htmlFor="description" label="Room Description" />
                            <Textarea
                                id="description"
                                placeholder="Enter room description"
                                className="w-full resize-none bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border transition-colors rounded-md"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <FormLabelComponent htmlFor="status" label="Room Status" />
                            <FormDropdownComponent
                                control={control}
                                name={"status"}
                                placeholder="Select room status"
                                errorMsg={errors?.status?.message}
                                defaultValue={"available"}
                                options={[
                                    { label: "Available", value: "available" },
                                    { label: "Unavailable", value: "unavailable" },
                                ]}
                            />
                        </div>

                        <div>
                            <FormLabelComponent htmlFor="location" label="Room Location" />
                            <FormInputComponent name="location" control={control} placeholder="Enter room location" errorMsg={errors?.location?.message} className="w-full" />
                        </div>

                        <div>
                            <FormLabelComponent htmlFor="images" label="Images" />
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        onChange={(e) => setImages(Object.values(e.target.files))}
                                        id="images"
                                        name="images"
                                        multiple
                                        type="file"
                                        className={`block w-full text-sm text-gray-900  border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 border-0 outline-none p-5`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2">
                        {loading ? (
                            <LoadingBtnComponent />
                        ) : (
                            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark">
                                Add Room
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomCreatePage;
