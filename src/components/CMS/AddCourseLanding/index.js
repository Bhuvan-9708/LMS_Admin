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
    Grid,
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
            image: [{ image_icon: null }],
        },
        certificate: '',
        faq: '',
        is_active: true
    });

    const [heroSections, setHeroSections] = useState([]);
    const [courses, setCourses] = useState([]);
    const [syllabuses, setSyllabuses] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [heroSectionsData, coursesData, syllabusData, certificatesData, faqsData] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page-hero-section/?type=course`).then(res => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/`).then(res => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/syllabus/`).then(res => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/certificate/`).then(res => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faq/`).then(res => res.json())
                ]);

                setHeroSections(heroSectionsData.data || []);
                setCourses(coursesData.data || []);
                setSyllabuses(syllabusData.data || []);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleNestedChange = (e, field, index) => {
        const { name, value } = e.target;
        const updatedField = [...formData[field]];

        if (index !== undefined) {
            updatedField[index][name] = value;
        } else {
            updatedField[name] = value;
        }

        setFormData({
            ...formData,
            [field]: updatedField,
        });
    };

    const handleUserLearningPointsChange = (e, index) => {
        const { name, value } = e.target;
        const updatedPoints = [...formData.user_learning.points];
        updatedPoints[index][name] = value;

        setFormData({
            ...formData,
            user_learning: {
                ...formData.user_learning,
                points: updatedPoints,
            },
        });
    };

    const handleAddPoint = () => {
        setFormData({
            ...formData,
            user_learning: {
                ...formData.user_learning,
                points: [...formData.user_learning.points, { title: '', description: '' }],
            },
        });
    };

    const handleAddBenefit = () => {
        setFormData({
            ...formData,
            course_benefits: [...formData.course_benefits, { title: '', description: '' }],
        });
    };

    const handleAddForWhomContent = () => {
        setFormData({
            ...formData,
            for_whom: {
                ...formData.for_whom,
                content: [...formData.for_whom.content, { title: '', description: '' }],
            },
        });
    };

    const handleAddToolImage = () => {
        setFormData({
            ...formData,
            tools: {
                ...formData.tools,
                image: [...formData.tools.image, { image_icon: '' }],
            },
        });
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
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth required>
                        <InputLabel>Hero Section</InputLabel>
                        <Select
                            name="hero_section"
                            value={formData.hero_section}
                            onChange={handleChange}
                        >
                            {heroSections.map((section) => (
                                <MenuItem key={section._id} value={section._id}>
                                    {section.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth required>
                        <InputLabel>Course</InputLabel>
                        <Select
                            name="course_id"
                            value={formData.course_id}
                            onChange={handleChange}
                        >
                            {courses.map((course) => (
                                <MenuItem key={course._id} value={course._id}>
                                    {course.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6">User Learning</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Title"
                                name="title"
                                value={formData.user_learning.title}
                                onChange={(e) => handleNestedChange(e, 'user_learning')}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.user_learning.description}
                                onChange={(e) => handleNestedChange(e, 'user_learning')}
                                fullWidth
                            />
                        </Grid>

                        {formData.user_learning.points.map((point, index) => (
                            <Grid key={index} container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        sx={{ m: 2 }}
                                        label="Point Title"
                                        name="title"
                                        value={point.title}
                                        onChange={(e) => handleUserLearningPointsChange(e, index)}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        sx={{ m: 2 }}
                                        label="Point Description"
                                        name="description"
                                        value={point.description}
                                        onChange={(e) => handleUserLearningPointsChange(e, index)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleAddPoint}>
                                Add Point
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6">Course Benefits</Typography>
                    {formData.course_benefits.map((benefit, index) => (
                        <Grid key={index} container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Benefit Title"
                                    name="title"
                                    value={benefit.title}
                                    onChange={(e) => handleNestedChange(e, 'course_benefits', index)}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    label="Benefit Description"
                                    name="description"
                                    value={benefit.description}
                                    onChange={(e) => handleNestedChange(e, 'course_benefits', index)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    ))}

                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleAddBenefit}>
                            Add Benefit
                        </Button>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Syllabus</InputLabel>
                        <Select
                            name="syllabus"
                            value={formData.syllabus}
                            onChange={handleChange}
                        >
                            {syllabuses.map((syllabus) => (
                                <MenuItem key={syllabus._id} value={syllabus._id}>
                                    {syllabus.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6">For Whom</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Title"
                                name="title"
                                value={formData.for_whom.title}
                                onChange={(e) => handleNestedChange(e, 'for_whom')}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label=" Description"
                                name="description"
                                value={formData.for_whom.description}
                                onChange={(e) => handleNestedChange(e, 'for_whom')}
                                fullWidth
                            />
                        </Grid>

                        {formData.for_whom.content.map((content, index) => (
                            <Grid key={index} container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Content Title"
                                        name="title"
                                        value={content.title}
                                        onChange={(e) => handleNestedChange(e, 'for_whom', index, 'content')}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        label="Content Description"
                                        name="description"
                                        value={content.description}
                                        onChange={(e) => handleNestedChange(e, 'for_whom', index, 'content')}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleAddForWhomContent}>
                                Add Content
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6">Tools</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Title"
                                name="title"
                                value={formData.tools.title}
                                onChange={(e) => handleNestedChange(e, 'tools')}
                                fullWidth
                            />
                        </Grid>

                        {formData.tools.image.map((image, index) => (
                            <Grid key={index} container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        sx={{ m: 2 }}
                                        type="file"
                                        name="image_icon"
                                        onChange={(e) => handleNestedChange(e, 'tools', index, 'image')} // Use the updated function
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        ))}

                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleAddToolImage}>
                                Add Image
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Certificate</InputLabel>
                        <Select
                            name="certificate"
                            value={formData.certificate}
                            onChange={handleChange}
                        >
                            {certificates.map((certificate) => (
                                <MenuItem key={certificate._id} value={certificate._id}>
                                    {certificate.certification_title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>FAQ</InputLabel>
                        <Select
                            name="faq"
                            value={formData.faq}
                            onChange={handleChange}
                        >
                            {faqs.map((faq) => (
                                <MenuItem key={faq._id} value={faq._id}>
                                    {faq.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.is_active}
                                onChange={handleChange}
                                name="is_active"
                            />
                        }
                        label="Is Active"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                        Create Course Landing Page
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default CourseLandingPageForm;