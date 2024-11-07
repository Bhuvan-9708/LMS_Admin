"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Snackbar,
    CircularProgress,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material';

interface Button {
    text: string;
    link: string;
}

interface Banner {
    _id: string;
    image: string | File;
    link: string;
    title: string;
    sub_title: string;
    type: 'image' | 'video';
    status: 'active' | 'inactive';
    position: number;
    buttons: Button[];
    additional_images: (string | File)[];
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function EditBannerForm({ bannerId }: { bannerId: string }) {
    const [banner, setBanner] = useState<Banner | null>(null);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const additionalImagesInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banner/${bannerId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch banner');
                }
                const data = await response.json();
                setBanner(data.data);

                // Set the image preview if the image URL exists
                if (data.data.image) {
                    setImagePreview(data.data.image);  // Directly use image URL
                }

                // Set the additional image previews if any additional images exist
                if (data.data.additional_images && data.data.additional_images.length > 0) {
                    setAdditionalImagePreviews(data.data.additional_images);  // Directly use additional image URLs
                }
            } catch (error) {
                console.error('Error fetching banner:', error);
                setSnackbar({
                    open: true,
                    message: 'Error fetching banner. Please try again.',
                    severity: 'error',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBanner();
    }, [bannerId]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
            setBanner(prev => prev ? { ...prev, image: file } : null); // Save the image file to banner state
        }
    };

    const handleAdditionalImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files);
            const previews = fileArray.map(file => URL.createObjectURL(file)); // Generate preview URLs for additional images
            setAdditionalImagePreviews(previews); // Set preview URLs in the state
            setBanner(prev => prev ? { ...prev, additional_images: fileArray } : null); // Save the files to the banner state
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBanner(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSelectChange = (event: SelectChangeEvent<'image' | 'video' | 'active' | 'inactive'>) => {
        const { name, value } = event.target;
        setBanner(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleButtonChange = (index: number, field: string, value: string) => {
        setBanner(prev => {
            if (prev) {
                const buttons = [...prev.buttons];
                buttons[index] = { ...buttons[index], [field]: value };
                return { ...prev, buttons };
            }
            return prev;
        });
    };

    const handleAddButton = () => {
        setBanner(prev => {
            if (!prev) return prev; // If prev is null, return null.

            return {
                ...prev, // Spread previous state to keep other properties.
                buttons: Array.isArray(prev.buttons)
                    ? [...prev.buttons, { text: '', link: '' }]
                    : [{ text: '', link: '' }] // Add a new button if `buttons` is undefined.
            };
        });
    };

    const handleRemoveButton = (index: number) => {
        setBanner(prev => {
            if (prev) {
                const buttons = [...prev.buttons];
                buttons.splice(index, 1);
                return { ...prev, buttons };
            }
            return prev;
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!banner) return;
    
        const formData = new FormData();
    
        // Debugging: Log the banner object
        console.log('Banner:', banner);
    
        // Ensure banner.image is a File
        if (banner.image instanceof File) {
            formData.append('image', banner.image);
        } else {
            console.log('No valid image found or invalid type.');
        }
    
        // Ensure additional_images is an array of files
        if (Array.isArray(banner.additional_images)) {
            banner.additional_images.forEach((file, index) => {
                if (file instanceof File) {
                    formData.append(`additional_images`, file);
                } else {
                    console.log(`Invalid file at index ${index}:`, file);
                }
            });
        }
    
        // Validate and append required fields with fallback values if needed
        formData.append('link', banner.link || ''); // Default to empty string if link is missing
        formData.append('title', banner.title || ''); // Default to empty string if title is missing
        formData.append('sub_title', banner.sub_title || ''); // Default to empty string if subtitle is missing
    
        // Validate and append type (should be either 'image' or 'video')
        const validType = banner.type === 'image' || banner.type === 'video' ? banner.type : 'image'; // Default to 'image' if invalid
        formData.append('type', validType);
    
        // Validate position before appending (ensure it is a valid number)
        formData.append('position', banner.position != null ? banner.position.toString() : '0'); // Default to '0' if invalid
    
        // Validate and append buttons
        if (Array.isArray(banner.buttons)) {
            banner.buttons.forEach((button, index) => {
                formData.append(`buttons[${index}][text]`, button.text || ''); // Default to empty string if button text is missing
                formData.append(`buttons[${index}][link]`, button.link || ''); // Default to empty string if button link is missing
            });
        }
    
        // Debugging: Log FormData entries (before sending the request)
        formData.forEach((value, key) => {
            console.log(key, value);
        });
    
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/banner/update/${bannerId}`,
                {
                    method: 'PUT',
                    body: formData,
                }
            );
    
            if (!response.ok) {
                throw new Error('Failed to update banner');
            }
    
            const result = await response.json();
            console.log('Banner updated successfully:', result);
            setSnackbar({
                open: true,
                message: 'Banner updated successfully!',
                severity: 'success',
            });
            router.push('/cms/banner');
        } catch (error) {
            console.error('Error updating banner:', error);
            setSnackbar({
                open: true,
                message: 'Error updating banner. Please try again.',
                severity: 'error',
            });
        }
    };    


    if (loading) {
        return <CircularProgress />;
    }

    if (!banner) {
        return <Typography>Banner not found</Typography>;
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Edit Banner</Typography>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" gutterBottom>Banner Image</Typography>
                    <input
                        accept="image/*"
                        type="file"
                        ref={imageInputRef}
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                    {imagePreview && (
                        <Box sx={{ mb: 2 }}>
                            <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => imageInputRef.current?.click()}
                        sx={{ mb: 2 }}
                    >
                        Change Banner Image
                    </Button>

                    <TextField
                        fullWidth
                        label="Link"
                        name="link"
                        value={banner.link}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={banner.title}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="Sub Title"
                        name="sub_title"
                        value={banner.sub_title}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Type</InputLabel>
                        <Select
                            name="type"
                            value={banner.type}
                            onChange={handleSelectChange}
                            required
                        >
                            <MenuItem value="image">Image</MenuItem>
                            <MenuItem value="video">Video</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={banner.status}
                            onChange={handleSelectChange}
                            required
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Position"
                        name="position"
                        value={banner.position}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }}
                        type="number"
                    />

                    <Typography variant="h6" gutterBottom>Buttons</Typography>
                    {banner?.buttons && Array.isArray(banner.buttons) && banner.buttons.map((button, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label={`Button ${index + 1} Text`}
                                value={button.text}
                                onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label={`Button ${index + 1} Link`}
                                value={button.link}
                                onChange={(e) => handleButtonChange(index, 'link', e.target.value)}
                                margin="normal"
                            />
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleRemoveButton(index)}
                            >
                                Remove Button
                            </Button>
                        </Box>
                    ))}
                    <Button
                        variant="contained"
                        onClick={handleAddButton}
                        sx={{ mb: 2 }}
                    >
                        Add Button
                    </Button>

                    <Box>
                        <Typography variant="h6" gutterBottom>Additional Images</Typography>
                        <input
                            accept="image/*"
                            type="file"
                            ref={additionalImagesInputRef}
                            multiple
                            onChange={handleAdditionalImageUpload}
                            style={{ display: 'none' }}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => additionalImagesInputRef.current?.click()}
                            sx={{ mb: 2 }}
                        >
                            Add Additional Images
                        </Button>
                        <Box>
                            {additionalImagePreviews.map((preview, index) => (
                                <img
                                    key={index}
                                    src={preview}
                                    alt={`Additional Preview ${index + 1}`}
                                    style={{ width: '100px', height: '100px', objectFit: 'contain', margin: '8px' }}
                                />
                            ))}
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Save Changes
                    </Button>
                </form>


            </CardContent>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Card>
    );
}
