import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import UsersTable from '../components/UsersTable';
import Layout from "../components/Layout/Layout";

const History = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8005/api/GetAllUsers.php') // Adjust this URL to your actual API endpoint
        .then(res => res.json())
        .then(response => {
            // Ensure response has 'success' flag and 'users' array
            if (response.success && response.users) {
                setData(response.users);
            }
        })
        .catch(error => console.error("There was an error fetching the users:", error));
    }, []);

    return (
        <Layout>


        <div>
            <UsersTable data={data}  />
        </div>
  { /*    <TableContainer component={Paper} className="my-2">
            <Table className="w-full">
                <TableHead className="bg-your-color text-[#f7f5f5]">
                    <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Created At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((user, index) => (
                        <TableRow key={index}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.department.trim()}</TableCell> {/* Trim department to remove extra spaces 
                            <TableCell>{user.created_at ? new Date(user.created_at.date).toLocaleString() : 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
                    </TableContainer> */}
        </Layout>
    );
};

export default History;

