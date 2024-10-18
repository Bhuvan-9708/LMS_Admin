'use client'

import React, { useState } from 'react';
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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface ContactInfo {
    company_name: string;
    description: string;
    company_logo: File | null;
    phone: string;
    email: string;
    address: string;
}

interface Link {
    name: string;
    link: string;
    position: number;
}

interface SocialMediaLink {
    name: string;
    link: string;
}

interface Reference {
    name: string;
    link: string;
    position: number;
    target: '_blank' | '_self';
}

interface QuickLink {
    name: string;
    link: string;
    position: number;
    target: '_blank' | '_self';
}

interface DownloadInfo {
    title: string;
    image: File | null;
}

interface Footer {
    company_info: Record<string, any>;
    contact_info: ContactInfo[];
    links: Link[];
    social_media_links: SocialMediaLink[];
    copyright_text: string;
    refrences: Reference[];
    quick_links: QuickLink[];
    download_information_text: string;
    download_information: DownloadInfo[];
    meta: {
        title: string;
        description: string;
        keywords: string[];
    };
    canonical_url: string;
    robots: 'index, follow' | 'noindex, nofollow';
    is_active: boolean;
}

export default function AddFooter() {
    const [footer, setFooter] = useState<Footer>({
        company_info: {},
        contact_info: [],
        links: [],
        social_media_links: [],
        copyright_text: '',
        refrences: [],
        quick_links: [],
        download_information_text: '',
        download_information: [],
        meta: {
            title: '',
            description: '',
            keywords: [],
        },
        canonical_url: '',
        robots: 'index, follow',
        is_active: true,
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFooter((prev) => ({ ...prev, [name]: value }));
    };

    const handleMetaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFooter((prev) => ({ ...prev, meta: { ...prev.meta, [name]: value } }));
    };

    const handleAddContactInfo = () => {
        setFooter((prev) => ({
            ...prev,
            contact_info: [...prev.contact_info, { company_name: '', description: '', company_logo: null, phone: '', email: '', address: '' }],
        }));
    };

    const handleContactInfoChange = (index: number, field: keyof ContactInfo, value: string | File | null) => {
        setFooter((prev) => {
            const newContactInfo = [...prev.contact_info];
            newContactInfo[index] = { ...newContactInfo[index], [field]: value };
            return { ...prev, contact_info: newContactInfo };
        });
    };

    const handleAddLink = (type: 'links' | 'refrences' | 'quick_links') => {
        setFooter((prev) => ({
            ...prev,
            [type]: [...prev[type], { name: '', link: '', position: prev[type].length + 1, target: '_blank' }],
        }));
    };

    const handleLinkChange = (type: 'links' | 'refrences' | 'quick_links', index: number, field: string, value: string | number) => {
        setFooter((prev) => {
            const newLinks = [...prev[type]];
            newLinks[index] = { ...newLinks[index], [field]: value };
            return { ...prev, [type]: newLinks };
        });
    };

    const handleAddSocialMediaLink = () => {
        setFooter((prev) => ({
            ...prev,
            social_media_links: [...prev.social_media_links, { name: '', link: '' }],
        }));
    };

    const handleSocialMediaLinkChange = (index: number, field: keyof SocialMediaLink, value: string) => {
        setFooter((prev) => {
            const newSocialMediaLinks = [...prev.social_media_links];
            newSocialMediaLinks[index] = { ...newSocialMediaLinks[index], [field]: value };
            return { ...prev, social_media_links: newSocialMediaLinks };
        });
    };

    const handleAddDownloadInfo = () => {
        setFooter((prev) => ({
            ...prev,
            download_information: [...prev.download_information, { title: '', image: null }],
        }));
    };

    const handleDownloadInfoChange = (index: number, field: keyof DownloadInfo, value: string | File | null) => {
        setFooter((prev) => {
            const newDownloadInfo = [...prev.download_information];
            newDownloadInfo[index] = { ...newDownloadInfo[index], [field]: value };
            return { ...prev, download_information: newDownloadInfo };
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();

        Object.entries(footer).forEach(([key, value]) => {
            if (key === 'company_info') {
                formData.append(key, JSON.stringify(value));
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    Object.entries(item).forEach(([itemKey, itemValue]) => {
                        if (itemValue instanceof File) {

                            formData.append(`${key}[${index}][${itemKey}]`, itemValue);
                        } else {
                            formData.append(`${key}[${index}][${itemKey}]`, itemValue as string);
                        }
                    });
                });
            } else if (typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    if (Array.isArray(subValue)) {
                        subValue.forEach((item, index) => {
                            formData.append(`${key}[${subKey}][${index}]`, item);
                        });
                    } else {
                        formData.append(`${key}[${subKey}]`, subValue as string);
                    }
                });
            } else {
                formData.append(key, value as string);
            }
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/footer`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create footer');
            }

            const result = await response.json();
            console.log('Footer created:', result);
            // Handle success (e.g., show a success message, redirect, etc.)
        } catch (error) {
            console.error('Error creating footer:', error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Add Footer</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Company Info (JSON)"
                        name="company_info"
                        value={JSON.stringify(footer.company_info)}
                        onChange={(e) => setFooter(prev => ({ ...prev, company_info: JSON.parse(e.target.value) }))}
                        margin="normal"
                        multiline
                        rows={4}
                    />

                    <Typography variant="h6" gutterBottom>Contact Info</Typography>
                    {footer.contact_info.map((contact, index) => (
                        <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Company Name"
                                value={contact.company_name}
                                onChange={(e) => handleContactInfoChange(index, 'company_name', e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={contact.description}
                                onChange={(e) => handleContactInfoChange(index, 'description', e.target.value)}
                                margin="normal"
                                required
                                multiline
                                rows={3}
                            />
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id={`company-logo-upload-${index}`}
                                type="file"
                                onChange={(e) => handleContactInfoChange(index, 'company_logo', e.target.files?.[0] || null)}
                            />
                            <label htmlFor={`company-logo-upload-${index}`}>
                                <Button variant="contained" component="span">Upload Company Logo</Button>
                            </label>
                            {contact.company_logo && <Typography variant="body2">{contact.company_logo.name}</Typography>}
                            <TextField
                                fullWidth
                                label="Phone"
                                value={contact.phone}
                                onChange={(e) => handleContactInfoChange(index, 'phone', e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={contact.email}
                                onChange={(e) => handleContactInfoChange(index, 'email', e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Address"
                                value={contact.address}
                                onChange={(e) => handleContactInfoChange(index, 'address', e.target.value)}
                                margin="normal"
                                required
                                multiline
                                rows={2}
                            />
                            <IconButton onClick={() => setFooter(prev => ({ ...prev, contact_info: prev.contact_info.filter((_, i) => i !== index) }))}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={handleAddContactInfo}>
                        Add Contact Info
                    </Button>

                    <Typography variant="h6" gutterBottom>Links</Typography>
                    {footer.links.map((link, index) => (
                        <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={link.name}
                                onChange={(e) => handleLinkChange('links', index, 'name', e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Link"
                                value={link.link}
                                onChange={(e) => handleLinkChange('links', index, 'link', e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Position"
                                type="number"
                                value={link.position}
                                onChange={(e) => handleLinkChange('links', index, 'position', parseInt(e.target.value))}
                                margin="normal"
                                required
                            />
                            <IconButton onClick={() => setFooter(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }))}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddLink('links')}>
                        Add Link
                    </Button>

                    <Typography variant="h6" gutterBottom>Social Media Links</Typography>
                    {footer.social_media_links.map((socialLink, index) => (
                        <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={socialLink.name}
                                onChange={(e) => handleSocialMediaLinkChange(index, 'name', e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Link"
                                value={socialLink.link}
                                onChange={(e) => handleSocialMediaLinkChange(index, 'link', e.target.value)}
                                margin="normal"
                                required
                            />
                            <IconButton onClick={() => setFooter(prev => ({ ...prev, social_media_links: prev.social_media_links.filter((_, i) => i !== index) }))}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={handleAddSocialMediaLink}>
                        Add Social Media Link
                    </Button>

                    <TextField
                        fullWidth
                        label="Copyright Text"
                        name="copyright_text"
                        value={footer.copyright_text}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />

                    <Typography variant="h6" gutterBottom>References</Typography>
                    {footer.refrences.map((reference, index) => (
                        <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={reference.name}
                                onChange={(e) => handleLinkChange('refrences', index, 'name', e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Link"
                                value={reference.link}
                                onChange={(e) => handleLinkChange('refrences', index, 'link', e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Position"
                                type="number"
                                value={reference.position}
                                onChange={(e) => handleLinkChange('refrences', index, 'position', parseInt(e.target.value))}
                                margin="normal"
                                required
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Target</InputLabel>
                                <Select
                                    value={reference.target}
                                    onChange={(e) => handleLinkChange('refrences', index, 'target', e.target.value)}
                                >
                                    <MenuItem value="_blank">_blank</MenuItem>
                                    <MenuItem value="_self">_self</MenuItem>
                                </Select>
                            </FormControl>
                            <IconButton onClick={() => setFooter(prev => ({ ...prev, refrences: prev.refrences.filter((_, i) => i !== index) }))}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddLink('refrences')}>
                        Add Reference
                    </Button>

                    <Typography variant="h6" gutterBottom>Quick Links</Typography>
                    {footer.quick_links.map((quickLink, index) => (
                        <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={quickLink.name}
                                onChange={(e) => handleLinkChange('quick_links', index, 'name', e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Link"
                                value={quickLink.link}
                                onChange={(e) => handleLinkChange('quick_links', index, 'link', e.target.value)}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Position"
                                type="number"
                                value={quickLink.position}
                                onChange={(e) => handleLinkChange('quick_links', index, 'position', parseInt(e.target.value))}
                                margin="normal"
                                required
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Target</InputLabel>
                                <Select
                                    value={quickLink.target}
                                    onChange={(e) => handleLinkChange('quick_links', index, 'target', e.target.value as '_blank' | '_self')}
                                >
                                    <MenuItem value="_blank">_blank</MenuItem>
                                    <MenuItem value="_self">_self</MenuItem>
                                </Select>
                            </FormControl>
                            <IconButton onClick={() => setFooter(prev => ({ ...prev, quick_links: prev.quick_links.filter((_, i) => i !== index) }))}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddLink('quick_links')}>
                        Add Quick Link
                    </Button>

                    <TextField
                        fullWidth
                        label="Download Information Text"
                        name="download_information_text"
                        value={footer.download_information_text}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <Typography variant="h6" gutterBottom>Download Information</Typography>
                    {footer.download_information.map((downloadInfo, index) => (
                        <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={downloadInfo.title}
                                onChange={(e) => handleDownloadInfoChange(index, 'title', e.target.value)}
                                margin="normal"
                                required
                            />
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id={`download-image-upload-${index}`}
                                type="file"
                                onChange={(e) => handleDownloadInfoChange(index, 'image', e.target.files?.[0] || null)}
                            />
                            <label htmlFor={`download-image-upload-${index}`}>
                                <Button variant="contained" component="span">Upload Image</Button>
                            </label>
                            {downloadInfo.image && <Typography variant="body2">{downloadInfo.image.name}</Typography>}
                            <IconButton onClick={() => setFooter(prev => ({ ...prev, download_information: prev.download_information.filter((_, i) => i !== index) }))}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={handleAddDownloadInfo}>
                        Add Download Information
                    </Button>

                    <Typography variant="h6" gutterBottom>Meta Information</Typography>
                    <TextField
                        fullWidth
                        label="Meta Title"
                        name="title"
                        value={footer.meta.title}
                        onChange={handleMetaChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Meta Description"
                        name="description"
                        value={footer.meta.description}
                        onChange={handleMetaChange}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <TextField
                        fullWidth
                        label="Meta Keywords (comma-separated)"
                        name="keywords"
                        value={footer.meta.keywords.join(', ')}
                        onChange={(e) => setFooter(prev => ({ ...prev, meta: { ...prev.meta, keywords: e.target.value.split(',').map(k => k.trim()) } }))}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Canonical URL"
                        name="canonical_url"
                        value={footer.canonical_url}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Robots</InputLabel>
                        <Select
                            name="robots"
                            value={footer.robots}
                            onChange={(e) => setFooter(prev => ({ ...prev, robots: e.target.value as 'index, follow' | 'noindex, nofollow' }))}
                        >
                            <MenuItem value="index, follow">index, follow</MenuItem>
                            <MenuItem value="noindex, nofollow">noindex, nofollow</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={footer.is_active}
                                onChange={(e) => setFooter(prev => ({ ...prev, is_active: e.target.checked }))}
                                name="is_active"
                            />
                        }
                        label="Is Active"
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Create Footer
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}