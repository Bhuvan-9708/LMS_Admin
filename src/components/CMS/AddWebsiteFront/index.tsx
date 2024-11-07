"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, TextField, FormControl, Snackbar, Alert, Select, MenuItem, FormControlLabel, Checkbox, Button, Card, CardContent } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';


interface WebsiteFrontForm {
    page_name: string;
    hero_section: string;
    banner: string;
    is_active: boolean;
}

interface HeroSection {
    _id: string;
    title: string;
}

interface Banner {
    _id: string;
    title: string;
}

const AddWebsiteFront: React.FC = () => {
    const [form, setForm] = useState<WebsiteFrontForm>({
        page_name: '',
        hero_section: '',
        banner: '',
        is_active: true,
    });

    const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const heroRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hero-section/`);
                const heroData = await heroRes.json();
                setHeroSections(heroData.data);

                const bannerRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banner/`);
                const bannerData = await bannerRes.json();
                setBanners(bannerData.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = event.target;

        // Update form state
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (form.page_name.trim().length < 3 || form.page_name.trim().length > 50) {
            setError("Page name must be between 3 and 50 characters long.");
            return;
        }

        if (!form.hero_section) {
            setError("Please select a hero section.");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/website-front/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle validation errors from the backend
                setError(result.errors?.[0]?.msg || result.message);
            } else {
                setSnackbarMessage('Website Front created successfully!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                router.push('/cms/website-front');
            }
        } catch (error) {
            console.error("Error creating website front page:", error);
            setSnackbarMessage('Error creating Website Front.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setError("An error occurred while creating the page. Please try again.");
        }
    };

    return (
        <Card>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" gutterBottom>
                        Add Website Front
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <FormControl fullWidth>
                            <TextField
                                fullWidth
                                label="Title"
                                name="page_name"
                                value={form.page_name}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                                error={form.page_name.trim().length < 3 || form.page_name.trim().length > 50}
                                helperText={
                                    form.page_name.trim().length < 3
                                        ? 'Page name must be at least 3 characters'
                                        : form.page_name.trim().length > 50
                                            ? 'Page name must be less than 50 characters'
                                            : ''
                                }
                            />
                        </FormControl>
                    </Box>

                    <Typography variant="h6" gutterBottom>
                        Hero Section
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <FormControl fullWidth>
                            <Select
                                labelId="hero_section_label"
                                id="hero_section"
                                name="hero_section"
                                value={form.hero_section}
                                onChange={handleInputChange}
                                required
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {heroSections.map((hero) => (
                                    <MenuItem key={hero._id} value={hero._id}>
                                        {hero.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Typography variant="h6" gutterBottom>
                        Banner
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <FormControl fullWidth>
                            <Select
                                required
                                id="banner"
                                name="banner"
                                value={form.banner}
                                onChange={(event: SelectChangeEvent<string>) => handleInputChange(event)}
                                displayEmpty
                            >
                                <MenuItem value="">Select Banner</MenuItem>
                                {banners.map((banner) => (
                                    <MenuItem key={banner._id} value={banner._id}>
                                        {banner.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id="is_active"
                                    name="is_active"
                                    checked={form.is_active}
                                    onChange={handleInputChange}
                                />
                            }
                            label="Is Active"
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="contained" color="primary">
                            Create Website Front
                        </Button>
                    </Box>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={2000}
                        onClose={handleCloseSnackbar}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </form>
            </CardContent>
        </Card>
    );
};

export default AddWebsiteFront;