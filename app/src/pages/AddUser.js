import React, { useState } from 'react';
import axios from 'axios';
import Layout from "../components/Layout/Layout";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

const AddUser = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        department: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8005/api/addUsers.php', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Form Data Submitted:', formData);

            if (response.data.success) {
                alert(response.data.success );
                setFormData({
                    email: '',
                    department: ''
                });
                // navigate("/pathToSomePage"); // Optional: Navigate to another page upon success
            } else if (response.data.error) {
                alert(response.data.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again later.');
        }
    };

    return (
        <Layout>
            <h1 className="text-center font-semibold p-3 text-4xl">Add User</h1>
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <div className="w-full px-3 mb-6">
                        <TextField
                            label="Email"
                            variant="outlined"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <TextField
                            label="Department"
                            variant="outlined"
                            name="department"
                            type="text"
                            value={formData.department}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </div>
                    <div className="flex justify-center mt-6">
                        <Button variant="contained" type="submit" color="primary">
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default AddUser;
