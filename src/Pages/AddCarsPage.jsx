import React from "react"
import AddCarForm from "../Utils/AddCarForm";

const AddCarsPage = ({index , setIndex})=>{
    return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Car</h1>
        <AddCarForm index={index} setIndex={setIndex}/>
    </div>
    )
}

export default AddCarsPage ;