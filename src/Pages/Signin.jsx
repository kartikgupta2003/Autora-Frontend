import React, { useState, useEffect } from "react";
import { SignIn } from "@clerk/clerk-react";

const Signin = () => {
    return (
        <div className="mt-20 container mx-auto px-4 py-12">
            <SignIn/>
        </div>
    )
}

export default Signin;