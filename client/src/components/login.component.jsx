import { useContext, useState } from "react";
import axios from "axios";

import { UserContext } from "../context/UserContext.context";
import { WebSocketContext } from "../context/WebsocketContext.context";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {setContextUserId, setContextUsername} = useContext(UserContext);
    const {setIsLoggedIn} = useContext(WebSocketContext);

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
            setContextUserId(data.id);
            setContextUsername(data.username);
            setIsLoggedIn(true);
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