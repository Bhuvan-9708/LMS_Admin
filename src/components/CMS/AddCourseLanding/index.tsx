"use client"

import React, { useState } from 'react';
import {
    Button,
    TextField,
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    FormControlLabel,
    Switch,
    Chip,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from 'next/navigation';

interface CourseLandingPage {
    logo: File | null;
    title: string;
    tag_line: string;
    image: File | null;
    application_deadline: Date | null;
    batch_start_date: Date | null;
    application_link_text: string;
    application_link: string;
    user_learning: {
        title: string;
        description: string;
        points: Array<{
            image_icon: File | null;
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
    for_whom: {
        title: string;
        description: string;
        content: Array<{
            logo: File | null;
            title: string;
            description: string;
        }>;
    };
    course_working: {
        title: string;
        description: string;
        points: Array<{
            title: string;
            description: string;
            image_icon: File | null;
        }>;
    };
    course_highlights: {
        title: string;
        description: string;
        image: File | null;
        points: Array<{
            image_icon: File | null;
            title: string;
            description: string;
        }>;
    };
    feedbacks: {
        title: string;
        description: string;
        join_now_text: string;
        join_now_url: string;
        feedback: Array<{
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
    queries: {
        title: string;
        content: Array<{
            label: string;
            type: string;
            placeholder: string;
        }>;
    };
    is_active: boolean;
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
    seo_url: string;
    slug: string;
}

export default function AddCourseLandingPage() {
    const [courseLandingPage, setCourseLandingPage] = useState<CourseLandingPage>({
        logo: null,
        title: '',
        tag_line: '',
        image: null,
        application_deadline: null,
        batch_start_date: null,
        application_link_text: '',
        application_link: '',
        user_learning: {
            title: '',
            description: '',
            points: [],
        },
        syllabus: {
            title: '',
            description: '',
            detailed_description: [
                {
                    title: '',
                    heading: [{ title: '', lesson_no: 0, time: '' }]
                }
            ]
        },
        for_whom: {
            title: '',
            description: '',
            content: [],
        },
        course_working: {
            title: '',
            description: '',
            points: [],
        },
        course_highlights: {
            title: '',
            description: '',
            image: null,
            points: [],
        },
        feedbacks: {
            title: '',
            description: '',
            join_now_text: '',
            join_now_url: '',
            feedback: [],
        },
        faq: {
            title: '',
            description: '',
            content: [],
        },
        queries: {
            title: '',
            content: [],
        },
        is_active: true,
        meta_title: '',
        meta_description: '',
        meta_keywords: [],
        seo_url: '',
        slug: '',
    });

    const router = useRouter();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCourseLandingPage((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof CourseLandingPage) => {
        const file = event.target.files?.[0] || null;
        setCourseLandingPage((prev) => ({ ...prev, [field]: file }));
    };

    const handleNestedInputChange = (section: keyof CourseLandingPage, field: string, value: any) => {
        setCourseLandingPage((prev) => {
            const currentSection = prev[section];

            if (typeof currentSection === 'object' && currentSection !== null) {
                return {
                    ...prev,
                    [section]: {
                        ...currentSection,
                        [field]: value,
                    },
                };
            }
            return prev;
        });
    };


    const handleArrayInputChange = (
        section: keyof CourseLandingPage,
        index: number,
        field: string,
        value: any
    ) => {
        setCourseLandingPage((prev) => {
            const sectionData = prev[section] as any;
            if (Array.isArray(sectionData[field])) {
                const newArray = [...sectionData[field]];

                if (newArray[index]) {
                    newArray[index] = { ...newArray[index], [field]: value };
                } else {
                    newArray[index] = { [field]: value };
                }

                return { ...prev, [section]: { ...sectionData, [field]: newArray } };
            }

            return { ...prev, [section]: { ...sectionData, [field]: value } };
        });
    };

    const handleAddArrayItem = (section: keyof CourseLandingPage, field: string) => {
        setCourseLandingPage((prev) => {
            const fieldValue = Array.isArray((prev[section] as any)[field])
                ? (prev[section] as any)[field]
                : [];

            return {
                ...prev,
                [section]: {
                    ...(prev[section] as any),
                    [field]: [...fieldValue, {}], 
                },
            };
        });
    };

    const handleRemoveArrayItem = (section: keyof CourseLandingPage, field: string, index: number) => {
        setCourseLandingPage((prev) => ({
            ...prev,
            [section]: {
                ...(prev[section] as any),
                [field]: (prev[section] as any)[field].filter((_: any, i: number) => i !== index),
            },
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();

        // Append all text fields
        Object.entries(courseLandingPage).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'boolean') {
                formData.append(key, value.toString());
            } else if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else if (value instanceof Date) {
                formData.append(key, value.toISOString());
            } else if (value instanceof File) {
                formData.append(key, value);
            } else if (typeof value === 'object' && value !== null) {
                formData.append(key, JSON.stringify(value));
            }
        });

        // Append nested file fields
        if (courseLandingPage.logo) formData.append('logo', courseLandingPage.logo);
        if (courseLandingPage.image) formData.append('image', courseLandingPage.image);
        if (courseLandingPage.course_highlights.image)
            formData.append('course_highlights.image', courseLandingPage.course_highlights.image);

        courseLandingPage.user_learning.points.forEach((point, index) => {
            if (point.image_icon) formData.append(`user_learning.points[${index}].image_icon`, point.image_icon);
        });

        courseLandingPage.for_whom.content.forEach((content, index) => {
            if (content.logo) formData.append(`for_whom.content[${index}].logo`, content.logo);
        });

        courseLandingPage.course_working.points.forEach((point, index) => {
            if (point.image_icon) formData.append(`course_working.points[${index}].image_icon`, point.image_icon);
        });

        courseLandingPage.course_highlights.points.forEach((point, index) => {
            if (point.image_icon) formData.append(`course_highlights.points[${index}].image_icon`, point.image_icon);
        });

        // Log the form data for debugging
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await fetch('https://lms-v1-xi.vercel.app/api/landing-page/course/create', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to create course landing page: ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            console.log('Course landing page created successfully:', result);
            router.push('/cms/course-landing-pages');
        } catch (error) {
            console.error('Error creating course landing page:', error);
            // You might want to show an error message to the user here
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Add Course Landing Page
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 2 }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="logo-upload"
                                type="file"
                                onChange={(e) => handleFileChange(e, 'logo')}
                            />
                            <label htmlFor="logo-upload">
                                <Button variant="contained" component="span">
                                    Upload Logo
                                </Button>
                            </label>
                            {courseLandingPage.logo && (
                                <Typography variant="body2">{courseLandingPage.logo.name}</Typography>
                            )}
                        </Box>

                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={courseLandingPage.title}
                            onChange={handleInputChange}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            label="Tag Line"
                            name="tag_line"
                            value={courseLandingPage.tag_line}
                            onChange={handleInputChange}
                            margin="normal"
                        />

                        <Box sx={{ mb: 2 }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="image-upload"
                                type="file"
                                onChange={(e) => handleFileChange(e, 'image')}
                            />
                            <label htmlFor="image-upload">
                                <Button variant="contained" component="span">
                                    Upload Image
                                </Button>
                            </label>
                            {courseLandingPage.image && (
                                <Typography variant="body2">{courseLandingPage.image.name}</Typography>
                            )}
                        </Box>

                        <DatePicker
                            label="Application Deadline"
                            value={courseLandingPage.application_deadline}
                            onChange={(newValue) =>
                                setCourseLandingPage((prev) => ({ ...prev, application_deadline: newValue }))
                            }
                            slots={{ textField: (params) => <TextField {...params} fullWidth margin="normal" /> }}
                        />

                        <DatePicker
                            label="Batch Start Date"
                            value={courseLandingPage.batch_start_date}
                            onChange={(newValue) =>
                                setCourseLandingPage((prev) => ({ ...prev, batch_start_date: newValue }))
                            }
                            slots={{ textField: (params) => <TextField {...params} fullWidth margin="normal" /> }}
                        />

                        <TextField
                            fullWidth
                            label="Application Link Text"
                            name="application_link_text"
                            value={courseLandingPage.application_link_text}
                            onChange={handleInputChange}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            label="Application Link"
                            name="application_link"
                            value={courseLandingPage.application_link}
                            onChange={handleInputChange}
                            margin="normal"
                        />

                        <Typography variant="h6" gutterBottom>
                            User Learning
                        </Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.user_learning.title}
                            onChange={(e) => handleNestedInputChange('user_learning', 'title', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={courseLandingPage.user_learning.description}
                            onChange={(e) => handleNestedInputChange('user_learning', 'description', e.target.value)}
                            margin="normal"
                            multiline
                            rows={3}
                        />

                        {courseLandingPage.user_learning.points.map((point, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id={`user-learning-image-${index}`}
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        handleArrayInputChange('user_learning', index, 'image_icon', file);
                                    }}
                                />
                                <label htmlFor={`user-learning-image-${index}`}>
                                    <Button variant="contained" component="span">
                                        Upload Image Icon
                                    </Button>
                                </label>
                                {point.image_icon && <Typography variant="body2">{point.image_icon.name}</Typography>}
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={point.title}
                                    onChange={(e) =>
                                        handleArrayInputChange('user_learning', index, 'title', e.target.value)
                                    }
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={point.description}
                                    onChange={(e) =>
                                        handleArrayInputChange('user_learning', index, 'description', e.target.value)
                                    }
                                    margin="normal"
                                    multiline
                                    rows={2}
                                />
                                <IconButton onClick={() => handleRemoveArrayItem('user_learning', 'points', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleAddArrayItem('user_learning', 'points')}
                        >
                            Add User Learning Point
                        </Button>

                        <Typography variant="h6" gutterBottom>
                            Syllabus
                        </Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.syllabus.title}
                            onChange={(e) => handleNestedInputChange('syllabus', 'title', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={courseLandingPage.syllabus.description}
                            onChange={(e) => handleNestedInputChange('syllabus', 'description', e.target.value)}
                            margin="normal"
                            multiline
                            rows={3}
                        />

                        {courseLandingPage.syllabus.detailed_description.map((description, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={description.title}
                                    onChange={(e) =>
                                        handleArrayInputChange('syllabus', index, 'title', e.target.value)
                                    }
                                    margin="normal"
                                />
                                {description.heading?.length > 0 ? (
                                    description.heading.map((heading, headingIndex) => (
                                        <Box key={headingIndex} sx={{ ml: 2, mb: 1 }}>
                                            <TextField
                                                label="Heading Title"
                                                value={heading.title}
                                                onChange={(e) =>
                                                    handleArrayInputChange(
                                                        'syllabus',
                                                        index,
                                                        `heading[${headingIndex}].title`,
                                                        e.target.value
                                                    )
                                                }
                                                margin="dense"
                                            />
                                            <TextField
                                                label="Lesson Number"
                                                type="number"
                                                value={heading.lesson_no}
                                                onChange={(e) =>
                                                    handleArrayInputChange(
                                                        'syllabus',
                                                        index,
                                                        `heading[${headingIndex}].lesson_no`,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                margin="dense"
                                            />
                                            <TextField
                                                label="Time"
                                                value={heading.time}
                                                onChange={(e) =>
                                                    handleArrayInputChange(
                                                        'syllabus',
                                                        index,
                                                        `heading[${headingIndex}].time`,
                                                        e.target.value
                                                    )
                                                }
                                                margin="dense"
                                            />
                                            <IconButton
                                                onClick={() =>
                                                    handleRemoveArrayItem('syllabus', `detailed_description[${index}].heading`, headingIndex)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography>No headings found. Please add a heading.</Typography>
                                )}
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={() =>
                                        handleAddArrayItem('syllabus', `detailed_description[${index}].heading`)
                                    }
                                >
                                    Add Heading
                                </Button>
                                <IconButton onClick={() => handleRemoveArrayItem('syllabus', 'detailed_description', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleAddArrayItem('syllabus', 'detailed_description')}
                        >
                            Add Syllabus Description
                        </Button>

                        <Typography variant="h6" gutterBottom>
                            For Whom
                        </Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.for_whom.title}
                            onChange={(e) => handleNestedInputChange('for_whom', 'title', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={courseLandingPage.for_whom.description}
                            onChange={(e) => handleNestedInputChange('for_whom', 'description', e.target.value)}
                            margin="normal"
                            multiline
                            rows={3}
                        />

                        {courseLandingPage.for_whom.content.map((content, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id={`for-whom-logo-${index}`}
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        handleArrayInputChange('for_whom', index, 'logo', file);
                                    }}
                                />
                                <label htmlFor={`for-whom-logo-${index}`}>
                                    <Button variant="contained" component="span">
                                        Upload Logo
                                    </Button>
                                </label>
                                {content.logo && <Typography variant="body2">{content.logo.name}</Typography>}
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={content.title}
                                    onChange={(e) =>
                                        handleArrayInputChange('for_whom', index, 'title', e.target.value)
                                    }
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={content.description}
                                    onChange={(e) =>
                                        handleArrayInputChange('for_whom', index, 'description', e.target.value)
                                    }
                                    margin="normal"
                                    multiline
                                    rows={2}
                                />
                                <IconButton onClick={() => handleRemoveArrayItem('for_whom', 'content', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleAddArrayItem('for_whom', 'content')}
                        >
                            Add For Whom Content
                        </Button>

                        <Typography variant="h6" gutterBottom>
                            Course Working
                        </Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.course_working.title}
                            onChange={(e) => handleNestedInputChange('course_working', 'title', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={courseLandingPage.course_working.description}
                            onChange={(e) => handleNestedInputChange('course_working', 'description', e.target.value)}
                            margin="normal"
                            multiline
                            rows={3}
                        />

                        {courseLandingPage.course_working.points.map((point, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={point.title}
                                    onChange={(e) =>
                                        handleArrayInputChange('course_working', index, 'title', e.target.value)
                                    }
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={point.description}
                                    onChange={(e) =>
                                        handleArrayInputChange('course_working', index, 'description', e.target.value)
                                    }
                                    margin="normal"
                                    multiline
                                    rows={2}
                                />
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id={`course-working-image-${index}`}
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        handleArrayInputChange('course_working', index, 'image_icon', file);
                                    }}
                                />
                                <label htmlFor={`course-working-image-${index}`}>
                                    <Button variant="contained" component="span">
                                        Upload Image Icon
                                    </Button>
                                </label>
                                {point.image_icon && <Typography variant="body2">{point.image_icon.name}</Typography>}
                                <IconButton onClick={() => handleRemoveArrayItem('course_working', 'points', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleAddArrayItem('course_working', 'points')}
                        >
                            Add Course Working Point
                        </Button>

                        <Typography variant="h6" gutterBottom>
                            Course Highlights
                        </Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.course_highlights.title}
                            onChange={(e) => handleNestedInputChange('course_highlights', 'title', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={courseLandingPage.course_highlights.description}
                            onChange={(e) => handleNestedInputChange('course_highlights', 'description', e.target.value)}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                        <Box sx={{ mb: 2 }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="course-highlights-image-upload"
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleNestedInputChange('course_highlights', 'image', file);
                                }}
                            />
                            <label htmlFor="course-highlights-image-upload">
                                <Button variant="contained" component="span">
                                    Upload Course Highlights Image
                                </Button>
                            </label>
                            {courseLandingPage.course_highlights.image && (
                                <Typography variant="body2">{courseLandingPage.course_highlights.image.name}</Typography>
                            )}
                        </Box>

                        {courseLandingPage.course_highlights.points.map((point, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id={`course-highlights-icon-${index}`}
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        handleArrayInputChange('course_highlights', index, 'image_icon', file);
                                    }}
                                />
                                <label htmlFor={`course-highlights-icon-${index}`}>
                                    <Button variant="contained" component="span">
                                        Upload Image Icon
                                    </Button>
                                </label>
                                {point.image_icon && <Typography variant="body2">{point.image_icon.name}</Typography>}
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={point.title}
                                    onChange={(e) =>
                                        handleArrayInputChange('course_highlights', index, 'title', e.target.value)
                                    }
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={point.description}
                                    onChange={(e) =>
                                        handleArrayInputChange('course_highlights', index, 'description', e.target.value)
                                    }
                                    margin="normal"
                                    multiline
                                    rows={2}
                                />
                                <IconButton onClick={() => handleRemoveArrayItem('course_highlights', 'points', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleAddArrayItem('course_highlights', 'points')}
                        >
                            Add Course Highlight Point
                        </Button>

                        <Typography variant="h6" gutterBottom>
                            Feedbacks
                        </Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.feedbacks.title}
                            onChange={(e) => handleNestedInputChange('feedbacks', 'title', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={courseLandingPage.feedbacks.description}
                            onChange={(e) => handleNestedInputChange('feedbacks', 'description', e.target.value)}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                        <TextField
                            fullWidth
                            label="Join Now Text"
                            value={courseLandingPage.feedbacks.join_now_text}
                            onChange={(e) => handleNestedInputChange('feedbacks', 'join_now_text', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Join Now URL"
                            value={courseLandingPage.feedbacks.join_now_url}
                            onChange={(e) => handleNestedInputChange('feedbacks', 'join_now_url', e.target.value)}
                            margin="normal"
                        />

                        {courseLandingPage.feedbacks.feedback.map((feedback, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={feedback.name}
                                    onChange={(e) =>
                                        handleArrayInputChange('feedbacks', index, 'name', e.target.value)
                                    }
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Feedback"
                                    value={feedback.feedback}
                                    onChange={(e) =>
                                        handleArrayInputChange('feedbacks', index, 'feedback', e.target.value)
                                    }
                                    margin="normal"
                                    multiline
                                    rows={3}
                                />
                                <DatePicker
                                    label="Date"
                                    value={feedback.date}
                                    onChange={(newValue) =>
                                        handleArrayInputChange('feedbacks', index, 'date', newValue)
                                    }
                                    slots={{ textField: (params) => <TextField {...params} fullWidth margin="normal" /> }}
                                />
                                <IconButton onClick={() => handleRemoveArrayItem('feedbacks', 'feedback', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleAddArrayItem('feedbacks', 'feedback')}
                        >
                            Add Feedback
                        </Button>

                        <Typography variant="h6" gutterBottom>
                            FAQ
                        </Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.faq.title}
                            onChange={(e) => handleNestedInputChange('faq', 'title', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={courseLandingPage.faq.description}
                            onChange={(e) => handleNestedInputChange('faq', 'description', e.target.value)}
                            margin="normal"
                            multiline
                            rows={3}
                        />

                        {courseLandingPage.faq.content.map((faq, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Question"
                                    value={faq.question}
                                    onChange={(e) =>
                                        handleArrayInputChange('faq', index, 'question', e.target.value)
                                    }
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Answer"
                                    value={faq.answer}
                                    onChange={(e) =>
                                        handleArrayInputChange('faq', index, 'answer', e.target.value)
                                    }
                                    margin="normal"
                                    multiline
                                    rows={3}
                                />
                                <IconButton onClick={() => handleRemoveArrayItem('faq', 'content', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleAddArrayItem('faq', 'content')}
                        >
                            Add FAQ
                        </Button>

                        <Typography variant="h6" gutterBottom>
                            Queries
                        </Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.queries.title}
                            onChange={(e) => handleNestedInputChange('queries', 'title', e.target.value)}
                            margin="normal"
                        />

                        {courseLandingPage.queries.content.map((query, index) => (
                            <Box key={index}
                                sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Label"
                                    value={query.label}
                                    onChange={(e) =>
                                        handleArrayInputChange('queries', index, 'label', e.target.value)
                                    }
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Type"
                                    value={query.type}
                                    onChange={(e) =>
                                        handleArrayInputChange('queries', index, 'type', e.target.value)
                                    }
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Placeholder"
                                    value={query.placeholder}
                                    onChange={(e) =>
                                        handleArrayInputChange('queries', index, 'placeholder', e.target.value)
                                    }
                                    margin="normal"
                                />
                                <IconButton onClick={() => handleRemoveArrayItem('queries', 'content', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => handleAddArrayItem('queries', 'content')}
                        >
                            Add Query Field
                        </Button>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={courseLandingPage.is_active}
                                    onChange={(e) =>
                                        setCourseLandingPage((prev) => ({ ...prev, is_active: e.target.checked }))
                                    }
                                    name="is_active"
                                />
                            }
                            label="Is Active"
                        />

                        <TextField
                            fullWidth
                            label="Meta Title"
                            name="meta_title"
                            value={courseLandingPage.meta_title}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Meta Description"
                            name="meta_description"
                            value={courseLandingPage.meta_description}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                            multiline
                            rows={3}
                        />

                        <Typography variant="h6" gutterBottom>
                            Meta Keywords
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {courseLandingPage.meta_keywords.map((keyword, index) => (
                                <Chip
                                    key={index}
                                    label={keyword}
                                    onDelete={() => handleRemoveArrayItem('meta_keywords', '', index)}
                                />
                            ))}
                        </Box>
                        <TextField
                            fullWidth
                            label="Add Meta Keyword"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const target = e.target as HTMLInputElement;
                                    setCourseLandingPage((prev) => ({
                                        ...prev,
                                        meta_keywords: [...prev.meta_keywords, target.value],
                                    }));
                                    target.value = '';
                                }
                            }}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            label="SEO URL"
                            name="seo_url"
                            value={courseLandingPage.seo_url}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Slug"
                            name="slug"
                            value={courseLandingPage.slug}
                            onChange={handleInputChange}
                            margin="normal"
                            required
                        />

                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Create Course Landing Page
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </LocalizationProvider>
    );
}