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
import { useRouter } from 'next/navigation';

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
        course_benefits_title: '',
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
    router - useRouter();
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

    const handleNestedChange = (e, field, index, subfield) => {
        const { name, value } = e.target;

        if (subfield && Array.isArray(formData[field][subfield])) {
            const updatedContent = [...formData[field][subfield]];
            updatedContent[index] = {
                ...updatedContent[index],
                [name]: value
            };
            setFormData({
                ...formData,
                [field]: {
                    ...formData[field],
                    [subfield]: updatedContent
                }
            });
        } else if (Array.isArray(formData[field])) {
            const updatedArray = [...formData[field]];
            updatedArray[index] = {
                ...updatedArray[index],
                [name]: value
            };
            setFormData({
                ...formData,
                [field]: updatedArray
            });
        } else {
            // Handle direct nested object
            setFormData({
                ...formData,
                [field]: {
                    ...formData[field],
                    [name]: value
                }
            });
        }
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
        setFormData((prevData) => ({
            ...prevData,
            course_benefits: [
                ...prevData.course_benefits,
                { title: '', description: '' }
            ]
        }));
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
            if (typeof value !== 'object' || key === 'course_id') {
                formDataToSend.append(key, value);
            }
        });

        formDataToSend.append('user_learning', JSON.stringify(formData.user_learning));
        formDataToSend.append('course_benefits', JSON.stringify([
            ...formData.course_benefits
        ]));
        formDataToSend.append('for_whom', JSON.stringify(formData.for_whom));
        formDataToSend.append('tools[title]', formData.tools.title);

        if (formData.tools.image) {
            formData.tools.image.forEach((img, index) => {
                if (img.image_icon) {
                    formDataToSend.append(`tools[image][${index}]`, img.image_icon);
                }
            });
        }
        formDataToSend.append('is_active', formData.is_active === 'true');

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
            router.push('/cms/course-landing');
        } catch (error) {
            console.error('Error creating course landing page:', error);
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
                    <TextField
                        label="Course Benefits Title"
                        name="course_benefits_title"
                        value={formData.course_benefits_title}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Course Benefits</Typography>
                    {formData.course_benefits.map((benefit, index) => (
                        <Grid key={index} container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    sx={{ m: 1 }}
                                    label="Benefit Title"
                                    name="title"
                                    value={benefit.title}
                                    onChange={(e) => handleNestedChange(e, 'course_benefits', index)}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    sx={{ m: 1 }}
                                    label="Benefit Description"
                                    name="description"
                                    value={benefit.description}
                                    onChange={(e) => handleNestedChange(e, 'course_benefits', index)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    ))}
                    <br />
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
                                        sx={{ m: 2 }}
                                        label="Content Title"
                                        name="title"
                                        value={content.title}
                                        onChange={(e) => handleNestedChange(e, 'for_whom', index, 'content')}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        sx={{ m: 2 }}
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
                            sx={{ m: 1 }}
                            accept="image/*"
                            style={{ display: 'none' }}
                            id={`tool-image-upload-${index}`}
                            type="file"
                            onChange={(e) => handleToolImageChange(e, index)}
                        />
                        <label htmlFor={`tool-image-upload-${index}`}>
                            <Button sx={{ m: 1 }} variant="contained" component="span">
                                Upload Tool Image {index + 1}
                            </Button>
                        </label>
                        {img.image_icon && (
                            <Typography variant="body2">{img.image_icon.name}</Typography>
                        )}
                    </Box>
                ))}

                <Button sx={{ m: 1 }} type="button" onClick={addToolImage} variant="outlined" color="primary">
                    Add Tool Image
                </Button>

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