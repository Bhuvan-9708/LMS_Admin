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
        instructor_name: '',
        date: '',
        time: '',
        is_deleted: false,
    });
    const router = useRouter();
    const [events, setEvents] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchEventsAndCourses = async () => {
            try {
                const eventsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/event/get-all-events`);
                const coursesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/`);
                setEvents(eventsResponse.data.data);
                setCourses(coursesResponse.data.data);
            } catch (error) {
                console.error('Error fetching events and courses:', error);
            }
        };

        fetchEventsAndCourses();
    }, []);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page-hero-section/create`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Landing page hero section submitted successfully:', response.data);
            router.push('/cms/landing-hero-section')
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
                instructor_name: '',
                date: '',
                time: '',
                is_deleted: false,
            });
        } catch (error) {
            console.error('Error submitting landing page hero section:', error);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" required>
                                <InputLabel id="type-label">Type</InputLabel>
                                <Select
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
                                        label="Batch Start Date Text"
                                        variant="outlined"
                                        fullWidth
                                        value={formData.batch_start_date_text}
                                        onChange={(e) => handleChange('batch_start_date_text', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
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
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'logo_image')}
                                required
                            />
                            <Typography variant="body2">Upload Logo Image</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'image')}
                                required
                            />
                            <Typography variant="body2">Upload Main Image</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Title"
                                variant="outlined"
                                fullWidth
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Application Deadline Text"
                                variant="outlined"
                                fullWidth
                                value={formData.application_deadline_text}
                                onChange={(e) => handleChange('application_deadline_text', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
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
                                label="Reservation Text"
                                variant="outlined"
                                fullWidth
                                value={formData.reservation_text}
                                onChange={(e) => handleChange('reservation_text', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Instructor Intro Text"
                                variant="outlined"
                                fullWidth
                                value={formData.instructor_intro_text}
                                onChange={(e) => handleChange('instructor_intro_text', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Instructor Name"
                                variant="outlined"
                                fullWidth
                                value={formData.instructor_name}
                                onChange={(e) => handleChange('instructor_name', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
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
    );
};

export default LandingPageHeroSectionForm;
