"use client";
import React, { useState } from 'react';
import { TextField, Card, CardContent, Box, Button, FormControlLabel, Checkbox, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AddFaqForm = () => {
    const [faq, setFaq] = useState({
        title: '',
        description: '',
        content: [
            { question: '', answers: '' }
        ],
        is_deleted: false
    });
    const router = useRouter();
    const handleChange = (field, value) => {
        setFaq(prev => ({ ...prev, [field]: value }));
    };

    const handleContentChange = (index, field, value) => {
        const updatedContent = [...faq.content];
        updatedContent[index][field] = value;
        setFaq(prev => ({
            ...prev,
            content: updatedContent
        }));
    };

    const addContent = () => {
        setFaq(prev => ({
            ...prev,
            content: [...prev.content, { question: '', answers: '' }]
        }));
    };

    const removeContent = (index) => {
        setFaq(prev => ({
            ...prev,
            content: prev.content.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/faq/create`, faq);
            console.log('FAQ submitted successfully:', response.data);
            router.push('/cms/faq')
            setFaq({
                title: '',
                description: '',
                content: [{ question: '', answers: '' }],
                is_deleted: false
            });
        } catch (error) {
            console.error('Error submitting FAQ:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="FAQ Title"
                                variant="outlined"
                                fullWidth
                                value={faq.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="FAQ Description"
                                variant="outlined"
                                fullWidth
                                value={faq.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </Grid>
                        {faq.content.map((item, index) => (
                            <Grid container key={index} spacing={3}>
                                <Grid item xs={12}>
                                    <Card className="mt-3" style={{ width: '100%' }}>
                                        <CardContent>
                                            <Typography variant="h6">Content {index + 1}</Typography>
                                            <Box mb={2}>
                                                <TextField
                                                    label="Question"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={item.question}
                                                    onChange={(e) => handleContentChange(index, 'question', e.target.value)}
                                                />
                                            </Box>
                                            <Box mb={2}>
                                                <TextField
                                                    label="Answer"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={item.answers}
                                                    onChange={(e) => handleContentChange(index, 'answers', e.target.value)}
                                                />
                                            </Box>
                                            <Button
                                                sx={{ mt: 1 }}
                                                variant="outlined"
                                                color="error"
                                                onClick={() => removeContent(index)}
                                            >
                                                Remove
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Button sx={{ m: 2 }} variant="contained" onClick={addContent}>
                                Add Content
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                sx={{ m: 2 }}
                                control={
                                    <Checkbox
                                        checked={faq.is_deleted}
                                        onChange={(e) => handleChange('is_deleted', e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Is Deleted"
                            />
                        </Grid>
                    </Grid>
                    <Button sx={{ m: 2, width: 200 }} type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
};

export default AddFaqForm;
