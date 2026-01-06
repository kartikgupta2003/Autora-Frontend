import React, { useState, useCallback } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Camera, Upload } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";


const HomeSearch = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [isImageSearchActive, setIsImageSearchActive] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const [searchImage, setSearchImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                toast.error("Image size must be less than 5MB");
                return;
            }

            setIsUploading(true);
            setSearchImage(file);

            const reader = new FileReader();

            reader.onloadend = () => {
                setImagePreview(reader.result);
                setIsUploading(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
                toast.success("Image uploaded successfully");
            }

            reader.onerror = () => {
                setIsUploading(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
                toast.error("Failed to read the image");
            }

            reader.readAsDataURL(file);
            setIsUploading(false);
        }
    }, [])
    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png"]
        },
        maxFiles: 1
    })

    const handleTextSubmit = (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            toast.error("Please enter a search term");
            return;
        }

        const cleanedSearch = searchTerm.trim().replace(/\s+/g, " ");
        navigate(`/cars?search=${encodeURIComponent(cleanedSearch)}`);
        // It is used to safely encode special characters (spaces, &, /, etc.) inside query parameters.
    }
    const handleImageSearch = async (e) => {
        e.preventDefault();

        if (!searchImage) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            toast.error("Please upload an image first");
            return;
        }

        // ai search logic 

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
            formData.append("image", searchImage);
            const { data } = await axios.post("http://localhost:8000/api/user/searchImage", formData, config);

            setIsLoading(false);
            navigate(`/cars?make=${data?.make}&bodyType=${data.bodyType}&color=${data.color}`);
        } catch (err) {
            setIsLoading(false);
            return toast.error("Failed to analyze image: " + err.response.data.message);
        }
    }


return (
    <div>
        <form onSubmit={handleTextSubmit}>
            <div className="relative flex items-center justify-between">
                <Input
                    type="text"
                    placeholder="Enter make , model , or use our AI image Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={"pl-10 pr-12 py-6 w-full rounded-full border-gray-300 bg-white/95 backdrop-blur-sm"} />
                <div>
                    <Camera size={35}
                        onClick={() => setIsImageSearchActive(!isImageSearchActive)}
                        className="cursor-pointer rounded-xl p-1.5"
                        style={{
                            color: "white"
                        }} />
                </div>
                <Button type="submit" className={"rounded-full cursor-pointer"}>Search</Button>
            </div>
        </form>
        {isImageSearchActive && <div className="mt-4">
            <form onSubmit={handleImageSearch}>
                <div className="border-2 border-dashed border-gray-300 rounded-3xl p-6">{imagePreview ? <div>
                    <img
                        src={imagePreview}
                        alt="Car preview"
                        className="h-40 object-contain mb-4"></img>
                    <Button
                        className={"cursor-pointer"}
                        variant="outline"
                        onClick={() => {
                            setSearchImage(null);
                            setImagePreview("");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            toast.info("Image removed");
                        }}>
                        Remove Image
                    </Button>
                </div> : (
                    <div {...getRootProps()} className="cursor-pointer">
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center">
                            <Upload className="h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-gray-500 mb-2">
                                {
                                    isDragActive && !isDragReject
                                        ? "Leave the file here to upload"
                                        : "Drag & drop a car image or click to select"
                                }
                            </p>
                            {isDragReject && (
                                <p className="text-red-500 mb-2">Invalid image type</p>
                            )

                            }
                            <p className="text-gray-400 text-sm">
                                Supports : JPG , PNG (max 5MB)
                            </p>
                        </div>
                    </div>
                )}</div>
                {imagePreview && <Button
                    type="submit"
                    className={"w-full mt-2 cursor-pointer"}
                    disabled={isLoading}>{isLoading ? "Searching..." : "Search with this Image"}</Button>}
            </form>
        </div>}
    </div>
)
}

export default HomeSearch;