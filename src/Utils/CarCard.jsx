import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { CarIcon, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import axios from "axios";

const CarCard = ({ car , setRefresh=()=> null}) => {

    const [isSaved, setIsSaved] = useState(car.wishListed);
    const navigate = useNavigate();
    const { getToken, isSignedIn } = useAuth();
    // console.log("car jo ayi " , car);

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

            const {data}= await axios.get(`${import.meta.env.VITE_API_URL}/api/showCars/toggleCar?id=${car._id}` , config);
            // console.log(data);
            setIsSaved((prev)=>{
                return (!prev)
            })
            setRefresh((prev)=> !prev)
            toast.success(data);
            return ;
        } catch (err) {
            // console.log(err);
            return toast.error(err.response.data.message)
        }
    }

    return (
        <Card className="overflow-hidden hover:shadow-lg transition group">
            <div className="relative w-full h-48 overflow-hidden">
                {car.images && car.images.length > 0 ?
                    (<div className="relative w-full h-full">
                        <img src={car.images[0].url} alt={`${car.make} ${car.model}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"></img>
                        {/* object-cover	Image scales to cover container without distortion (cropping edges if needed) */}
                        {/* group-hover:scale-105 On hover (of parent with group class), scale (zoom slightly) to 1.05 = 5% bigger */}
                        {/* transition Enables smooth animation instead of sudden change */}
                        {/* duration-300 Animation lasts 300ms (0.3 seconds) */}
                    </div>) : (<div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <CarIcon className="h-12 w-12 text-gray-400"></CarIcon>
                    </div>)}
                <Button varient="ghost" size="icon" className={`absolute top-2 right-2 bg-white/90 rounded-full p-1.5 
                        ${isSaved ? "text-red-500 hover:text-red-600" : "text-gray-600 hover:text-gray-900"}`}
                    onClick={handleToggleSave}>
                    <Heart className={isSaved ? "fill-current" : ""} size={20}></Heart>
                </Button>
            </div>
            <CardContent className="p-4 lg:mt-4 sm:mt-8">
                <div className="flex flex-col mb-2">
                    <h3 className="text-lg font-bold line-clamp-1">{car.make} {car.model}</h3>
                    <span className="text-xl font-bold text-blue-600">$ {car.price}</span>
                    {/* MongoDB stores decimals as Decimal128. When serialized to JSON, they appear as $numberDecimal objects. */}
                </div>
                <div className="text-gray-600 mb-2 flex items-center">
                    <span>{car.year}</span>
                    <span className="mx-1 font-bold">.</span>
                    <span>{car.transmission}</span>
                    <span className="mx-1 font-bold">.</span>
                    <span>{car.fuelType}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                    <Badge variant="outline" className="bg-gray-50">{car.bodyType}</Badge>
                    <Badge variant="outline" className="bg-gray-50">{car.mileage} km/l</Badge>
                    <Badge variant="outline" className="bg-gray-50">{car.color}</Badge>
                </div>
                <div>
                    <Button onClick={() => navigate(`/cars/${car._id}`)} className="flex-1 cursor-pointer">View Car</Button>
                </div>
            </CardContent>

        </Card>
    )
}

export default CarCard;