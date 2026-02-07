import { Calendar, Car, Currency, Fuel, Gauge, Heart, LocateFixed, MessageSquare } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";
import EmiCalculator from "./EmiCalculator";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format, parseISO } from "date-fns";

const CarDetails = ({ car, testDriveInfo }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishListed, setIsWishListed] = useState(car.wishListed);
    const navigate = useNavigate();
    const { getToken, isSignedIn } = useAuth();

    // console.log("car ka data " , car);

    const handleToggleSave = async (e) => {
        if (!isSignedIn) {
            toast.error("Please sign in to save cars");
            navigate("/sign-in");
            return;
        }

        try {
            const token = await getToken();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };

            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/showCars/toggleCar?id=${car._id}`, config);
            setIsWishListed((prev) => {
                return (!prev)
            })

            toast.success(data);
            return;
        } catch (err) {
            // console.log(err);
            return toast.error(err.response.data.message)
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(amount);
    };

    const handleBookTestDrive = () => {
        if (!isSignedIn) {
            toast.error("Please sign in to save cars");
            navigate("/sign-in");
            return;
        }

        navigate(`/test-drive/${car._id}`);
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-7/12">
                    {/* on larger screens it is going to take 7 out of 12 blocks */}
                    <div className="aspect-video rounded-lg overflow-hidden relative mb-4">{(car.images && car.images.length > 0) ? (
                        <img src={car.images[currentImageIndex].url} className="absolute inset-0 w-full h-full object-cover"></img>
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Car className="h-24 w-24 text-gray-400" />
                        </div>
                    )}</div>
                    {car.images && car.images.length > 1 &&
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {car.images.map((img, idx) => {
                                return (
                                    <div key={idx} className={`relative cursor-pointer rounded-md h-20 w-24 flex-shrink-0 transition ${idx === currentImageIndex ? "border-2 border-blue-600" : "opacity-70 hover:opacity-100"
                                        }`}
                                        onClick={() => setCurrentImageIndex(idx)}>
                                        <img src={img.url} className="absolute inset-0 w-full h-full object-cover"></img>
                                    </div>
                                )
                            })}
                        </div>}

                    <div className="mt-4">
                        <Button
                            variant="outline"
                            className={`flex cursor-pointer items-center gap-2 flex-1 ${isWishListed ? "text-red-500" : ""}`}
                            onClick={handleToggleSave}
                        >
                            <Heart className={`h-5 w-5 ${isWishListed ? "fill-red-500" : ""}`} />
                            {isWishListed ? "Saved" : "Save"}
                        </Button>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between">
                        <Badge className="mb-2">{car.bodyType}</Badge>
                    </div>
                    <h1 className="text-4xl font-bold mb-1">
                        {car.year} {car.make} {car.model}
                    </h1>
                    <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(car.price)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
                        <div className="flex items-center gap-2">
                            <Gauge className="text-gray-500 h-5 w-5" />
                            <span>{car.mileage.toLocaleString()} km/l</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Fuel className="text-gray-500 h-5 w-5" />
                            <span>{car.fuelType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Car className="text-gray-500 h-5 w-5" />
                            <span>{car.transmission}</span>
                        </div>
                    </div>
                    <Dialog>
                        <DialogTrigger className="w-full text-start">
                            <Card>
                                <CardContent className="cursor-pointer">
                                    <div className="flex items-center gap-2 text-lg font-medium mb-2">
                                        <Currency className="h-5 w-5 text-blue-600" />
                                        <h3>EMI Calculator</h3>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Estimated Monthly Payment:{" "}
                                        <span className="font-bold text-gray-900">{formatCurrency(car.price / 60)}</span>{" "}for 60 months
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        *Based on $0 down payment and 4.5% interset rate
                                    </div>
                                </CardContent>
                            </Card>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>EMI Calculator</DialogTitle>
                                <EmiCalculator price={car.price}></EmiCalculator>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <Card className="my-6">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-lg font-medium mb-2">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                                <h3>Have Questions?</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                Our representatives are available to answer all your queries about this vehicle.
                            </p>
                            <a href="mailto:help@autora.in">
                                <Button variant="outline" className={"w-full cursor-pointer"}>
                                    Request Info
                                </Button>
                            </a>
                        </CardContent>
                    </Card>
                    {(car.status === "SOLD" || car.status === "UNAVAILABLE") && (
                        <Alert variant="destructive">
                            <AlertTitle className="capitalize">This car is {car.status.toLowerCase()}</AlertTitle>
                            <AlertDescription>
                                Please check again later.
                            </AlertDescription>
                        </Alert>
                    )}
                    {car.status !== "SOLD" && car.status !== "UNAVAILABLE" && (
                        <Button className={"w-full py-6 text-lg cursor-pointer"}
                            disabled={car.testDriveInfo.userTestDrive}
                            onClick={handleBookTestDrive}>
                            <Calendar className="mr-2 h-5 w-5" />
                            {
                                (car?.testDriveInfo?.userTestDrive?.bookingDate) ? (
                                    `Booked for ${format(
                                        parseISO(car?.testDriveInfo?.userTestDrive?.bookingDate),
                                        "yyyy-MM-dd"
                                    )}`
                                ) : ("Book Test Drive")
                            }
                        </Button>
                    )}
                </div>
            </div>
            <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Description</h3>
                        <p className="whitespace-pre-line text-gray-700">{car.description}</p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Features</h3>
                        <ul className="grid grid-cols-1 gap-2">
                            <li className="flex items-center gap-2">
                                <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                                {car.transmission} Transmission
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                                {car.fuelType} Engine
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                                {car.bodyType} Body Style
                            </li>
                            {Number(car.seats) > 0 && (
                                <li className="flex items-center gap-2">
                                    <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                                    {car.seats} Seats
                                </li>
                            )}
                            <li className="flex items-center gap-2">
                                <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                                {car.color} Exterior
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Specifications</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Make</span>
                            <span className="font-medium">{car.make}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Model</span>
                            <span className="font-medium">{car.model}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Year</span>
                            <span className="font-medium">{car.year}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Body Type</span>
                            <span className="font-medium">{car.bodyType}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Fuel Type</span>
                            <span className="font-medium">{car.fuelType}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Transmission</span>
                            <span className="font-medium">{car.transmission}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Mileage</span>
                            <span className="font-medium">
                                {car.mileage.toLocaleString()} Km/l
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Color</span>
                            <span className="font-medium">{car.color}</span>
                        </div>
                        {Number(car.seats) > 0 && (
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Seats</span>
                                <span className="font-medium">{car.seats}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Dealership Location</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex flex-col md:flex-row gap-6 justify-between">
                        <div className="flex items-start gap-3">
                            <LocateFixed className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium">Autora Motors</h4>
                                <p className="text-gray-600">
                                    {car?.testDriveInfo?.dealerShip?.address || "Not Available"}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    Phone: {car?.testDriveInfo?.dealerShip?.phone || "Not Available"}
                                </p>
                                <p className="text-gray-600">
                                    Email: {car?.testDriveInfo?.dealerShip?.email || "Not Available"}
                                </p>
                            </div>
                        </div>
                        <div className="md:w-1/2 lg:w-1/3">
                            <h4 className="font-medium mb-2">Working Hours</h4>
                            <div>
                                {car?.testDriveInfo?.dealerShip?.workingHours ?
                                    (
                                        car?.testDriveInfo?.dealerShip?.workingHours.map((day) => {
                                            return (
                                                <div key={day.dayOfWeek}
                                                    className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        {day.dayOfWeek.charAt(0) + day.dayOfWeek.slice(1).toLowerCase()}
                                                    </span>
                                                    <span>
                                                        {day.isOpen ? `${day.openTime} - ${day.closeTime}` : "Closed"}
                                                    </span>
                                                </div>)
                                        })
                                    ) : (<></>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarDetails;