import { useContext } from 'react';
import 'moment/locale/de';


// MUI
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LangContext } from '../utils/context/LangContext';
import { styled } from "@mui/material/styles";


const CustomDateTimePicker = styled(DateTimePicker)({
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


const BasicDateTimePicker = (props) => {
    const { Lang } = useContext(LangContext);

    return (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={Lang}>
            <CustomDateTimePicker {...props} />
        </LocalizationProvider>
    )
}

export default BasicDateTimePicker