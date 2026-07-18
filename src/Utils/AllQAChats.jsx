import React, { useState, useEffect, useRef } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from "@/components/ui/sheet"
import { Button } from "../components/ui/button";
import { Filter, Sliders, X } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useChat } from "./QAProvider.jsx";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate} from "react-router-dom";

const AllQAChats = () => {
    const {isSignedIn, userId, getToken, isLoaded} = useAuth();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { selectedThread, setSelectedThread, threads, setThreads } = useChat();
    const navigate = useNavigate();

    // A useEffect hook to fetch all previous chats of the user from Database 
    useEffect(() => {
        if(!isLoaded) return ;
    //     // Clerk auth async hota hai , Refresh ke baad isSignedIn 1 second ke liye false/undefined hota hai
    //     // to wo page ko refresh karne pe sign-in pe navigate karwata hi chahe user logged in hi kyu na hota 

        if (!isSignedIn) {
            navigate("/sign-in");
            return ;
        }
        const fetchAllChats = async () => {
            try {
                const token = await getToken();
                // console.log("secret ", token);
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                };

                const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/api/qachats/fecthChats` , config);

                // console.log("chats " , data);

                setThreads(data);
            } catch (err) {
                // console.log(err)
                window.scrollTo({ top: 0, behavior: "smooth" });
                return toast.error(err.message);
            }
        }

        fetchAllChats();
    }, [isLoaded , isSignedIn]);

    const createNewChat = (id, name , active_doc_hash , active_doc_name) => {
        const newThread = {
            "name": name,
            "id": id ,
            "active_doc_hash" : active_doc_hash ,
            "active_doc_name" : active_doc_name
        }

        // setThreads((prv)=>[newThread , ...prv])

        setSelectedThread(newThread)

    }
    return (
        <div className="flex lg:flex-col justify-between gap-4">
            {/* Mobile filters */}
            <div className="lg:hidden mb-4">
                <div className="flex items-center">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant={"outline"} className={"flex items-center gap-2"}>
                                Recent Chats
                                {/* {activeFilterCount > 0 && (
                                    <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                        {activeFilterCount}
                                    </Badge>
                                )} */}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left"
                            className="w-full sm:max-w-md overflow-y-auto"
                            aria-describedby={undefined}>
                            <SheetHeader>
                                <SheetTitle>Recents</SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col max-h-screen overflow-y-auto overflow-x-hidden">
                                <div className="p-4 border-b cursor-pointer" onClick={() => createNewChat("", "" , "" , "")}>New Chat</div>
                                {threads.length > 0 && threads.map((thread) => {
                                    return (
                                        <div className="p-4 border-b cursor-pointer" key={thread.id} onClick={() => createNewChat(thread.id, thread.name , thread.active_doc_hash , thread.active_doc_name)}>{thread.name}</div>
                                    )
                                })}
                            </div>

                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value)
            }
                // call the applyFilter Button
            }>
                <SelectTrigger className="w-[180px] lg:w-full">
                    <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                    {[
                        { value: "newest", label: "Newest First" },
                        { value: "priceAsc", label: "Price : Low to High" },
                        { value: "priceDesc", label: "Price : High to Low" }
                    ].map((options) => {
                        return (
                            <SelectItem key={options.value} value={options.value}>{options.label}</SelectItem>
                        )
                    })}
                </SelectContent>
            </Select> */}

            {/* Desktop Filters */}
            <div className="hidden lg:block sticky top-24">
                <div className="border rounded-lg overflow-hidden bg-white">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <h3 className="font-medium flex items-center">
                            Recent Chats
                        </h3>
                        {/* {activeFilterCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className={"h-8 text-sm text-gray-600"}
                                onClick={clearFilters}
                            >
                                <X className="mr-1 h-3 w-3" />Clear All
                            </Button>
                        )} */}
                    </div>
                    <div className="flex flex-col max-h-60 overflow-y-auto overflow-x-hidden">
                        <div className="p-4 border-b cursor-pointer" onClick={() => createNewChat("", "" , "" , "")}>New Chat</div>
                        {threads.length > 0 && threads.map((thread) => {
                            return (
                                <div className="p-4 border-b cursor-pointer" key={thread.id} onClick={() => createNewChat(thread.id, thread.name , thread.active_doc_hash , thread.active_doc_name)}>{thread.name}</div>
                            )
                        })}
                    </div>
                    {/* <div className="p-4"> */}
                    {/* <CarFilterControls
                            filters={filters}
                            currentFilters={currentFilters}
                            onFilterChange={handleFilterChange}
                            onClearFilter={handleClearFilter}
                        /> */}
                    {/* </div> */}
                    {/* <div className="px-4 py-4 border-t"> */}
                    {/* <Button onClick={applyFilters} className={"w-full"}>Apply Filters</Button> */}
                    {/* </div> */}
                </div>
            </div>
        </div>
    )
}

export default AllQAChats;