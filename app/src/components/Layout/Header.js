import { Fragment, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Global states
import { useSession } from "../../globalStates/session.state";

// MUI components
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip
} from "@mui/material";

// MUI icons
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LanguageIcon from '@mui/icons-material/Language';

// Components
import { Clock } from "./Clock";
import { LangContext, LANGS } from "../../utils/context/LangContext";

// Styles
import "../../styles/Header.css";

// Files
import GB_flag from "../../images/united-kingdom.png";
import DE_flag from "../../images/germany.png";
import UK_flag from "../../images/ukraine.png";
import Valeo from "../../images/valeo_logo.png";


const Header = function () {
  const { Lang, changeLang } = useContext(LangContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionState, sessionAction] = useSession();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLangSelect = (language) => {
    changeLang(language)
  }

  return (
    <header className="bg-[#f7f5f5] drop-shadow-md flex h-16 items-center justify-between sticky top-0 z-10">
      <div className="flex flex-row items-center ml-3">
        <IconButton onClick={() => sessionAction.setVar("open", !sessionState.open)} className="icon">
          {sessionState.open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
        <Clock />
      </div>
      <button className="p-1 rounded transition hover:bg-gray-200" onClick={() => (navigate("/"), sessionAction.setVar("open", false))}>
        <img src={Valeo} alt="Not found" id="logo" />
      </button>
      <div className="sm:hidden">
        <Tooltip arrow title="Language selector">
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            size="small"
          >
            <LanguageIcon sx={{ color: "#4e6b7c", fontSize: "2.75rem" }} />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          onClick={() => setAnchorEl(null)}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 24,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleLangSelect(LANGS.EN)}>
            <ListItemIcon>
              <img
                className={`h-10 ${Lang == "en" ? "" : "opacity-30"}`}
                src={GB_flag}
                alt="Not found"
                id="GB"
              />
            </ListItemIcon>
            <p className={`text-lg ml-3`}>English</p>
          </MenuItem>
          <MenuItem onClick={() => handleLangSelect(LANGS.DE)}>
            <ListItemIcon>
              <img
                className={`h-10 ${Lang == "de" ? "" : "opacity-30"}`}
                src={DE_flag}
                alt="Not found"
                id="DE"
              />
            </ListItemIcon>
            <p className={`text-lg ml-3`}>Deutsch</p>
          </MenuItem>
          {/* <MenuItem onClick={() => handleLangSelect(LANGS.UK)}>
            <ListItemIcon>
              <img
                className={`h-10 ${Lang == "uk" ? "" : "opacity-30"}`}
                src={UK_flag}
                alt="Not found"
                id="UK"
              />
            </ListItemIcon>
            <p className={`text-lg ml-3`}>українська</p>
          </MenuItem> */}
        </Menu>
      </div>
      <div className="hidden sm:block sm:visible">
        <button className="p-2 rounded-full transition hover:bg-gray-200" onClick={() => changeLang(LANGS.EN)}>
          <img
            className={`h-10 ${Lang == "en" ? "" : "opacity-30"
              }`}
            src={GB_flag}
            alt="Not found"
            id="GB"
          />
        </button>
        <button className="p-2 rounded-full transition hover:bg-gray-200" onClick={() => changeLang(LANGS.DE)}>
          <img
            className={`h-10 ${Lang == "de" ? "" : "opacity-30"}`}
            src={DE_flag}
            alt="Not found"
            id="DE"
          />
        </button>
        {/* <button className="p-2 rounded-full transition hover:bg-gray-200" onClick={() => changeLang(LANGS.UK)}>
          <img
            className={`h-10 ${Lang == "uk" ? "" : "opacity-30"
              }`}
            src={UK_flag}
            alt="Not found"
            id="UK"
          />
        </button> */}
      </div>
    </header>
  );
};

export default Header;
