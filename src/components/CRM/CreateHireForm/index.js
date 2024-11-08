"use client"
import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Container,
    Box,
    Snackbar,
    Alert,
    InputAdornment,
    IconButton
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const HireFromUsForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        heading: "",
        short_desc: "",
        description: "",
        button_text: "",
        button_url: "",
        community_title: "",
        community_description: "",
        community_image: null,
        faq: "",
    });
    const [faqs, setFaqs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faq`);
                if (!response.ok) throw new Error("Failed to fetch FAQs");

                const data = await response.json();
                setFaqs(data.data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchFaqs();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                community_image: file, // Store the image file
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formDataToSubmit = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === "community_image") {
                formDataToSubmit.append(key, formData[key]); // Append the image file
            } else {
                formDataToSubmit.append(key, formData[key]);
            }
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hire-from-us/create/`, {
                method: "POST",
                body: formDataToSubmit, // Send FormData to handle file upload
            });

            if (!response.ok) throw new Error("Failed to add HireFromUs entry");

            setFormData({
                title: "",
                heading: "",
                short_desc: "",
                description: "",
                button_text: "",
                button_url: "",
                community_title: "",
                community_description: "",
                community_image: null,
                faq: "",
            });
            setSnackbar({
                open: true,
                message: 'Hire Form created successfully!',
                severity: 'success',
            });
        } catch (err) {
            setError(err.message);
            setSnackbar({
                open: true,
                message: 'Error creating Hire Form. Please try again.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Heading"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Short Description"
                    name="short_desc"
                    value={formData.short_desc}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    rows={4}
                    margin="normal"
                />
                <TextField
                    label="Button Text"
                    name="button_text"
                    value={formData.button_text}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Button URL"
                    name="button_url"
                    value={formData.button_url}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Community Title"
                    name="community_title"
                    value={formData.community_title}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Community Description"
                    name="community_description"
                    value={formData.community_description}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />

                {/* Image Upload Input */}
                <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Upload Community Image
                    <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
                {formData.community_image && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                            {formData.community_image.name}
                        </Typography>
                    </Box>
                )}

                <FormControl fullWidth margin="normal">
                    <InputLabel>FAQ</InputLabel>
                    <Select
                        name="faq"
                        value={formData.faq}
                        onChange={handleChange}
                        label="FAQ"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {faqs.map((faq) => (
                            <MenuItem key={faq._id} value={faq._id}>
                                {faq.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {error && (
                    <Typography color="error" align="center" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </Button>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default HireFromUsForm;
