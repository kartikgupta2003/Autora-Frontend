import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import Sidebars from "../Utils/Sidebars";
import SettingsPage from "./SettingsPage";
import CarsPage from "./CarsPage";
import TestDrives from "./TestDrives";
import Dashboard from "./Dashboard";
import AddCarsPage from "./AddCarsPage";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const AdminLayout = () => {
    const { getToken } = useAuth();
    const [isAllowed, setIsAllowed] = useState(null);
    const navigate = useNavigate();
    const [index , setIndex] = useState(0);

    useEffect(() => {
        const checkRole = async () => {
            try {
                const token = await getToken();
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,   // 🔥 this is REQUIRED
                    }
                };
                await axios.get("http://localhost:8000/api/authMe/verify-admin", config);
                setIsAllowed(true);
            } catch {
                setIsAllowed(false);
                // console.log("catch hau");
            }
        }

        checkRole();
    }, []);

    if (isAllowed === null) return <p className="mt-20">Checking...</p>

    return (
        <div>
            {isAllowed ? (<div className="h-full">
                <div className="flex h-full flex-col top-20 fixed inset-y-0 z-0">
                    <SidebarProvider>
                    <Sidebars index={index} setIndex={setIndex}/>
                    </SidebarProvider>
                    {/* top-20 -> element will be 5rem from the top of its nearest positioned ancestor (or from the viewport if fixed).
                    inset-y-0 is nothing but top:0 bottom:0*/}
                </div>
                <main className="pl-4 md:pl-56 pt-20 h-full z-10000">
                    {index === 0 && <Dashboard/>}
                    {index === 1 && <CarsPage index={index} setIndex={setIndex}/>}
                    {index === 2 && <TestDrives/>}
                    {index === 3 && <SettingsPage/>}
                    {index === 4 && <AddCarsPage index={index} setIndex={setIndex}/>}
                </main>
            </div>) : (
                <div className="flex flex-col items-center jsutrify-center min-h-screen px-4 text-center pt-20">
                    <h1 className="text-6xl font-bold mb-4">403</h1>
                    <h2 className="text-2xl font-semibold mb-4">Access Denied!</h2>
                    <Button className="cursor-pointer"
                        onClick={() => navigate("/")}>Go Back</Button>
                </div>
            )}
        </div>
    )

}

export default AdminLayout;