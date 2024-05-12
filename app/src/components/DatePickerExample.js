import React, { useState,useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { LangContext } from "../utils/context/LangContext";
const DatePickerExample = ({ onChange }) => {
    const { t } = useContext(LangContext);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleDateChange = (updates) => {
        const [start, end] = updates;
        setStartDate(start);
        setEndDate(end);
        onChange({
            from_date: start ? moment(start).format("YYYY-MM-DD") : null,
            to_date: end ? moment(end).format("YYYY-MM-DD") : null
        });
    };

    return (
        <>
            <style>
                {`
                .react-datepicker-wrapper .react-datepicker__input-container input {
                    color: #f7f5f5;
                    background-color: transparent;
                    border: 1px solid rgba(0, 0, 0, 0.282);
                    border-radius: 4px;
                    padding: 10px 12px;
                    font-size: 16px;
                    width: 100%;
                }

                .react-datepicker-wrapper .react-datepicker__input-container input:hover {
                    border-color: #a0f630;
                }

                .react-datepicker-wrapper .react-datepicker__input-container input:focus {
                    outline: none;
                    border-color: #82e600;
                    box-shadow: 0 0 0 2px rgba(130, 230, 0, 0.2);
                }

                .react-datepicker-wrapper .react-datepicker__input-container input::placeholder {
                    color: white; /* Change placeholder text color to white */
                    opacity: 1; /* Make sure it's fully opaque */
                }
                
                `}
            </style>
            <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                isClearable={true}
                placeholderText={t("common.choose_date")}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker-input" // This class is not strictly necessary unless used elsewhere
            />
        </>
    );
};

export default DatePickerExample;
