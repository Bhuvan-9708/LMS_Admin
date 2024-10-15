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

interface Section {
    title: string;
    content: string;
    meta_url: string;
    meta_tags: string[];
    meta_description: string;
    is_active: boolean;
}

export default function AddSectionForm() {
    const [section, setSection] = useState<Section>({
        title: '',
        content: '',
        meta_url: '',
        meta_tags: [''],
        meta_description: '',
        is_active: true,
    });

    const router = useRouter();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSection(prev => ({ ...prev, [name]: value }));
    };

    const handleMetaTagChange = (index: number, value: string) => {
        const newMetaTags = [...section.meta_tags];
        newMetaTags[index] = value;
        setSection(prev => ({ ...prev, meta_tags: newMetaTags }));
    };

    const handleAddMetaTag = () => {
        setSection(prev => ({ ...prev, meta_tags: [...prev.meta_tags, ''] }));
    };

    const handleRemoveMetaTag = (index: number) => {
        const newMetaTags = [...section.meta_tags];
        newMetaTags.splice(index, 1);
        setSection(prev => ({ ...prev, meta_tags: newMetaTags }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch('https://lms-v1-xi.vercel.app/api/section/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(section),
            });

            if (!response.ok) {
                throw new Error('Failed to create section');
            }

            const result = await response.json();
            console.log('Section created successfully:', result);
            router.push('/cms/section');
        } catch (error) {
            console.error('Error creating section:', error);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Add New Section</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={section.title}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />
                    <Typography variant="h6" gutterBottom>Content</Typography>
                    <RichTextEditor
                        value={section.content}
                        onChange={(value) => setSection(prev => ({ ...prev, content: value }))}
                    />
                    <TextField
                        fullWidth
                        label="Meta URL"
                        name="meta_url"
                        value={section.meta_url}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <Typography variant="h6" gutterBottom>Meta Tags</Typography>
                    {section.meta_tags.map((tag, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TextField
                                fullWidth
                                label={`Meta Tag ${index + 1}`}
                                value={tag}
                                onChange={(e) => handleMetaTagChange(index, e.target.value)}
                                margin="normal"
                            />
                            <Button onClick={() => handleRemoveMetaTag(index)}>Remove</Button>
                        </Box>
                    ))}
                    <Button onClick={handleAddMetaTag}>Add Meta Tag</Button>
                    <TextField
                        fullWidth
                        label="Meta Description"
                        name="meta_description"
                        value={section.meta_description}
                        onChange={handleInputChange}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={section.is_active}
                                onChange={(e) => setSection(prev => ({ ...prev, is_active: e.target.checked }))}
                                name="is_active"
                            />
                        }
                        label="Is Active"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Create Section
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}