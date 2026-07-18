import React from "react"
import { QAProvider, useChat } from "../Utils/QAProvider.jsx"
import AllQAChats from "../Utils/AllQAChats.jsx"
import QAChat from "../Utils/QAChat.jsx"

const QuestionAnswerPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 pt-20">
            {/* <h1 className="text-6xl mb-10 text-center">Welcome to AutoDoc AI</h1> */}
            <div className="mb-6 flex flex-col justify-center items-center">
                <p className="text-2xl font-semibold">
                    Welcome to AutoDoc AI 📄
                </p>

                <p className="mt-2 text-gray-500">
                    Upload a vehicle manual and ask questions instantly.
                </p>
            </div>
            <QAProvider>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-60 shrink-0">
                        {/*prevents the item from shrinking Even if the container becomes smaller, this item keeps its width */}
                        <AllQAChats />
                    </div>
                    <div className="flex-1">
                        {/* Takes all remaining available space Shrinks when needed* Grows relative to other flex-* items */}
                        <QAChat />
                    </div>
                </div>
            </QAProvider>
        </div>
    )
}

export default QuestionAnswerPage