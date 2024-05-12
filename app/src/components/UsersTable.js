import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import { LangContext } from "../utils/context/LangContext";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import BlueTextField from '../components/BlueTextField'; // Assuming this is a styled MUI TextField
import DatePickerExample from './DatePickerExample'; // For date range selection

const UsersTable = ({ data }) => {
    const { t } = useContext(LangContext);
    const [searchEmail, setSearchEmail] = useState('');
    const [searchDepartment, setSearchDepartment] = useState('');
    const [searchDateRange, setSearchDateRange] = useState({ from_date: null, to_date: null });
    const [hoveredRow, setHoveredRow] = useState(null); 

    const handleDetails = (email, event) => {
        console.log(email)
        event.stopPropagation();
        navigate(`/details/${email}`);
    };

    const navigate = useNavigate();

    const filterData = (data, searchEmail, searchDepartment, searchDateRange) => {
        return data.filter(user => {
            const matchesEmail = user.email.toLowerCase().includes(searchEmail.toLowerCase());
            const matchesDepartment = user.department.trim().toLowerCase().includes(searchDepartment.toLowerCase());
            let matchesDateRange = true;
            if (searchDateRange.from_date && searchDateRange.to_date && user.created_at && user.created_at.date) {
                const userDate = new Date(user.created_at.date);
                const fromDate = new Date(searchDateRange.from_date);
                const toDate = new Date(searchDateRange.to_date);
                matchesDateRange = userDate >= fromDate && userDate <= toDate;
            }

            return matchesEmail && matchesDepartment && matchesDateRange;
        });
    };

    const filteredData = filterData(data, searchEmail, searchDepartment, searchDateRange);

    return (
        <TableContainer component={Paper} className="my-2">
            <Table className="w-full">
                <TableHead className="bg-valeo-blue text-[#f7f5f5]">
                    <TableRow>
                        <TableCell>
                            <BlueTextField 
                                label="Email"
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                            />
                        </TableCell>
                        <TableCell>
                            <BlueTextField 
                                label="Department"
                                value={searchDepartment}
                                onChange={(e) => setSearchDepartment(e.target.value)}
                            />
                        </TableCell>
                        <TableCell>
                            <DatePickerExample
                                selected={searchDateRange}
                                onChange={(update) => setSearchDateRange(update)}
                            />
                        </TableCell>
                        <TableCell style={{ color: "white" }}>
                            {t("common.created_at")}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>


{filteredData.reverse().map((user, index) => (
         <TableRow 
         key={user.userID} 
         hover
         onMouseEnter={() => setHoveredRow(index)} // Set hovered row
         onMouseLeave={() => setHoveredRow(null)} // Reset hovered row
     >
                          
                          <TableCell>{user.email}</TableCell>
                            <TableCell>{user.department.trim()}</TableCell>
                            <TableCell>{new Date(user.created_at.date).toLocaleString()}</TableCell>

                            <TableCell className="text-center">
                            <HistoryIcon 
    style={{ 
        color: '#164863', 
        visibility: hoveredRow === index ? 'visible' : 'hidden'
    }}
    onClick={(event) => handleDetails(user.email, event)}
/>

                            </TableCell>
                        </TableRow>
                    ))}






                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsersTable;
