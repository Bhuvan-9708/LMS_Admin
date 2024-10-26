"use client"
import React, { useState, useEffect } from 'react';
import {
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Button,
    Typography,
    Box
} from '@mui/material';

function EventLandingPageDetailsForm() {
    const [formData, setFormData] = useState({
        landing_page_id: '',
        faq: [],
        tools: {
            title: '',
            image: []
        },
        pro: {
            title: '',
            description: '',
            points: []
        },
        skills_learn: {
            title: '',
            tags: []
        },
        meta_title: '',
        meta_description: '',
        meta_keywords: [],
        seo_url: ''
    });

    const [landingPages, setLandingPages] = useState([]);
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const landingPagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/webinar`);
                const landingPages = await landingPagesResponse.json();
                setLandingPages(landingPages.data);

                const faqsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faq/`);
                const faqs = await faqsResponse.json();
                setFaqs(faqs.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    
    const handleFaqChange = (e) => {
        const { name, value } = e.target;

        if (name === 'faq') {
            const selectedValue = e.target.value;
            setFormData(prev => ({
                ...prev,
                [name]: [...prev[name], selectedValue],
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
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

    const handleSkillsLearnChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            skills_learn: {
                ...prevData.skills_learn,
                [name]: value
            }
        }));

    };

    const handleTagsChange = (e, index) => {
        const newTags = [...formData.skills_learn.tags];
        newTags[index] = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            skills_learn: {
                ...prevData.skills_learn,
                tags: newTags
            }
        }));
    };

    const addTag = () => {
        setFormData(prevData => ({
            ...prevData,
            skills_learn: {
                ...prevData.skills_learn,
                tags: [...prevData.skills_learn.tags, '']
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        Object.keys(formData).forEach(key => {
            if (key !== 'tools' && key !== 'pro' && key !== 'skills_learn' && key !== 'faq' && key !== 'meta_keywords') {
                formDataToSend.append(key, formData[key]);
            }
        });

        formDataToSend.append('tools[title]', formData.tools.title);
        formData.tools.image.forEach((img, index) => {
            if (img.image_icon) {
                formDataToSend.append(`tools[image][${index}]`, img.image_icon);
            }
        });
        formDataToSend.append('landing_page_id', formData.landing_page_id);
        formDataToSend.append('pro[title]', formData.pro.title);
        formDataToSend.append('pro[description]', formData.pro.description);
        formData.pro.points.forEach((point, index) => {
            formDataToSend.append(`pro[points][${index}][title]`, point.title);
            formDataToSend.append(`pro[points][${index}][description]`, point.description);
        });

        formDataToSend.append('skills_learn[title]', formData.skills_learn.title);
        formData.skills_learn.tags.forEach((tag, index) => {
            formDataToSend.append(`skills_learn[tags][${index}]`, tag);
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
        } catch (error) {
            console.error('Error creating event landing page details:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>FAQs</Typography>
            <FormControl fullWidth margin="normal" required>
                <InputLabel>Landing Page</InputLabel>
                <Select
                    name="landing_page_id"
                    value={formData.landing_page_id}
                    onChange={handleInputChange}
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
                    name="faq"
                    value={formData.faq}
                    onChange={handleFaqChange}
                >
                    {faqs.map(page => (
                        <MenuItem key={page._id} value={page._id}>{page.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>Tools</Typography>
            <TextField
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

            <Typography variant="h6" gutterBottom>Pro</Typography>
            <TextField
                fullWidth
                label="Pro Title"
                name="title"
                value={formData.pro.title}
                onChange={handleProChange}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Pro Description"
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
                        fullWidth
                        label={`Point ${index + 1} Title`}
                        name="title"
                        value={point.title}
                        onChange={(e) => handleProPointChange(e, index)}
                        margin="normal"
                    />
                    <TextField
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
                Add Pro Point
            </Button>

            <Typography variant="h6" gutterBottom>Skills Learn</Typography>
            <TextField
                fullWidth
                label="Skills Learn Title"
                name="title"
                value={formData.skills_learn.title}
                onChange={handleSkillsLearnChange}
                margin="normal"
            />

            {formData.skills_learn.tags.map((tag, index) => (
                <TextField
                    key={index}
                    fullWidth
                    label={`Skill Tag ${index + 1}`}
                    value={tag}
                    onChange={(e) => handleTagsChange(e, index)}
                    margin="normal"
                />
            ))}
            <Button type="button" onClick={addTag} variant="outlined" color="primary">
                Add Skill Tag
            </Button>

            <TextField
                fullWidth
                label="Meta Title"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
                margin="normal"
            />

            <TextField
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
        </form>
    );
}

export default EventLandingPageDetailsForm;