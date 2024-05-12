// MUI components
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTextField = styled(TextField)({
    "& input": {
        color: "#f7f5f5",
    },
    "& label": {
        color: "#f7f5f5",
    },
    "& .MuiSelect-select": {
        color: "#f7f5f5",
    },
    "& label.Mui-focused": { color: "#f7f5f5" },
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
    }
});

const BlueTextField = (props) => {
    return <CustomTextField {...props} />
}

export default BlueTextField;