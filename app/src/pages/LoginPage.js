import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import sha256 from 'crypto-js/sha256';

// Global states
import { useSession } from "../globalStates/session.state";

// MUI components
import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput
} from "@mui/material";

// MUI icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

// Components
import { LangContext, LANGS } from "../utils/context/LangContext";
import WhiteTextField from "../components/WhiteTextField";
import ErrorAlert from "../components/ErrorAlert";

// Images
import UK_flag from "../images/united-kingdom.png";
import DE_flag from "../images/germany.png";
import Valeo from "../images/valeo_logo.png";


const LoginPage = () => {
    const navigate = useNavigate();
    const { t, changeLang, Lang } = useContext(LangContext);
    const [_, sessionAction] = useSession();
    const [apus, setApus] = useState([]);
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState(false);
    const [form, setForm] = useState({
        apu_id: "",
        username: "",
        password: ""
    });


    useEffect(() => {
        axios.post(`/api/LoginPage/get_apus.php`).then(res => {
            if (res.data.errors == 0) {
                setApus(res.data.apus);
            } else {
                setError(true);
            }
        })
    }, [])


    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    const handleClickShowPassword = () => setShowPwd(prev => (!prev));


    const handleLogin = () => {
        if (form.username !== "" && form.password !== "") {
            var fd = new FormData();
            Object.entries({ ...form, password: sha256(form.password) }).map(([key, val]) => fd.append(key, val));

            axios.post(`/api/LoginPage/authenticate.php`, fd).then((res) => {
                if (res.data.errors == 0) {
                    sessionAction.setSession(res.data.data);
                    navigate("/home");
                } else {
                    window.alert("Something went wrong!");
                }
            });
        } else {
            window.alert("Something is missing!");
        }
    };

    return (
        <div className="bg-[#f7f5f5] h-screen relative w-screen">
            <ErrorAlert open={error} setOpen={setError} />
            <div className="absolute top-0 right-0 space-x-3 p-3 z-10">
                <IconButton onClick={() => changeLang(LANGS.DE)}>
                    <img
                        className={`h-10 ${Lang == "de" ? "" : "opacity-30"}`}
                        src={DE_flag}
                        alt="Not found"
                        id="DE"
                    />
                </IconButton>
                <IconButton onClick={() => changeLang(LANGS.EN)}>
                    <img
                        className={`h-10 ${Lang == "en" ? "" : "opacity-30"}`}
                        src={UK_flag}
                        alt="Not found"
                        id="EN"
                    />
                </IconButton>
            </div>
            <div className="absolute bg-white drop-shadow-md flex flex-col items-center justify-center left-1/2 h-screen sm:h-auto sm:m-3 p-5 sm:rounded-md gap-3 top-1/2 translate-x-[-50%] translate-y-[-50%] w-screen sm:w-72">
                <img className="sm:p-10 sm:w-full w-1/2" src={Valeo} alt="valeo-logo" />
                <h1 className="font-semibold mb-10 text-4xl text-valeo-blue">FRI1 Inventory</h1>
                <WhiteTextField fullWidth label="APU" name="apu_id" onChange={handleChange} select sx={{ textTransform: "uppercase" }} value={form.apu_id}>
                    <MenuItem disabled sx={{ fontStyle: "italic" }} value="">None</MenuItem>
                    {apus.map(apu => (<MenuItem key={apu.id} sx={{ textTransform: "uppercase" }} value={apu.id}>{apu.description}</MenuItem>))}
                </WhiteTextField>
                <WhiteTextField
                    fullWidth
                    label={t("login_page.username")}
                    name="username"
                    variant="outlined"
                    value={form.username}
                    onChange={handleChange}
                    onKeyDown={(e) =>
                        e.key == "Enter" ? handleLogin() : <noscript />
                    }
                />
                <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password" sx={{ "&.MuiInputLabel-formControl": { color: "#4e6b7c" } }}>
                        {t("login_page.password")}
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        name="password"
                        onChange={handleChange}
                        onKeyDown={(e) => e.key == "Enter" ? handleLogin() : <noscript />}
                        type={showPwd ? "text" : "password"}
                        value={form.password}
                        sx={{
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#a0f630",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline ": {
                                borderColor: "#82e600",
                            }
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPwd ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label={t("login_page.password")}
                    />
                </FormControl>
                <button className="bg-valeo-green drop-shadow my-5 text-white text-xl p-2 rounded space-x-2 px-5" onClick={() => handleLogin()}>
                    <LoginIcon />
                    <span>{t("login_page.login_button")}</span>
                </button>
                <a className="text-xl text-blue-700 hover:underline hover:text-blue-600" href={Lang == "en" ? "/wi-line-en.pdf" : Lang == "uk" ? "/wi-line-uk.pdf" : "/wi-line-hu.pdf"} target="_blank" rel="noreferrer" align="center" variant="h5">{t("login_page.wi")}</a>
            </div>
        </div>
    );
};

export default LoginPage;
