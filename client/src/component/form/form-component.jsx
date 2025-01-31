import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useController } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const FormLabelComponent = ({ htmlFor, label }) => (
    <Label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
    </Label>
);

export const FormInputComponent = ({ type = "text", name, placeholder = "Enter valid data", control, errorMsg = null }) => {
    const { field } = useController({
        control: control,
        name: name,
    });
    return (
        <div className="relative pb-5">
            <Input
                type={type}
                id={name}
                placeholder={placeholder}
                {...field}
                className={`w-full bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border transition-colors rounded-md 
                    ${
                        errorMsg
                            ? "border-red-500 focus-visible:ring-red-500 dark:border-red-400 dark:focus-visible:ring-red-500"
                            : "border-gray-300 focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                    }`}
            />
            {errorMsg && <span className="absolute bottom-0 left-0 text-xs text-red-600 dark:text-red-400">{errorMsg}</span>}
        </div>
    );
};

export const FormDropdownComponent = ({ name, control, options, errorMsg = null, defaultValue = null, placeholder = "Select a role" }) => {
    const { field } = useController({
        control: control,
        name: name,
        defaultValue: defaultValue,
    });
    return (
        <div className="relative pb-5">
            <Select onValueChange={field.onChange}>
                <SelectTrigger
                    className={`w-full bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border transition-colors rounded-md 
                        ${
                            errorMsg
                                ? "border-red-500 focus-visible:ring-red-500 dark:border-red-400 dark:focus-visible:ring-red-500"
                                : "border-gray-300 focus:ring-primary dark:border-gray-600 dark:focus:ring-primary"
                        }`}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                    {options.map((element, index) => (
                        <SelectItem key={index} value={element.value} className="text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
                            {element.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errorMsg && <span className="absolute bottom-0 left-0 text-xs text-red-600 dark:text-red-400">{errorMsg}</span>}
        </div>
    );
};

export const FormRadioComponent = ({ name, control, options, errorMsg = null, defaultValue = null }) => {
    const { field } = useController({
        name: name,
        control: control,
        defaultValue: defaultValue,
    });
    return (
        <div className="relative pb-5">
            <div className="flex gap-4">
                {options &&
                    options.map((radioOptions, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            <input
                                {...field}
                                id={name + "-" + radioOptions.value}
                                type="radio"
                                value={radioOptions.value}
                                className={`h-4 w-4 text-primary transition-colors dark:bg-gray-800 dark:checked:bg-primary rounded-full 
                                    ${errorMsg ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"}`}
                            />
                            <FormLabelComponent htmlFor={name + "-" + radioOptions.value} label={radioOptions.label} />
                        </div>
                    ))}
            </div>
            {errorMsg && <span className="absolute bottom-0 left-0 text-xs text-red-600 dark:text-red-400">{errorMsg}</span>}
        </div>
    );
};

export const FormImageComponent = ({ setImage, thumb = null, name = "image", errorMsg = null, multiple }) => {
    return (
        <div className="relative pb-5">
            <Input
                multiple={multiple}
                type="file"
                name={name}
                id={name}
                onChange={(e) => {
                    setImage(e.target.files[0]);
                }}
                className={`w-full file:bg-gray-50 file:text-gray-800 hover:file:bg-gray-100 dark:file:bg-gray-800 dark:file:text-gray-100 dark:file:hover:bg-gray-700 border rounded-md 
                    ${
                        errorMsg
                            ? "border-red-500 focus-visible:ring-red-500 dark:border-red-400 dark:focus-visible:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-primary"
                    }`}
            />
            {errorMsg && <span className="absolute bottom-0 left-0 text-xs text-red-600 dark:text-red-400">{errorMsg}</span>}
            {thumb ? (
                <div>
                    <img
                        src={typeof thumb === "string" ? thumb : URL.createObjectURL(thumb)}
                        alt=""
                        className={` ${
                            errorMsg
                                ? "border-red-500 focus-visible:ring-red-500 dark:border-red-400 dark:focus-visible:ring-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-primary"
                        }`}
                    />
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
