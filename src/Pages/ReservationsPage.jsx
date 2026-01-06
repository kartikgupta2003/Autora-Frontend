import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReservationsList from "../Utils/ReservationsList";

const ReservationsPage = () => {
    const { isSignedIn, userId, getToken, isLoaded } = useAuth();
    const [userReservations, setUserReservations] = useState(null);
    const [refresh , setRefresh] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn) {
            navigate("/sign-in");
        }

        const fetchReservations = async () => {
            try {
                const token = await getToken();
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                };
                const { data } = await axios.get("https://autora-backend.vercel.app/api/test-drive/fetch", config);

                setUserReservations(data);
            } catch (err) {
                // console.log(err);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return toast.error(err.response.data.message);
            }
        }

        fetchReservations();

    }, [isLoaded, isSignedIn , refresh])
    return (
        <div className="container mx-auto px-4 py-12 pt-20">
            <h1 className="text-6xl mb-6">Your Reservations</h1>
            <ReservationsList initialData={userReservations} setRefresh={setRefresh}/>
        </div>
    )
}

export default ReservationsPage;


