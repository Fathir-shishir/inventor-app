import { useContext } from "react";

// MUI components
import { Alert, Snackbar } from "@mui/material";

// Components
import { LangContext } from "../utils/context/LangContext";

const ErrorAlert = (props) => {
    const { t } = useContext(LangContext);
    const handleClose = () => props.setOpen(false);

    return (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            autoHideDuration={5000}
            onClose={handleClose}
            open={props.open}
        >
            <Alert color="error" onClose={handleClose} severity="error" sx={{ backgroundColor: "red", color: "#fff", width: '100%', ".MuiAlert-icon": { color: "#fff" } }}>
                {props.children || t("notifications.error")}
            </Alert>
        </Snackbar>
    )
}

export default ErrorAlert;