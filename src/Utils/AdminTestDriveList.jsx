import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CalendarRange, Loader2, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import TestDriveCard from "./TestDriveCard.jsx";

const AdminTestDriveList = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [testDrives, setTestDrives] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [cancelling , setCancelling] = useState(false);
    const [refresh , setRefresh] = useState(false);
    const [updatingStatus , setUpdatingStatus] = useState(false);
    const { getToken } = useAuth();


    // console.log("fetching testdrive" , fetching , testDrives);

    const handleSearchSubmit = async(e) => {
        e.preventDefault();

        try {
            setFetching(true);
            const token = await getToken();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/adminDrive/fetchDrives?search=${search}&status=${statusFilter}`, config);

            setTestDrives(data);
            setFetching(false);

            // console.log("data ", data);
        } catch (err) {
            // console.log(err);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.error(err.response.data.message);
        }
    }

    const cancelTestDrive = async(id)=>{
        try{
            setCancelling(true);
            const token = await getToken();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };

            const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/api/test-drive/delete?id=${id}` , config);

            setCancelling(false);
            setRefresh((prev)=> !prev);
            toast.success(data.message);

        }catch(err){
            return toast.error(err.response.data.message);
        }
    }

    const handleUpdateStatus = async(bookingId , newStatus)=>{
        try{
            setUpdatingStatus(true);
            const token = await getToken();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };

            const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/api/adminDrive/updateDrives?id=${bookingId}&status=${newStatus}` , config);

            setRefresh((prev)=> !prev);
            setUpdatingStatus(false);
            toast.success(data.message);
        }catch(err){
            return toast.error(err.response.data.message);
        }
    }

    useEffect(() => {
        const fetchDrives = async () => {
            try {
                if(statusFilter === "all"){
                    setStatusFilter("");
                }
                const token = await getToken();
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/adminDrive/fetchDrives?search=${search}&status=${statusFilter}`, config);

                setTestDrives(data);

                // console.log("data ", data);
            } catch (err) {
                // console.log(err);
                window.scrollTo({ top: 0, behavior: "smooth" });
                return toast.error(err.response.data.message);
            }
        }

        fetchDrives();

    }, [search, statusFilter , refresh]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full items-start">
                <Select value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-48">
                    <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        <SelectItem value="NO_SHOW">No Show</SelectItem>
                    </SelectContent>
                </Select>
                <form onSubmit={handleSearchSubmit} className="flex w-full">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Search by car or customer..."
                            className={"pl-9 w-full"}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}>
                        </Input>
                    </div>
                    <Button type="submit" className="ml-2 cursor-pointer" disabled={fetching}>
                        Search
                    </Button>
                </form>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarRange className="h-5 w-5" />Test Drive Bookings</CardTitle>
                    <CardDescription>Manage all test drive reservations and update their status</CardDescription>
                </CardHeader>
                <CardContent>
                    {(fetching) ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : (<div className="space-y-4">
                        {testDrives && testDrives.length > 0 && testDrives?.map((booking) => {
                            return (
                                <div key={booking.id} className="relative">
                                    <TestDriveCard
                                        booking={booking}
                                        onCancel={cancelTestDrive}
                                        showActions={["PENDING", "CONFIRMED"].includes(booking.status)}
                                        isAdmin={true}
                                        isCancelling={cancelling}
                                        renderStatusSelector={() => (
                                            <Select
                                                value={booking.status}
                                                onValueChange={(val) => handleUpdateStatus(booking.id, val)}
                                                disabled={updatingStatus}>
                                                <SelectTrigger className="w-full h-8">
                                                    <SelectValue placeholder="Update Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PENDING">Pending</SelectItem>
                                                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                    <SelectItem value="NO_SHOW">No Show</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )} />
                                </div>
                            )
                        })}
                    </div>)}
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminTestDriveList;