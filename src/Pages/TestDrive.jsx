import React , {useState , useEffect} from "react";
import { useParams } from "react-router-dom";
import TestDriveForm from "../Utils/TestDriveForm";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

const TestDrive = () => {
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

                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/showCars/get-car?id=${id}`, config);

                // console.log("car ka info test drive pe", data);
                setCarData(data);
            } catch (err) {
                // console.log(err);
                // window.scrollTo({ top: 0, behavior: "smooth" });
                return toast.error(err.response.data.message);
            }
        }

        fetchCarData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-12 pt-20">
            <h1 className="text-6xl mb-6">Book a Test Drive</h1>

            <TestDriveForm car={carData} testDriveInfo={carData.testDriveInfo}/>
        </div>
    )
}

export default TestDrive;