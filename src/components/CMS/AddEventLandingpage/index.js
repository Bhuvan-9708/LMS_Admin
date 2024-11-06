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
    Box,
    Snackbar,
    Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
function EventLandingPageForm() {
    const [formData, setFormData] = useState({
        title: '',
        hero_section: '',
        event_id: '',
        for_whom_title: '',
        for_whom_text: '',
        for_whom: [],
        instructor_details: {
            instructor_title_text: '',
            image: null,
            description: ''
        },
        skills_learn: {
            title: '',
            tags: []
        },
        syllabus: '',
        feedbacks: '',
        is_active: true,
    });
    const router = useRouter();
    const [syllabus, setSyllabus] = useState([])
    const [events, setEvents] = useState([]);
    const [heroSections, setHeroSections] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event/get-all-events`);
                const events = await eventsResponse.json();
                setEvents(events.data);

                const heroSectionsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page-hero-section/?type=event`);
                const heroSections = await heroSectionsResponse.json();
                setHeroSections(heroSections.data);

                const feedbacksResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/`);
                const feedbacks = await feedbacksResponse.json();
                setFeedbacks(feedbacks.data);

                const syllabusResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/syllabus/`);
                const syllabus = await syllabusResponse.json();
                setSyllabus(syllabus.data);
            } catch (error) {
                console.error('Error fetching data:', error);
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

    const handleInstructorDetailsChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            instructor_details: {
                ...prevData.instructor_details,
                [name]: value
            }
        }));
    };

    const handleInstructorImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prevData => ({
            ...prevData,
            instructor_details: {
                ...prevData.instructor_details,
                image: file
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

    const handleForWhomChange = (e, index) => {
        const newForWhom = [...formData.for_whom];
        newForWhom[index] = { tags: e.target.value };
        setFormData(prevData => ({
            ...prevData,
            for_whom: newForWhom
        }));
    };

    const addForWhom = () => {
        setFormData(prevData => ({
            ...prevData,
            for_whom: [...prevData.for_whom, { tags: '' }]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Append all text fields
        Object.keys(formData).forEach(key => {
            if (key !== 'instructor_details' && key !== 'skills_learn' && key !== 'for_whom') {
                formDataToSend.append(key, formData[key]);
            }
        });

        // Append nested objects
        formDataToSend.append('instructor_details[instructor_title_text]', formData.instructor_details.instructor_title_text);
        formDataToSend.append('instructor_details[description]', formData.instructor_details.description);
        if (formData.instructor_details.image) {
            formDataToSend.append('instructor_details[image]', formData.instructor_details.image);
        }

        formDataToSend.append('skills_learn[title]', formData.skills_learn.title);
        formData.skills_learn.tags.forEach((tag, index) => {
            formDataToSend.append(`skills_learn[tags][${index}]`, tag);
        });

        formData.for_whom.forEach((item, index) => {
            formDataToSend.append(`for_whom[${index}][tags]`, item.tags);
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/webinar/v1/create`, {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Failed to create event landing page');
            }

            const result = await response.json();
            console.log('Event landing page created:', result);
            setSnackbar({
                open: true,
                message: 'Event landing page created successfully!',
                severity: 'success',
            });
            router.push('/cms/event-landing');
        } catch (error) {
            console.error('Error creating event landing page:', error);
            setSnackbar({
                open: true,
                message: 'Error creating event landing page. Please try again.',
                severity: 'error',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h4" gutterBottom>Create Event Landing Page</Typography>

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
                    required
                    name="hero_section"
                    value={formData.hero_section}
                    onChange={handleInputChange}
                >
                    {heroSections?.map(section => (
                        <MenuItem key={section._id} value={section._id}>{section.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
                <InputLabel>Syllabus</InputLabel>
                <Select
                    required
                    name="syllabus"
                    value={formData.syllabus}
                    onChange={handleInputChange}
                >
                    {syllabus?.map(syllabuses => (
                        <MenuItem key={syllabuses._id} value={syllabuses._id}>{syllabuses.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
                <InputLabel>Event</InputLabel>
                <Select
                    required
                    name="event_id"
                    value={formData.event_id}
                    onChange={handleInputChange}
                >
                    {events?.map(event => (
                        <MenuItem key={event._id} value={event._id}>{event.title}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                required
                fullWidth
                label="For Whom Title"
                name="for_whom_title"
                value={formData.for_whom_title}
                onChange={handleInputChange}
                margin="normal"
            />

            <TextField
                required
                fullWidth
                label="For Whom Text"
                name="for_whom_text"
                value={formData.for_whom_text}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
            />

            <Typography variant="h6" gutterBottom>For Whom Tags</Typography>
            {formData.for_whom.map((item, index) => (
                <TextField
                    required
                    key={index}
                    fullWidth
                    label={`Tag ${index + 1}`}
                    value={item.tags}
                    onChange={(e) => handleForWhomChange(e, index)}
                    margin="normal"
                />
            ))}
            <Button type="button" onClick={addForWhom} variant="outlined" color="primary">
                Add For Whom Tag
            </Button>

            <Typography variant="h6" gutterBottom>Instructor Details</Typography>
            <TextField
                required
                fullWidth
                label="Instructor Title Text"
                name="instructor_title_text"
                value={formData.instructor_details.instructor_title_text}
                onChange={handleInstructorDetailsChange}
                margin="normal"
            />

            <input
                required
                accept="image/*"
                style={{ display: 'none' }}
                id="instructor-image-upload"
                type="file"
                onChange={handleInstructorImageChange}
            />
            <label htmlFor="instructor-image-upload">
                <Button variant="contained" component="span">
                    Upload Instructor Image
                </Button>
            </label>
            {formData.instructor_details.image && (
                <Typography variant="body2">{formData.instructor_details.image.name}</Typography>
            )}

            <TextField
                required
                fullWidth
                label="Instructor Description"
                name="description"
                value={formData.instructor_details.description}
                onChange={handleInstructorDetailsChange}
                margin="normal"
                multiline
                rows={4}
            />

            <Typography variant="h6" gutterBottom>Skills Learn</Typography>
            <TextField
                required
                fullWidth
                label="Skills Learn Title"
                name="title"
                value={formData.skills_learn.title}
                onChange={handleSkillsLearnChange}
                margin="normal"
            />

            {formData.skills_learn.tags.map((tag, index) => (
                <TextField
                    required
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

            <FormControl fullWidth margin="normal">
                <InputLabel>Feedbacks</InputLabel>
                <Select
                    required
                    name="feedbacks"
                    value={formData.feedbacks}
                    onChange={handleInputChange}
                >
                    {feedbacks?.map(feedback => (
                        <MenuItem key={feedback._id} value={feedback._id}>{feedback.title}</MenuItem>
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
                    Create Event Landing Page
                </Button>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={1000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </form>
    );
}

export default EventLandingPageForm;