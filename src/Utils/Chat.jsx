import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../components/ui/button";
import { toast } from "react-toastify";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner"
import { Loader2 } from "lucide-react";
import { useChat } from "./ChatProvider";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@clerk/clerk-react";

const Chat = () => {
    const { getToken } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const textareaRef = useRef(null);
    const [loadedThread, setLoadedThread] = useState(null)
    const { selectedThread, setSelectedThread, threads, setThreads } = useChat();
    // const config = { 'configurable': { 'thread_id': "1" } };
    useEffect(() => {
        const fecth_chats = async () => {
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
                            "thread_id": selectedThread.id
                        }
                    }
                }
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                };
                // console.log("fetch ", body)
                const { data } = await axios.post("https://autora-chatbot-backend-production.up.railway.app/ai/fetch", body)

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

    const fetchUserAnswer = async () => {
        try {
            if (input.length === 0) {
                const err = new Error("Please ask a valid query !")
                err.status = 400;
                throw err;
            }
            let newThread = { ...selectedThread };
            if (selectedThread.name === "") {
                // selectedThread.name = input;
                // selectedThread.id = uuidv4();
                newThread = {
                    "name": input.slice(0, 30),
                    "id": uuidv4()
                }

                setLoadedThread(newThread)
                setSelectedThread(newThread)
                setThreads((prv) => [newThread, ...prv]);

                try {
                    const token = await getToken();
                    // console.log("secret ", token);
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    };
                    const body = {
                        thread_name: newThread.name,
                        thread_id: newThread.id
                    }
                    const { data } = await axios.post("https://autora-backend.vercel.app/api/chats/addChat", body, config);



                } catch (err) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    return toast.error(err.message);
                }


            }
            setIsLoading(true)
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
                "thread_id": newThread.id
            }
            const token = await getToken();
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
            setInput("")
            // console.log("body ", body)
            const { data } = await axios.post("https://autora-chatbot-backend-production.up.railway.app/ai", body, config);
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
            window.scrollTo({ top: 0, behavior: "smooth" });
            return toast.error("AI service failed :- " + err.message);
        }
    }

    return (
        <div className="flex h-[calc(100dvh-96px)] flex-col overflow-hidden">
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

export default Chat;