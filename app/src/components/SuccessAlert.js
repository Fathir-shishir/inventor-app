import { useContext } from "react";

// MUI components
import { Alert, Snackbar } from "@mui/material";

// Components
import { LangContext } from "../utils/context/LangContext";

const SuccessAlert = (props) => {
    const { t } = useContext(LangContext);
    const handleClose = () => props.setOpen(false);

    return (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            autoHideDuration={5000}
            onClose={handleClose}
            open={props.open}
        >
            <Alert color="success" onClose={handleClose} severity="success" sx={{ backgroundColor: "rgb(46, 125, 50)", color: "#fff", width: '100%', ".MuiAlert-icon": { color: "#fff" } }}>
                {props.children || t("notifications.success")}
            </Alert>
        </Snackbar>
    )
}

export default SuccessAlert;