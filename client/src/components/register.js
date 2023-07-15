import React, { useState } from "react";
//import { server } from '../services/server';
import APIRequest from "../services/APIRequest";
const Register = ({ setToken }) => {
    const [username, setUsername] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [message, setMessage] = useState("");
    
    const usernameHandler = (e) => {
        setUsername(e.target.value);
    };
    const lastNameHandler = (e) => {
        setLastName(e.target.value);
    };
    const firstNameHandler = (e) => {
        setFirstName(e.target.value);
    };
    const password1Handler = (e) => {
        setPassword1(e.target.value);
    };
    const password2Handler = (e) => {
        setPassword2(e.target.value);
    };
    const donate = async () => {
        console.log("donate");
    }
    const register = async () => {    
        const resp = await APIRequest.register(username,lastName, firstName, password1, password2);
        if (resp.status === 1)
        {
            setToken(resp.token, "/");
        } else {
            setMessage(resp.message);
        }
    }
    return (
        <div className={"vertRow"}>
            <p><input style={{width: "100%"}} type="text" name="username" id="username" value={username} onChange={usernameHandler} placeholder="USERNAME" /></p>
            <div className="row">
                <input style={{width: "50%"}} type="text" name="firstName" id="firstName" value={firstName} onChange={firstNameHandler} placeholder="FIRSTNAME" />

                <input type="text" name="lastName" id="lastName" value={lastName} onChange={lastNameHandler} placeholder="LASTNAME" />

            </div>

            <div className="row">
                <input type="password" name="password1" id="password1" value={password1} onChange={password1Handler} placeholder="password" />
                <input type="password" name="password2" id="password2" value={password2} onChange={password2Handler} placeholder="password comfirm" />
            </div>

            <p><button onClick={register}>Register</button></p>
            <p>{message}</p>
        </div>)
}
export default Register;