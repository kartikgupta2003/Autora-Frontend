import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SavedCarList from "../Utils/SavedCarList";

const SavedCarsPage = () => {
    const { isSignedIn, userId, getToken , isLoaded} = useAuth();
    const navigate = useNavigate();
    const [savedCars , setSavedCars] = useState([]);
    const [refresh , setRefresh] = useState(false);

    useEffect(() => {

        if(!isLoaded) return ;
        // Clerk auth async hota hai , Refresh ke baad isSignedIn 1 second ke liye false/undefined hota hai
        // to wo page ko refresh karne pe sign-in pe navigate karwata hi chahe user logged in hi kyu na hota 

        if (!isSignedIn) {
            navigate("/sign-in");
        }

        const fetchSavedCars = async () => {
            try {
                const token = await getToken();

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                };
                const { data } = await axios.get("https://autora-backend.vercel.app/api/showCars/fetchSavedCars", config);

                // console.log(data);
                setSavedCars(data);

            } catch (err) {
                return toast.error(err.response.data.message);
            }
        }

        fetchSavedCars();

    }, [isLoaded , isSignedIn , refresh]);


    return (
        <div className="container mx-auto px-4 py-12 pt-20">
            <h1 className="text-6xl mb-6 text-center">Your Saved Cars</h1>
            <SavedCarList initialData={savedCars} setRefresh={setRefresh}/>
        </div>
    )

}

export default SavedCarsPage;