"use client";
import React, { useState } from 'react';
import {
    TextField,
    Card,
    CardContent,
    Box,
    Button,
    FormControlLabel,
    Checkbox,
    Typography,
    Grid,
    Snackbar,
    Alert
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CertificateForm = () => {
    const [certificateData, setCertificateData] = useState({
        certification_title: '',
        certification_heading: '',
        certificate_image: null,
        text_displayed_on_frontend: '',
        certification_details: [
            {
                title: '',
                description: ''
            }
        ],
        is_deleted: false
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const router = useRouter();

    const handleChange = (field, value) => {
        setCertificateData(prev => ({ ...prev, [field]: value }));
    };

    const handleDetailChange = (index, field, value) => {
        const updatedDetails = [...certificateData.certification_details];
        updatedDetails[index][field] = value;
        setCertificateData(prev => ({ ...prev, certification_details: updatedDetails }));
    };

    const addDetail = () => {
        setCertificateData(prev => ({
            ...prev,
            certification_details: [...prev.certification_details, { title: '', description: '' }]
        }));
    };

    const removeDetail = (index) => {
        const updatedDetails = certificateData.certification_details.filter((_, i) => i !== index);
        setCertificateData(prev => ({ ...prev, certification_details: updatedDetails }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setCertificateData(prev => ({ ...prev, certificate_image: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('certification_title', certificateData.certification_title);
        formData.append('certification_heading', certificateData.certification_heading);
        formData.append('certificate_image', certificateData.certificate_image);
        formData.append('text_displayed_on_frontend', certificateData.text_displayed_on_frontend);
        formData.append('is_deleted', certificateData.is_deleted);

        certificateData.certification_details.forEach((detail, index) => {
            formData.append(`certification_details[${index}][title]`, detail.title);
            formData.append(`certification_details[${index}][description]`, detail.description);
        });

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/certificate/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSnackbar({
                open: true,
                message: 'Certificate submitted successfully!',
                severity: 'success'
            });
            setCertificateData({
                certification_title: '',
                certification_heading: '',
                certificate_image: null,
                text_displayed_on_frontend: '',
                certification_details: [{ title: '', description: '' }],
                is_deleted: false
            });
            router.push('/cms/certificate');
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error submitting certificate. Please try again.',
                severity: 'error'
            });
            console.error('Error submitting certificate:', error);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                label="Certification Title"
                                variant="outlined"
                                fullWidth
                                value={certificateData.certification_title}
                                onChange={(e) => handleChange('certification_title', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                label="Certification Heading"
                                variant="outlined"
                                fullWidth
                                value={certificateData.certification_heading}
                                onChange={(e) => handleChange('certification_heading', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                required
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                label="Text Displayed on Frontend"
                                variant="outlined"
                                fullWidth
                                value={certificateData.text_displayed_on_frontend}
                                onChange={(e) => handleChange('text_displayed_on_frontend', e.target.value)}
                            />
                        </Grid>

                        {certificateData.certification_details.map((detail, index) => (
                            <Grid container key={index} spacing={2} alignItems="center">
                                <Grid item xs={12}>
                                    <Typography sx={{ p: 2 }} variant="h6">Certification Detail {index + 1}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        sx={{ m: 1 }}
                                        label="Detail Title"
                                        variant="outlined"
                                        fullWidth
                                        value={detail.title}
                                        onChange={(e) => handleDetailChange(index, 'title', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        sx={{ m: 1 }}
                                        label="Detail Description"
                                        variant="outlined"
                                        fullWidth
                                        value={detail.description}
                                        onChange={(e) => handleDetailChange(index, 'description', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        sx={{ m: 1 }}
                                        variant="outlined"
                                        color="error"
                                        onClick={() => removeDetail(index)}
                                    >
                                        Remove Detail
                                    </Button>
                                </Grid>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Button variant="contained" onClick={addDetail}>
                                Add Detail
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={certificateData.is_deleted}
                                        onChange={(e) => handleChange('is_deleted', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Is Deleted"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </form>
    );
};

export default CertificateForm;
