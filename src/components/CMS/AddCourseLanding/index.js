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
    CircularProgress,
    IconButton,
    Snackbar,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
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
        course_benefits_title: [{ title: "" }],
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
        skills_learning: {
            title: '',
            tags: ['']
        },
        faq: '',
        is_active: true
    });
    const [heroSections, setHeroSections] = useState([]);
    const [courses, setCourses] = useState([]);
    const [syllabuses, setSyllabuses] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

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
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleNestedChange = (e, field, index, subfield) => {
        const { name, value } = e.target;

        setFormData(prevData => {
            if (subfield && Array.isArray(prevData[field][subfield])) {
                const updatedContent = [...prevData[field][subfield]];
                updatedContent[index] = {
                    ...updatedContent[index],
                    [name]: value
                };
                return {
                    ...prevData,
                    [field]: {
                        ...prevData[field],
                        [subfield]: updatedContent
                    }
                };
            } else if (Array.isArray(prevData[field])) {
                const updatedArray = [...prevData[field]];
                updatedArray[index] = {
                    ...updatedArray[index],
                    [name]: value
                };
                return {
                    ...prevData,
                    [field]: updatedArray
                };
            } else {
                return {
                    ...prevData,
                    [field]: {
                        ...prevData[field],
                        [name]: value
                    }
                };
            }
        });
    };

    const handleUserLearningPointsChange = (e, index) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            user_learning: {
                ...prevData.user_learning,
                points: prevData.user_learning.points.map((point, i) =>
                    i === index ? { ...point, [name]: value } : point
                ),
            },
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
        setFormData(prevData => ({
            ...prevData,
            tools: {
                ...prevData.tools,
                image: prevData.tools.image.map((img, i) =>
                    i === index ? { image_icon: file } : img
                )
            }
        }));
    };

    const handleAddPoint = () => {
        setFormData(prevData => ({
            ...prevData,
            user_learning: {
                ...prevData.user_learning,
                points: [...prevData.user_learning.points, { title: '', description: '' }],
            },
        }));
    };

    const handleAddBenefit = () => {
        setFormData(prevData => ({
            ...prevData,
            course_benefits: [
                ...prevData.course_benefits,
                { title: '', description: '' }
            ]
        }));
    };

    const handleAddForWhomContent = () => {
        setFormData(prevData => ({
            ...prevData,
            for_whom: {
                ...prevData.for_whom,
                content: [...prevData.for_whom.content, { title: '', description: '' }],
            },
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

    const handleSkillsLearningChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            skills_learning: {
                ...prevData.skills_learning,
                [name]: value,
            },
        }));
    };

    const handleTagChange = (index, value) => {
        setFormData(prevData => ({
            ...prevData,
            skills_learning: {
                ...prevData.skills_learning,
                tags: prevData.skills_learning.tags.map((tag, i) =>
                    i === index ? value : tag
                ),
            },
        }));
    };

    const addTagField = () => {
        setFormData(prevData => ({
            ...prevData,
            skills_learning: {
                ...prevData.skills_learning,
                tags: [...prevData.skills_learning.tags, ''],
            },
        }));
    };

    const removeTagField = (index) => {
        setFormData(prevData => ({
            ...prevData,
            skills_learning: {
                ...prevData.skills_learning,
                tags: prevData.skills_learning.tags.filter((_, i) => i !== index),
            },
        }));
    };
    const handleCourseBenefitTitleChange = (index, event) => {
        const updatedTitles = [...formData.course_benefits_title];
        updatedTitles[index].title = event.target.value;
        setFormData({ ...formData, course_benefits_title: updatedTitles });
    };

    const addCourseBenefitTitle = () => {
        setFormData({
            ...formData,
            course_benefits_title: [...formData.course_benefits_title, { title: "" }],
        });
    };

    const removeCourseBenefitTitle = (index) => {
        const updatedTitles = formData.course_benefits_title.filter((_, i) => i !== index);
        setFormData({ ...formData, course_benefits_title: updatedTitles });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
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
        formDataToSend.append('course_benefits', JSON.stringify(formData.course_benefits));
        formDataToSend.append('for_whom', JSON.stringify(formData.for_whom));
        formDataToSend.append("tools.title", formData.tools.title);
        formDataToSend.append('skills_learning', JSON.stringify(formData.skills_learning));
        formData.course_benefits_title.forEach((benefit, index) => {
            formDataToSend.append(`course_benefits_title[${index}][title]`, benefit.title);
        });

        formData.tools.image.forEach((img, index) => {
            if (img.image_icon) {
                formDataToSend.append(`tools.image[${index}].image_icon`, img.image_icon);
            }
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/course/v1/create`, {
                method: 'POST',
                body: formDataToSend,
            });
            if (response.status === 409) {
                alert('A landing page already exists for this course.');
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to create course landing page');
            }

            const result = await response.json();
            console.log('Course landing page created:', result);
            setSnackbar({
                open: true,
                message: 'Course Landing submitted successfully!',
                severity: 'success'
            });
            router.push('/cms/course-landing');
        } catch (error) {
            console.error('Error creating course landing page:', error);
            setSnackbar({
                open: true,
                message: 'Error submitting Course Landing. Please try again.',
                severity: 'error'
            });
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
                            required
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
                            required
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
                                required
                                label="Title"
                                name="title"
                                value={formData.user_learning.title}
                                onChange={(e) => handleNestedChange(e, 'user_learning')}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                required
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
                                        required
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
                                        required
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
                <br />
                <Grid container spacing={1} sx={{ m: 1 }}>
                    {formData.course_benefits_title.map((benefit, index) => (
                        <Grid item xs={12} key={index}>
                            <TextField
                                required
                                label={`Course Benefits Title ${index + 1}`}
                                value={benefit.title}
                                onChange={(e) => handleCourseBenefitTitleChange(index, e)}
                                fullWidth
                            />
                            <Button onClick={() => removeCourseBenefitTitle(index)} color="secondary">
                                Remove
                            </Button>
                        </Grid>
                    ))}
                    <Grid item xs={6} spacing={2}>
                        <Button onClick={addCourseBenefitTitle} variant="outlined" color="primary">
                            Add Another Benefit Title
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} >
                    <Typography variant="h6">Course Benefits</Typography>
                    {formData.course_benefits.map((benefit, index) => (
                        <Grid key={index} container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    required
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
                                    required
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
                            required
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
                                required
                                label="Title"
                                name="title"
                                value={formData.for_whom.title}
                                onChange={(e) => handleNestedChange(e, 'for_whom')}
                                fullWidth
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                required
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
                                        required
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
                                        required
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
                <Grid container spacing={2} sx={{ m: 1 }}>
                    <Typography variant="h6" gutterBottom>Tools</Typography>
                    <TextField
                        required
                        sx={{ m: 1 }}
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
                </Grid>
                <Grid item xs={12}>
                    <Box>
                        <Typography variant="h6">Skills Learning</Typography>
                        <TextField
                            required
                            label="Title"
                            name="title"
                            variant="outlined"
                            fullWidth
                            value={formData.skills_learning.title}
                            onChange={handleSkillsLearningChange}
                            margin="normal"
                        />

                        <Typography variant="subtitle1" gutterBottom>
                            Tags
                        </Typography>
                        {formData.skills_learning.tags.map((tag, index) => (
                            <Box key={index} display="flex" alignItems="center" mb={1}>
                                <TextField
                                    required
                                    label={`Tag ${index + 1}`}
                                    variant="outlined"
                                    value={tag}
                                    onChange={(e) => handleTagChange(index, e.target.value)}
                                    fullWidth
                                />
                                <IconButton
                                    color="primary"
                                    onClick={addTagField}
                                    size="large"
                                >
                                    <AddIcon />
                                </IconButton>
                                {formData.skills_learning.tags.length > 1 && (
                                    <IconButton
                                        color="secondary"
                                        onClick={() => removeTagField(index)}
                                        size="large"
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Certificate</InputLabel>
                        <Select
                            required
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
                            required
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
};

export default CourseLandingPageForm;