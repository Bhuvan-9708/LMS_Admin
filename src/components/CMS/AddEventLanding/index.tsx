"use client"

import React, { useState, useEffect } from 'react';
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
import { SelectChangeEvent } from '@mui/material/Select';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useRouter } from 'next/navigation';

interface Instructor {
    _id: string;
    first_name: string;
    last_name: string;
}

interface Event {
    _id: string;
    title: string;
}

interface EventLandingPage {
    event_id: string;
    event_logo?: File | null;
    tag_line: string;
    title: string;
    image?: File | null;
    reservation_text: string;
    reservation_url: string;
    instructor_id: string;
    instructor_occupation: string;
    event_date: Date | null;
    event_time: Date | null;
    pro: {
        title: string;
        description: string;
        points: Array<{
            title: string;
            description: string;
            image_icon: File | string | null;
        }>;
    };
    syllabus: {
        title: string;
        description: string;
        detailed_description: Array<{
            title: string;
            heading: Array<{
                title: string;
                lesson_no: number;
                time: string;
            }>;
        }>;
    };
    for_whom: {
        title: string;
        description: string;
        content: Array<{
            logo: File | string | null;
            title: string;
            description: string;
        }>;
    };
    feedbacks: {
        title: string;
        description: string;
        join_now_text: string;
        join_now_url: string;
        feedbacks: Array<{
            name: string;
            feedback: string;
            date: Date | null;
        }>;
    };
    faq: {
        title: string;
        description: string;
        content: Array<{
            question: string;
            answer: string;
        }>;
    };
    is_active: boolean;
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
    seo_url: string;
}

export default function AddEventLandingPage() {
    const [eventLandingPage, setEventLandingPage] = useState<EventLandingPage>({
        event_id: '',
        event_logo: null,
        tag_line: '',
        title: '',
        image: null,
        reservation_text: '',
        reservation_url: '',
        instructor_id: '',
        instructor_occupation: '',
        event_date: null,
        event_time: null,
        pro: {
            title: '',
            description: '',
            points: [],
        },
        syllabus: {
            title: '',
            description: '',
            detailed_description: [],
        },
        for_whom: {
            title: '',
            description: '',
            content: [],
        },
        feedbacks: {
            title: '',
            description: '',
            join_now_text: '',
            join_now_url: '',
            feedbacks: [],
        },
        faq: {
            title: '',
            description: '',
            content: [],
        },
        is_active: true,
        meta_title: '',
        meta_description: '',
        meta_keywords: [],
        seo_url: '',
    });

    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const router = useRouter();
    const [eventLogo, setEventLogo] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchInstructors();
        fetchEvents();
    }, []);

    const fetchInstructors = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/instructor/`);
            if (!response.ok) throw new Error('Failed to fetch instructors');
            const data = await response.json();
            setInstructors(data.data);
        } catch (error) {
            console.error('Error fetching instructors:', error);
        }
    };

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

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = event.target as HTMLInputElement | HTMLTextAreaElement | { name: string; value: string };

        setEventLandingPage((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNestedChange = (
        section: keyof EventLandingPage,
        field: string,
        value: any
    ) => {
        setEventLandingPage((prev) => {
            const currentSection = prev[section];

            if (currentSection && typeof currentSection === 'object') {
                return {
                    ...prev,
                    [section]: {
                        ...currentSection,
                        [field]: value,
                    },
                };
            } else {
                console.error(`Invalid section: ${section}`);
                return prev;
            }
        });
    };

    const handleArrayInputChange = (path: string, index: number, field: string, value: any) => {
        setEventLandingPage((prev) => {
            const newState = { ...prev };
            const pathArray = path.split('.');
            let current: any = newState;
            for (let i = 0; i < pathArray.length - 1; i++) {
                current = current[pathArray[i]];
            }
            current[pathArray[pathArray.length - 1]][index][field] = value;
            return newState;
        });
    };

    const handleAddArrayItem = (path: string, newItem: any) => {
        setEventLandingPage((prev) => {
            const newState = { ...prev };
            const pathArray = path.split('.');
            let current: any = newState;
            for (let i = 0; i < pathArray.length - 1; i++) {
                current = current[pathArray[i]];
            }
            current[pathArray[pathArray.length - 1]].push(newItem);
            return newState;
        });
    };

    const handleRemoveArrayItem = (path: string, index: number) => {
        setEventLandingPage((prev) => {
            const newState = { ...prev };
            const pathArray = path.split('.');
            let current: any = newState;
            for (let i = 0; i < pathArray.length - 1; i++) {
                current = current[pathArray[i]];
            }
            current[pathArray[pathArray.length - 1]].splice(index, 1);
            return newState;
        });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof EventLandingPage) => {
        const file = event.target.files?.[0] || null;
        setEventLandingPage((prev) => ({ ...prev, [field]: file }));
    };

    const handleProPointFileUpload = (event: React.ChangeEvent<HTMLInputElement>, section: string, index: number, field: string) => {
        const file = event.target.files?.[0];
        if (file) {
            setEventLandingPage((prev) => {
                const updatedState = { ...prev };

                if (section === 'for_whom.content') {
                    updatedState.for_whom.content[index] = {
                        ...updatedState.for_whom.content[index],
                        [field]: file,
                    };
                } else if (section === 'pro.points') {
                    updatedState.pro.points[index] = {
                        ...updatedState.pro.points[index],
                        [field]: file, // Assign the file to the specified field (e.g., 'image_icon')
                    };
                }
                return updatedState;
            });
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();

        // Append JSON data (excluding images)
        const jsonData = {
            title: eventLandingPage.title,
            tag_line: eventLandingPage.tag_line,
            reservation_text: eventLandingPage.reservation_text,
            reservation_url: eventLandingPage.reservation_url,
            instructor_id: eventLandingPage.instructor_id,
            instructor_occupation: eventLandingPage.instructor_occupation,
            event_date: eventLandingPage.event_date,
            event_time: eventLandingPage.event_time,
            meta_title: eventLandingPage.meta_title,
            meta_description: eventLandingPage.meta_description,
            meta_keywords: eventLandingPage.meta_keywords,
            seo_url: eventLandingPage.seo_url,
            pro: eventLandingPage.pro,
            syllabus: eventLandingPage.syllabus,
        };

        // Append JSON data as a string
        formData.append('data', JSON.stringify(jsonData));

        // Append image files to formData
        if (eventLandingPage.event_logo instanceof File) {
            formData.append('event_logo', eventLandingPage.event_logo);
        }

        if (eventLandingPage.image instanceof File) {
            formData.append('image', eventLandingPage.image);
        }

        // Append pro section image files
        eventLandingPage.pro.points.forEach((point, index) => {
            if (point.image_icon instanceof File) {
                formData.append(`pro[points][${index}][image_icon]`, point.image_icon);
            }
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/webinar/create`, {
                method: 'POST',
                body: formData,  
            });

            if (!response.ok) {
                throw new Error('Failed to create event landing page');
            }

            const result = await response.json();
            console.log('Event landing page created:', result);
        } catch (error) {
            console.error('Error creating event landing page:', error);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Add Event Landing Page</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
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
                            <Grid item xs={12} sm={12}>
                                <Box sx={{ mb: 2 }}>
                                    <Input
                                        id="logo-upload"
                                        type="file"
                                        inputProps={{ accept: "image/*" }}
                                        style={{ display: 'none' }}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'event_logo')}
                                        fullWidth
                                    />
                                    <label htmlFor="logo-upload">
                                        <Button variant="contained" component="span">
                                            Upload Logo
                                        </Button>
                                    </label>
                                    {eventLandingPage.event_logo && (
                                        <Typography variant="body2">{eventLandingPage.event_logo.name}</Typography>
                                    )}
                                </Box>
                            </Grid>
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
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Box sx={{ mb: 2 }}>
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        inputProps={{ accept: "image/*" }}
                                        style={{ display: 'none' }}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'image')}
                                        fullWidth
                                    />
                                    <label htmlFor="image-upload">
                                        <Button variant="contained" component="span">
                                            Upload Image
                                        </Button>
                                    </label>
                                    {eventLandingPage.image && (
                                        <Typography variant="body2">{eventLandingPage.image instanceof File ? eventLandingPage.image.name : ''}</Typography>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Reservation Text"
                                    name="reservation_text"
                                    value={eventLandingPage.reservation_text}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Reservation URL"
                                    name="reservation_url"
                                    value={eventLandingPage.reservation_url}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Instructor</InputLabel>
                                    <Select
                                        name="instructor_id"
                                        value={eventLandingPage.instructor_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        {instructors.map((instructor) => (
                                            <MenuItem key={instructor._id} value={instructor._id}>{instructor.first_name}{instructor.last_name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Instructor Occupation"
                                    name="instructor_occupation"
                                    value={eventLandingPage.instructor_occupation}
                                    onChange={handleChange}
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
                                <TimePicker
                                    label="Event Time"
                                    value={eventLandingPage.event_time}
                                    onChange={(newValue) => setEventLandingPage((prev) => ({ ...prev, event_time: newValue }))}
                                />
                            </Grid>

                            {/* Pro Section */}
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
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <Input
                                                id={`pro-point-image-upload-${index}`}
                                                type="file"
                                                inputProps={{ accept: "image/*" }}
                                                style={{ display: 'none' }}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProPointFileUpload(e, 'pro.points', index, 'image_icon')}
                                                fullWidth
                                            />
                                            <label htmlFor={`pro-point-image-upload-${index}`}>
                                                <Button variant="contained" component="span">
                                                    Upload Image
                                                </Button>
                                            </label>
                                            {point.image_icon && (
                                                <Typography variant="body2">
                                                    {point.image_icon instanceof File ? point.image_icon.name : point.image_icon}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Button onClick={() => handleRemoveArrayItem('pro.points', index)}>Remove Point</Button>
                                    </Box>
                                ))}
                                <Button onClick={() => handleAddArrayItem('pro.points', { title: '', description: '', image_icon: '' })}>
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
                                    onChange={(e) => handleNestedChange('syllabus', 'title', e.target.value)}
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
                                        {desc.heading?.map((heading, headingIndex) => (
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
                                    value={eventLandingPage.for_whom.title}
                                    onChange={(e) => handleNestedChange('for_whom', 'title', e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="For Whom Description"
                                    value={eventLandingPage.for_whom.description}
                                    onChange={(e) => handleNestedChange('for_whom', 'description', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={3}
                                />
                                {eventLandingPage.for_whom.content.map((item, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                        <Input
                                            style={{ display: 'none' }}
                                            inputProps={{ accept: "image/*" }}
                                            id={`logo-upload-${index}`}
                                            type="file"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProPointFileUpload(e, 'for_whom.content', index, 'logo')}
                                        />
                                        <label htmlFor={`logo-upload-${index}`}>
                                            <Button variant="contained" component="span">
                                                Upload Logo
                                            </Button>
                                        </label>
                                        {item.logo && (
                                            <Typography variant="body2">
                                                {item.logo instanceof File ? item.logo.name : item.logo}
                                            </Typography>
                                        )}
                                        <TextField
                                            fullWidth
                                            label="Title"
                                            value={item.title}
                                            onChange={(e) => handleArrayInputChange('for_whom.content', index, 'title', e.target.value)}
                                            margin="normal"
                                        />
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            value={item.description}
                                            onChange={(e) => handleArrayInputChange('for_whom.content', index, 'description', e.target.value)}
                                            margin="normal"
                                            multiline
                                            rows={2}
                                        />
                                        <Button onClick={() => handleRemoveArrayItem('for_whom.content', index)}>Remove Item</Button>
                                    </Box>
                                ))}
                                <Button onClick={() => handleAddArrayItem('for_whom.content', { logo: '', title: '', description: '' })}>
                                    Add For Whom Item
                                </Button>
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