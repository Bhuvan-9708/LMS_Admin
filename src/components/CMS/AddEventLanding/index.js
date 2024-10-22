'use client'

import React, { useState, useEffect, useCallback } from 'react';
import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
    Box,
    IconButton,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Input,
    Grid,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useRouter } from 'next/navigation';
import qs from 'qs';

export default function AddEventLandingPage() {
    const [eventLandingPage, setEventLandingPage] = useState({
        event_id: '',
        event_logo: null,
        tag_line: '',
        title: '',
        image: null,
        reservation_text: '',
        instructor_name: '',
        event_date: null,
        event_time: '',
        pro: { title: '', description: '', points: [] },
        syllabus: { title: '', description: '', detailed_description: [] },
        for_whom_title: '',
        for_whom_text: '',
        for_whom: [{ tags: '' }],
        download_syllabus_link: '',
        instructor_details: {
            instructor_title_text: '',
            image: null,
            description: '',
        },
        skills_learn: [{ title: '', tags: '' }],
        tools: [{ title: '', image: [{ image_icon: null }] }],
        certification_title: '',
        certification_heading: '',
        certification_details: [{ title: '', description: '' }],
        certificate_image: null,
        feedbacks: { title: '', description: '', join_now_text: '', join_now_url: '', feedbacks: [] },
        faq: {
            title: '',
            description: '',
            content: [{ question: '', answer: '' }]
        },
        is_active: true,
        meta_title: '',
        meta_description: '',
        meta_keywords: [],
        seo_url: '',
    });

    const [events, setEvents] = useState([]);
    const router = useRouter();
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event/get-all-events`);
            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();
            setEvents(data.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventLandingPage((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNestedChange = (field, key, value) => {
        setEventLandingPage((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                [key]: value,
            },
        }));
    };

    const handleArrayInputChange = (field, index, subField, value) => {
        const fieldPath = field.split('.'); // Split the field string to handle nested fields
        setEventLandingPage((prev) => {
            let updatedField = { ...prev };

            // Traverse through the field path to get the correct reference
            const targetArray = fieldPath.reduce((acc, currentField) => acc[currentField], updatedField);

            // Update the specific item at the index
            targetArray[index][subField] = value;

            return {
                ...prev,
                [fieldPath[0]]: updatedField[fieldPath[0]],
            };
        });
    };

    const handleAddArrayItem = (field, newItem) => {
        const fieldPath = field.split('.'); // Split the field string to handle nested fields
        setEventLandingPage((prev) => {
            let updatedField = { ...prev };

            // Traverse through the field path to get the correct reference
            const targetArray = fieldPath.reduce((acc, currentField) => acc[currentField], updatedField);

            // Append the new item to the array (Make sure it adds only once)
            targetArray.push(newItem);

            return {
                ...prev,
                [fieldPath[0]]: updatedField[fieldPath[0]],
            };
        });
    };

    const handleRemoveArrayItem = (field, index) => {
        const fieldPath = field.split('.'); // Split the field string to handle nested fields
        setEventLandingPage((prev) => {
            let updatedField = { ...prev };

            // Traverse through the field path to get the correct reference
            const targetArray = fieldPath.reduce((acc, currentField) => acc[currentField], updatedField);

            // Remove the item from the array at the specified index
            targetArray.splice(index, 1);

            return {
                ...prev,
                [fieldPath[0]]: updatedField[fieldPath[0]], // Ensure immutability of the state
            };
        });
    };

    const handleToolImageChange = (toolIndex, imageIndex, file) => {
        const updatedTools = [...eventLandingPage.tools];
        updatedTools[toolIndex].image[imageIndex].image_icon = file;
        setEventLandingPage({ ...eventLandingPage, tools: updatedTools });
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setEventLandingPage(prev => ({
                ...prev,
                [fieldName]: file
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        // Append all simple fields
        Object.keys(eventLandingPage).forEach(key => {
            if (typeof eventLandingPage[key] !== 'object' && eventLandingPage[key] !== null) {
                formData.append(key, eventLandingPage[key]);
            }
        });

        // Handle file uploads
        if (eventLandingPage.event_logo instanceof File) {
            formData.append('event_logo', eventLandingPage.event_logo);
        }
        if (eventLandingPage.image instanceof File) {
            formData.append('image', eventLandingPage.image);
        }
        if (eventLandingPage.instructor_details?.image instanceof File) {
            formData.append('instructor_details[image]', eventLandingPage.instructor_details.image);
        }
        if (eventLandingPage.certificate_image instanceof File) {
            formData.append('certificate_image', eventLandingPage.certificate_image);
        }
        if (typeof eventLandingPage.pro === 'object') {
            formData.append('pro', eventLandingPage.pro);
        }

        if (typeof eventLandingPage.syllabus === 'object') {
            formData.append('syllabus', eventLandingPage.syllabus);
        }
        // Handle nested objects and arrays
        formData.append('pro', JSON.stringify(eventLandingPage.pro));
        formData.append('syllabus', JSON.stringify(eventLandingPage.syllabus));
        formData.append('skills_learn', JSON.stringify(eventLandingPage.skills_learn));
        formData.append('certification_details', JSON.stringify(eventLandingPage.certification_details));
        formData.append('feedbacks', JSON.stringify(eventLandingPage.feedbacks));
        formData.append('faq', JSON.stringify(eventLandingPage.faq));
        formData.append('for_whom', JSON.stringify(eventLandingPage.for_whom));  // Assuming for_whom is array or object
        formData.append('instructor_details', JSON.stringify(eventLandingPage.instructor_details));
        formData.append('meta_keywords', JSON.stringify(eventLandingPage.meta_keywords));
        // Handle tools separately
        eventLandingPage.tools.forEach((tool, toolIndex) => {
            formData.append(`tools[${toolIndex}][title]`, tool.title);
            tool.image.forEach((img, imgIndex) => {
                if (img.image_icon instanceof File) {
                    formData.append(`tools[${toolIndex}][image][${imgIndex}]`, img.image_icon, img.image_icon.name);
                }
            });
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/webinar/create`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit');
            }

            const jsonResponse = await response.json();
            console.log('Parsed JSON response:', jsonResponse);

            alert('Event Landing Page created successfully!');
            router.push('/event-landing-pages');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Add Event Landing Page</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Event selection */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Event</InputLabel>
                                    <Select
                                        name="event_id"
                                        value={eventLandingPage.event_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        {events.map((event) => (
                                            <MenuItem key={event._id} value={event._id}>{event.title}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Event logo upload */}
                            <Grid item xs={12}>
                                <Input
                                    type="file"
                                    onChange={(e) => setEventLandingPage({ ...eventLandingPage, event_logo: e.target.files[0] })}
                                />
                                <label>Event Logo</label>
                            </Grid>

                            {/* Basic information */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tag Line"
                                    name="tag_line"
                                    value={eventLandingPage.tag_line}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    name="title"
                                    value={eventLandingPage.title}
                                    onChange={(e) => setEventLandingPage(prev => ({ ...prev, title: e.target.value }))}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    type="file"
                                    onChange={(e) => setEventLandingPage({ ...eventLandingPage, image: e.target.files[0] })}
                                    required
                                />
                                <label>Event Image</label>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Reservation Text"
                                    name="reservation_text"
                                    value={eventLandingPage.reservation_text}
                                    onChange={(e) => setEventLandingPage(prev => ({ ...prev, reservation_text: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Instructor Name"
                                    name="instructor_name"
                                    value={eventLandingPage.instructor_name}
                                    onChange={(e) => setEventLandingPage(prev => ({ ...prev, instructor_name: e.target.value }))}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Event Date"
                                    value={eventLandingPage.event_date}
                                    onChange={(newValue) => setEventLandingPage((prev) => ({ ...prev, event_date: newValue }))}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Event Time"
                                    name="event_time"
                                    value={eventLandingPage.event_time}
                                    onChange={(e) => setEventLandingPage(prev => ({ ...prev, event_time: e.target.value }))}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6">Pro Section</Typography>
                                <TextField
                                    fullWidth
                                    label="Pro Title"
                                    value={eventLandingPage.pro.title}
                                    onChange={(e) => handleNestedChange('pro', 'title', e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Pro Description"
                                    value={eventLandingPage.pro.description}
                                    onChange={(e) => handleNestedChange('pro', 'description', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={3}
                                />
                                {eventLandingPage.pro.points.map((point, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                        <TextField
                                            fullWidth
                                            label="Point Title"
                                            value={point.title}
                                            onChange={(e) => handleArrayInputChange('pro.points', index, 'title', e.target.value)}
                                            margin="normal"
                                        />
                                        <TextField
                                            fullWidth
                                            label="Point Description"
                                            value={point.description}
                                            onChange={(e) => handleArrayInputChange('pro.points', index, 'description', e.target.value)}
                                            margin="normal"
                                        />
                                        <Button onClick={() => handleRemoveArrayItem('pro.points', index)}>Remove Point</Button>
                                    </Box>
                                ))}
                                <Button onClick={() => handleAddArrayItem('pro.points', { title: '', description: '' })}>
                                    Add Pro Point
                                </Button>
                            </Grid>

                            {/* Syllabus Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6">Syllabus</Typography>
                                <TextField
                                    fullWidth
                                    label="Syllabus Title"
                                    value={eventLandingPage.syllabus.title}
                                    onChange={(e) => handleNestedChange('syllabus', 'title',

                                        e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Syllabus Description"
                                    value={eventLandingPage.syllabus.description}
                                    onChange={(e) => handleNestedChange('syllabus', 'description', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={3}
                                />
                                {eventLandingPage.syllabus.detailed_description.map((desc, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                        <TextField
                                            fullWidth
                                            label="Description Title"
                                            value={desc.title}
                                            onChange={(e) => handleArrayInputChange('syllabus.detailed_description', index, 'title', e.target.value)}
                                            margin="normal"
                                        />
                                        {desc.heading.map((heading, headingIndex) => (
                                            <Box key={headingIndex} sx={{ ml: 2, mb: 1 }}>
                                                <TextField
                                                    label="Heading Title"
                                                    value={heading.title}
                                                    onChange={(e) => {
                                                        const newHeadings = [...desc.heading];
                                                        newHeadings[headingIndex] = { ...newHeadings[headingIndex], title: e.target.value };
                                                        handleArrayInputChange('syllabus.detailed_description', index, 'heading', newHeadings);
                                                    }}
                                                    margin="dense"
                                                />
                                                <TextField
                                                    label="Lesson Number"
                                                    type="number"
                                                    value={heading.lesson_no}
                                                    onChange={(e) => {
                                                        const newHeadings = [...desc.heading];
                                                        newHeadings[headingIndex] = { ...newHeadings[headingIndex], lesson_no: parseInt(e.target.value) };
                                                        handleArrayInputChange('syllabus.detailed_description', index, 'heading', newHeadings);
                                                    }}
                                                    margin="dense"
                                                />
                                                <TextField
                                                    label="Time"
                                                    value={heading.time}
                                                    onChange={(e) => {
                                                        const newHeadings = [...desc.heading];
                                                        newHeadings[headingIndex] = { ...newHeadings[headingIndex], time: e.target.value };
                                                        handleArrayInputChange('syllabus.detailed_description', index, 'heading', newHeadings);
                                                    }}
                                                    margin="dense"
                                                />
                                                <IconButton onClick={() => {
                                                    const newHeadings = desc.heading.filter((_, i) => i !== headingIndex);
                                                    handleArrayInputChange('syllabus.detailed_description', index, 'heading', newHeadings);
                                                }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        ))}
                                        <Button onClick={() => {
                                            const newHeadings = [...desc.heading, { title: '', lesson_no: 0, time: '' }];
                                            handleArrayInputChange('syllabus.detailed_description', index, 'heading', newHeadings);
                                        }}>
                                            Add Heading
                                        </Button>
                                        <Button onClick={() => handleRemoveArrayItem('syllabus.detailed_description', index)}>Remove Description</Button>
                                    </Box>
                                ))}
                                <Button onClick={() => handleAddArrayItem('syllabus.detailed_description', { title: '', heading: [] })}>
                                    Add Detailed Description
                                </Button>
                            </Grid>

                            {/* For Whom Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6">For Whom</Typography>
                                <TextField
                                    fullWidth
                                    label="For Whom Title"
                                    name="for_whom_title"
                                    value={eventLandingPage.for_whom_title}
                                    onChange={handleChange}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="For Whom Text"
                                    name="for_whom_text"
                                    value={eventLandingPage.for_whom_text}
                                    onChange={handleChange}
                                    margin="normal"
                                    multiline
                                    rows={3}
                                />
                                {eventLandingPage.for_whom.map((item, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                        <TextField
                                            fullWidth
                                            label="Tags"
                                            value={item.tags}
                                            onChange={(e) => handleArrayInputChange('for_whom', index, 'tags', e.target.value)}
                                            margin="normal"
                                        />
                                        <Button onClick={() => handleRemoveArrayItem('for_whom', index)}>Remove Tag</Button>
                                    </Box>
                                ))}
                                <Button onClick={() => handleAddArrayItem('for_whom', { tags: '' })}>
                                    Add For Whom Tag
                                </Button>
                            </Grid>

                            {/* Download Syllabus Link */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Download Syllabus Link"
                                    name="download_syllabus_link"
                                    value={eventLandingPage.download_syllabus_link}
                                    onChange={handleChange}
                                />
                            </Grid>

                            {/* Instructor Details */}
                            <Grid item xs={12}>
                                <Typography variant="h6">Instructor Details</Typography>
                                <Input
                                    type="file"
                                    onChange={(e) => setEventLandingPage(prev => ({
                                        ...prev,
                                        instructor_details: { ...prev.instructor_details, image: e.target.files[0] }
                                    }))}
                                />
                                <label>Instructor Image</label>
                                <TextField
                                    fullWidth
                                    label="Instructor Title"
                                    value={eventLandingPage.instructor_details.instructor_title_text}
                                    onChange={(e) => handleNestedChange('instructor_details', 'instructor_title_text', e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Instructor Description"
                                    value={eventLandingPage.instructor_details.description}
                                    onChange={(e) => handleNestedChange('instructor_details', 'description', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={3}
                                />
                            </Grid>

                            {/* Skills Learn */}
                            <Grid item xs={12}>
                                <Typography variant="h6">Skills to Learn</Typography>
                                {eventLandingPage.skills_learn.map((skill, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                        <TextField
                                            fullWidth
                                            label="Skill Title"
                                            value={skill.title}
                                            onChange={(e) => handleArrayInputChange('skills_learn', index, 'title', e.target.value)}
                                            margin="normal"
                                        />
                                        <TextField
                                            fullWidth
                                            label="Skill Tag"
                                            value={skill.tags}
                                            onChange={(e) => handleArrayInputChange('skills_learn', index, 'tags', e.target.value)}
                                            margin="normal"
                                        />
                                        <Button onClick={() => handleRemoveArrayItem('skills_learn', index)}>Remove Skill</Button>
                                    </Box>
                                ))}
                                <Button onClick={() => handleAddArrayItem('skills_learn', { title: '', tags: '' })}>
                                    Add Skill
                                </Button>
                            </Grid>

                            {/* Tools */}
                            <Grid item xs={12}>
                                <Typography variant="h6">Tools</Typography>
                                {eventLandingPage.tools.map((tool, toolIndex) => (
                                    <Box key={toolIndex} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                        <TextField
                                            fullWidth
                                            label="Tool Title"
                                            value={tool.title}
                                            onChange={(e) => {
                                                const updatedTools = [...eventLandingPage.tools];
                                                updatedTools[toolIndex].title = e.target.value;
                                                setEventLandingPage({ ...eventLandingPage, tools: updatedTools });
                                            }}
                                            margin="normal"
                                        />
                                        {tool.image.map((img, imgIndex) => (
                                            <Box key={imgIndex}>
                                                <Input
                                                    type="file"
                                                    onChange={(e) => handleToolImageChange(toolIndex, imgIndex, e.target.files[0])}
                                                />
                                                {img.image_icon && <Typography variant="caption">{img.image_icon.name}</Typography>}
                                                <Button onClick={() => {
                                                    const updatedTools = [...eventLandingPage.tools];
                                                    updatedTools[toolIndex].image.splice(imgIndex, 1);
                                                    setEventLandingPage({ ...eventLandingPage, tools: updatedTools });
                                                }}>
                                                    Remove Image
                                                </Button>
                                            </Box>
                                        ))}
                                        <Button onClick={() => {
                                            const updatedTools = [...eventLandingPage.tools];
                                            updatedTools[toolIndex].image.push({ image_icon: null });
                                            setEventLandingPage({ ...eventLandingPage, tools: updatedTools });
                                        }}>
                                            Add Image
                                        </Button>
                                        <Button onClick={() => {
                                            const updatedTools = eventLandingPage.tools.filter((_, index) => index !== toolIndex);
                                            setEventLandingPage({ ...eventLandingPage, tools: updatedTools });
                                        }}>
                                            Remove Tool
                                        </Button>
                                    </Box>
                                ))}
                                <Button onClick={() => {
                                    setEventLandingPage({
                                        ...eventLandingPage,
                                        tools: [...eventLandingPage.tools, { title: '', image: [{ image_icon: null }] }]
                                    });
                                }}>
                                    Add Tool
                                </Button>
                            </Grid>


                            {/* Certification */}
                            <Grid item xs={12}>
                                <Typography variant="h6">Certification</Typography>
                                <TextField
                                    fullWidth
                                    label="Certification Title"
                                    name="certification_title"
                                    value={eventLandingPage.certification_title}
                                    onChange={handleChange}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Certification Heading"
                                    name="certification_heading"
                                    value={eventLandingPage.certification_heading}
                                    onChange={handleChange}
                                    margin="normal"
                                />
                                {eventLandingPage.certification_details.map((detail, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                        <TextField
                                            fullWidth
                                            label="Detail Title"
                                            value={detail.title}
                                            onChange={(e) => handleArrayInputChange('certification_details', index, 'title', e.target.value)}
                                            margin="normal"
                                        />
                                        <TextField
                                            fullWidth
                                            label="Detail Description"
                                            value={detail.description}
                                            onChange={(e) => handleArrayInputChange('certification_details', index, 'description', e.target.value)}
                                            margin="normal"
                                            multiline
                                            rows={2}
                                        />
                                        <Button onClick={() => handleRemoveArrayItem('certification_details', index)}>Remove Detail</Button>
                                    </Box>
                                ))}
                                <Button onClick={() => handleAddArrayItem('certification_details', { title: '', description: '' })}>
                                    Add Certification Detail
                                </Button>
                                <Input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, 'certificate_image')}
                                />
                                <label>Certificate Image</label>
                            </Grid>

                            {/* Feedbacks Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6">Feedbacks</Typography>
                                <TextField
                                    fullWidth
                                    label="Feedbacks Title"
                                    value={eventLandingPage.feedbacks.title}
                                    onChange={(e) => handleNestedChange('feedbacks', 'title', e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Feedbacks Description"
                                    value={eventLandingPage.feedbacks.description}
                                    onChange={(e) => handleNestedChange('feedbacks', 'description', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={3}
                                />
                                <TextField
                                    fullWidth
                                    label="Join Now Text"
                                    value={eventLandingPage.feedbacks.join_now_text}
                                    onChange={(e) => handleNestedChange('feedbacks', 'join_now_text', e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Join Now URL"
                                    value={eventLandingPage.feedbacks.join_now_url}
                                    onChange={(e) => handleNestedChange('feedbacks', 'join_now_url', e.target.value)}
                                    margin="normal"
                                />
                                {eventLandingPage.feedbacks.feedbacks.map((feedback, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            value={feedback.name}
                                            onChange={(e) => handleArrayInputChange('feedbacks.feedbacks', index, 'name', e.target.value)}
                                            margin="normal"
                                        />
                                        <TextField
                                            fullWidth
                                            label="Feedback"
                                            value={feedback.feedback}
                                            onChange={(e) => handleArrayInputChange('feedbacks.feedbacks', index, 'feedback', e.target.value)}
                                            margin="normal"
                                            multiline
                                            rows={2}
                                        />
                                        <DatePicker
                                            label="Feedback Date"
                                            value={feedback.date}
                                            onChange={(newValue) => handleArrayInputChange('feedbacks.feedbacks', index, 'date', newValue)}
                                        />
                                        <Button onClick={() => handleRemoveArrayItem('feedbacks.feedbacks', index)}>Remove Feedback</Button>
                                    </Box>
                                ))}
                                <Button onClick={() => handleAddArrayItem('feedbacks.feedbacks', { name: '', feedback: '', date: null })}>
                                    Add Feedback
                                </Button>
                            </Grid>

                            {/* FAQ Section */}
                            <Grid item xs={12}>
                                <Typography variant="h6">FAQ</Typography>
                                <TextField
                                    fullWidth
                                    label="FAQ Title"
                                    value={eventLandingPage.faq.title}
                                    onChange={(e) => handleNestedChange('faq', 'title', e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="FAQ Description"
                                    value={eventLandingPage.faq.description}
                                    onChange={(e) => handleNestedChange('faq', 'description', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={3}
                                />
                                {eventLandingPage.faq.content.map((item, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                        <TextField
                                            fullWidth
                                            label="Question"
                                            value={item.question}
                                            onChange={(e) => handleArrayInputChange('faq.content', index, 'question', e.target.value)}
                                            margin="normal"
                                        />
                                        <TextField
                                            fullWidth
                                            label="Answer"
                                            value={item.answer}
                                            onChange={(e) => handleArrayInputChange('faq.content', index, 'answer', e.target.value)}
                                            margin="normal"
                                            multiline
                                            rows={2}
                                        />
                                        <Button onClick={() => handleRemoveArrayItem('faq.content', index)}>Remove FAQ Item</Button>
                                    </Box>
                                ))}
                                <Button onClick={() => handleAddArrayItem('faq.content', { question: '', answer: '' })}>
                                    Add FAQ Item
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={eventLandingPage.is_active}
                                            onChange={(e) => setEventLandingPage(prev => ({ ...prev, is_active: e.target.checked }))}
                                            name="is_active"
                                        />
                                    }
                                    label="Is Active"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Meta Title"
                                    name="meta_title"
                                    value={eventLandingPage.meta_title}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Meta Description"
                                    name="meta_description"
                                    value={eventLandingPage.meta_description}
                                    onChange={handleChange}
                                    required
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">Meta Keywords</Typography>
                                {eventLandingPage.meta_keywords.map((keyword, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <TextField
                                            fullWidth
                                            label={`Keyword ${index + 1}`}
                                            value={keyword}
                                            onChange={(e) => {
                                                const newKeywords = [...eventLandingPage.meta_keywords];
                                                newKeywords[index] = e.target.value;
                                                setEventLandingPage(prev => ({ ...prev, meta_keywords: newKeywords }));
                                            }}
                                            margin="dense"
                                        />
                                        <IconButton onClick={() => handleRemoveArrayItem('meta_keywords', index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                                <Button onClick={() => handleAddArrayItem('meta_keywords', '')}>
                                    Add Keyword
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="SEO URL"
                                    name="seo_url"
                                    value={eventLandingPage.seo_url}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3 }}>
                            <Button type="submit" variant="contained" color="primary">
                                Create Event Landing Page
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </LocalizationProvider>
    );
}