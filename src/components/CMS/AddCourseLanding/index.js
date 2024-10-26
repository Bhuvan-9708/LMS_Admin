'use client'

import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Box,
    Checkbox,
    FormControlLabel,
    CircularProgress
} from '@mui/material';

function CourseLandingPageForm() {
    const [formData, setFormData] = useState({
        title: '',
        hero_section: '',
        course_id: '',
        user_learning: {
            title: '',
            description: '',
            points: []
        },
        course_benefits: [],
        syllabus: '',
        for_whom: {
            title: '',
            description: '',
            content: []
        },
        tools: {
            title: '',
            image: []
        },
        certificate: '',
        faq: '',
        is_active: true
    });

    const [heroSections, setHeroSections] = useState([]);
    const [courses, setCourses] = useState([]);
    const [syllabi, setSyllabi] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [heroSectionsData, coursesData, syllabiData, certificatesData, faqsData] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page-hero-section/?type=course`).then(res => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/`).then(res => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/syllabus/`).then(res => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/certificate/`).then(res => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faq/`).then(res => res.json())
                ]);

                setHeroSections(heroSectionsData.data || []);
                setCourses(coursesData.data || []);
                setSyllabi(syllabiData.data || []);
                setCertificates(certificatesData.data || []);
                setFaqs(faqsData.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleArrayInputChange = (section, index, field, value) => {
        setFormData(prevData => {
            // Ensure section corresponds to an array
            const newArray = Array.isArray(prevData[section]) ? [...prevData[section]] : [];

            // Check if index is valid
            if (newArray[index]) {
                newArray[index] = { ...newArray[index], [field]: value };
            }

            return {
                ...prevData,
                [section]: newArray
            };
        });
    };


    const addArrayItem = (section, newItem) => {
        setFormData(prevData => {
            const pathParts = section.split('.');
            let current = prevData;

            for (const part of pathParts) {
                if (current[part] === undefined) {
                    console.error(`Path ${part} does not exist in the formData.`);
                    return prevData;
                }
                current = current[part];
            }

            if (Array.isArray(current)) {
                return {
                    ...prevData,
                    [pathParts[0]]: {
                        ...prevData[pathParts[0]],
                        [pathParts[1]]: [...current, newItem]
                    }
                };
            } else {
                console.error(`Expected array at ${section}, but found:`, current);
                return prevData;
            }
        });
    };

    const handleToolImageChange = (e, index) => {
        const file = e.target.files[0];
        setFormData(prevData => {
            const newImages = [...prevData.tools.image];
            newImages[index] = { image_icon: file };
            return {
                ...prevData,
                tools: {
                    ...prevData.tools,
                    image: newImages
                }
            };
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value !== 'object') {
                formDataToSend.append(key, value);
            }
        });

        formDataToSend.append('user_learning', JSON.stringify(formData.user_learning));
        formDataToSend.append('course_benefits', JSON.stringify(formData.course_benefits));
        formDataToSend.append('for_whom', JSON.stringify(formData.for_whom));
        formDataToSend.append('tools[title]', formData.tools.title);

        formData.tools.image.forEach((img, index) => {
            if (img.image_icon) {
                formDataToSend.append(`tools[image][${index}]`, img.image_icon);
            }
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/course/v1/create`, {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Failed to create course landing page');
            }

            const result = await response.json();
            console.log('Course landing page created:', result);
            // Handle success (e.g., show a success message, redirect, etc.)
        } catch (error) {
            console.error('Error creating course landing page:', error);
            // Handle error (e.g., show an error message)
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h4" gutterBottom>Add Course Landing Page</Typography>

            <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                margin="normal"
                required
            />

            <FormControl fullWidth margin="normal" required>
                <InputLabel>Hero Section</InputLabel>
                <Select
                    name="hero_section"
                    value={formData.hero_section || ''}
                    onChange={handleInputChange}
                >
                    {heroSections.map(section => (
                        <MenuItem key={section._id} value={section._id}>{section.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
                <InputLabel>Course</InputLabel>
                <Select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleInputChange}
                >
                    {courses.map(course => (
                        <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>User Learning</Typography>
            <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.user_learning.title}
                onChange={(e) => handleInputChange(e, 'user_learning')}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.user_learning.description}
                onChange={(e) => handleInputChange(e, 'user_learning')}
                margin="normal"
                multiline
                rows={4}
            />
            {formData.user_learning.points.map((point, index) => (
                <Box key={index} mb={2}>
                    <TextField
                        fullWidth
                        label={`Point ${index + 1} Title`}
                        value={point.title}
                        onChange={(e) => handleArrayInputChange('user_learning.points', index, 'title', e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label={`Point ${index + 1} Description`}
                        value={point.description}
                        onChange={(e) => handleArrayInputChange('user_learning.points', index, 'description', e.target.value)}
                        margin="normal"
                    />
                </Box>
            ))}
            <Button
                type="button"
                onClick={() => addArrayItem('user_learning.points', { title: '', description: '' })}
                variant="outlined"
                color="primary"
            >
                Add Learning Point
            </Button>

            <Typography variant="h6" gutterBottom>Course Benefits</Typography>
            {formData.course_benefits?.map((benefit, index) => (
                <Box key={index} mb={2}>
                    <TextField
                        fullWidth
                        label={`Benefit ${index + 1} Title`}
                        value={benefit.title}
                        onChange={(e) => handleArrayInputChange('course_benefits', index, 'title', e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label={`Benefit ${index + 1} Description`}
                        value={benefit.description}
                        onChange={(e) => handleArrayInputChange('course_benefits', index, 'description', e.target.value)}
                        margin="normal"
                    />
                </Box>
            ))}
            <Button
                type="button"
                onClick={() => addArrayItem('course_benefits', { title: '', description: '' })}
                variant="outlined"
                color="primary"
            >
                Add Course Benefit
            </Button>

            <FormControl fullWidth margin="normal">
                <InputLabel>Syllabus</InputLabel>
                <Select
                    name="syllabus"
                    value={formData.syllabus}
                    onChange={handleInputChange}
                >
                    {syllabi.map(syllabus => (
                        <MenuItem key={syllabus._id} value={syllabus._id}>{syllabus.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>For Whom</Typography>
            <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.for_whom.title}
                onChange={(e) => handleInputChange(e, 'for_whom')}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.for_whom.description}
                onChange={(e) => handleInputChange(e, 'for_whom')}
                margin="normal"
                multiline
                rows={4}
            />
            {formData.for_whom.content.map((item, index) => (
                <Box key={index} mb={2}>
                    <TextField
                        fullWidth
                        label={`Content ${index + 1} Title`}
                        value={item.title}
                        onChange={(e) => handleArrayInputChange('for_whom.content', index, 'title', e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label={`Content ${index + 1} Description`}
                        value={item.description}
                        onChange={(e) => handleArrayInputChange('for_whom.content', index, 'description', e.target.value)}
                        margin="normal"
                    />
                </Box>
            ))}
            <Button
                type="button"
                onClick={() => addArrayItem('for_whom.content', { title: '', description: '' })}
                variant="outlined"
                color="primary"
            >
                Add For Whom Content
            </Button>

            <Typography variant="h6" gutterBottom>Tools</Typography>
            <TextField
                fullWidth
                label="Tools Title"
                name="title"
                value={formData.tools.title}
                onChange={(e) => handleInputChange(e, 'tools')}
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

            <FormControl fullWidth margin="normal">
                <InputLabel>Certificate</InputLabel>
                <Select
                    name="certificate"
                    value={formData.certificate}
                    onChange={handleInputChange}
                >
                    {certificates.map(certificate => (
                        <MenuItem key={certificate._id} value={certificate._id}>{certificate.certification_title || certificate.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>FAQ</InputLabel>
                <Select
                    name="faq"
                    value={formData.faq}
                    onChange={handleInputChange}
                >
                    {faqs.map(faq => (
                        <MenuItem key={faq._id} value={faq._id}>{faq.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prevData => ({ ...prevData, is_active: e.target.checked }))}
                        name="is_active"
                        color="primary"
                    />
                }
                label="Is Active"
            />

            <Box mt={2}>
                <Button type="submit" variant="contained" color="primary">
                    Create Course Landing Page
                </Button>
            </Box>
        </form>
    );
}

export default CourseLandingPageForm;