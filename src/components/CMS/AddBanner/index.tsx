"use client"
import React, { useState, useRef } from 'react';
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
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material';

interface Button {
    text: string;
    link: string;
}

interface Banner {
    image: File | null;
    link: string;
    title: string;
    sub_title: string;
    type: 'image' | 'video';
    status: 'active' | 'inactive';
    position: number;
    buttons: Button[];
    additional_images: File[];
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddBannerForm() {
    const [banner, setBanner] = useState<Banner>({
        image: null,
        link: '',
        title: '',
        sub_title: '',
        type: 'image',
        status: 'active',
        position: 1,
        buttons: [],
        additional_images: [],
    });

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

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
            setBanner(prev => ({ ...prev, image: file }));
        }
    };

    const handleAdditionalImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files);
            const previews = fileArray.map(file => URL.createObjectURL(file));
            setAdditionalImagePreviews(previews);
            setBanner(prev => ({ ...prev, additional_images: fileArray }));
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setBanner(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (event: SelectChangeEvent<'image' | 'video' | 'active' | 'inactive'>) => {
        const name = event.target.name as keyof Banner;
        setBanner(prev => ({ ...prev, [name]: event.target.value }));
    };

    const handleButtonChange = (index: number, field: keyof Button, value: string) => {
        const newButtons = [...banner.buttons];
        newButtons[index] = { ...newButtons[index], [field]: value };
        setBanner(prev => ({ ...prev, buttons: newButtons }));
    };

    const handleAddButton = () => {
        setBanner(prev => ({ ...prev, buttons: [...prev.buttons, { text: '', link: '' }] }));
    };

    const handleRemoveButton = (index: number) => {
        const newButtons = [...banner.buttons];
        newButtons.splice(index, 1);
        setBanner(prev => ({ ...prev, buttons: newButtons }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        if (banner.image) {
            formData.append('image', banner.image);
        }

        banner.additional_images.forEach((file, index) => {
            formData.append(`additional_images`, file);
        });

        formData.append('link', banner.link);
        formData.append('title', banner.title);
        formData.append('sub_title', banner.sub_title);
        formData.append('type', banner.type);
        formData.append('status', banner.status);
        formData.append('position', banner.position.toString());
        banner.buttons.forEach((button, index) => {
            formData.append(`buttons[${index}][text]`, button.text);
            formData.append(`buttons[${index}][link]`, button.link);
        });

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/banner/create`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create banner');
            }

            const result = await response.json();
            console.log('Banner created successfully:', result);
            router.push('/cms/banner');
        } catch (error) {
            console.error('Error creating banner:', error);
            setSnackbar({
                open: true,
                message: 'Error creating banner. Please try again.',
                severity: 'error',
            });
        }
    };

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" gutterBottom>Upload Banner Image</Typography>
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
                        Choose Banner Image
                    </Button>

                    <TextField
                        fullWidth
                        label="Link"
                        name="link"
                        value={banner.link}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={banner.title}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Sub Title"
                        name="sub_title"
                        value={banner.sub_title}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
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
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            name="status"
                            value={banner.status}
                            onChange={handleSelectChange}
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Position"
                        name="position"
                        type="number"
                        value={banner.position}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <Typography variant="h6" gutterBottom>Buttons</Typography>
                    {banner.buttons.map((button, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TextField
                                label={`Button ${index + 1} Text`}
                                value={button.text}
                                onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label={`Button ${index + 1} Link`}
                                value={button.link}
                                onChange={(e) => handleButtonChange(index, 'link', e.target.value)}
                                margin="normal"
                            />
                            <Button onClick={() => handleRemoveButton(index)}>Remove</Button>
                        </Box>
                    ))}
                    <Button onClick={handleAddButton}>Add Button</Button>
                    <Typography variant="h6" gutterBottom>Upload Additional Images</Typography>
                    <input
                        accept="image/*"
                        type="file"
                        ref={additionalImagesInputRef}
                        multiple
                        onChange={handleAdditionalImageUpload}
                        style={{ display: 'none' }}
                    />
                    {additionalImagePreviews.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            {additionalImagePreviews.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Additional Preview ${index + 1}`}
                                    style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                                />
                            ))}
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => additionalImagesInputRef.current?.click()}
                        sx={{ mb: 2 }}
                    >
                        Choose Additional Images
                    </Button>
                    <br />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Create Banner
                    </Button>
                </form>
            </CardContent>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Card>
    );
}