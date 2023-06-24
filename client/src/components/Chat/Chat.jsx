import { useContext, useState, useEffect, useRef } from "react"
import Logo from "./Logo";
import { UserContext } from "../Register/UserContext";

import axios from 'axios'


export default function Chat(){

    const {username, setId, setLoggedInUserName}=useContext(UserContext)
    const [userText, setuserText] = useState('') //value


    const [userPrompt, setuserPrompt] = useState(null) //value
    const [assistantMessage, setAssistantMessage] = useState(null) //message
    const [previousChats, setPreviousChats] = useState([])
    const [currentTitle, setCurrentTitle] = useState(null)
    const divUnderMessages= useRef()

    const getMessages=async()=>{
        const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('AlgoByte='))
        .split('=')[1];
        // console.log(token)
        const userMessage={message: {
            "role": "user",
            "content": userPrompt,
        }}
        setuserText(userPrompt)
        try {
            await axios.post('/chat/completion',userMessage,{
                headers: {
                    "Content-Type":'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
            .then((res)=>{
                console.log(res.data)
                setAssistantMessage(res.data?.choices[0].message)
                setuserPrompt('')
            })
            .catch((err)=>console.log(err))
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit=(ev)=>{
        if(ev) ev.preventDefault();

        getMessages();
    }

    useEffect(() => {
    //   console.log(currentTitle, userText, assistantMessage)
        if(!currentTitle && userText && assistantMessage){
            setCurrentTitle(userText)
        }
        if(currentTitle && userText && assistantMessage){
            setPreviousChats(prevChats=>(
                [...prevChats,
                    {
                        title: currentTitle,
                        role: "user",
                        content: userText
                    },
                    {
                        title: currentTitle,
                        role: assistantMessage.role,
                        content: assistantMessage.content
                    }
                ]   
            ))
        }
    }, [assistantMessage, currentTitle])
    
    
    const createNewChat=()=>{
        setAssistantMessage(null)
        setuserPrompt(null)
        setCurrentTitle(null)
    }


    const handleClick=(unqTitle)=>{
        setCurrentTitle(unqTitle)
        setAssistantMessage(null)
        setuserPrompt(null)
    }

    
    function logout(){
        axios.post('/user/logout')
        .then(()=>{
            setId(null);
            setLoggedInUserName(null);
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        })
        
    }

    useEffect(()=>{     
        const div=divUnderMessages.current;
        if(div) div.scrollIntoView({behavior: 'smooth' , block: 'end'});
    },[currentTitle])

    const saveSession=async()=>{
        console.log(previousChats)
        console.log(uniqueTitles)
        const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('AlgoByte='))
        .split('=')[1];
        try {
            axios.post('/chat/savesession',{previousChats, uniqueTitles},{
                headers: {
                    "Content-Type":'application/json',
                    "Authorization": `Bearer ${token}`
                }
            }).then((res)=>{
                console.log(res.data.msg)
            })
            .catch((err)=>console.log(err))
        } catch (error) {
            console.log(error)
        }
    }

    const retrievePreviousSessions=async()=>{
        const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('AlgoByte='))
        .split('=')[1];
        try {
            axios.post('/chat/prevsession',{},{
                headers: {
                    "Content-Type":'application/json',
                    "Authorization": `Bearer ${token}`
                }
            }).then((res)=>{
                console.log(res.data.msg)
                setPreviousChats(res.data.previousChats)
            })
            .catch((err)=>console.log(err))
        } catch (error) {
            console.log(error)
        }
    }
    // console.log(previousChats)
    
    const currentChat = previousChats.filter(prevChat=>prevChat.title===currentTitle)
    const uniqueTitles = Array.from(new Set(previousChats.map(prevChat=>prevChat.title)))

    // console.log(uniqueTitles)

    return (
        <div className="flex h-screen">
            <div className=" bg-gray-800 w-1/4 flex flex-col">
                <div className="flex-grow flex flex-col justify-start items-center">
                    <Logo/>
                    <button className="bg-gray-800 hover:bg-slate-700 text-white font-semibold m-1 py-2 px-4 border border-gray-400 rounded shadow w-5/6 " onClick={createNewChat}>+ New Chat</button>
                    <button className="bg-gray-800 hover:bg-slate-700 text-white font-semibold m-1 py-2 px-4 border border-gray-400 rounded shadow w-5/6 " onClick={saveSession}>Save Session</button>
                    <button className="bg-gray-800 hover:bg-slate-700 text-white font-semibold m-1 py-2 px-4 border border-gray-400 rounded shadow w-5/6 " onClick={retrievePreviousSessions}>Retrieve Previous Sessions</button>
                    <div className=" p-3 m-3 h-full w-full flex flex-col items-center" >
                        {uniqueTitles?.map((unqTitle, index)=>
                            <button onClick={()=>handleClick(unqTitle,index)} key={index} className="text-white py-3 px-0 cursor-pointer hover:bg-slate-700 border border-gray-600 rounded shadow w-5/6 m-1">{unqTitle.slice(0,14)+'...'}</button>
                        )}
                    </div>
                </div>
                <div className="p-2 text-center flex items-center justify-evenly">
                    <span className="mr-2 text-sm text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                        {username}
                    </span>
                    <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                        onClick={logout}>Logout</button>
                </div>
            </div>
            <div className=" bg-slate-700 flex flex-col w-3/4 p-2" >
                {!currentTitle && 
                <div>
                    <h1 className="text-white text-center font-semibold mb-1">AlgoByte</h1>
                    <p className="text-white text-center">Your Self-Interview preparation platform</p>
                    <p className=" text-gray-400 text-center my-32">Start Typing...</p>
                </div>
                }
                <div className="flex-grow text-white">
                    <div className=" relative h-full">
                        <div className=" overflow-y-scroll absolute top-0 left-0 right-0 bottom-2 p-3">
                            {currentChat?.map((chatMessage, index)=> 
                            <div key={index} className={(chatMessage.role==='user' ? 'text-right':'text-left')+" my-4"}>
                                <div className=" inline-block p-2 my-2 rounded-md text-md outline outline-2 outline-gray-500 mx-3 hover:bg-gray-800">
                                    <p className="mb-3 font-semibold">{chatMessage.role.toUpperCase()}</p>
                                    <p className="mb-3">{chatMessage.content}</p>
                                </div>
                            </div>)}
                            <div ref={divUnderMessages}></div>
                        </div>
                    </div>
                </div>
                <form className="flex gap-2 w-2/3 m-auto mb-3.5" onSubmit={handleSubmit}>
                    <input type="text" 
                            value={userPrompt}
                            onChange={(e)=>setuserPrompt(e.target.value)}
                            placeholder="Type your message here" 
                            className="bg-white border p-2 flex-grow rounded-md focus:outline-none"/>
                    {/* <label className="cursor-pointer bg-blue-200 p-2 text-gray-600 rounded-md border border-blue-300">
                        <input type="file" className="hidden" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                        </svg>
                    </label> */}
                    <button type="submit" className="bg-blue-500 p-2 text-white rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 -rotate-45">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    )
}