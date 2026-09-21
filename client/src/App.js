
import React, { useEffect, useState } from "react";
import axios from "axios";
// import AddEmployeePopup from "./components/AddEmployeePopup";
// import Header from "./components/Header";
import Home from "./components/Home";
import {BrowserRouter, Routes, Router, Route} from "react-router-dom";
import Header from "./components/Header";
import Auth from "./components/Auth";


const App = () => {

    const [logged, setLogged] = useState(null);

    useEffect(()=>{
        loggedFun()
    },[])

    async function loggedFun(){
        try{
            var res = await axios.get("https://localhost:7243/api/Employees/me", {
                headers : {
                    "Content-Type" : "Application/json"
                },
                WithCredentials : true
            });

            if(res.status === 200){
                console.log("logged response - ",res);
            }
        }
        catch(error){
             console.log("logged error - ",error);
        }
    }

    return (
        <BrowserRouter>
        <Header/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth/>} />
        </Routes>
        
        </BrowserRouter>
        );
};



export default App;
