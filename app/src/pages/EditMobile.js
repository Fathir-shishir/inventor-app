import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, CircularProgress, Typography, Container } from '@mui/material';
import Layout from "../components/Layout/Layout";
import SignatureCanvas from 'react-signature-canvas';

const EditMobile = () => {
    const { assignmentId } = useParams();
    const [assignmentData, setAssignmentData] = useState({});
    const [loading, setLoading] = useState(true);
    const signatureCanvasRef = useRef(null);

    useEffect(() => {
        const fetchAssignmentData = async () => {
            try {
                const response = await axios.get(`http://localhost:8005/api/getsingleAssignedData.php?assignmentId=${assignmentId}`);
                setAssignmentData(response.data);
            } catch (error) {
                console.error('Error fetching assignment data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentData();
    }, [assignmentId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssignmentData({ ...assignmentData, [name]: value });
    };

    const handleClearSignature = () => {
        if (signatureCanvasRef.current) {
            signatureCanvasRef.current.clear();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let signatureImage = '';
            if (signatureCanvasRef.current.isEmpty()) {
                signatureImage = assignmentData.signature_data;
            } else {
                signatureImage = signatureCanvasRef.current.toDataURL();
            }
            await axios.put(`http://localhost:8005/api/updateAssignedMobile.php?assignmentId=${assignmentId}`, { ...assignmentData, signatureImage });
            alert('Assignment data updated successfully.');
        } catch (error) {
            console.error('Error updating assignment data:', error);
            alert('Error updating assignment data. Please try again.');
        }
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Layout>
            <Container>
                <Typography variant="h4" align="center" gutterBottom>
                    Edit Assignment
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Model"
                        name="model"
                        value={assignmentData.model || ''}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="IMEI"
                        name="imei"
                        value={assignmentData.imei || ''}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Serial Number"
                        name="serial_number"
                        value={assignmentData.serial_number || ''}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Comment"
                        name="comment"
                        value={assignmentData.comment || ''}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Assigned To"
                        name="assignedTo"
                        value={assignmentData.assignedTo || ''}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    {assignmentData.signature_data && ( // Check if there is a signature image
                        <div>
                            <Typography variant="h6" gutterBottom>
                                Previous Signature:
                            </Typography>
                            <img src={assignmentData.signature_data} alt="Previous Signature" style={{ maxWidth: '100%', marginBottom: '10px' }} />
                        </div>
                    )}
                    <Typography variant="h6" gutterBottom>
                        New Signature:
                    </Typography>
                    <SignatureCanvas
                        ref={signatureCanvasRef}
                        penColor="black"
                        canvasProps={{ width: 500, height: 200, style: { border: '1px solid black' } }}
                    />
                    <Button variant="contained" type="button" color="secondary" onClick={handleClearSignature} style={{ marginTop: '10px', marginRight: '10px' }}>
                        Clear Signature
                    </Button>
                    <Button variant="contained" type="submit" color="primary" size="large" style={{ marginTop: '10px' }}>
                        Update
                    </Button>
                </form>
            </Container>
        </Layout>
    );
};

export default EditMobile;
