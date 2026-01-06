import { Calendar } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import TestDriveCard from "./TestDriveCard";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

const ReservationsList = ({ initialData , setRefresh}) => {
    const [upComingBookings, setUpComingBookings] = useState(null);
    const [pastBookings, setPastBookings] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const navigate = useNavigate();
    const { getToken } = useAuth();


    const handleCancelBooking = async (id) => {
        try {
            setCancelling(true);
            const token = await getToken();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
            // console.log("token" , token);
            const { data } = await axios.get(`https://autora-backend.vercel.app/api/test-drive/delete?id=${id}`,config);

            setCancelling(false);
            setRefresh((prev)=> !prev);
            // window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.success(data?.message);

        } catch (err) {
            setCancelling(false);
            // console.log(err);
            // window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.error(err.response.data.message);
        }
    }

    useEffect(() => {
        if (initialData) {
            const comingBookings = initialData.filter((booking) => {
                return (
                    (booking.status === "PENDING" || booking.status === "CONFIRMED")
                )
            })


            const prevBookings = initialData.filter((booking) => {
                return (
                    (booking.status === "COMPLETED" || booking.status === "CANCELLED" || booking.status === "NO_SHOW")
                )
            })

            setUpComingBookings(comingBookings);
            setPastBookings(prevBookings);
        }
    }, [initialData]);

    // console.log("upcoming ", upComingBookings);
    // console.log("past " , pastBookings);

    if (!initialData || initialData.length === 0) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-gray-50">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Reservations Found</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                    You don't have any test drive reservations yet. Browse our cars and book a test drive to get started.
                </p>
                <Button variant="default" onClick={() => navigate("/cars")} className={"cursor-pointer"}>
                    Browse Cars
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-4">Upcoming Test Drives</h2>
                {(upComingBookings && upComingBookings.length > 0) ? (<div className="space-y-3">
                    {upComingBookings.map((booking) => {
                        return (
                            <TestDriveCard
                                key={booking.id}
                                booking={booking}
                                onCancel={handleCancelBooking}
                                isCancelling={cancelling}
                                showActions>

                            </TestDriveCard>
                        )
                    })}
                </div>) : ((<p className="text-gray-500 italic">No upcoming test drives.</p>))}
            </div>
            {(pastBookings && pastBookings.length > 0) ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Past Test Drives</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pastBookings.map((booking) => {
                            return(
                                <TestDriveCard key={booking.id}
                                booking={booking}
                                showActions={false}
                                isPast />
                            )
                            
                        })}
                    </div>
                </div>
            ) : (<></>)}
        </div>
    )
}

export default ReservationsList;