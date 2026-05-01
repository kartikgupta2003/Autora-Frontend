import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import SavedCarList from "../Utils/SavedCarList";
import Chat from "../Utils/Chat";
import AllChats from "../Utils/AllChats";
import { ChatProvider } from "../Utils/ChatProvider.jsx";

const ChatBotPage = () => {
    const { isSignedIn, userId, getToken, isLoaded } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        if(!isLoaded) return ;
        // Clerk auth async hota hai , Refresh ke baad isSignedIn 1 second ke liye false/undefined hota hai
        // to wo page ko refresh karne pe sign-in pe navigate karwata hi chahe user logged in hi kyu na hota 

        if (!isSignedIn) {
            navigate("/sign-in");
        }

    }, [isLoaded , isSignedIn]);


    return (
        <div className="container mx-auto px-4 py-12 pt-20">
            <h1 className="text-6xl mb-10 text-center">AutoMate AI</h1>
            {/* <SavedCarList initialData={savedCars} setRefresh={setRefresh}/> */}
            {/* <h4 className="text-3xl mb-8 text-center">Sit back and let AI guide your car buying journey — from discovery to decision.</h4> */}
            <ChatProvider>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-60 shrink-0">
                        {/*prevents the item from shrinking Even if the container becomes smaller, this item keeps its width */}
                        <AllChats />
                    </div>
                    <div className="flex-1">
                        {/* Takes all remaining available space Shrinks when needed* Grows relative to other flex-* items */}
                        <Chat />
                    </div>
                </div>
            </ChatProvider>
        </div>
    )

}

export default ChatBotPage;