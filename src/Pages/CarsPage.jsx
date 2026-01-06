import React from "react";
import CarsList from "../Utils/CarsList";

const CarsPage = ({index , setIndex})=>{
    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Cars Management</h1>
            <CarsList index={index} setIndex={setIndex}/>
        </div>
    )
}

export default CarsPage ;