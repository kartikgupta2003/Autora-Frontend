import React, { useState, useEffect } from "react";
import { useFilter } from "./FilterContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import { Info , ChevronLeft , ChevronRight} from "lucide-react";
import CarCard from "./CarCard";
import { Button } from "../components/ui/button";

const CarListing = () => {
    const { make, bodyType, fuelType, transmission, priceRange, sortBy , search , setSearch} = useFilter();
    const [currPage, setCurrPage] = useState(1);
    const [fetchedCars, setFetchedCars] = useState([]);
    const [totalCars, setTotalCars] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const limit = 6;
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const token = await getToken();
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                // console.log(priceRange);

                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/showCars/fetchCar?search=${search}&make=${make}&bodyType=${bodyType}&fuelType=${fuelType}&transmission=${transmission}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&sortBy=${sortBy}&page=${currPage}&limit=${limit}`, config);

                setFetchedCars(data?.serializedCars);
                setTotalCars(data?.totalCars);
                setTotalPages(data?.totalPages);

                // console.log("cars ka data ", data);
                setLoading(false);

            } catch (err) {
                setLoading(false);
                return toast.error(err.response.data.message);
            }
        }

        fetchCars();
    }, [make, bodyType, fuelType, transmission, priceRange, sortBy, currPage , search]);

    if (loading) return "Loading...";

    if (fetchedCars.length === 0) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Info className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">No cars found</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                    We couldn't find any cars matching your search criteria. Try adjusting
                    your filters or search term.
                </p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                    Showing <span className="font-medium">
                        {((currPage - 1) * limit) + 1}-{((currPage - 1) * limit) + fetchedCars.length}
                    </span> of <span className="font-medium">{totalCars}</span> cars
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fetchedCars.map((car) => {
                    return (
                        <CarCard key={car._id} car={car} />
                    )
                })}
            </div>
            <div className="mt-4">
                <div className="flex justify-center gap-2 items-center">
                    <ChevronLeft/>
                    <Button variant={"outline"}
                    onClick={()=>{
                        setCurrPage((prev)=>{
                            return (prev-1)
                        })
                    }}
                    disabled={(currPage === 1)}>Previous</Button>
                    <Button variant={"outline"}
                    onClick={()=>{
                        setCurrPage((prev)=>{
                            return (prev+1)
                        })
                    }}
                    disabled={(currPage === totalPages)}>Next</Button>
                    <ChevronRight />
                </div>
            </div>
        </div>
    )
}

export default CarListing;