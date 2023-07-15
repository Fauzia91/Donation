import React, { useState, useEffect } from "react";
//import { getProfile, donate, getDonations, nicedate } from '../services/server';
import APIRequest from "../services/APIRequest";
import Donations from './donations';
import {
    Link
} from 'react-router-dom';
const Dashboard = ({ token, setToken }) => {
    const [amount, setAmount] = useState(0);
    const [profile, setProfile] = useState({ lastName: "", firstName: "" });
    const [donations, setDonations] = useState([]);
    useEffect(() => {
        init();
    }, []);
    const init = async () => {
        const profile = await APIRequest.getProfile();
        setProfile(profile);

        const donations = await APIRequest.getDonations();
        setDonations(donations);
    }
    const amountHandler = (e) => {
        setAmount(e.target.value);
        console.log("setAmount", e.target.value);
    };
    const donateHandler = async () => {
        const url = await APIRequest.donate(amount);
        window.open(url);
        const d = await APIRequest.getDonations();
        setDonations(d);
    }
    const logout = async () => {
        console.log("DB.LOGOUT");

        const resp = await APIRequest.logout();
        console.log("RESP:", resp)
        setToken("");
    }

    return (
        <div>

            <div className={"corner"}>
                <p><button onClick={logout}>Logout</button></p>
            </div>
            <h1>Welcome {profile.firstName}</h1>
            <div className={"row center"}>
                <div className={"row"}>
                    <div className={"special"}>
                    <div>$</div>
                    <input className={"small"} type="text" name="amount" id="amount" value={amount} onChange={amountHandler} placeholder="DONATION AMOUNT" />
                    </div>
                <button onClick={donateHandler}>Donate</button>
                </div>
            </div>
            <br/>
            <Donations donations={donations} />
        </div>
    )
}
export default Dashboard;