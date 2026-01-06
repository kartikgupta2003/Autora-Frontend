import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import CarDetails from "../Utils/CarDetails";

const ShowACarPage = () => {
    const { id } = useParams();
    const [carData, setCarData] = useState({});
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const token = await getToken();
                // console.log("secret ", token);
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                };

                const { data } = await axios.get(`http://localhost:8000/api/showCars/getCar?id=${id}`, config);

                // console.log("car ka info show a car page pe ", data);
                setCarData(data);
            } catch (err) {
                // console.log(err);
                // window.scrollTo({ top: 0, behavior: "smooth" });
                return toast.error(err.response.data.message);
            }
        }

        fetchCarData();
    }, []);

    if(Object.keys(carData).length === 0){
        return <div className="mt-20 text-center">Loading...</div>
    }

    return (
        <div className="mt-20 container mx-auto px-4 py-12">
            <CarDetails car={carData} testDriveInfo={carData.testDriveInfo}/>
        </div>
    )
}

export default ShowACarPage;