"use client";
import React, { useState } from 'react';
import { TextField, Card, CardContent, Button, FormControlLabel, Checkbox, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const FeedbackForm = () => {
    const [feedbackData, setFeedbackData] = useState({
        title: '',
        description: '',
        join_now_text: '',
        join_now_url: '',
        feedbacks: [
            {
                name: '',
                feedback: '',
                date: ''
            }
        ],
        is_deleted: false
    });
    const router = useRouter();
    const handleChange = (field, value) => {
        setFeedbackData(prev => ({ ...prev, [field]: value }));
    };

    const handleFeedbackChange = (index, field, value) => {
        const updatedFeedbacks = [...feedbackData.feedbacks];
        updatedFeedbacks[index][field] = value;
        setFeedbackData(prev => ({ ...prev, feedbacks: updatedFeedbacks }));
    };

    const addFeedback = () => {
        setFeedbackData(prev => ({
            ...prev,
            feedbacks: [...prev.feedbacks, { name: '', feedback: '', date: '' }]
        }));
    };

    const removeFeedback = (index) => {
        const updatedFeedbacks = feedbackData.feedbacks.filter((_, i) => i !== index);
        setFeedbackData(prev => ({ ...prev, feedbacks: updatedFeedbacks }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/create`, feedbackData);
            console.log('Feedback submitted successfully:', response.data);
            router.push('/cms/feedback')
            setFeedbackData({
                title: '',
                description: '',
                join_now_text: '',
                join_now_url: '',
                feedbacks: [{ name: '', feedback: '', date: '' }],
                is_deleted: false
            });
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                value={feedbackData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                variant="outlined"
                                fullWidth
                                value={feedbackData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Join Now Text"
                                variant="outlined"
                                fullWidth
                                value={feedbackData.join_now_text}
                                onChange={(e) => handleChange('join_now_text', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Join Now URL"
                                variant="outlined"
                                fullWidth
                                value={feedbackData.join_now_url}
                                onChange={(e) => handleChange('join_now_url', e.target.value)}
                            />
                        </Grid>

                        {feedbackData.feedbacks.map((fb, index) => (
                            <Grid container key={index} spacing={2} alignItems="center">
                                <Grid item xs={12} >
                                    <Typography sx={{ p: 2 }} variant="h6">Feedback {index + 1}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        sx={{ m: 1 }}
                                        label="Name"
                                        variant="outlined"
                                        fullWidth
                                        value={fb.name}
                                        onChange={(e) => handleFeedbackChange(index, 'name', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        sx={{ m: 1 }}
                                        label="Feedback"
                                        variant="outlined"
                                        fullWidth
                                        value={fb.feedback}
                                        onChange={(e) => handleFeedbackChange(index, 'feedback', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        sx={{ m: 1 }}
                                        label="Date"
                                        variant="outlined"
                                        fullWidth
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={fb.date}
                                        onChange={(e) => handleFeedbackChange(index, 'date', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        sx={{ m: 1 }}
                                        variant="outlined"
                                        color="error"
                                        onClick={() => removeFeedback(index)}
                                    >
                                        Remove Feedback
                                    </Button>
                                </Grid>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Button variant="contained" onClick={addFeedback}>
                                Add Feedback
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={feedbackData.is_deleted}
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
        </form>
    );
};

export default FeedbackForm;
