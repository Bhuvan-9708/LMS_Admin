'use client';

import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    FormControlLabel,
    Switch,
    Chip,
    Snackbar,
    Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Description {
    title: string;
    image_icon: File | null;
    short_description: string;
    long_description: string;
    image: File | null;
    alt_text: string;
}

interface SectionWorking {
    _id: string;
    title: string;
    sub_title: string;
    description: Description[];
    is_active: boolean;
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
}

export default function EditSectionWorking({ sectionId }: { sectionId: string }) {
    const [sectionWorking, setSectionWorking] = useState<SectionWorking | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const router = useRouter();

    useEffect(() => {
        const fetchSectionWorking = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/section-working/${sectionId}`);
                if (!response.ok) throw new Error('Failed to fetch section working');
                const data = await response.json();
                setSectionWorking(data.data);
            } catch (error) {
                console.error('Error fetching section working data:', error);
                setSnackbarMessage('Error fetching section working data');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };

        if (sectionId) fetchSectionWorking();
    }, [sectionId]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (sectionWorking) {
            setSectionWorking((prev) => ({
                ...prev!,
                [name]: value,
            }));
        }
    };

    const handleDescriptionChange = (index: number, field: keyof Description, value: string | File | null) => {
        if (sectionWorking) {
            const newDescription = [...sectionWorking.description];
            newDescription[index] = { ...newDescription[index], [field]: value };
            setSectionWorking({ ...sectionWorking, description: newDescription });
        }
    };

    const handleAddDescription = () => {
        if (sectionWorking) {
            setSectionWorking({
                ...sectionWorking,
                description: [
                    ...sectionWorking.description,
                    { title: '', image_icon: null, short_description: '', long_description: '', image: null, alt_text: '' },
                ],
            });
        }
    };

    const handleToggleActive = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (sectionWorking) {
            setSectionWorking(prev => ({
                ...prev!,
                is_active: e.target.checked,
            }));
        }
    };


    const handleRemoveDescription = (index: number) => {
        if (sectionWorking) {
            setSectionWorking({
                ...sectionWorking,
                description: sectionWorking.description.filter((_, i) => i !== index),
            });
        }
    };

    const handleAddKeyword = (keyword: string) => {
        if (sectionWorking) {
            setSectionWorking({
                ...sectionWorking,
                meta_keywords: [...sectionWorking.meta_keywords, keyword],
            });
        }
    };

    const handleRemoveKeyword = (index: number) => {
        if (sectionWorking) {
            setSectionWorking({
                ...sectionWorking,
                meta_keywords: sectionWorking.meta_keywords.filter((_, i) => i !== index),
            });
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();

        if (sectionWorking) {
            Object.entries(sectionWorking).forEach(([key, value]) => {
                if (key === 'description') {
                    value.forEach((desc: Description, index: number) => {
                        Object.entries(desc).forEach(([descKey, descValue]) => {
                            if (descValue instanceof File) {
                                formData.append(`description[${index}][${descKey}]`, descValue);
                            } else {
                                formData.append(`description[${index}][${descKey}]`, descValue as string);
                            }
                        });
                    });
                } else if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item);
                    });
                } else {
                    formData.append(key, value as string);
                }
            });

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/section-working/update/${sectionId}`, {
                    method: 'PUT',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to update section working');
                }

                const result = await response.json();
                console.log('Section working updated:', result);
                setSnackbarMessage('Section working updated successfully!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                router.push('/cms/section-working');
            } catch (error) {
                console.error('Error updating section working:', error);
                setSnackbarMessage('Error updating section working.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (!sectionWorking) return <div>Loading...</div>;
    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={sectionWorking.title}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        required
                        fullWidth
                        label="Sub Title"
                        name="sub_title"
                        value={sectionWorking.sub_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <Typography variant="h6" gutterBottom>Description</Typography>
                    {sectionWorking.description.map((desc, index) => (
                        <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                            <TextField
                                required
                                fullWidth
                                label="Title"
                                value={desc.title}
                                onChange={(e) => handleDescriptionChange(index, 'title', e.target.value)}
                                margin="normal"
                            />
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id={`image-icon-upload-${index}`}
                                type="file"
                                onChange={(e) => handleDescriptionChange(index, 'image_icon', e.target.files?.[0] || null)}
                            />
                            <label htmlFor={`image-icon-upload-${index}`}>
                                <Button variant="contained" component="span">Upload Image Icon</Button>
                            </label>
                            {desc.image_icon && <Typography variant="body2">{desc.image_icon.name}</Typography>}
                            <TextField
                                required
                                fullWidth
                                label="Short Description"
                                value={desc.short_description}
                                onChange={(e) => handleDescriptionChange(index, 'short_description', e.target.value)}
                                margin="normal"
                                multiline
                                rows={2}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Long Description"
                                value={desc.long_description}
                                onChange={(e) => handleDescriptionChange(index, 'long_description', e.target.value)}
                                margin="normal"
                                multiline
                                rows={4}
                            />
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id={`image-upload-${index}`}
                                type="file"
                                onChange={(e) => handleDescriptionChange(index, 'image', e.target.files?.[0] || null)}
                            />
                            <label htmlFor={`image-upload-${index}`}>
                                <Button variant="contained" component="span">Upload Image</Button>
                            </label>
                            {desc.image && <Typography variant="body2">{desc.image.name}</Typography>}
                            <TextField
                                required
                                fullWidth
                                label="Alt Text"
                                value={desc.alt_text}
                                onChange={(e) => handleDescriptionChange(index, 'alt_text', e.target.value)}
                                margin="normal"
                            />
                            <IconButton onClick={() => handleRemoveDescription(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={handleAddDescription}>
                        Add Description
                    </Button>
                    <br />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={sectionWorking?.is_active || false} // Use optional chaining
                                onChange={handleToggleActive}
                                name="is_active"
                            />
                        }
                        label="Is Active"
                    />

                    <TextField
                        required
                        fullWidth
                        label="Meta Title"
                        name="meta_title"
                        value={sectionWorking.meta_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        required
                        fullWidth
                        label="Meta Description"
                        name="meta_description"
                        value={sectionWorking.meta_description}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Meta Keywords"
                        value={sectionWorking.meta_keywords.join(', ')}
                        onChange={(e) => handleAddKeyword(e.target.value)}
                        margin="normal"
                    />
                    {sectionWorking.meta_keywords.map((keyword, index) => (
                        <Chip
                            key={index}
                            label={keyword}
                            onDelete={() => handleRemoveKeyword(index)}
                            sx={{ m: 0.5 }}
                        />
                    ))}

                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Save Changes
                    </Button>
                </form>
            </CardContent>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Card>
    );
}
