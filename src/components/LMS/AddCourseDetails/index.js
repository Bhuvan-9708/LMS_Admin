"use client"
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const AddCourseDetailsForm = () => {
    const [formData, setFormData] = useState({
        course_benefits: [{ title: '', description: '' }],
        course_benfits_title: [''],
        placement_stats: [{ title: '', description: '' }],
        admission_details_text: '',
        admission_details_desc: '',
        admission_details: [{ title: '', description: '' }],
        why_us: {
            title: '',
            heading: '',
            description: '',
            points: [{ title: '', image: null }],
        },
        placement_info_text: '',
        placement_info: [{ text: '', image: null }],
        course_id: '',
    });
    const [courses, setCourses] = useState();
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
            if (!response.ok) throw new Error('Failed to fetch courses');
            const data = await response.json();
            setCourses(data.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
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
                updatedField[index] = value;
                return { ...prevData, [field]: updatedField };
            } else {
                return { ...prevData, [name]: value };
            }
        });
    };

    const handleWhyUsChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            why_us: { ...prevData.why_us, [name]: value },
        }));
    };
    const handleCourseChange = (event) => {
        const { value } = event.target;
        setFormData((prev) => ({
            ...prev,
            course_id: value
        }));
    };
    const handleWhyUsPointChange = (index, field, value) => {
        setFormData((prevData) => {
            const updatedPoints = [...prevData.why_us.points];
            updatedPoints[index][field] = value;
            return {
                ...prevData,
                why_us: { ...prevData.why_us, points: updatedPoints },
            };
        });
    };

    const handleFileChange = (e, index, field) => {
        const file = e.target.files[0];
        setFormData((prevData) => {
            if (field === 'why_us') {
                const updatedPoints = [...prevData.why_us.points];
                updatedPoints[index].image = file;
                return {
                    ...prevData,
                    why_us: { ...prevData.why_us, points: updatedPoints },
                };
            } else {
                const updatedField = [...prevData[field]];
                updatedField[index].image = file;
                return { ...prevData, [field]: updatedField };
            }
        });
    };

    const addField = (field) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: [...prevData[field], field === 'course_benfits_title' ? '' : { title: '', description: '' }],
        }));
    };

    const removeField = (field, index) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: prevData[field].filter((_, i) => i !== index),
        }));
    };

    const addWhyUsPoint = () => {
        setFormData((prevData) => ({
            ...prevData,
            why_us: {
                ...prevData.why_us,
                points: [...prevData.why_us.points, { title: '', image: null }],
            },
        }));
    };

    const removeWhyUsPoint = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            why_us: {
                ...prevData.why_us,
                points: prevData.why_us.points.filter((_, i) => i !== index),
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Append all non-file fields
        Object.keys(formData).forEach((key) => {
            if (key !== 'why_us' && key !== 'placement_info') {
                if (Array.isArray(formData[key])) {
                    formData[key].forEach((item, index) => {
                        if (typeof item === 'object') {
                            Object.keys(item).forEach((subKey) => {
                                if (subKey !== 'image') {
                                    formDataToSend.append(`${key}[${index}][${subKey}]`, item[subKey]);
                                }
                            });
                        } else {
                            formDataToSend.append(`${key}[${index}]`, item);
                        }
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }
        });

        // Append why_us fields
        Object.keys(formData.why_us).forEach((key) => {
            if (key !== 'points') {
                formDataToSend.append(`why_us[${key}]`, formData.why_us[key]);
            }
        });

        // Append why_us points and images
        formData.why_us.points.forEach((point, index) => {
            formDataToSend.append(`why_us[points][${index}][title]`, point.title);
            if (point.image) {
                formDataToSend.append(`why_us[points][${index}][image]`, point.image);
            }
        });

        // Append placement_info and images
        formData.placement_info.forEach((info, index) => {
            formDataToSend.append(`placement_info[${index}][text]`, info.text);
            if (info.image) {
                formDataToSend.append(`placement_info[${index}][image]`, info.image);
            }
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/create-course-details`, {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Course details added successfully:', result);
                setSnackbar({
                    open: true,
                    message: 'Course Details created successfully!',
                    severity: 'success',
                });
                router.push('/lms/courses');
            } else {
                console.error('Failed to add course details');
            }
        } catch (error) {
            console.error('Error adding course details:', error);
            setSnackbar({
                open: true,
                message: 'Error creating Course Details page. Please try again.',
                severity: 'error',
            });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Course Benefits
                    </Typography>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Course
                            </Typography>
                            <FormControl fullWidth margin="normal">
                                <Select
                                    required
                                    labelId="course-select-label"
                                    value={formData.course_id}
                                    onChange={handleCourseChange}
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

                    {formData.course_benefits.map((benefit, index) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                            <Grid item xs={5}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Title"
                                    value={benefit.title}
                                    onChange={(e) => handleInputChange(e, index, 'course_benefits', 'title')}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Description"
                                    value={benefit.description}
                                    onChange={(e) => handleInputChange(e, index, 'course_benefits', 'description')}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={() => removeField('course_benefits', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => addField('course_benefits')}>
                        Add Course Benefit
                    </Button>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Course Benefits Title
                    </Typography>
                    {formData.course_benfits_title.map((title, index) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                            <Grid item xs={10}>
                                <TextField
                                    required
                                    fullWidth
                                    label={`Title ${index + 1}`}
                                    value={title}
                                    onChange={(e) => handleInputChange(e, index, 'course_benfits_title')}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={() => removeField('course_benfits_title', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => addField('course_benfits_title')}>
                        Add Course Benefit Title
                    </Button>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Placement Stats
                    </Typography>
                    {formData.placement_stats.map((stat, index) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                            <Grid item xs={5}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Title"
                                    value={stat.title}
                                    onChange={(e) => handleInputChange(e, index, 'placement_stats', 'title')}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Description"
                                    value={stat.description}
                                    onChange={(e) => handleInputChange(e, index, 'placement_stats', 'description')}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={() => removeField('placement_stats', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => addField('placement_stats')}>
                        Add Placement Stat
                    </Button>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Admission Details
                    </Typography>
                    <TextField
                        required
                        fullWidth
                        label="Admission Details Text"
                        name="admission_details_text"
                        value={formData.admission_details_text}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Admission Details Description"
                        name="admission_details_desc"
                        value={formData.admission_details_desc}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />
                    {formData.admission_details.map((detail, index) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                            <Grid item xs={5}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Title"
                                    value={detail.title}
                                    onChange={(e) => handleInputChange(e, index, 'admission_details', 'title')}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Description"
                                    value={detail.description}
                                    onChange={(e) => handleInputChange(e, index, 'admission_details', 'description')}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={() => removeField('admission_details', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => addField('admission_details')}>
                        Add Admission Detail
                    </Button>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Why Us
                    </Typography>
                    <TextField
                        required
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.why_us.title}
                        onChange={handleWhyUsChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Heading"
                        name="heading"
                        value={formData.why_us.heading}
                        onChange={handleWhyUsChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        required
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.why_us.description}
                        onChange={handleWhyUsChange}
                        multiline
                        rows={3}
                        sx={{ mb: 2 }}
                    />
                    {formData.why_us.points.map((point, index) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                            <Grid item xs={5}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Title"
                                    value={point.title}
                                    onChange={(e) => handleWhyUsPointChange(index, 'title', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <input
                                    required
                                    accept="image/*"
                                    type="file"
                                    onChange={(e) => handleFileChange(e, index, 'why_us')}
                                    style={{ display: 'none' }}
                                    id={`why-us-image-${index}`}
                                />
                                <label htmlFor={`why-us-image-${index}`}>
                                    <Button variant="contained" component="span">
                                        Upload Image
                                    </Button>
                                </label>
                                {point.image && <Typography>{point.image.name}</Typography>}
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={() => removeWhyUsPoint(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={addWhyUsPoint}>
                        Add Why Us Point
                    </Button>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Placement Info
                    </Typography>
                    <TextField
                        required
                        fullWidth
                        label="Placement Info Text"
                        name="placement_info_text"
                        value={formData.placement_info_text}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    {formData.placement_info.map((info, index) => (
                        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                            <Grid item xs={5}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Text"
                                    value={info.text}
                                    onChange={(e) => handleInputChange(e, index, 'placement_info', 'text')}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <input
                                    required
                                    accept="image/*"
                                    type="file"
                                    onChange={(e) => handleFileChange(e, index, 'placement_info')}
                                    style={{ display: 'none' }}

                                    id={`placement-info-image-${index}`}
                                />
                                <label htmlFor={`placement-info-image-${index}`}>
                                    <Button variant="contained" component="span">
                                        Upload Image
                                    </Button>
                                </label>
                                {info.image && <Typography>{info.image.name}</Typography>}
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={() => removeField('placement_info', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => addField('placement_info')}>
                        Add Placement Info
                    </Button>
                </CardContent>
            </Card>
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Submit Course Details
            </Button>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={1000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AddCourseDetailsForm;