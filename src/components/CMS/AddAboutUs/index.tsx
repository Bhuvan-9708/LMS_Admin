'use client'

import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
    Box,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@mantine/rte'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
});

interface AboutUs {
    title: string;
    about_us_text: string;
    about_us_heading: string;
    image: File | null;
    about_us_sub_heading: string;
    about_us_description: { title: string; description: string }[];
    section_working: string;
    points_title: string;
    points_heading: string;
    points_sub_title: string;
    points_description: { title: string; description: string; image: File | null }[];
    community_text: string;
    community_description: string;
    coummnity_banner_image: File | null;
    team_heading: string;
    team_description: {
        name: string;
        position: string;
        image: File | null;
        description: string;
        social_media: { name: string; link: string }[];
    }[];
    banner: string;
    is_active: boolean;
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
    seo_url: string;
    slug: string;
}

interface Banner {
    _id: string;
    title: string;
}

interface SectionWorking {
    _id: string;
    title: string;
}

export default function CreateAboutUs() {
    const [aboutUs, setAboutUs] = useState<AboutUs>({
        title: '',
        about_us_text: '',
        about_us_heading: '',
        image: null,
        about_us_sub_heading: '',
        about_us_description: [{ title: '', description: '' }],
        section_working: '',
        points_title: '',
        points_heading: '',
        points_sub_title: '',
        points_description: [{ title: '', description: '', image: null }],
        community_text: '',
        community_description: '',
        coummnity_banner_image: null,
        team_heading: '',
        team_description: [
            {
                name: '',
                position: '',
                image: null,
                description: '',
                social_media: [{ name: '', link: '' }],
            },
        ],
        banner: '',
        is_active: true,
        meta_title: '',
        meta_description: '',
        meta_keywords: [''],
        seo_url: '',
        slug: '',
    });

    const router = useRouter();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [sections, setSections] = useState<SectionWorking[]>([]);

    useEffect(() => {
        fetchBanners();
        fetchSections();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banner/`);
            if (!response.ok) {
                throw new Error("Failed to fetch banners");
            }
            const data = await response.json();
            setBanners(data.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    const fetchSections = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/section-working/`);
            if (!response.ok) {
                throw new Error("Failed to fetch section-working");
            }
            const data = await response.json();
            setSections(data.data);
        } catch (error) {
            console.error('Error fetching section-working:', error);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAboutUs((prev) => ({ ...prev, [name]: value }));
    };

    const handleRichTextChange = (field: keyof AboutUs, value: string) => {
        setAboutUs((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof AboutUs) => {
        if (event.target.files && event.target.files[0]) {
            setAboutUs((prev) => ({ ...prev, [field]: event.target.files![0] }));
        }
    };

    const handleArrayChange = (index: number, field: string, value: any, arrayField: keyof AboutUs) => {
        setAboutUs((prev) => {
            const newArray = [...prev[arrayField] as any[]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [arrayField]: newArray };
        });
    };

    const handleAddArrayItem = (arrayField: keyof AboutUs, newItem: any) => {
        setAboutUs((prev) => ({
            ...prev,
            [arrayField]: [...prev[arrayField] as any[], newItem],
        }));
    };

    const handleRemoveArrayItem = (index: number, arrayField: keyof AboutUs) => {
        setAboutUs((prev) => ({
            ...prev,
            [arrayField]: (prev[arrayField] as any[]).filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();

        // Append all text fields
        Object.entries(aboutUs).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'boolean') {
                formData.append(key, value.toString());
            }
            // Handle arrays like points_description and team_description
            else if (Array.isArray(value)) {
                if (key === 'points_description' || key === 'team_description') {
                    value.forEach((item, index) => {
                        Object.entries(item).forEach(([subKey, subValue]) => {
                            if (typeof subValue === 'string' || typeof subValue === 'boolean' || typeof subValue === 'number') {
                                formData.append(`${key}[${index}][${subKey}]`, subValue.toString());
                            } else if (subValue instanceof File) {
                                formData.append(`${key}[${index}][${subKey}]`, subValue);
                            }
                        });
                    });
                } else {
                    formData.append(key, JSON.stringify(value)); // For any other arrays
                }
            }
        });

        // Append file fields (if they exist)
        if (aboutUs.image) formData.append('image', aboutUs.image);
        if (aboutUs.coummnity_banner_image) formData.append('coummnity_banner_image', aboutUs.coummnity_banner_image);

        // Append points_description images
        aboutUs.points_description.forEach((point, index) => {
            if (point.image) formData.append(`points_description[${index}].image`, point.image);
        });

        // Append team_description images
        aboutUs.team_description.forEach((member, index) => {
            if (member.image) formData.append(`team_description[${index}].image`, member.image);
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about-us/create`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to create About Us entry');

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
                <Typography variant="h5" gutterBottom>Create About Us Page</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={aboutUs.title}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="About Us Heading"
                        name="about_us_heading"
                        value={aboutUs.about_us_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="About Us Sub Heading"
                        name="about_us_sub_heading"
                        value={aboutUs.about_us_sub_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">About Us Image</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'image')}
                        />
                    </Box>
                    <Typography variant="subtitle1">About Us Text</Typography>
                    <RichTextEditor
                        value={aboutUs.about_us_text}
                        onChange={(value) => handleRichTextChange('about_us_text', value)}
                    />
                    <Typography variant="h6" gutterBottom>About Us Descriptions</Typography>
                    {aboutUs.about_us_description.map((desc, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={desc.title}
                                onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'about_us_description')}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={desc.description}
                                onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'about_us_description')}
                                margin="normal"
                                multiline
                                rows={3}
                            />
                            <Button onClick={() => handleRemoveArrayItem(index, 'about_us_description')}>Remove</Button>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('about_us_description', { title: '', description: '' })}>
                        Add Description
                    </Button>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Section Working</InputLabel>
                        <Select
                            value={aboutUs.section_working}
                            onChange={(e) => setAboutUs(prev => ({ ...prev, section_working: e.target.value }))}
                        >
                            {sections.map((section) => (
                                <MenuItem key={section._id} value={section._id}>{section.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Points Title"
                        name="points_title"
                        value={aboutUs.points_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Points Heading"
                        name="points_heading"
                        value={aboutUs.points_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Points Sub Title"
                        name="points_sub_title"
                        value={aboutUs.points_sub_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <Typography variant="h6" gutterBottom>Points Description</Typography>
                    {aboutUs.points_description.map((point, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={point.title}
                                onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'points_description')}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={point.description}
                                onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'points_description')}
                                margin="normal"
                                multiline
                                rows={3}
                            />
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2">Image</Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleArrayChange(index, 'image', e.target.files[0], 'points_description');
                                        }
                                    }}
                                />
                            </Box>
                            <Button onClick={() => handleRemoveArrayItem(index, 'points_description')}>Remove</Button>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('points_description', { title: '', description: '', image: null })}>
                        Add Point
                    </Button>
                    <TextField
                        fullWidth
                        label="Community Text"
                        name="community_text"
                        value={aboutUs.community_text}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Community Description"
                        name="community_description"
                        value={aboutUs.community_description}
                        onChange={handleInputChange}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Community Banner Image</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'coummnity_banner_image')}
                        />
                    </Box>
                    <TextField
                        fullWidth
                        label="Team Heading"
                        name="team_heading"
                        value={aboutUs.team_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <Typography variant="h6" gutterBottom>Team Description</Typography>
                    {aboutUs.team_description.map((member, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={member.name}
                                onChange={(e) => handleArrayChange(index, 'name', e.target.value, 'team_description')}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Position"
                                value={member.position}
                                onChange={(e) => handleArrayChange(index, 'position', e.target.value, 'team_description')}
                                margin="normal"
                            />

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2">Image</Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleArrayChange(index, 'image', e.target.files[0], 'team_description');
                                        }
                                    }}
                                />
                            </Box>
                            <TextField
                                fullWidth
                                label="Description"
                                value={member.description}
                                onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'team_description')}
                                margin="normal"
                                multiline
                                rows={3}
                            />
                            <Typography variant="subtitle2">Social Media</Typography>
                            {member.social_media.map((social, socialIndex) => (
                                <Box key={socialIndex} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                    <TextField
                                        label="Name"
                                        value={social.name}
                                        onChange={(e) => {
                                            const newSocialMedia = [...member.social_media];
                                            newSocialMedia[socialIndex].name = e.target.value;
                                            handleArrayChange(index, 'social_media', newSocialMedia, 'team_description');
                                        }}
                                    />
                                    <TextField
                                        label="Link"
                                        value={social.link}
                                        onChange={(e) => {
                                            const newSocialMedia = [...member.social_media];
                                            newSocialMedia[socialIndex].link = e.target.value;
                                            handleArrayChange(index, 'social_media', newSocialMedia, 'team_description');
                                        }}
                                    />
                                    <IconButton onClick={() => {
                                        const newSocialMedia = member.social_media.filter((_, i) => i !== socialIndex);
                                        handleArrayChange(index, 'social_media', newSocialMedia, 'team_description');
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button onClick={() => {
                                const newSocialMedia = [...member.social_media, { name: '', link: '' }];
                                handleArrayChange(index, 'social_media', newSocialMedia, 'team_description');
                            }}>
                                Add Social Media
                            </Button>
                            <Button onClick={() => handleRemoveArrayItem(index, 'team_description')}>Remove Team Member</Button>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('team_description', {
                        name: '',
                        position: '',
                        image: null,
                        description: '',
                        social_media: []
                    })}>
                        Add Team Member
                    </Button>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Banner</InputLabel>
                        <Select
                            value={aboutUs.banner}
                            onChange={(e) => setAboutUs(prev => ({ ...prev, banner: e.target.value }))}
                        >
                            {banners.map((banner) => (
                                <MenuItem key={banner._id} value={banner._id}>{banner.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                                onChange={(e) => {
                                    const newKeywords = [...aboutUs.meta_keywords];
                                    newKeywords[index] = e.target.value;
                                    setAboutUs(prev => ({ ...prev, meta_keywords: newKeywords }));
                                }}
                                margin="normal"
                            />
                            <IconButton onClick={() => handleRemoveArrayItem(index, 'meta_keywords')}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('meta_keywords', '')}>
                        Add Keyword
                    </Button>
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
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Create About Us Entry
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}