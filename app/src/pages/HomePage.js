import { useContext, useEffect } from "react";
import axios from "axios";

// Global states
import { useSession } from "../globalStates/session.state";

// Components
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";


const HomePage = () => {
    const navigate = useNavigate();
    const [sessionState, sessionAction] = useSession();


    useEffect(() => {
        if (!sessionState.name) {
            axios.post(`/api/Layout/get_session_data.php`).then(res => {
                if (res.data.errors == 0) {
                    sessionAction.setSession(res.data.session_data);
                } else {
                    return navigate("/login");
                }
            })
        }
    }, []);


    return (
        <Layout>
            <h1 className="text-center font-semibold p-3 text-4xl">Welcome {sessionState.name} to the FRI1 Inventory!</h1>
        </Layout>
    )
}

export default HomePage