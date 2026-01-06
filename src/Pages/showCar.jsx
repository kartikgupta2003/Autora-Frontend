import React, { useEffect, useState } from "react";
import CarFilters from "../Utils/CarFilters";
import CarListing from "../Utils/CarListing";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import { FilterProvider } from "../Utils/FilterContext.jsx";

const ShowCar = () => {
    const [filtersData, setFiltersData] = useState({});

    const { getToken } = useAuth();

    useEffect(() => {
        const getCarFilters = async () => {
            try {
                const token = await getToken();
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const { data } = await axios.get("https://autora-backend.vercel.app/api/showCars/carFilters", config);

                // console.log("car filters " , data);

                setFiltersData(data.data);
            } catch (err) {
                // console.log(err);
                return toast.error(err.response.data.message);
            }
        }

        getCarFilters();
    }, []);
    return (
        <div className="pt-20 container mx-auto px-4 py-12">
            <h1 className="text-6xl mb-6 text-center">Browse Cars</h1>
            <FilterProvider filters={filtersData}>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-80 shrink-0">
                        {/*prevents the item from shrinking Even if the container becomes smaller, this item keeps its width */}
                        <CarFilters filters={filtersData} />
                    </div>
                    <div className="flex-1">
                        {/* Takes all remaining available space Shrinks when needed* Grows relative to other flex-* items */}
                        <CarListing />
                    </div>
                </div>
            </FilterProvider>

        </div>
    )
}

export default ShowCar;