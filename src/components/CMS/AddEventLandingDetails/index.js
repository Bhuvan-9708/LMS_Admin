"use client"
import React, { useState, useEffect } from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Typography,
    Box,
    Snackbar,
    Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
function EventLandingPageDetailsForm() {
    const [formData, setFormData] = useState({
        landing_page_id: '',
        faq: [],
        tools: {
            title: '',
            image: []
        },
        certificate: '',
        pro: {
            title: '',
            description: '',
            points: []
        },
        meta_title: '',
        meta_description: '',
        meta_keywords: [],
        seo_url: ''
    });
    const router = useRouter();
    const [landingPages, setLandingPages] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [certificate, setCertificate] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const landingPagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/webinar`);
                const landingPages = await landingPagesResponse.json();
                setLandingPages(landingPages.data);

                const faqsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faq/`);
                const faqs = await faqsResponse.json();
                setFaqs(faqs.data);

                const certificateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/certificate/`);
                const certificates = await certificateResponse.json();
                setCertificate(certificates.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleLandingPageIdChange = (e) => {
        setFormData(prev => ({
            ...prev,
            landing_page_id: e.target.value  // Single value
        }));
    };

    const handleCertificateChange = (e) => {
        setFormData(prev => ({
            ...prev,
            certificate: e.target.value  // Single value
        }));
    };

    const handleFaqChange = (e) => {
        const selectedValue = e.target.value;
        setFormData(prev => ({
            ...prev,
            faq: [...prev.faq, selectedValue],
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };


    const handleToolsChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            tools: {
                ...prevData.tools,
                [name]: value
            }
        }));
    };

    const handleToolImageChange = (e, index) => {
        const file = e.target.files[0];
        const newImages = [...formData.tools.image];
        newImages[index] = { image_icon: file };
        setFormData(prevData => ({
            ...prevData,
            tools: {
                ...prevData.tools,
                image: newImages
            }
        }));
    };

    const addToolImage = () => {
        setFormData(prevData => ({
            ...prevData,
            tools: {
                ...prevData.tools,
                image: [...prevData.tools.image, { image_icon: null }]
            }
        }));
    };

    const handleProChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            pro: {
                ...prevData.pro,
                [name]: value
            }
        }));
    };

    const handleProPointChange = (e, index) => {
        const newPoints = [...formData.pro.points];
        newPoints[index] = {
            ...newPoints[index],
            [e.target.name]: e.target.value
        };
        setFormData(prevData => ({
            ...prevData,
            pro: {
                ...prevData.pro,
                points: newPoints
            }
        }));
    };

    const addProPoint = () => {
        setFormData(prevData => ({
            ...prevData,
            pro: {
                ...prevData.pro,
                points: [...prevData.pro.points, { title: '', description: '' }]
            }
        }));
    };

    const handleMetaKeywordsChange = (e, index) => {
        const newKeywords = [...formData.meta_keywords];
        newKeywords[index] = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            meta_keywords: newKeywords
        }));
    };

    const addMetaKeyword = () => {
        setFormData(prevData => ({
            ...prevData,
            meta_keywords: [...formData.meta_keywords, '']
        }));
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        formDataToSend.append('certificate', formData.certificate);
        formDataToSend.append('landing_page_id', formData.landing_page_id);
        formDataToSend.append('tools[title]', formData.tools.title);
        formData.tools.image.forEach((img, index) => {
            if (img.image_icon) {
                formDataToSend.append(`tools[image][${index}]`, img.image_icon);
            }
        });
        formDataToSend.append('seo_url', formData.seo_url);
        formDataToSend.append('meta_title', formData.meta_title);
        formDataToSend.append('meta_description', formData.meta_description);
        formDataToSend.append('pro[title]', formData.pro.title);
        formDataToSend.append('pro[description]', formData.pro.description);
        formData.pro.points.forEach((point, index) => {
            formDataToSend.append(`pro[points][${index}][title]`, point.title);
            formDataToSend.append(`pro[points][${index}][description]`, point.description);
        });

        if (Array.isArray(formData.faq) && formData.faq.length > 0) {
            formData.faq.forEach((faqId) => {
                formDataToSend.append('faq[]', faqId);
            });
        } else {
            console.error("formData.faq is not an array or is empty", formData.faq);
        }

        formData.meta_keywords.forEach((keyword, index) => {
            formDataToSend.append(`meta_keywords[${index}]`, keyword);
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/webinar-details/v1/create`, {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Failed to create event landing page details');
            }

            const result = await response.json();
            console.log('Event landing page details created:', result);
            setSnackbar({
                open: true,
                message: 'Event landing page created successfully!',
                severity: 'success',
            });
            router.push('/cms/event-landing');
        } catch (error) {
            console.error('Error creating event landing page details:', error);
            setSnackbar({
                open: true,
                message: 'Error creating event landing page. Please try again.',
                severity: 'error',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>Event Landing Page Details</Typography>

            <FormControl fullWidth margin="normal" required>
                <InputLabel>Landing Page</InputLabel>
                <Select
                    required
                    name="landing_page_id"
                    value={formData.landing_page_id}
                    onChange={handleLandingPageIdChange}
                >
                    {landingPages.map(page => (
                        <MenuItem key={page._id} value={page._id}>{page.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>FAQs</Typography>
            <FormControl fullWidth margin="normal" required>
                <InputLabel>Faq</InputLabel>
                <Select
                    required
                    name="faq"
                    value={formData.faq}
                    onChange={handleFaqChange}
                >
                    {faqs.map(page => (
                        <MenuItem key={page._id} value={page._id}>{page.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>Certificate</Typography>
            <FormControl fullWidth margin="normal" required>
                <InputLabel>Certificate</InputLabel>
                <Select
                    required
                    name="certificate"
                    value={formData.certificate}
                    onChange={handleCertificateChange}
                >
                    {certificate.map(page => (
                        <MenuItem key={page._id} value={page._id}>{page.certification_title}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>Tools</Typography>
            <TextField
                required
                fullWidth
                label="Tools Title"
                name="title"
                value={formData.tools.title}
                onChange={handleToolsChange}
                margin="normal"
            />

            {formData.tools.image.map((img, index) => (
                <Box key={index} mb={2}>
                    <input
                        required
                        accept="image/*"
                        style={{ display: 'none' }}
                        id={`tool-image-upload-${index}`}
                        type="file"
                        onChange={(e) => handleToolImageChange(e, index)}
                    />
                    <label htmlFor={`tool-image-upload-${index}`}>
                        <Button variant="contained" component="span">
                            Upload Tool Image {index + 1}
                        </Button>
                    </label>
                    {img.image_icon && (
                        <Typography variant="body2">{img.image_icon.name}</Typography>
                    )}
                </Box>
            ))}
            <Button type="button" onClick={addToolImage} variant="outlined" color="primary">
                Add Tool Image
            </Button>
            <br />

            <Typography variant="h6" gutterBottom>Reasons to Join</Typography>
            <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.pro.title}
                onChange={handleProChange}
                margin="normal"
            />
            <TextField
                required
                fullWidth
                label="Description"
                name="description"
                value={formData.pro.description}
                onChange={handleProChange}
                margin="normal"
                multiline
                rows={4}
            />

            {formData.pro.points.map((point, index) => (
                <Box key={index} mb={2}>
                    <TextField
                        required
                        fullWidth
                        label={`Point ${index + 1} Title`}
                        name="title"
                        value={point.title}
                        onChange={(e) => handleProPointChange(e, index)}
                        margin="normal"
                    />
                    <TextField
                        required
                        fullWidth
                        label={`Point ${index + 1} Description`}
                        name="description"
                        value={point.description}
                        onChange={(e) => handleProPointChange(e, index)}
                        margin="normal"
                    />
                </Box>
            ))}
            <Button type="button" onClick={addProPoint} variant="outlined" color="primary">
                Add Point
            </Button>

            <TextField
                required
                fullWidth
                label="Meta Title"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                margin="normal"
            />

            <TextField
                required
                fullWidth
                label="Meta Description"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
            />

            {formData.meta_keywords.map((keyword, index) => (
                <TextField
                    required
                    key={index}
                    fullWidth
                    label={`Meta Keyword ${index + 1}`}
                    value={keyword}
                    onChange={(e) => handleMetaKeywordsChange(e, index)}
                    margin="normal"
                />
            ))}
            <Button type="button" onClick={addMetaKeyword} variant="outlined" color="primary">
                Add Meta Keyword
            </Button>

            <TextField
                required
                fullWidth
                label="SEO URL"
                name="seo_url"
                value={formData.seo_url}
                onChange={handleInputChange}
                margin="normal"
            />

            <Box mt={2}>
                <Button type="submit" variant="contained" color="primary">
                    Create Event Landing Page Details
                </Button>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </form>

    );
}

export default EventLandingPageDetailsForm;