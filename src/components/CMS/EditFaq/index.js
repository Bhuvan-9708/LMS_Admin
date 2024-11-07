import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Box,
    Snackbar,
    Alert
} from '@mui/material';

const EditFaqForm = ({ faqId }) => {
    const [faq, setFaq] = useState({
        title: '',
        description: '',
        content: [{ question: '', answers: '' }],
        is_deleted: false,
    });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const router = useRouter();

    useEffect(() => {
        if (faqId) {
            const fetchFaqData = async () => {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/faq/${faqId}`);
                    setFaq(response.data.data);
                } catch (error) {
                    console.error('Error fetching FAQ:', error);
                }
            };

            fetchFaqData();
        }
    }, [faqId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFaq(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (index, field, value) => {
        const newContent = [...faq.content];
        newContent[index][field] = value;
        setFaq(prev => ({ ...prev, content: newContent }));
    };

    const handleAddContent = () => {
        setFaq(prev => ({
            ...prev,
            content: [...prev.content, { question: '', answers: '' }],
        }));
    };

    const handleRemoveContent = (index) => {
        const newContent = [...faq.content];
        newContent.splice(index, 1);
        setFaq(prev => ({ ...prev, content: newContent }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/faq/update/${faqId}`, faq);
            setSnackbar({ open: true, message: 'FAQ updated successfully!', severity: 'success' });
            router.push('/cms/faq');
        } catch (error) {
            console.error('Error updating FAQ:', error);
            setSnackbar({ open: true, message: 'Failed to update FAQ.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Edit FAQ</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={faq.title}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={faq.description}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />

                    <Typography variant="h6" gutterBottom>Content</Typography>
                    {faq.content.map((item, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Question"
                                value={item.question}
                                onChange={(e) => handleContentChange(index, 'question', e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Answer"
                                value={item.answers}
                                onChange={(e) => handleContentChange(index, 'answers', e.target.value)}
                                margin="normal"
                                required
                            />
                            <Button onClick={() => handleRemoveContent(index)}>Remove</Button>
                        </Box>
                    ))}
                    <Button onClick={handleAddContent}>Add Question</Button>

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                        {loading ? 'Saving...' : 'Update FAQ'}
                    </Button>
                </form>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={2000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
};

export default EditFaqForm;
