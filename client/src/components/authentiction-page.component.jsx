import Login from "./login.component";
import Register from "./register.component";

const AuthenticationPage = () => {
    return (
        <div className="space-x-10 flex h-screen w-full bg-blue-50 justify-center">
            <Login></Login>
            <Register></Register>
        </div>
    );
}

export default AuthenticationPage