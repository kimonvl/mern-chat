import axios from "axios";
import { useContext, useState } from "react";
import React from "react";
import { useDispatch } from "react-redux";
import { setUserId, setUsername as setUsernameStore } from "../store/user/user.actions";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const dispatch = useDispatch();

    const changePasswordHandler = (e) =>{
        setPassword(e.target.value);
    }

    const changeEmailHandler = (e) =>{
        setEmail(e.target.value);
    }

    const changeUsernameHandler = (e) =>{
        setUsername(e.target.value);
    }

    const register = async (ev) => {
        ev.preventDefault();
        const {data} = await axios.post('register', {username, email, password});
        if(data){
            dispatch(setUserId(data.id));
            dispatch(setUsernameStore(username));
        }else {
            alert("Could not create account");
        }
    }

    return (
        <div className=" flex items-center ">
            <form className="w-64 mx-auto mb-12" onSubmit={register}>
                <input value={username} onChange={changeUsernameHandler} type="text" placeholder="username" className="block w-full rounded-sm p-2 mb-2 border"></input>
                <input value={email} onChange={changeEmailHandler} type="email" placeholder="email" className="block w-full rounded-sm p-2 mb-2 border"></input>
                <input value={password} onChange={changePasswordHandler} type="password" placeholder="password" className="block w-full rounded-sm p-2 mb-2 border"></input>
                <button className="bg-blue-500 text-white block w-full rounded-sm p-2">Register1</button>
            </form>
        </div>
    );
}

export default Register;