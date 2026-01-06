import React from "react";
import AdminTestDriveList from "../Utils/AdminTestDriveList";

const TestDrives = ()=>{
    return(
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Test Drive Management</h1>
            <AdminTestDriveList/>
        </div>
    )
}

export default TestDrives ;