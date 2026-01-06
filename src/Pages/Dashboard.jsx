import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import DashboardComp from "../Utils/DashboardComp";

const Dashboard = () => {
    const [dashBoardData, setDashBoardData] = useState(null);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchData = async() => {
            try{
                const token = await getToken();
                // console.log("ok");
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                };
                const {data} = await axios.get("http://localhost:8000/api/adminDrive/fetch-dashboard" , config);

                setDashBoardData(data);

                // console.log("dashboard " , data);
            }catch(err){
                // console.log(err);
                return toast.error(err.response.data.message);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <DashboardComp initialData={dashBoardData}/>
        </div>
    )
}

export default Dashboard;