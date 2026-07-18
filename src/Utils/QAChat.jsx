import React, { useEffect, useRef, useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner"
import { Loader2 } from "lucide-react";
import { useChat } from "./QAProvider.jsx";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@clerk/clerk-react";
import { useDropzone } from 'react-dropzone';
import { useUser } from "@clerk/clerk-react";

const QAChat = () => {
    const { getToken } = useAuth();
    const { user} = useUser();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const textareaRef = useRef(null);
    const [loadedThread, setLoadedThread] = useState(null)
    const { selectedThread, setSelectedThread, threads, setThreads } = useChat();
    // const config = { 'configurable': { 'thread_id': "1" } };
    useEffect(() => {
        const fecth_chats = async () => {
            console.log("chat jo select hui " , selectedThread);
            try {
                const token = await getToken();
                if (!selectedThread.id) {
                    setMessages([])
                    return;
                }
                if (loadedThread?.id === selectedThread.id) return;
                const body = {
                    config: {
                        "configurable": {
                            "thread_id": selectedThread.id,
                            "auth_token": user.id,
                            "filename": selectedThread.active_doc_name,
                            "file_hash": selectedThread.active_doc_hash
                        }
                    }
                }
                const { data } = await axios.post("https://autora-chatbot-backend-production.up.railway.app/qa/fetch", body)

                setMessages(data)
                setLoadedThread(selectedThread)
            } catch (err) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return toast.error("AI service failed :- " + err.message);
            }

        }

        fecth_chats();
    }, [selectedThread])


    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "0px";
        el.style.height = Math.min(el.scrollHeight, 180) + "px";
    }, [input]);
    // const fetchUserAnswer = () => { }
    const fetchUserAnswer = async () => {
        try {
            const token = await getToken();
            setIsLoading(true)
            if (input.length === 0) {
                const err = new Error("Please ask a valid query !")
                err.status = 400;
                throw err;
            }
            let newThread = { ...selectedThread };
            if (newThread.id === "") {
                console.log("thread nhi hai ");
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                };
                const body = {
                    "thread_name": input.slice(0, 30),
                    "thread_id": uuidv4()
                }
                const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/qachats/addChat` , body , config);

                // console.log("thread to ban gaya " , data);
                newThread = {
                    "id" : data.thread_id ,
                    "name" : data.thread_name
                }

                setLoadedThread(newThread)
                setSelectedThread(newThread)
                setThreads((prv) => [newThread, ...prv]);
                // console.log("Thread jo ab save hua hai backend me " , selectedThread , newThread);
            }
            setMessages((prv) =>
                [
                    ...prv,
                    {
                        "role": "user",
                        "content": input
                    }
                ])
            // console.log("gaya " , selectedThread)
            const body = {
                "user_message": input,
                "config" : {
                    "configurable" : {
                        "thread_id": newThread.id,
                        "auth_token": user.id,
                        "filename": newThread.active_doc_name,
                        "file_hash": newThread.active_doc_hash
                    }
                }
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
            setInput("")
            // console.log("body ", body)
            const { data } = await axios.post("https://autora-chatbot-backend-production.up.railway.app/ai/answer", body, config);
            // console.log(data)
            setMessages((prv) =>
                [
                    ...prv,
                    {
                        "role": "assistant",
                        "content": data
                    }
                ])
            setIsLoading(false)

        } catch (err) {
            // console.log(err);
            setIsLoading(false)
            setInput("");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.error("AI service failed :- " + err.message);
        }
    }

    const handleFileUpload = async (file) => {
        try {
            setIsUploading(true);
            let newThread = {...selectedThread};
            const token = await getToken();
            console.log("thread jisme upload karna hai " , selectedThread);
            if (selectedThread.id === "") {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                };
                const body = {
                    "thread_name": file.name.slice(0, 30),
                    "thread_id": uuidv4()
                }
                const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/qachats/addChat` , body , config);

                newThread = {
                    "id" : data.thread_id ,
                    "name" : data.thread_name
                }

                setSelectedThread(newThread);
                setLoadedThread(newThread);
                setThreads((prv)=>{
                    return [newThread , ...prv]
                });

            }
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: token,
                    "user-id" : user.id
                }
            };
            const formData = new FormData();
            formData.append("file", file);
            const { data : updateData } = await axios.post("https://autora-chatbot-backend-production.up.railway.app/upload-pdf", formData, config);
            // console.log(data);
            setSelectedThread((prv) => {
                return {
                    ...prv, active_doc_name: file.name, active_doc_hash: updateData?.doc_hash
                }
            })
            newThread = {
                ...newThread ,
                active_doc_hash : updateData?.doc_hash ,
                active_doc_name : file.name 
            }
            if (newThread.id) {
                // we need to update active doc in mongodb document 
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                };
                const body = {
                    active_doc_hash: updateData?.doc_hash,
                    active_doc_name: file.name,
                    thread_id: newThread.id
                }
                const {data : updatedChat} = await axios.patch(`${import.meta.env.VITE_API_URL}/api/qachats/updateDoc`, body, config);
                // console.log("file upload karne ke bad system " , selectedThread , updatedChat);
            }
            setIsUploading(false);
            return toast.success(updateData.message);
        } catch (err) {
            setIsUploading(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.error("File upload failed - " + err.message);
        }
    }

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];

        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                toast.error("File size must be less than 10MB");
                return;
            }

            setIsUploading(true);
            try {
                await handleFileUpload(file);
            } finally {
                setIsUploading(false);
            }
            setIsUploading(false);
        }
    }
    // useCallback is a React hook used to memoize a function, so that the same function reference is reused between renders unless its dependencies change.
    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"]
        },
        // JPG & PNG har browser me 100% supported hote hain Desktop + mobile + old browsers → no compatibility issues
        maxFiles: 1
    })
    // react-dropzone is a React library used to implement drag-and-drop file uploads in web applications.

    return (
        <div className="flex h-[calc(100dvh-60px)] flex-col overflow-hidden">
            {/* PDF SECTION */}
            <div className="border-b bg-zinc-50 p-4">
                {selectedThread.active_doc_name ? <>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">
                                Active Document
                            </p>

                            <p className="text-sm text-gray-500">
                                {selectedThread.active_doc_name}
                            </p>
                        </div>
                        <div>
                            {isUploading ? <><div className="flex justify-center items-center py-8">
                                <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
                            </div></> : <>
                                <Button {...getRootProps()} className="cursor-pointer mt-4">
                                    <input {...getInputProps()} />
                                    Replace PDF
                                </Button></>}
                        </div>
                    </div>
                </> : <>
                    <div className="rounded-xl border-2 border-dashed p-5 text-center">

                        <p className="text-lg font-semibold">
                            Upload Vehicle Manual 📄
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Ask questions about your uploaded PDF instantly
                        </p>
                        {isUploading ? <><div className="flex justify-center items-center py-8">
                            <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
                        </div></> : <><Button {...getRootProps()} className="cursor-pointer mt-4">
                            <input {...getInputProps()} />
                            Upload PDF
                        </Button></>}

                    </div>
                </>}
            </div>
            {/* Chat Section */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.length > 0 ? (
                    messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {(msg.role === "user") ? (<>{"👨🏻‍💻"}</>) : (<>{"֎🇦🇮"}</>)}
                            <div
                                className={`max-w-[70%] p-3 ${msg.role === "user"
                                    ? "bg-gray-200  text-black rounded-lg rounded-br-none"
                                    : "bg-gray-200 text-black rounded-lg rounded-bl-none"
                                    }`}
                            >
                                <pre className="whitespace-pre-wrap break-words text-sm font-mono">
                                    {typeof msg.content === "string"
                                        ? msg.content
                                        : JSON.stringify(msg.content, null, 2)}
                                </pre>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="mt-20 text-center text-lg">
                        <p className="text-2xl font-semibold">Hi! I’m AutoMate AI 🚗</p>
                        <p className="mt-2 text-gray-500">
                            Tell me your budget or preferences, and I’ll help you find the perfect car.
                        </p>
                    </div>
                )}
            </div>
            {/* Input Section */}
            <div className="border-t bg-white p-4">
                <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me about cars, budget, or comparisons..."
                    rows={1}
                    wrap="soft"
                    className="w-full resize-none overflow-hidden overflow-x-hidden"
                    style={{
                        overflowWrap: "anywhere",
                        whiteSpace: "pre-wrap"
                    }}
                />
                <div>
                    {isLoading ? (<><Loader2 className="mt-2 h-4 w-4 animate-spin" />{"Loading..."}</>) : (<Button className="mt-2 cursor-pointer" onClick={fetchUserAnswer}>
                        Send
                    </Button>)}
                </div>
            </div>
        </div>
    );
};

export default QAChat;