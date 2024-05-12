import { Fragment, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Global states
import { useSession } from "../../globalStates/session.state";

// MUI components
import { Drawer } from "@mui/material";

// MUI icons
import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";


// Components
import { LangContext } from "../../utils/context/LangContext";


// Images
import ProfileLogo from "../../images/profile-logo.svg";


const NavMenu = () => {
  const { t } = useContext(LangContext);
  const navigate = useNavigate();
  const useLoc = useLocation();
  const [sessionState, sessionAction] = useSession();

  const handleNavigation = (to) => {
    navigate(to);
    sessionAction.setVar("open", false);
  };


  const handleLogout = () => {
    axios.post(`/api/logout.php`).then((res) => {
      if (res.data == true) {
        sessionAction.setVar("open", false);
        navigate("/login");
      }
    });
  };


  return (
    <Drawer
      anchor="left"
      open={sessionState.open}
      onClose={() => sessionAction.setVar("open", false)}
      PaperProps={{
        style: {
          height: "calc(100% - 64px)",
          top: 64,
          width: 350
        },
      }}
      slotProps={{
        backdrop: {
          style: { top: 64, height: "calc(100vh - 4px)" },
        }
      }}
      sx={{ top: 64, height: "calc(100vh - 64px)" }}
    >
      <div className="bg-valeo-blue flex flex-col h-full items-center">
        <img alt="profil-logo" className="mt-10 mb-5" src={ProfileLogo} />
        <p className="font-semibold text-[#f7f5f5] text-3xl">
          {sessionState.name}
        </p>
        <p className="font-semibold text-gray-300 text-2xl mb-10 uppercase">
          {sessionState.apu}
        </p>
        <ul className="flex flex-col gap-2 h-full p-3 w-full">
          <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${useLoc.pathname == "/home" ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]" : "hover:bg-valeo-blue-hover text-[#f7f5f5]"}`}
              onClick={() => handleNavigation("/home")}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 ${useLoc.pathname == "/home" ? "bg-valeo-blue" : ""}`}>
                <HomeIcon
                  sx={{
                    color: useLoc.pathname == "/home" ? "white" : "",
                    display: useLoc.pathname == "/home" ? "block" : "none"
                  }}
                />
                <HomeOutlinedIcon
                  sx={{
                    display: useLoc.pathname == "/home" ? "none" : "block"
                  }}
                />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.home")}</span>
            </button>
          </li>

                  {/* History page start */}
                  <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${useLoc.pathname == "/history" ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]" : "hover:bg-valeo-blue-hover text-[#f7f5f5]"}`}
              onClick={() => handleNavigation("/history")}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 ${useLoc.pathname == "/history" ? "bg-valeo-blue" : ""}`}>
                <HomeIcon
                  sx={{
                    color: useLoc.pathname == "/history" ? "white" : "",
                    display: useLoc.pathname == "/history" ? "block" : "none"
                  }}
                />
                <HomeOutlinedIcon
                  sx={{
                    display: useLoc.pathname == "/history" ? "none" : "block"
                  }}
                />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.history")}</span>
            </button>
          </li>


                    {/* History page end  */}

                     {/* Assigned mobile page start */}
                     <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${useLoc.pathname == "/assignedMobile" ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]" : "hover:bg-valeo-blue-hover text-[#f7f5f5]"}`}
              onClick={() => handleNavigation("/assignedMobile")}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 ${useLoc.pathname == "/assignedMobile" ? "bg-valeo-blue" : ""}`}>
                <HomeIcon
                  sx={{
                    color: useLoc.pathname == "/assignedMobile" ? "white" : "",
                    display: useLoc.pathname == "/assignedMobile" ? "block" : "none"
                  }}
                />
                <HomeOutlinedIcon
                  sx={{
                    display: useLoc.pathname == "/assignedMobile" ? "none" : "block"
                  }}
                />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.assignedMobile")}</span>
            </button>
          </li>

                       {/* Assigned mobile page end  */}

        {/* add mobile page start */}

        <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${useLoc.pathname == "/storeMobile" ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]" : "hover:bg-valeo-blue-hover text-[#f7f5f5]"}`}
              onClick={() => handleNavigation("/storeMobile")}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 ${useLoc.pathname == "/storeMobile" ? "bg-valeo-blue" : ""}`}>
                <HomeIcon
                  sx={{
                    color: useLoc.pathname == "/storeMobile" ? "white" : "",
                    display: useLoc.pathname == "/storeMobile" ? "block" : "none"
                  }}
                />
                <HomeOutlinedIcon
                  sx={{
                    display: useLoc.pathname == "/storeMobile" ? "none" : "block"
                  }}
                />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.storeMobile")}</span>
            </button>
          </li>

        {/* add mobile page end  */}

          {/* add User page start */}

          <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${useLoc.pathname == "/Adduser" ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]" : "hover:bg-valeo-blue-hover text-[#f7f5f5]"}`}
              onClick={() => handleNavigation("/Adduser")}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 ${useLoc.pathname == "/Adduser" ? "bg-valeo-blue" : ""}`}>
                <HomeIcon
                  sx={{
                    color: useLoc.pathname == "/Adduser" ? "white" : "",
                    display: useLoc.pathname == "/Adduser" ? "block" : "none"
                  }}
                />
                <HomeOutlinedIcon
                  sx={{
                    display: useLoc.pathname == "/Adduser" ? "none" : "block"
                  }}
                />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.Adduser")}</span>
            </button>
          </li>


          {/* add User page end  */}

          {/* ScrapMobiles page start  */}

          <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${useLoc.pathname == "/scrapMobiles" ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]" : "hover:bg-valeo-blue-hover text-[#f7f5f5]"}`}
              onClick={() => handleNavigation("/ScrapMobiles")}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 ${useLoc.pathname == "/scrapMobiles" ? "bg-valeo-blue" : ""}`}>
                <HomeIcon
                  sx={{
                    color: useLoc.pathname == "/scrapMobiles" ? "white" : "",
                    display: useLoc.pathname == "/scrapMobiles" ? "block" : "none"
                  }}
                />
                <HomeOutlinedIcon
                  sx={{
                    display: useLoc.pathname == "/scrapMobiles" ? "none" : "block"
                  }}
                />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.scrapMobiles")}</span>
            </button>
  </li>

          {/* ScrapMobiles page end  */}

  {/* dashboard page start  */}

  <li>
            <button
              className={`flex gap-3 items-center px-4 py-2 rounded transition-all w-full ${useLoc.pathname == "/dashboard" ? "bg-valeo-green drop-shadow hover:bg-valeo-green-hover text-[#494949]" : "hover:bg-valeo-blue-hover text-[#f7f5f5]"}`}
              onClick={() => handleNavigation("/dashboard")}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 ${useLoc.pathname == "/dashboard" ? "bg-valeo-blue" : ""}`}>
                <HomeIcon
                  sx={{
                    color: useLoc.pathname == "/dashboard" ? "white" : "",
                    display: useLoc.pathname == "/dashboard" ? "block" : "none"
                  }}
                />
                <HomeOutlinedIcon
                  sx={{
                    display: useLoc.pathname == "/dashboard" ? "none" : "block"
                  }}
                />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.dashboard")}</span>
            </button>
  </li>

  {/* Dashboard page end  */}

          <li className="mt-auto">
            <button
              className={`flex gap-3 hover:bg-[#708A99] items-center px-4 py-2 rounded text-[#f7f5f5] transition-all w-full `}
              onClick={() => handleLogout()}
            >
              <div className={`flex h-7 items-center justify-center rounded w-7 `}>
                <ExitToAppIcon />
              </div>
              <span className="font-semibold text-xl">{t("nav_menu.log_out")}</span>
            </button>
          </li>
        </ul>
      </div>
    </Drawer>
  );
};

export default NavMenu;
