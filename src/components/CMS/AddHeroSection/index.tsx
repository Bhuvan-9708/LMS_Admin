"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TextField, Button, Checkbox, FormControlLabel, Box, Typography, Snackbar, Alert } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';

interface HeroSectionFormData {
    title: string;
    sub_title: string;
    description: string;
    image: File | null;
    tag_line: string;
    buttonText: string;
    buttonUrl: string;
    is_active: boolean;
}

const AddHeroSection: React.FC = () => {
    const [formData, setFormData] = useState<HeroSectionFormData>({
        title: "",
        sub_title: "",
        description: "",
        image: null,
        tag_line: "",
        buttonText: "",
        buttonUrl: "",
        is_active: true,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const router = useRouter();

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = event.target;
        setFormData((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setFormData((prevForm) => ({
                ...prevForm,
                image: file
            }));

            // Create image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setFormData((prevForm) => ({
            ...prevForm,
            [name]: checked
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'image' && value instanceof File) {
                    formDataToSend.append('file', value);
                } else if (typeof value === 'boolean') {
                    formDataToSend.append(key, value.toString());
                } else if (value !== null) {
                    formDataToSend.append(key, value as string);
                }
            });

            const buttonObject = {
                text: formData.buttonText,
                url: formData.buttonUrl
            };
            formDataToSend.append('button', JSON.stringify(buttonObject));

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/hero-section/create`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                setSnackbar({ open: true, message: "Hero Section added successfully!", severity: 'success' });
                router.push("/cms/hero-section");
            } else {
                setSnackbar({ open: true, message: "Failed to add hero section.", severity: 'error' });
            }
        } catch (error) {
            console.error("Error adding hero section:", error);
            setSnackbar({ open: true, message: "Error adding hero section.", severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                margin="normal"
            />

            <TextField
                fullWidth
                label="Sub Title"
                name="sub_title"
                value={formData.sub_title}
                onChange={handleInputChange}
                margin="normal"
            />

            <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                margin="normal"
                multiline
                rows={4}
            />

            <Box sx={{ mt: 2, mb: 2 }}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleFileChange}
                />
                <label htmlFor="raised-button-file">
                    <Button variant="contained" component="span">
                        Upload Image
                    </Button>
                </label>
                {imagePreview && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Image Preview:</Typography>
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                    </Box>
                )}
            </Box>

            <TextField
                fullWidth
                label="Tag Line"
                name="tag_line"
                value={formData.tag_line}
                onChange={handleInputChange}
                margin="normal"
            />

            <TextField
                fullWidth
                label="Button Text"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleInputChange}
                margin="normal"
            />

            <TextField
                fullWidth
                label="Button URL"
                name="buttonUrl"
                value={formData.buttonUrl}
                onChange={handleInputChange}
                margin="normal"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleCheckboxChange}
                    />
                }
                label="Active"
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Add Hero Section
            </Button>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddHeroSection;
