"use client"
import React, { useState } from 'react';
import { TextField, Card, CardContent, Box, Button, FormControlLabel, Checkbox, Typography, Grid } from '@mui/material';
import axios from 'axios';

const SyllabusForm = () => {
    const [syllabus, setSyllabus] = useState({
        title: '',
        download_syllabus_link_text: '',
        download_syllabus_link: '',
        syllabus: {
            title: '',
            description: '',
            detailed_description: [
                {
                    title: '',
                    heading: [
                        { title: '', lesson_no: 1, time: '' }
                    ]
                }
            ]
        },
        is_deleted: false
    });

    const handleChange = (field, value) => {
        setSyllabus(prev => ({ ...prev, [field]: value }));
    };

    const handleSyllabusChange = (field, value) => {
        setSyllabus(prev => ({
            ...prev,
            syllabus: { ...prev.syllabus, [field]: value }
        }));
    };

    const handleDetailedDescriptionChange = (index, field, value) => {
        const updatedDetails = [...syllabus.syllabus.detailed_description];
        updatedDetails[index][field] = value;
        setSyllabus(prev => ({
            ...prev,
            syllabus: { ...prev.syllabus, detailed_description: updatedDetails }
        }));
    };

    const handleHeadingChange = (detailedIndex, headingIndex, field, value) => {
        const updatedDetails = [...syllabus.syllabus.detailed_description];
        updatedDetails[detailedIndex].heading[headingIndex][field] = value;
        setSyllabus(prev => ({
            ...prev,
            syllabus: { ...prev.syllabus, detailed_description: updatedDetails }
        }));
    };

    const addHeading = (detailedIndex) => {
        const updatedDetails = [...syllabus.syllabus.detailed_description];
        updatedDetails[detailedIndex].heading.push({ title: '', lesson_no: 1, time: '' });
        setSyllabus(prev => ({
            ...prev,
            syllabus: { ...prev.syllabus, detailed_description: updatedDetails }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/syllabus/create`, syllabus);
            console.log('Syllabus submitted successfully:', response.data);
            setSyllabus({
                title: '',
                download_syllabus_link_text: '',
                download_syllabus_link: '',
                syllabus: {
                    title: '',
                    description: '',
                    detailed_description: [
                        { title: '', heading: [{ title: '', lesson_no: 1, time: '' }] }
                    ]
                },
                is_deleted: false
            });
        } catch (error) {
            console.error('Error submitting syllabus:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Syllabus Title"
                                variant="outlined"
                                fullWidth
                                value={syllabus.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Download Syllabus Link Text"
                                variant="outlined"
                                fullWidth
                                value={syllabus.download_syllabus_link_text}
                                onChange={(e) => handleChange('download_syllabus_link_text', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Download Syllabus Link"
                                variant="outlined"
                                fullWidth
                                value={syllabus.download_syllabus_link}
                                onChange={(e) => handleChange('download_syllabus_link', e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Syllabus Title"
                                variant="outlined"
                                fullWidth
                                value={syllabus.syllabus.title}
                                onChange={(e) => handleSyllabusChange('title', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Syllabus Description"
                                variant="outlined"
                                fullWidth
                                value={syllabus.syllabus.description}
                                onChange={(e) => handleSyllabusChange('description', e.target.value)}
                            />
                        </Grid>
                        {syllabus.syllabus.detailed_description.map((detail, detailIndex) => (
                            <Grid container key={detailIndex} spacing={3}>
                                <Grid item xs={12}>
                                    <Card className="mt-3" style={{ width: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6">Detailed Description {detailIndex + 1}</Typography>
                                            <TextField
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
                                                                label="Time"
                                                                variant="outlined"
                                                                fullWidth
                                                                value={heading.time}
                                                                onChange={(e) =>
                                                                    handleHeadingChange(detailIndex, headingIndex, 'time', e.target.value)
                                                                }
                                                            />
                                                        </Box>
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
    );
};

export default SyllabusForm;