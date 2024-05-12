import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../components/Layout/Layout";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete'; // Import Autocomplete
import Button from '@mui/material/Button';
import { useSession } from "../globalStates/session.state";
import { useNavigate } from "react-router-dom";

const AddMobile = () => {
    const navigate = useNavigate();

    const [sessionState, sessionAction] = useSession();

    useEffect(() => {
        if (!sessionState.name) {
            axios.post(`/api/Layout/get_session_data.php`).then(res => {
                if (res.data.errors === 0) {
                    sessionAction.setSession(res.data.session_data);
                } else {
                    return navigate("/login");
                }
            });
        }
    }, [sessionAction, navigate, sessionState.name]);

    const [formData, setFormData] = useState({
        model: '',
        condition: '',
        quantities: '',
        mobileHistory: sessionState.name // Use sessionState.name as the initial value
    });

    useEffect(() => {
        // Wait for a few seconds after component mounts and then update the state
        const timer = setTimeout(() => {
            // Only update if sessionState.name is not null or undefined
            if (sessionState.name) {
                setFormData(formData => ({
                    ...formData,
                    mobileHistory: sessionState.name
                }));
            }
        }, 2000); // Wait for 2000 milliseconds (2 seconds) before updating

        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, [sessionState.name]);

    const handleChange = (event, value, field) => {
        // Updated to handle changes from Autocomplete component as well
        if (value !== undefined) {
            // This is for the Autocomplete component
            setFormData({ ...formData, [field]: value });
        } else {
            // This is for the other input fields
            const { name, value } = event.target;
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8005/api/addMobiles.php', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Form Data Submitted:', formData);

            if (response.data.success) {
                alert(response.data.success);
                setFormData({
                    model: '',
                    condition: '',
                    quantities: '',
                    mobileHistory: sessionState.name || '' // Reset with sessionState.name
                });
            } else if (response.data.error) {
                alert(response.data.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again later.');
        }
    };

    // Define the models array for suggestions
    const models = ['Sumsung A54', 'Iphone SE', 'Sumsung A53', 'Sumsung Tab S8'];
    const conditions = ['New', 'Used'];

    return (
        <Layout>
            <h1 className="text-center font-semibold p-3 text-4xl">Add Mobile Inventory</h1>
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <div className="w-full px-3 mb-6">
                        <Autocomplete
                            freeSolo
                            options={models}
                            onChange={(event, newValue) => {
                                handleChange(event, newValue, 'model'); // Pass 'model' as the field name
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Model"
                                    variant="outlined"
                                    name="model"
                                    fullWidth
                                    required
                                />
                            )}
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <Autocomplete
                            options={conditions}
                            onChange={(event, newValue) => {
                                handleChange(event, newValue, 'condition'); // Pass 'condition' as the field name
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Condition"
                                    variant="outlined"
                                    name="condition"
                                    fullWidth
                                    required
                                />
                            )}
                        />
                    </div>
                    <div className="w-full px-3 mb-6">
                        <TextField
                            label="Quantities"
                            variant="outlined"
                            name="quantities"
                            type="number"
                            value={formData.quantities}
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

export default AddMobile;
