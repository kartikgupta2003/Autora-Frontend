import React, { useState, useCallback } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
// Creates and manages a form using React Hook Form
import { zodResolver } from "@hookform/resolvers/zod";
// Connects Zod validation schema to React Hook Form, so Zod controls validation rules.

// react-hook-form is a popular library for building and managing forms in React. It is fast , works well with validation libraries like Zod , and we donot need to manually track state for every I/P.
// Zod is a TypeScript-first schema validation library. It allows you to validate form data, checking rules like:- Required fields , Number ranges etc  

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { useDropzone } from 'react-dropzone';
import { toast } from "react-toastify";
import { Camera, Loader2, Upload } from "lucide-react";
import { X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Loader } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

// Predefined options
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
const bodyTypes = [
    "SUV",
    "Sedan",
    "Hatchback",
    "Convertible",
    "Coupe",
    "Wagon",
    "Pickup",
];
const carStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

const AddCarForm = ({ index, setIndex }) => {
    const [activeTab, setActiveTab] = useState("ai");
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [imageStrings, setImageStrings] = useState([]);
    const [uploadedAiImage, setUploadedAiImage] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageError, setImageError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { getToken } = useAuth();

    const onAiSearch = async () => {
        if (!uploadedAiImage) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.error("Please upload an image to search");
        }

        try {
            setIsLoading(true);
            const token = await getToken();
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            };
            const formData = new FormData();
            formData.append("image", uploadedAiImage);
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/processImage/ai`, formData, config);

            // console.log(data);

            setUploadedImages((prev) => [...prev, uploadedAiImage]);

            const reader = new FileReader();
            reader.onload = (e) => {
                setImageStrings((prv) => [...prv, e.target.result]);
            }
            reader.readAsDataURL(uploadedAiImage);

            setIsLoading(false);
            setImagePreview(null)
            setUploadedAiImage(null)

            setValue("make", data.make);
            setValue("model", data.model);
            setValue("year", data.year);
            setValue("color", data.color);
            setValue("bodyType", data.bodyType);
            setValue("fuelType", data.fuelType);
            setValue("price", data.price);
            setValue("mileage", data.mileage);
            setValue("transmission", data.transmission);
            setValue("description", data.description);


            toast.success("Successfully extracted car details", {
                description: `Detected ${data.year} ${data.make} ${data.model} with ${Math.round(data.confidence * 100)}% confidence`
            });

            setActiveTab("manual");

        } catch (err) {
            setIsLoading(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.error(err.response.data.message);
        }
    }

    // Handle AI image upload with Dropzone
    const onAiDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            toast.error("Image size should be less than 5MB");
            return;
        }

        if (file.type === "image/avif") {
            toast.error("AVIF images are not supported. Please upload JPG, PNG, or WebP.");
            return;
        }

        if (file.type === "image/heic" || file.type === "image/heif") {
            toast.error("HEIC images are not supported. Please upload JPG or PNG.");
            return;
        }



        setUploadedAiImage(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
            toast.success(`Image uploaded successfully`);
        };
        reader.readAsDataURL(file);
    }, []);

    const { getRootProps: getAiRootProps, getInputProps: getAiInputProps } =
        useDropzone({
            onDrop: onAiDrop,
            accept: {
                "image/*": [".jpeg", ".jpg", ".png", ".webp"],
            },
            maxFiles: 1,
            multiple: false,
        });

    // Handle multiple image uploads with Dropzone
    const onMultiImagesDrop = useCallback((acceptedFiles) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];
        const validFiles = acceptedFiles.filter((file) => {
            if (!allowedTypes.includes(file.type)) {
                toast.error(
                    `${file.name} has unsupported format (${file.type}). Please upload JPG, PNG, or WebP.`
                );
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                toast.error(`${file.name} exceeds 5MB limit and will be skipped`);
                return false;
            }
            return true;
        });


        if (validFiles.length === 0) return;

        setUploadedImages((prev) => [...prev, ...validFiles]);

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);

                // Process the images
                const newImages = [];
                validFiles.forEach((file) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        newImages.push(e.target.result);

                        // When all images are processed
                        if (newImages.length === validFiles.length) {
                            setImageStrings((obj) => [...obj, newImages])
                            setUploadProgress(0);
                            setImageError("");
                            toast.success(
                                `Successfully uploaded ${validFiles.length} images`
                            );
                        }
                    };
                    reader.readAsDataURL(file);
                });
            }
        }, 200);
    }, []);

    const {
        getRootProps: getMultiImageRootProps,
        getInputProps: getMultiImageInputProps,
    } = useDropzone({
        onDrop: onMultiImagesDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".webp"],
        },
        multiple: true,
    });


    // Remove image from upload preview
    const removeImage = (index) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
        setImageStrings((prev) => prev.filter((_, i) => i !== index));
    };

    const carFormSchema = z.object({
        make: z.string().min(1, "Make is required"),
        // .string() => must be a string
        // .min(1) => minimum length
        // "error message"	message shown when validation fails
        model: z.string().min(1, "Model is required"),
        year: z.string().refine((val) => {
            // refine() lets you write custom validation logic. val is the input value (string entered by user).
            const year = parseInt(val);
            return (
                !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1
                //Ensures the value is actually a number           Year must be less than or equal to next year
            )
        }, "Valid year required"),
        price: z.string().min(1, "Price is required"),
        mileage: z.string().min(1, "Mileage is required"),
        color: z.string().min(1, "Color is required"),
        fuelType: z.string().min(1, "Fuel Type is required"),
        transmission: z.string().min(1, "Transmission is required"),
        bodyType: z.string().min(1, "Body type is required"),
        seats: z.string().optional(),
        description: z.string().min(10, "Description must be atleast 10 characters"),
        status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"]),
        featured: z.boolean().default(false)
    })

    const {
        register,
        // Connects input fields to form
        setValue,
        // Update a field programmatically (manually)
        getValues,
        // Read current form values
        formState: { errors, isSubmitting },
        // Access validation error messages
        handleSubmit,
        // Wraps submission logic
        watch,
        // Observe value changes in real time ,
        reset
    } = useForm({
        resolver: zodResolver(carFormSchema),
        // This tells React Hook Form: Validate all fields using the Zod schema
        defaultValues: {
            make: "",
            model: "",
            year: "",
            price: "",
            mileage: "",
            color: "",
            fuelType: "",
            transmission: "",
            bodyType: "",
            seats: "",
            description: "",
            status: "AVAILABLE",
            featured: false,
        },
    })

    const onSubmit = async (inputData) => {
        if (uploadedImages.length === 0) {
            setImageError("Please upload at least one image");
            return;
        }

        // console.log(inputData);

        const formData = new FormData();

        uploadedImages.forEach((img) => {
            formData.append("images", img);
        })

        formData.append("carData", JSON.stringify({
            ...inputData,
            year: Number(inputData.year),
            price: parseFloat(inputData.price),
            mileage: Number(inputData.mileage),
            seats: Number(inputData.seats)
        }));

        // console.log(...formData);

        try {
            const token = await getToken();
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            };
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/car/addCar`, formData, config);

            // console.log(data);

            reset();
            setImageError("");
            setImagePreview(null);
            setUploadedImages([]);
            setImageStrings("");
            setUploadedAiImage(null);
            setUploadProgress(0);


            window.scrollTo({ top: 0, behavior: "smooth" });
            toast.success("Car added successfully");

            setIndex(1);
        } catch (err) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            // toast.error(err.response.data.message);
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong. Please try again.";

            toast.error(message);
        }


    }

    return (
        <div className="mb-4">
            <Tabs defaultValue="ai" className="mt-6" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    <TabsTrigger value="ai">AI Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Car Details</CardTitle>
                            <CardDescription>Enter the deatils of the car you want to add.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="make">Make</Label>
                                        {/* Form label tied to input with id "make" */}
                                        <Input
                                            id='make'
                                            {...register("make")}
                                            // Connects input to react-hook-form validation
                                            placeholder="e.g. Toyota"
                                            className={errors.make ? "border-red-500" : ""} />
                                        {errors.make && (
                                            // Checks if error exists for "make" field
                                            <p className="text-xs text-red-500">{errors.make.message}</p>
                                            // Shows validation error message
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="model">Model</Label>
                                        <Input
                                            id='model'
                                            {...register("model")}
                                            placeholder="e.g. Camry"
                                            className={errors.model ? "border-red-500" : ""} />
                                        {errors.model && (
                                            <p className="text-xs text-red-500">{errors.model.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="year">Year</Label>
                                        <Input
                                            id='year'
                                            {...register("year")}
                                            placeholder="e.g. 2023"
                                            className={errors.year ? "border-red-500" : ""} />
                                        {errors.year && (
                                            <p className="text-xs text-red-500">{errors.year.message}</p>
                                        )}
                                        {/* if you don’t declare type, it defaults to: text */}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price ($)</Label>
                                        <Input
                                            id="price"
                                            {...register("price")}
                                            placeholder="e.g. 25000"
                                            className={errors.price ? "border-red-500" : ""}
                                        />
                                        {errors.price && (
                                            <p className="text-xs text-red-500">
                                                {errors.price.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mileage">Mileage (km/l)</Label>
                                        <Input
                                            id="mileage"
                                            {...register("mileage")}
                                            placeholder="e.g. 15"
                                            className={errors.mileage ? "border-red-500" : ""}
                                        />
                                        {errors.mileage && (
                                            <p className="text-xs text-red-500">
                                                {errors.mileage.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="color">Color</Label>
                                        <Input
                                            id="color"
                                            {...register("color")}
                                            placeholder="e.g. Blue"
                                            className={errors.color ? "border-red-500" : ""}
                                        />
                                        {errors.color && (
                                            <p className="text-xs text-red-500">
                                                {errors.color.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fuelType">Fuel Type</Label>
                                        <Select
                                            onValueChange={(value) => setValue("fuelType", value)}
                                            defaultValue={getValues("fuelType")}>
                                            <SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Select fuel type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {fuelTypes.map((fuel, idx) => {
                                                    return (
                                                        <SelectItem key={idx} value={fuel}>{fuel}</SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        {errors.fuelType && (
                                            <p className="text-xs text-red-500">
                                                {errors.fuelType.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="transmission">Transmission</Label>
                                        <Select
                                            onValueChange={(value) => setValue("transmission", value)}
                                            defaultValue={getValues("transmission")}>
                                            <SelectTrigger className={errors.transmission ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Select transmission" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {transmissions.map((trans, idx) => {
                                                    return (
                                                        <SelectItem key={idx} value={trans}>{trans}</SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        {errors.transmission && (
                                            <p className="text-xs text-red-500">
                                                {errors.transmission.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="transmission">Body Type</Label>
                                        <Select
                                            onValueChange={(value) => setValue("bodyType", value)}
                                            defaultValue={getValues("bodyType")}>
                                            <SelectTrigger className={errors.bodyType ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Select Body Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bodyTypes.map((type, idx) => {
                                                    return (
                                                        <SelectItem key={idx} value={type}>{type}</SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        {errors.bodyType && (
                                            <p className="text-xs text-red-500">
                                                {errors.bodyType.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="seats">Number of seats <span className="text-sm tecxt-gray-500">(optional)</span></Label>
                                        <Input
                                            id="seats"
                                            {...register("seats")}
                                            placeholder="e.g. 5"
                                            className={errors.seats ? "border-red-500" : ""}
                                        />
                                        {errors.seats && (
                                            <p className="text-xs text-red-500">
                                                {errors.seats.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            onValueChange={(value) => setValue("status", value)}
                                            defaultValue={getValues("status")}>
                                            <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {carStatuses.map((type, idx) => {
                                                    return (
                                                        <SelectItem key={idx} value={type}>{type}</SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        {errors.status && (
                                            <p className="text-xs text-red-500">
                                                {errors.status.message}
                                            </p>
                                        )}
                                    </div>


                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        {...register("description")}
                                        placeholder="Enter detailed description of the car..."
                                        className={`min-h-32
                                            ${errors.description ? "border-red-500" : ""}`}
                                    />
                                    {errors.description && (
                                        <p className="text-xs text-red-500">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <Checkbox
                                        id="featured"
                                        checked={watch("featured")}
                                        onCheckedChange={(checked) =>
                                            setValue("featured", checked)
                                        } />
                                    <div className="space-y-1 leading-none">
                                        <label>Feature this Car</label>
                                        <p className="text-sm text-gray-500">Featured cars appear on the homepage</p>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="images"
                                        className={imageError ? "text-red-500" : ""}>Images {imageError && <span className="text-red-500">*</span>}</Label>
                                    <div {...getMultiImageRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center
                                        cursor-pointer hover:bg-gray-50 transition mt-2 ${imageError ? "border-red-500" : "border-gray-300"}`}>
                                        <input {...getMultiImageInputProps()} />
                                        <div className="flex flex-col items-center justify-center">
                                            <Upload className="h-12 w-12 text-gray-400 mb-3" />
                                            <p className="text-gray-600 text-sm">
                                                Drag & drop or click to upload multiple images
                                            </p>

                                            <p className="text-gray-500 text-xs mt-1">
                                                (JPG , PNG , WebP , max 5MB each)
                                            </p>
                                        </div>
                                    </div>
                                    {imageError && (
                                        <p className="text-xs text-red-500 mt-1">{imageError}</p>
                                    )}

                                    {imageStrings.length > 0 && (
                                        <div className="mt-4">
                                            <h3 className="text-sm font-medium mb-2">Uploaded Images ({uploadedImages.length})</h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                                            lg:grid-cols-5 gap-4">
                                                {imageStrings.map((img, idx) => {
                                                    return (
                                                        <div key={idx} className="relative group">
                                                            <img src={img} height={50} width={50} className="h-28 w-full object-cover rounded-md"></img>
                                                            <Button type="button"
                                                                size="icon"
                                                                variant="destructive"
                                                                className="absolute top-1 right-1 h-6 w-6
                                                            opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => removeImage(idx)}><X className="h-3 w-3" /></Button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Button type="submit" className="w-full md:w-auto cursor-pointer"
                                    disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding Car...
                                        </>
                                    ) : ("Add Car")}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="ai" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI-Powered Car Details Extraction</CardTitle>
                            <CardDescription>Upload an image of a car and let AI extract its details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                    {imagePreview ? <div className="flex flex-col items-center">
                                        <img src={imagePreview} className="max-h-56 max-w-full object-contain mb-4"></img>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm"
                                                onClick={() => {

                                                    setImagePreview(null)
                                                    setUploadedAiImage(null)
                                                }}>Remove</Button>
                                            <Button size="sm"
                                                variant="outline"
                                                onClick={onAiSearch}
                                                disabled={isLoading}
                                            >{
                                                    isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : <><Camera className="mr-2 h-4 w-4" />Extract Details</>
                                                }</Button>
                                        </div>
                                    </div> : <div {...getAiRootProps()} className="cursor-pointer hover:bg-gray-50 transition">
                                        <input {...getAiInputProps()} />
                                        <div className="flex flex-col items-center justify-center">
                                            <Camera className="h-12 w-12 text-gray-400 mb-2" />
                                            <p className="text-gray-600 text-sm">
                                                Drag and drop a car image or click to select
                                            </p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                Supports : JPG , PNG , WebP (max 5MB)
                                            </p>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )

}

export default AddCarForm