"use client";
import React, { useEffect, useState } from 'react';
import {
    TextField,
    Card,
    CardContent,
    Box,
    Button,
    Typography,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Snackbar,
    Alert,
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const LandingPageHeroSectionForm = () => {
    const [formData, setFormData] = useState({
        type: '',
        event_id: '',
        course_id: '',
        logo_image: null,
        title: '',
        image: null,
        application_deadline_text: '',
        application_deadline_date: '',
        reservation_text: '',
        batch_start_date_text: '',
        batch_start_date: '',
        instructor_intro_text: '',
        instructor_name: [],
        date: '',
        time: '',
        is_deleted: false,
        tag_line: ''
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [instructors, setInstructors] = useState([]);

    const router = useRouter();
    const [events, setEvents] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchEventsAndCourses = async () => {
            try {
                const eventsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/event/get-all-events`);
                const coursesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/`);
                const instructorResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/instructor/`);
                setEvents(eventsResponse.data.data);
                setCourses(coursesResponse.data.data);
                setInstructors(instructorResponse.data.data);
            } catch (error) {
                console.error('Error fetching events and courses:', error);
            }
        };

        fetchEventsAndCourses();
    }, []);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'instructor_name') {
            const selectedNames = instructors
                .filter((instructor) => value.includes(instructor._id))
                .map((instructor) => `${instructor.first_name} ${instructor.last_name}`);

            setFormData((prev) => ({
                ...prev,
                [name]: selectedNames,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleImageChange = (e, field) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, [field]: file }));
    };

    const handleTypeChange = async (e) => {
        const selectedType = e.target.value;
        handleChange('type', selectedType);

        if (selectedType === 'course') {
            handleChange('event_id', undefined);
            const courseId = formData.course_id;

            if (courseId) {
                try {
                    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/id/${courseId}`);
                    const { batch_start_date, batch_start_date_text } = response.data;

                    handleChange('batch_start_date', batch_start_date || '');
                    handleChange('batch_start_date_text', batch_start_date_text || '');
                } catch (error) {
                    console.error('Error fetching batch details:', error);
                }
            }
        } else if (selectedType === 'event') {
            handleChange('course_id', undefined);
            handleChange('batch_start_date', '');
            handleChange('batch_start_date_text', '');
        }
    };

    const handleCourseChange = async (e) => {
        const courseId = e.target.value;
        handleChange('course_id', courseId);

        if (formData.type === 'course' && courseId) {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/id/${courseId}`);
                const { batch_start_date, batch_start_date_text } = response.data;

                handleChange('batch_start_date', batch_start_date || '');
                handleChange('batch_start_date_text', batch_start_date_text || '');
            } catch (error) {
                console.error('Error fetching batch details:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if either Event or Course is selected
        if (!formData.event_id && !formData.course_id) {
            alert('Please select either an Event or a Course.');
            return;
        }

        const submitData = new FormData();
        for (const key in formData) {
            const value = formData[key];
            if (value !== undefined && value !== null) {
                if (value instanceof File) {
                    submitData.append(key, value);
                } else {
                    submitData.append(key, value);
                }
            }
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/landing-page-hero-section/create`,
                submitData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('Landing page hero section submitted successfully:', response.data);
            setSnackbarMessage('Landing page hero section submitted successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            router.push('/cms/landing-hero-section');
            setFormData({
                type: '',
                event_id: '',
                course_id: '',
                logo_image: null,
                title: '',
                image: null,
                application_deadline_text: '',
                application_deadline_date: '',
                reservation_text: '',
                batch_start_date_text: '',
                batch_start_date: '',
                instructor_intro_text: '',
                instructor_name: [],
                date: '',
                time: '',
                tag_line: '',
                is_deleted: false,
            });
        } catch (error) {
            console.error('Error submitting landing page hero section:', error);

            const errorMessage = error.response?.data?.message || 'Error submitting landing page hero section.';
            // alert(errorMessage);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined" required>
                                    <InputLabel id="type-label">Type</InputLabel>
                                    <Select
                                        required
                                        labelId="type-label"
                                        value={formData.type}
                                        onChange={handleTypeChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="course">Course</MenuItem>
                                        <MenuItem value="event">Event</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {formData.type === 'event' && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" required>
                                        <InputLabel id="event-label">Event</InputLabel>
                                        <Select
                                            required
                                            labelId="event-label"
                                            value={formData.event_id}
                                            onChange={(e) => handleChange('event_id', e.target.value)}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {events.map((event) => (
                                                <MenuItem key={event._id} value={event._id}>
                                                    {event.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            {formData.type === 'course' && (
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" required>
                                        <InputLabel id="course-label">Course</InputLabel>
                                        <Select
                                            required
                                            labelId="course-label"
                                            value={formData.course_id}
                                            onChange={handleCourseChange}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {courses.map((course) => (
                                                <MenuItem key={course._id} value={course._id}>
                                                    {course.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}

                            {formData.type === 'course' && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            label="Batch Start Date Text"
                                            variant="outlined"
                                            fullWidth
                                            value={formData.batch_start_date_text}
                                            onChange={(e) => handleChange('batch_start_date_text', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            label="Batch Start Date"
                                            type="date"
                                            variant="outlined"
                                            fullWidth
                                            value={formData.batch_start_date}
                                            onChange={(e) => handleChange('batch_start_date', e.target.value)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12}>
                                <input
                                    required
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, 'logo_image')}
                                />
                                <Typography variant="body2">Upload Logo Image</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <input
                                    required
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, 'image')}
                                />
                                <Typography variant="body2">Upload Main Image</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Title"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Tag Line"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.tag_line}
                                    onChange={(e) => handleChange('tag_line', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Application Deadline Text"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.application_deadline_text}
                                    onChange={(e) => handleChange('application_deadline_text', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Application Deadline Date"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.application_deadline_date}
                                    onChange={(e) => handleChange('application_deadline_date', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Reservation Text"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.reservation_text}
                                    onChange={(e) => handleChange('reservation_text', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Instructor Intro Text"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.instructor_intro_text}
                                    onChange={(e) => handleChange('instructor_intro_text', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="instructor-label">Instructors</InputLabel>
                                    <Select
                                        required
                                        labelId="instructor-label"
                                        multiple
                                        name="instructor_name"
                                        value={Array.isArray(formData.instructor_name) ? formData.instructor_name.map((name) =>
                                            instructors.find((i) => `${i.first_name} ${i.last_name}` === name)?._id) : []}
                                        onChange={handleInputChange}
                                    >
                                        {instructors.map((instructor) => (
                                            <MenuItem key={instructor._id} value={instructor._id}>
                                                {`${instructor.first_name} ${instructor.last_name}`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Date"
                                    type="date"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.date}
                                    onChange={(e) => handleChange('date', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Time"
                                    type="time"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.time}
                                    onChange={(e) => handleChange('time', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Box mt={2}>
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </form>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default LandingPageHeroSectionForm;
