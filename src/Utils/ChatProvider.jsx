import React , {useState , createContext , useContext, Children} from "react";

const chatContext = createContext(null); 

export const ChatProvider = ({children})=>{
    const [selectedThread , setSelectedThread] = useState({"name" : "" , "id" : ""});
    const [threads , setThreads] = useState([]);
    
    return(
        <chatContext.Provider value={{selectedThread , setSelectedThread , threads , setThreads}}>
            {children}
        </chatContext.Provider>
    )

}

export const useChat = ()=>{
    const states = useContext(chatContext)
    return states;
}

