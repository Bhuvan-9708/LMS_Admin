"use client"
import React, { useState } from 'react';
import { TextField, Card, CardContent, Box, Button, FormControlLabel, Checkbox, Typography, Grid, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SyllabusForm = () => {
    const [syllabus, setSyllabus] = useState({
        title: '',
        download_syllabus_link_text: '',
        download_syllabus_link: '',
        description: '',
        detailed_description: [
            {
                title: '',
                heading: [
                    { title: '', lesson_no: 1, time: '' }
                ]
            }
        ],
        is_deleted: false
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
    const router = useRouter();

    const handleChange = (field, value) => {
        setSyllabus(prev => ({ ...prev, [field]: value }));
    };

    const handleDetailedDescriptionChange = (index, field, value) => {
        const updatedDetails = [...syllabus.detailed_description];
        updatedDetails[index][field] = value;
        setSyllabus(prev => ({
            ...prev,
            detailed_description: updatedDetails
        }));
    };

    const handleHeadingChange = (detailedIndex, headingIndex, field, value) => {
        const updatedDetails = [...syllabus.detailed_description];
        updatedDetails[detailedIndex].heading[headingIndex][field] = value;
        setSyllabus(prev => ({
            ...prev,
            detailed_description: updatedDetails
        }));
    };

    const addHeading = (detailedIndex) => {
        const updatedDetails = [...syllabus.detailed_description];
        updatedDetails[detailedIndex].heading.push({ title: '', lesson_no: 1, time: '' });
        setSyllabus(prev => ({
            ...prev,
            detailed_description: updatedDetails
        }));
    };

    const removeHeading = (detailedIndex, headingIndex) => {
        const updatedDetails = [...syllabus.detailed_description];
        updatedDetails[detailedIndex].heading.splice(headingIndex, 1);
        setSyllabus(prev => ({
            ...prev,
            detailed_description: updatedDetails
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/syllabus/create`, syllabus);
            console.log('Syllabus submitted successfully:', response.data);
            setSnackbarMessage('Syllabus submitted successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            router.push('/cms/syllabus');
            setSyllabus({
                title: '',
                download_syllabus_link_text: '',
                download_syllabus_link: '',
                description: '',
                detailed_description: [
                    { title: '', heading: [{ title: '', lesson_no: 1, time: '' }] }
                ],
                is_deleted: false
            });
        } catch (error) {
            console.error('Error submitting syllabus:', error);
            setSnackbarMessage('Error submitting syllabus. Please try again.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Syllabus Title"
                                    variant="outlined"
                                    fullWidth
                                    value={syllabus.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Download Syllabus Link Text"
                                    variant="outlined"
                                    fullWidth
                                    value={syllabus.download_syllabus_link_text}
                                    onChange={(e) => handleChange('download_syllabus_link_text', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Download Syllabus Link"
                                    variant="outlined"
                                    fullWidth
                                    value={syllabus.download_syllabus_link}
                                    onChange={(e) => handleChange('download_syllabus_link', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Description"
                                    variant="outlined"
                                    fullWidth
                                    value={syllabus.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                            </Grid>

                            {syllabus.detailed_description.map((detail, detailIndex) => (
                                <Grid container key={detailIndex} spacing={3}>
                                    <Grid item xs={12}>
                                        <Card className="mt-3" style={{ width: '100%' }}>
                                            <CardContent>
                                                <Typography variant="h6">Detailed Description {detailIndex + 1}</Typography>
                                                <TextField
                                                    required
                                                    label="Title"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={detail.title}
                                                    onChange={(e) => handleDetailedDescriptionChange(detailIndex, 'title', e.target.value)}
                                                />
                                                {detail.heading.map((heading, headingIndex) => (
                                                    <Card key={headingIndex} className="mt-3" style={{ width: '100%' }}>
                                                        <CardContent>
                                                            <Typography variant="subtitle1">Heading {headingIndex + 1}</Typography>
                                                            <Box mb={2}>
                                                                <TextField
                                                                    required
                                                                    label="Heading Title"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    value={heading.title}
                                                                    onChange={(e) =>
                                                                        handleHeadingChange(detailIndex, headingIndex, 'title', e.target.value)
                                                                    }
                                                                />
                                                            </Box>
                                                            <Box mb={2}>
                                                                <TextField
                                                                    required
                                                                    label="Lesson No"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    type="number"
                                                                    value={heading.lesson_no}
                                                                    onChange={(e) =>
                                                                        handleHeadingChange(detailIndex, headingIndex, 'lesson_no', e.target.value)
                                                                    }
                                                                />
                                                            </Box>
                                                            <Box mb={2}>
                                                                <TextField
                                                                    required
                                                                    label="Time"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    value={heading.time}
                                                                    onChange={(e) =>
                                                                        handleHeadingChange(detailIndex, headingIndex, 'time', e.target.value)
                                                                    }
                                                                />
                                                            </Box>
                                                            <Button
                                                                sx={{ mt: 1 }}
                                                                variant="outlined"
                                                                color="error"
                                                                onClick={() => removeHeading(detailIndex, headingIndex)}
                                                            >
                                                                Remove Heading
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                                <Button sx={{ m: 2 }} variant="contained" onClick={() => addHeading(detailIndex)}>
                                                    Add Heading
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            ))}

                            <FormControlLabel sx={{ m: 2 }}
                                control={
                                    <Checkbox
                                        checked={syllabus.is_deleted}
                                        onChange={(e) => handleChange('is_deleted', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Is Deleted"
                            />
                        </Grid>
                        <Button sx={{ m: 2 }} type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </CardContent>
                </Card>
            </form>

            <Snackbar open={openSnackbar} autoHideDuration={1000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default SyllabusForm;
