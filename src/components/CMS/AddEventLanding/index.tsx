"use client"

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
import { SelectChangeEvent } from '@mui/material/Select';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useRouter } from 'next/navigation';

interface Event {
    _id: string;
    title: string;
}
interface ToolImage {
    image_icon: File | null;
}
interface Tool {
    title: string;
    image: ToolImage[];
}
interface EventLandingPage {
    event_id: string;
    event_logo: File | null;
    tag_line: string;
    title: string;
    image: File | null;
    reservation_text: string;
    instructor_name: string;
    event_date: Date | null;
    event_time: string;
    pro: {
        title: string;
        description: string;
        points: Array<{
            title: string;
            description: string;
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
    for_whom_title: string;
    for_whom_text: string;
    for_whom: Array<{ tags: string }>;
    download_syllabus_link: string;
    instructor_details: {
        image: File | null;
        description: string;
    };
    skills_learn: Array<{ tags: string }>;
    tools: Tool[];
    certification_title: string;
    certification_heading: string;
    certification_details: Array<{
        title: string;
        description: string;
    }>;
    certificate_image: File | null;
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
        instructor_name: '',
        event_date: null,
        event_time: '',
        pro: { title: '', description: '', points: [] },
        syllabus: { title: '', description: '', detailed_description: [] },
        for_whom_title: '',
        for_whom_text: '',
        for_whom: [],
        download_syllabus_link: '',
        instructor_details: { image: null, description: '' },
        skills_learn: [],
        tools: [],
        certification_title: '',
        certification_heading: '',
        certification_details: [],
        certificate_image: null,
        feedbacks: { title: '', description: '', join_now_text: '', join_now_url: '', feedbacks: [] },
        faq: { title: '', description: '', content: [] },
        is_active: true,
        meta_title: '',
        meta_description: '',
        meta_keywords: [],
        seo_url: '',
    });

    const [events, setEvents] = useState<Event[]>([]);
    const router = useRouter();

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

    const handleChange = useCallback((
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
        const { name, value } = event.target as HTMLInputElement | HTMLTextAreaElement | { name: string; value: string };
        setEventLandingPage((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleNestedChange = useCallback((
        section: keyof EventLandingPage,
        field: string,
        value: any
    ) => {
        setEventLandingPage((prev) => ({
            ...prev,
            [section]: {
                ...(prev[section] as Record<string, any>),
                [field]: value,
            },
        }));
    }, []);

    const handleArrayInputChange = useCallback((path: string, index: number, field: string, value: any) => {
        setEventLandingPage((prev) => {
            const newState = { ...prev };
            const pathArray = path.split('.');
            let current: any = newState;

            for (let i = 0; i < pathArray.length - 1; i++) {
                if (!current[pathArray[i]]) {
                    current[pathArray[i]] = Array.isArray(current) ? [] : {};
                }
                current = current[pathArray[i]];
            }

            const lastKey = pathArray[pathArray.length - 1];
            if (!Array.isArray(current[lastKey])) {
                current[lastKey] = [];
            }

            if (!current[lastKey][index]) {
                current[lastKey][index] = {};
            }

            current[lastKey][index][field] = value;

            return newState;
        });
    }, []);

    const handleAddArrayItem = useCallback((path: string, newItem: any) => {
        setEventLandingPage((prev) => {
            const newState = { ...prev };
            const pathArray = path.split('.');
            let current: any = newState;

            for (let i = 0; i < pathArray.length - 1; i++) {
                const key = pathArray[i];
                if (!current[key]) {
                    current[key] = Array.isArray(current) ? [] : {};
                }
                current = current[key];
            }

            const finalKey = pathArray[pathArray.length - 1];
            if (!Array.isArray(current[finalKey])) {
                current[finalKey] = [];
            }

            current[finalKey].push(newItem);
            return newState;
        });
    }, []);

    const handleRemoveArrayItem = useCallback((path: string, index: number) => {
        setEventLandingPage((prev) => {
            const newState = { ...prev };
            const pathArray = path.split('.');
            let current: any = newState;

            for (let i = 0; i < pathArray.length - 1; i++) {
                if (!current[pathArray[i]]) {
                    return prev;
                }
                current = current[pathArray[i]];
            }

            const lastKey = pathArray[pathArray.length - 1];
            if (!Array.isArray(current[lastKey])) {
                return prev;
            }

            current[lastKey].splice(index, 1);
            return newState;
        });
    }, []);

    const handleFileChange = useCallback((
        event: React.ChangeEvent<HTMLInputElement>,
        field: keyof EventLandingPage | string
    ) => {
        const file = event.target.files?.[0] || null;

        if (field.includes('.')) {
            const [section, subField] = field.split('.');
            setEventLandingPage((prev) => ({
                ...prev,
                [section]: {
                    ...((prev[section as keyof EventLandingPage] as Record<string, any>) || {}),
                    [subField]: file,
                },
            }));
        } else {
            setEventLandingPage((prev) => ({ ...prev, [field]: file }));
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();

        // Function to convert event_date to YYYY-MM-DD format
        const formatEventDate = (date: Date | null) => {
            if (date) {
                const formattedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD format
                return formattedDate;
            }
            return null;
        };

        // Safely handle entries in the main object
        Object.entries(eventLandingPage).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (typeof value === 'object' && value !== null) {
                // Handle specific cases like 'pro', 'syllabus', and other nested objects
                if (key === 'pro' || key === 'syllabus') {
                    Object.entries(value || {}).forEach(([nestedKey, nestedValue]) => {
                        if (Array.isArray(nestedValue)) {
                            nestedValue.forEach((item, index) => {
                                formData.append(`${key}[${nestedKey}][${index}]`, JSON.stringify(item)); // Stringify array items
                            });
                        } else {
                            formData.append(`${key}[${nestedKey}]`, JSON.stringify(nestedValue)); // Stringify nested object
                        }
                    });
                } else if (Array.isArray(value)) {
                    // Handle arrays
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, JSON.stringify(item)); // Stringify each array item
                    });
                } else {
                    // For other objects
                    formData.append(key, JSON.stringify(value)); // Stringify the object
                }
            } else if (key === 'event_date') {
                // Correctly format the event date
                const formattedDate = formatEventDate(value as Date); // Ensure value is treated as a Date
                if (formattedDate) {
                    formData.append(key, formattedDate);
                }
            } else {
                formData.append(key, String(value));
            }
        });

        // Handle tools array with additional checks
        if (Array.isArray(eventLandingPage.tools)) {
            eventLandingPage.tools.forEach((tool, toolIndex) => {
                if (tool && typeof tool === 'object' && tool.title) {
                    formData.append(`tools[${toolIndex}][title]`, tool.title); // Add tool title

                    if (Array.isArray(tool.image)) {
                        // Loop through the image array for each tool
                        tool.image.forEach((toolImage, imageIndex) => {
                            if (toolImage && toolImage.image_icon instanceof File) {
                                formData.append(`tools[${toolIndex}][image][${imageIndex}][image_icon]`, toolImage.image_icon); // Add image icon
                            }
                        });
                    }
                }
            });
        } else {
            console.warn('tools is not an array:', eventLandingPage.tools); // Debugging
        }

        // Handle instructor details with null check
        if (eventLandingPage.instructor_details?.image instanceof File) {
            formData.append('instructor_details[image]', eventLandingPage.instructor_details.image); // Add instructor image
        } else {
            console.warn('instructor_details or image is missing:', eventLandingPage.instructor_details);
        }

        // Handle feedbacks array with null checks
        if (
            eventLandingPage.feedbacks &&
            Array.isArray(eventLandingPage.feedbacks.feedbacks)
        ) {
            eventLandingPage.feedbacks.feedbacks.forEach((feedback, index) => {
                if (feedback) {
                    formData.append(`feedbacks[feedbacks][${index}]`, JSON.stringify(feedback)); // Stringify feedback
                } else {
                    console.warn(`feedback at index ${index} is undefined or null`, feedback);
                }
            });
        } else {
            console.warn('feedbacks is not an array or is missing:', eventLandingPage.feedbacks);
        }

        console.log('Form Data:', Object.fromEntries(formData.entries())); // Log the data being sent

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/webinar/create`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error creating event landing page:', errorData);
                return;
            }

            const result = await response.json();
            console.log('Event landing page created:', result);
            router.push('/cms/event-landing');
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
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'event_logo')}
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
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    type="file"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'image')}
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
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Instructor Name"
                                    name="instructor_name"
                                    value={eventLandingPage.instructor_name}
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
                                <TextField
                                    fullWidth
                                    label="Event Time"
                                    name="event_time"
                                    value={eventLandingPage.event_time}
                                    onChange={handleChange}
                                    required
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
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'instructor_details.image')}
                                />
                                <label>Instructor Image</label>
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
                                            label="Skill Tag"
                                            value={skill.tags}
                                            onChange={(e) => handleArrayInputChange('skills_learn', index, 'tags', e.target.value)}
                                            margin="normal"
                                        />
                                        <Button onClick={() => handleRemoveArrayItem('skills_learn', index)}>Remove Skill</Button>
                                    </Box>
                                ))}
                                <Button onClick={() => handleAddArrayItem('skills_learn', { tags: '' })}>
                                    Add Skill
                                </Button>
                            </Grid>

                            {/* Tools */}
                            <Grid item xs={12}>
                                <Typography variant="h6">Tools</Typography>
                                {eventLandingPage.tools.map((tool, index) => (
                                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                        <TextField
                                            label="Tool Title"
                                            value={tool.title} // Add title field
                                            onChange={(e) => {
                                                const newTools = [...eventLandingPage.tools];
                                                newTools[index] = { ...newTools[index], title: e.target.value }; // Update title
                                                setEventLandingPage(prev => ({ ...prev, tools: newTools }));
                                            }}
                                            fullWidth
                                        />
                                        <Input
                                            type="file"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const file = e.target.files?.[0] || null;
                                                const newTools = [...eventLandingPage.tools];
                                                newTools[index].image[0] = { image_icon: file }; // Update image array
                                                setEventLandingPage(prev => ({ ...prev, tools: newTools }));
                                            }}
                                        />
                                        <label>Tool Icon</label>
                                        <Button onClick={() => handleRemoveArrayItem('tools', index)}>Remove Tool</Button>
                                    </Box>
                                ))}
                                <Button onClick={() => handleAddArrayItem('tools', { title: '', image: [{ image_icon: null }] })}>
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
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'certificate_image')}
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