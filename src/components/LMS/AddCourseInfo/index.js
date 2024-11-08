'use client'

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    IconButton,
    Card,
    CardContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from 'next/navigation';

export default function AddCourseInfoForm() {
    const [formData, setFormData] = useState({
        placement_opportunity: [
            {
                date: null,
                title: '',
                short_desc: '',
                image_icon: null,
                link: '',
            },
        ],
        curriculum: {
            title: '',
            tags: [''],
            path: [{ title: '', description: '' }],
        },
        projects: [
            {
                level: '',
                title: '',
                tags: [''],
                image: null,
            },
        ],
        faq: [{ title: '', description: '' }],
        course_id: '',
    });

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/`);
            if (response.ok) {
                const data = await response.json();
                setCourses(data.data);
            } else {
                console.error('Failed to fetch courses');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = (event) => {
        const { value } = event.target;
        setFormData((prev) => ({
            ...prev,
            course_id: value
        }));
    };

    const handleInputChange = (e, index, field, nestedField) => {
        const { name, value } = e.target;

        setFormData((prevData) => {
            if (field && nestedField) {
                const updatedField = [...prevData[field]];
                updatedField[index][nestedField] = value;
                return { ...prevData, [field]: updatedField };
            } else if (field) {
                const updatedField = [...prevData[field]];
                updatedField[index][name] = value;
                return { ...prevData, [field]: updatedField };
            } else {
                return { ...prevData, [name]: value };
            }
        });
    };

    const handleCurriculumChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            curriculum: { ...prevData.curriculum, [name]: value },
        }));
    };

    const handleCurriculumPathChange = (index, field, value) => {
        setFormData((prevData) => {
            const updatedPath = [...prevData.curriculum.path];
            updatedPath[index][field] = value;
            return {
                ...prevData,
                curriculum: { ...prevData.curriculum, path: updatedPath },
            };
        });
    };

    const handleDateChange = (date, index) => {
        setFormData((prevData) => {
            const updatedOpportunities = [...prevData.placement_opportunity];
            updatedOpportunities[index].date = date;
            return { ...prevData, placement_opportunity: updatedOpportunities };
        });
    };

    const handleFileChange = (e, index, field) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prevData) => {
                const updatedField = [...prevData[field]];
                updatedField[index].image_icon = file;
                return { ...prevData, [field]: updatedField };
            });
        }
    };

    const handleProjectImageChange = (e, index) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prevData) => {
                const updatedProjects = [...prevData.projects];
                updatedProjects[index].image = file;
                return { ...prevData, projects: updatedProjects };
            });
        }
    };

    const handleTagsChange = (e, projectIndex, tagIndex, field) => {
        const { value } = e.target;
        setFormData((prevData) => {
            if (field === 'curriculum') {
                const updatedTags = [...prevData.curriculum.tags];
                updatedTags[projectIndex] = value;
                return {
                    ...prevData,
                    curriculum: { ...prevData.curriculum, tags: updatedTags },
                };
            } else if (field === 'projects') {
                const updatedProjects = [...prevData.projects];
                updatedProjects[projectIndex].tags[tagIndex] = value;
                return { ...prevData, projects: updatedProjects };
            }
            return prevData;
        });
    };

    const addField = (field, projectIndex) => {
        setFormData((prevData) => {
            if (field === 'placement_opportunity') {
                return {
                    ...prevData,
                    [field]: [
                        ...prevData[field],
                        { date: null, title: '', short_desc: '', image_icon: null, link: '' },
                    ],
                };
            } else if (field === 'curriculum.path') {
                return {
                    ...prevData,
                    curriculum: {
                        ...prevData.curriculum,
                        path: [...prevData.curriculum.path, { title: '', description: '' }],
                    },
                };
            } else if (field === 'projects') {
                return {
                    ...prevData,
                    [field]: [...prevData[field], { level: '', title: '', tags: [''], image: null }],
                };
            } else if (field === 'faq') {
                return {
                    ...prevData,
                    [field]: [...prevData[field], { title: '', description: '' }],
                };
            } else if (field === 'curriculum.tags') {
                return {
                    ...prevData,
                    curriculum: {
                        ...prevData.curriculum,
                        tags: [...prevData.curriculum.tags, ''],
                    },
                };
            } else if (field === 'projects.tags' && projectIndex !== undefined) {
                const updatedProjects = [...prevData.projects];
                updatedProjects[projectIndex].tags.push('');
                return {
                    ...prevData,
                    projects: updatedProjects,
                };
            }
            return prevData;
        });
    };

    const removeField = (field, index, projectIndex) => {
        setFormData((prevData) => {
            if (field === 'curriculum.path') {
                const updatedPath = [...prevData.curriculum.path];
                updatedPath.splice(index, 1);
                return {
                    ...prevData,
                    curriculum: { ...prevData.curriculum, path: updatedPath },
                };
            } else if (field === 'curriculum.tags') {
                const updatedTags = [...prevData.curriculum.tags];
                updatedTags.splice(index, 1);
                return {
                    ...prevData,
                    curriculum: { ...prevData.curriculum, tags: updatedTags },
                };
            } else if (field === 'projects.tags' && projectIndex !== undefined) {
                const updatedProjects = [...prevData.projects];
                updatedProjects[projectIndex].tags.splice(index, 1);
                return {
                    ...prevData,
                    projects: updatedProjects,
                };
            } else {
                return {
                    ...prevData,
                    [field]: prevData[field].filter((_, i) => i !== index),
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Append course_id
        formDataToSend.append('course_id', formData.course_id);

        // Append placement_opportunity
        formData.placement_opportunity.forEach((opportunity, index) => {
            Object.entries(opportunity).forEach(([field, value]) => {
                if (field === 'image_icon' && value instanceof File) {
                    formDataToSend.append(`placement_opportunity[${index}][${field}]`, value);
                } else {
                    formDataToSend.append(`placement_opportunity[${index}][${field}]`, value);
                }
            });
        });

        // Append curriculum
        formDataToSend.append('curriculum[title]', formData.curriculum.title);
        formData.curriculum.tags.forEach((tag, index) => {
            formDataToSend.append(`curriculum[tags][${index}]`, tag);
        });
        formData.curriculum.path.forEach((pathItem, index) => {
            formDataToSend.append(`curriculum[path][${index}][title]`, pathItem.title);
            formDataToSend.append(`curriculum[path][${index}][description]`, pathItem.description);
        });

        // Append projects
        formData.projects.forEach((project, index) => {
            Object.entries(project).forEach(([field, value]) => {
                if (field === 'image' && value instanceof File) {
                    formDataToSend.append(`projects[${index}][${field}]`, value);
                } else if (field === 'tags') {
                    value.forEach((tag, tagIndex) => {
                        formDataToSend.append(`projects[${index}][${field}][${tagIndex}]`, tag);
                    });
                } else {
                    formDataToSend.append(`projects[${index}][${field}]`, value);
                }
            });
        });

        // Append FAQ
        formData.faq.forEach((faqItem, index) => {
            formDataToSend.append(`faq[${index}][title]`, faqItem.title);
            formDataToSend.append(`faq[${index}][description]`, faqItem.description);
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/create-course-info`, {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Course info added successfully:', result);
                setSnackbar({
                    open: true,
                    message: 'Course Info created successfully!',
                    severity: 'success',
                });
                router.push('/lms/courses');
            } else {
                console.error('Failed to add course info');
            }
        } catch (error) {
            console.error('Error adding course info:', error);
            setSnackbar({
                open: true,
                message: 'Error creating Course Info page. Please try again.',
                severity: 'error',
            });
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Course
                        </Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="course-select-label">Select Course</InputLabel>
                            <Select
                                required
                                labelId="course-select-label"
                                value={formData.course_id}
                                onChange={handleCourseChange}
                                label="Select Course"
                            >
                                {courses?.map((course) => (
                                    <MenuItem key={course._id} value={course._id}>
                                        {course.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>

                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Placement Opportunities
                        </Typography>
                        {formData.placement_opportunity.map((opportunity, index) => (
                            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        label="Date"
                                        value={opportunity.date}
                                        onChange={(date) => handleDateChange(date, index)}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Title"
                                        value={opportunity.title}
                                        onChange={(e) => handleInputChange(e, index, 'placement_opportunity', 'title')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Short Description"
                                        value={opportunity.short_desc}
                                        onChange={(e) => handleInputChange(e, index, 'placement_opportunity', 'short_desc')}
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <input
                                        required
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => handleFileChange(e, index, 'placement_opportunity')}
                                        style={{ display: 'none' }}
                                        id={`placement-opportunity-image-${index}`}
                                    />
                                    <label htmlFor={`placement-opportunity-image-${index}`}>
                                        <Button variant="contained" component="span">
                                            Upload Image Icon
                                        </Button>
                                    </label>
                                    {opportunity.image_icon && <Typography>{opportunity.image_icon.name}</Typography>}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Link"
                                        value={opportunity.link}
                                        onChange={(e) => handleInputChange(e, index, 'placement_opportunity', 'link')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <IconButton onClick={() => removeField('placement_opportunity', index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => addField('placement_opportunity')}>
                            Add Placement Opportunity
                        </Button>
                    </CardContent>
                </Card>

                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Curriculum
                        </Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            required
                            name="title"
                            value={formData.curriculum.title}
                            onChange={handleCurriculumChange}
                            sx={{ mb: 2 }}
                        />
                        {formData.curriculum.tags.map((tag, index) => (
                            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                <Grid item xs={10}>
                                    <TextField
                                        required
                                        fullWidth
                                        label={`Tag ${index + 1}`}
                                        value={tag}
                                        onChange={(e) => handleTagsChange(e, index, null, 'curriculum')}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton onClick={() => removeField('curriculum.tags', index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => addField('curriculum.tags')}>
                            Add Curriculum Tag
                        </Button>
                        {formData.curriculum.path.map((pathItem, index) => (
                            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Title"
                                        value={pathItem.title}
                                        onChange={(e) => handleCurriculumPathChange(index, 'title', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Description"
                                        value={pathItem.description}
                                        onChange={(e) => handleCurriculumPathChange(index, 'description', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <IconButton onClick={() => removeField('curriculum.path', index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => addField('curriculum.path')}>
                            Add Curriculum Path Item
                        </Button>
                    </CardContent>
                </Card>

                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Projects
                        </Typography>
                        {formData.projects.map((project, projectIndex) => (
                            <Grid container spacing={2} key={projectIndex} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Level"
                                        name="level"
                                        value={project.level}
                                        onChange={(e) => handleInputChange(e, projectIndex, 'projects')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Title"
                                        name="title"
                                        value={project.title}
                                        onChange={(e) => handleInputChange(e, projectIndex, 'projects')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Tags
                                    </Typography>
                                    {project.tags.map((tag, tagIndex) => (
                                        <Grid container spacing={2} key={tagIndex} sx={{ mb: 2 }}>
                                            <Grid item xs={10}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    label={`Tag ${tagIndex + 1}`}
                                                    value={tag}
                                                    onChange={(e) => handleTagsChange(e, projectIndex, tagIndex, 'projects')}
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <IconButton onClick={() => removeField('projects.tags', tagIndex, projectIndex)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <Button startIcon={<AddIcon />} onClick={() => addField('projects.tags', projectIndex)}>
                                        Add Project Tag
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => handleProjectImageChange(e, projectIndex)}
                                        style={{ display: 'none' }}
                                        id={`project-image-${projectIndex}`}
                                    />
                                    <label htmlFor={`project-image-${projectIndex}`}>
                                        <Button variant="contained" component="span">
                                            Upload Project Image
                                        </Button>
                                    </label>
                                    {project.image && <Typography>{project.image.name}</Typography>}
                                </Grid>
                                <Grid item xs={12}>
                                    <IconButton onClick={() => removeField('projects', projectIndex)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => addField('projects')}>
                            Add Project
                        </Button>
                    </CardContent>
                </Card>

                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            FAQ
                        </Typography>
                        {formData.faq.map((faqItem, index) => (
                            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Question"
                                        name="title"
                                        value={faqItem.title}
                                        onChange={(e) => handleInputChange(e, index, 'faq')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Answer"
                                        name="description"
                                        value={faqItem.description}
                                        onChange={(e) => handleInputChange(e, index, 'faq')}
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <IconButton onClick={() => removeField('faq', index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => addField('faq')}>
                            Add FAQ
                        </Button>
                    </CardContent>
                </Card>

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit Course Info
                </Button>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
}