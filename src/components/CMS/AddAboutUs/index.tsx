"use client"

import React, { useState } from 'react';
import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
    Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import("@mantine/rte"), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
});

interface AboutUs {
    about_us_text: string;
    about_us_heading: string;
    about_us_image: string;
    about_us_sub_heading: string;
    about_us_description: { title: string; description: string }[];
    is_active: boolean;
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
    seo_url: string;
    slug: string;
}

export default function CreateAboutUs() {
    const [aboutUs, setAboutUs] = useState<AboutUs>({
        about_us_text: '',
        about_us_heading: '',
        about_us_image: '',
        about_us_sub_heading: '',
        about_us_description: [{ title: '', description: '' }],
        is_active: true,
        meta_title: '',
        meta_description: '',
        meta_keywords: [''],
        seo_url: '',
        slug: '',
    });

    const router = useRouter();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAboutUs(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (index: number, field: 'title' | 'description', value: string) => {
        const newDescriptions = [...aboutUs.about_us_description];
        newDescriptions[index][field] = value;
        setAboutUs(prev => ({ ...prev, about_us_description: newDescriptions }));
    };

    const handleAddDescription = () => {
        setAboutUs(prev => ({
            ...prev,
            about_us_description: [...prev.about_us_description, { title: '', description: '' }]
        }));
    };

    const handleRemoveDescription = (index: number) => {
        const newDescriptions = [...aboutUs.about_us_description];
        newDescriptions.splice(index, 1);
        setAboutUs(prev => ({ ...prev, about_us_description: newDescriptions }));
    };

    const handleMetaKeywordsChange = (index: number, value: string) => {
        const newKeywords = [...aboutUs.meta_keywords];
        newKeywords[index] = value;
        setAboutUs(prev => ({ ...prev, meta_keywords: newKeywords }));
    };

    const handleAddMetaKeyword = () => {
        setAboutUs(prev => ({ ...prev, meta_keywords: [...prev.meta_keywords, ''] }));
    };

    const handleRemoveMetaKeyword = (index: number) => {
        const newKeywords = [...aboutUs.meta_keywords];
        newKeywords.splice(index, 1);
        setAboutUs(prev => ({ ...prev, meta_keywords: newKeywords }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/about-us/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aboutUs),
            });

            if (!response.ok) {
                throw new Error('Failed to create About Us entry');
            }

            const result = await response.json();
            console.log('About Us entry created successfully:', result);
            router.push('/cms/about-us');
        } catch (error) {
            console.error('Error creating About Us entry:', error);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Create About Us Entry</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="About Us Heading"
                        name="about_us_heading"
                        value={aboutUs.about_us_heading}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="About Us Sub Heading"
                        name="about_us_sub_heading"
                        value={aboutUs.about_us_sub_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="About Us Image URL"
                        name="about_us_image"
                        value={aboutUs.about_us_image}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <Typography variant="h6" gutterBottom>About Us Text</Typography>
                    <RichTextEditor
                        value={aboutUs.about_us_text}
                        onChange={(value) => setAboutUs(prev => ({ ...prev, about_us_text: value }))}
                    />
                    <Typography variant="h6" gutterBottom>About Us Descriptions</Typography>
                    {aboutUs.about_us_description.map((desc, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label={`Description ${index + 1} Title`}
                                value={desc.title}
                                onChange={(e) => handleDescriptionChange(index, 'title', e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label={`Description ${index + 1} Content`}
                                value={desc.description}
                                onChange={(e) => handleDescriptionChange(index, 'description', e.target.value)}
                                margin="normal"
                                multiline
                                rows={3}
                            />
                            <Button onClick={() => handleRemoveDescription(index)}>Remove Description</Button>
                        </Box>
                    ))}
                    <Button onClick={handleAddDescription}>Add Description</Button>
                    <TextField
                        fullWidth
                        label="Meta Title"
                        name="meta_title"
                        value={aboutUs.meta_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Meta Description"
                        name="meta_description"
                        value={aboutUs.meta_description}
                        onChange={handleInputChange}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <Typography variant="h6" gutterBottom>Meta Keywords</Typography>
                    {aboutUs.meta_keywords.map((keyword, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TextField
                                fullWidth
                                label={`Keyword ${index + 1}`}
                                value={keyword}
                                onChange={(e) => handleMetaKeywordsChange(index, e.target.value)}
                                margin="normal"
                            />
                            <Button onClick={() => handleRemoveMetaKeyword(index)}>Remove</Button>
                        </Box>
                    ))}
                    <Button onClick={handleAddMetaKeyword}>Add Keyword</Button>
                    <TextField
                        fullWidth
                        label="SEO URL"
                        name="seo_url"
                        value={aboutUs.seo_url}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Slug"
                        name="slug"
                        value={aboutUs.slug}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={aboutUs.is_active}
                                onChange={(e) => setAboutUs(prev => ({ ...prev, is_active: e.target.checked }))}
                                name="is_active"
                            />
                        }
                        label="Is Active"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Create About Us Entry
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}