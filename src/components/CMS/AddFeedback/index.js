"use client";
import React, { useState } from 'react';
import { TextField, Card, CardContent, Button, FormControlLabel, Checkbox, Typography, Grid, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const DynamicForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        join_now_text: '',
        join_now_url: '',
        entries: [
            {
                name: '',
                comment: '',
                date: ''
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

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleEntryChange = (index, field, value) => {
        const updatedEntries = [...formData.entries];
        updatedEntries[index][field] = value;
        setFormData(prev => ({ ...prev, entries: updatedEntries }));
    };

    const addEntry = () => {
        setFormData(prev => ({
            ...prev,
            entries: [...prev.entries, { name: '', comment: '', date: '' }]
        }));
    };

    const removeEntry = (index) => {
        const updatedEntries = formData.entries.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, entries: updatedEntries }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/create`, formData);
            console.log('Form submitted successfully:', response.data);
            setSnackbar({
                open: true,
                message: 'Feedback submitted successfully!',
                severity: 'success'
            });
            setFormData({
                title: '',
                description: '',
                join_now_text: '',
                join_now_url: '',
                entries: [{ name: '', comment: '', date: '' }],
                is_deleted: false
            });
            router.push('/cms/feedback');
        } catch (error) {
            console.error('Error submitting form:', error);
            setSnackbar({
                open: true,
                message: 'Error submitting Feedback. Please try again.',
                severity: 'error'
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                label="Title"
                                variant="outlined"
                                fullWidth
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                label="Description"
                                variant="outlined"
                                fullWidth
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                label="Join Now Text"
                                variant="outlined"
                                fullWidth
                                value={formData.join_now_text}
                                onChange={(e) => handleChange('join_now_text', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                label="Join Now URL"
                                variant="outlined"
                                fullWidth
                                value={formData.join_now_url}
                                onChange={(e) => handleChange('join_now_url', e.target.value)}
                            />
                        </Grid>

                        {formData.entries.map((entry, index) => (
                            <Grid container key={index} spacing={2} alignItems="center">
                                <Grid item xs={12}>
                                    <Typography sx={{ p: 2 }} variant="h6">Entry {index + 1}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        sx={{ m: 1 }}
                                        label="Name"
                                        variant="outlined"
                                        fullWidth
                                        value={entry.name}
                                        onChange={(e) => handleEntryChange(index, 'name', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        sx={{ m: 1 }}
                                        label="Comment"
                                        variant="outlined"
                                        fullWidth
                                        value={entry.comment}
                                        onChange={(e) => handleEntryChange(index, 'comment', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        sx={{ m: 1 }}
                                        label="Date"
                                        variant="outlined"
                                        fullWidth
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={entry.date}
                                        onChange={(e) => handleEntryChange(index, 'date', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        sx={{ m: 1 }}
                                        variant="outlined"
                                        color="error"
                                        onClick={() => removeEntry(index)}
                                    >
                                        Remove Entry
                                    </Button>
                                </Grid>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Button variant="contained" onClick={addEntry}>
                                Add Entry
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.is_deleted}
                                        onChange={(e) => handleChange('is_deleted', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Is Deleted"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button sx={{ width: 200 }} type="submit" variant="contained" color="primary">
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
        </form >
    );
};

export default DynamicForm;
