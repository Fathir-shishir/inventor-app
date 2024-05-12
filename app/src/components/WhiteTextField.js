// MUI components
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTextField = styled(TextField)({
    "& input": {
        color: "#333",
    },
    "& label": {
        color: "#4e6b7c",
    },
    "& .MuiSelect-select": {
        color: "#4e6b7c",
    },
    "& label.Mui-focused": { color: "#4e6b7c" },
    "& .MuiOutlinedInput-root": {
        "&:hover fieldset": { borderColor: "#a0f630" },
        "&.Mui-focused fieldset": {
            borderColor: "#82e600",
        },
        "&.Mui-error:hover fieldset": {
            borderColor: "#f87171",
        },
        "&.Mui-error.Mui-focused fieldset": {
            borderColor: "red",
        },
    },
});

const WhiteTextField = (props) => {
    return <CustomTextField {...props} />
}

export default WhiteTextField;