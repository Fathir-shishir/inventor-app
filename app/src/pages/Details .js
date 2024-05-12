import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from "../components/Layout/Layout";
import HardwareIcon from '@mui/icons-material/Hardware';
import { Card, CardContent, Typography, CircularProgress, Button } from '@mui/material';

const Details = () => {
    let { email } = useParams();
    const [assignmentDetails, setAssignmentDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const renderData = (data) => {
        if (data && typeof data === 'object') {
            return Object.entries(data).map(([key, value]) => {
                if (key === 'created_at') {
                    return (
                        <Typography key={key} variant="body2" color="textSecondary" component="p">
                            <strong>{key.replace('_', ' ')}:</strong> {new Date(value.date).toLocaleString()}
                        </Typography>
                    );
                } else if (key === 'signature_data') {
                    return (
                        <div key={key}>
                            <strong>{key.replace('_', ' ')}:</strong>
                            {value ? <img src={value} alt="Signature" /> : "No signature available"}
                        </div>
                    );
                } else {
                    return (
                        <Typography key={key} variant="body2" color="textSecondary" component="p">
                            <strong>{key.replace('_', ' ')}:</strong> {typeof value === 'object' ? renderData(value) : value}
                        </Typography>
                    );
                }
            });
        }
        return data;
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8005/api/details.php?assignedTo=${email}`);
            if (response.data && response.data.assignments) {
                setAssignmentDetails(response.data.assignments);
            } else {
                console.error('No data found for this ID:', email);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [email]);

    const handleEdit = (assignmentId) => {
        navigate(`/editMobile/${assignmentId}`);
    };

    const handleBackToInventory = async (assignmentId, model) => {
        if (window.confirm("Are you sure you want to go back to inventory?")) {
            try {
                const response = await axios.post(`http://localhost:8005/api/backToInventory.php`, { assignmentId, model });
                console.log(response.data);
            } catch (error) {
                console.error('Error going back to inventory:', error);
            }
        }
    };

    const handleScrap = async (assignmentId, model) => {
        if (window.confirm("Are you sure you want to scrap this assignment?")) {
            try {
                const response = await axios.post(`http://localhost:8005/api/handlemobileScrap.php`, { assignmentId, model });
                console.log(response.data);
            } catch (error) {
                console.error('Error scrapping assignment:', error);
            }
        }
    };

    const content = () => {
        if (loading) {
            return <div className="text-center p-5"><CircularProgress /></div>;
        }
        if (!assignmentDetails || assignmentDetails.length === 0) {
            return <div className="text-center p-5">No data found.</div>;
        }
        return (
            <div className="container mx-auto p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {assignmentDetails.map((assignment, index) => (
                        <Card key={index} className="m-2">
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    <HardwareIcon /> Assignment Details
                                </Typography>
                                <ul className="list-disc pl-5">
                                    {renderData(assignment)}
                                </ul>
                                <div className="mt-3 flex justify-between">
                                    <Button variant="contained" onClick={() => handleEdit(assignment.id)}>Edit</Button>
                                    <Button variant="contained" onClick={() => handleBackToInventory(assignment.id, assignment.model)}>Back to Inventory</Button>
                                    <Button variant="contained" onClick={() => handleScrap(assignment.id, assignment.model)}>Scrap</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    };

    return <Layout>{content()}</Layout>;
}

export default Details;
