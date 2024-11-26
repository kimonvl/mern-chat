import { useContext, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserId, setUsername } from "../store/user/user.actions";
import React from "react";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    const changeEmailHandle = (ev) => {
        setEmail(ev.target.value);
    }

    const changePasswordHandle = (ev) => {
        setPassword(ev.target.value);
    }

    const login = async (ev) => {
        ev.preventDefault();
        const {data} = await axios.post('login', {email, password});

        if(data){
            dispatch(setUserId(data.id));
            dispatch(setUsername(data.username));
        }else {
            alert("Could not create account");
        }
    }

    return (
        <div className=" flex items-center">
            <form className="w-64 mx-auto mb-12" onSubmit={login}>
                <input value={email} onChange={changeEmailHandle} type="email" placeholder="email" className="block w-full rounded-sm p-2 mb-2 border"></input>
                <input value={password} onChange={changePasswordHandle} type="password" placeholder="password" className="block w-full rounded-sm p-2 mb-2 border"></input>
                <button className="bg-blue-500 text-white block w-full rounded-sm p-2">Login</button>
            </form>
        </div>
    );
    
}

export default Login;