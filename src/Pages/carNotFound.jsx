import React from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const CarNotFound = ()=>{
    const navigate = useNavigate();

    return(
        <div className="flex flex-col items-center jsutrify-center min-h-screen px-4 text-center pt-20">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">Oops! The page you're looking for doesn't exists or has been moved.</p>
            <Button className="cursor-pointer" 
            onClick={()=> navigate("/")}>Return Home</Button>
        </div>
    )
}

export default CarNotFound;