import React , {useState , createContext , useContext, Children} from "react";

const qaContext = createContext(null); 

export const QAProvider = ({children})=>{
    const [selectedThread , setSelectedThread] = useState({"name" : "" , "id" : "" , "active_doc_hash" : "" , "active_doc_name" : ""});
    const [threads , setThreads] = useState([{"name" : "" , "id" : "" , "active_doc_hash" : "" , "active_doc_name" : ""}]);
    
    return(
        <qaContext.Provider value={{selectedThread , setSelectedThread , threads , setThreads}}>
            {children}
        </qaContext.Provider>
    )

}

export const useChat = ()=>{
    const states = useContext(qaContext)
    return states;
}

