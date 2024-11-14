import { useContext } from "react";

import { UserContext } from "../context/UserContext.context";
import AuthenticationPage from "./authentiction-page.component";
import Chat from "./chat.component";

const MainRoutes = () => {
    const {contextUsername} = useContext(UserContext);

    if(contextUsername)
        return (
            <Chat />
        );

    return (
        <AuthenticationPage></AuthenticationPage>
    );
}

export default MainRoutes;