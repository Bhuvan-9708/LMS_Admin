'use client'

import React, { useState, useEffect, useCallback } from 'react';
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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Input,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from 'next/navigation';

interface Course {
    _id: string;
    title: string;
}

interface SectionWorking {
    _id: string;
    title: string;
}
interface Heading {
    title: string;
    lesson_no: number;
    time: string;
}
interface DetailedDescription {
    title: string;
    heading: Heading[];
}
interface Syllabus {
    title: string;
    description: string;
    detailed_description: DetailedDescription[];
}
interface CourseLandingPage {
    course_id: string;
    logo: File | null;
    title: string;
    tag_line: string;
    image: File | null;
    application_deadline_text: string;
    application_deadline: Date | null;
    batch_start_date_text: string;
    batch_start_date: Date | null;
    application_link_text: string;
    application_link: string;
    user_learning: {
        title: string;
        description: string;
        points: Array<{
            title: string;
            description: string;
        }>;
    };
    course_benefits: Array<{
        title: string;
        description: string;
    }>;
    skills_learning: {
        title: string;
        tags: Array<string>;
    };
    download_syllabus_link_text: string;
    download_syllabus_link: string;
    syllabus: Syllabus;
    for_whom: {
        title: string;
        description: string;
        content: Array<{
            title: string;
            description: string;
        }>;
    };
    section_working: string;
    course_highlights: {
        title: string;
        description: string;
        image: File | null;
        points: Array<{
            title: string;
            description: string;
        }>;
    };
    tools: {
        title: string;
        image: Array<{
            image_icon: File | null;
        }>;
    };
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
    is_active: boolean;
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
    seo_url: string;
    [key: string]: any;
}

export default function AddCourseLandingPage() {
    const [courseLandingPage, setCourseLandingPage] = useState<CourseLandingPage>({
        course_id: '',
        logo: null,
        title: '',
        tag_line: '',
        image: null,
        application_deadline_text: '',
        application_deadline: null,
        batch_start_date_text: '',
        batch_start_date: null,
        application_link_text: '',
        application_link: '',
        user_learning: { title: '', description: '', points: [] },
        course_benefits: [],
        skills_learning: { title: '', tags: [] },
        download_syllabus_link_text: '',
        download_syllabus_link: '',
        syllabus: {
            title: '',
            description: '',
            detailed_description: [],
        },
        for_whom: { title: '', description: '', content: [] },
        section_working: '',
        course_highlights: { title: '', description: '', image: null, points: [] },
        tools: { title: '', image: [] },
        certification_title: '',
        certification_heading: '',
        certification_details: [],
        certificate_image: null,
        feedbacks: { title: '', description: '', join_now_text: '', join_now_url: '', feedback: [] },
        faq: { title: '', description: '', content: [] },
        is_active: true,
        meta_title: '',
        meta_description: '',
        meta_keywords: [],
        seo_url: '',
    });

    const [courses, setCourses] = useState<Course[]>([]);
    const [sectionWorkings, setSectionWorkings] = useState<SectionWorking[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchCourses();
        fetchSectionWorkings();
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

    const fetchSectionWorkings = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/section-working/`);
            if (!response.ok) throw new Error('Failed to fetch section workings');
            const data = await response.json();
            setSectionWorkings(data.data);
        } catch (error) {
            console.error('Error fetching section workings:', error);
        }
    };

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setCourseLandingPage((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>, field: keyof CourseLandingPage | string) => {
            const file = event.target.files?.[0] || null;

            setCourseLandingPage((prev) => {
                if (typeof field === 'string' && field.includes('.')) {
                    const [section, subField] = field.split('.');

                    // Ensure section exists and is an object
                    const currentSection = prev[section as keyof CourseLandingPage] || {};

                    return {
                        ...prev,
                        [section]: {
                            ...currentSection,
                            [subField]: file,
                        },
                    };
                }

                return { ...prev, [field]: file };
            });
        },
        []
    );

    const handleNestedChange = useCallback((section: keyof CourseLandingPage, field: string, value: any) => {
        setCourseLandingPage((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    }, []);

    const handleArrayInputChange = (path: string, index: number, field: string, value: any) => {
        setCourseLandingPage((prevState) => {
            const paths = path.split('.');
            const updatedState = { ...prevState };

            let current = updatedState;
            for (let i = 0; i < paths.length - 1; i++) {
                current = current[paths[i]];
            }

            const fieldArray = current[paths[paths.length - 1]];
            if (Array.isArray(fieldArray)) {
                fieldArray[index][field] = value; // Update the specific field
            }

            return updatedState;
        });
    };

    const handleAddArrayItem = (path: string, newItem: any) => {
        setCourseLandingPage((prevState) => {
            const paths = path.split('.');
            const updatedState = { ...prevState };

            let current = updatedState;
            for (let i = 0; i < paths.length - 1; i++) {
                current = current[paths[i]];
            }

            const fieldArray = current[paths[paths.length - 1]];
            if (Array.isArray(fieldArray)) {
                current[paths[paths.length - 1]] = [...fieldArray, newItem]; // Add new item to the array
            }

            return updatedState;
        });
    };


    const handleRemoveArrayItem = useCallback((path: string, index: number) => {
        setCourseLandingPage((prev) => {
            const newState = { ...prev };
            const pathArray = path.split('.');
            let current: any = newState;

            for (let i = 0; i < pathArray.length - 1; i++) {
                if (!current[pathArray[i]]) return prev;
                current = current[pathArray[i]];
            }

            const lastKey = pathArray[pathArray.length - 1];
            if (!Array.isArray(current[lastKey])) return prev;

            current[lastKey] = current[lastKey].filter((_: any, idx: number) => idx !== index);

            return newState;
        });
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();

        const appendToFormData = (key: string, value: any) => {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    appendToFormData(`${key}[${index}]`, item);
                });
            } else if (typeof value === 'object' && value !== null) {
                Object.keys(value).forEach(nestedKey => {
                    appendToFormData(`${key}[${nestedKey}]`, value[nestedKey]);
                });
            } else if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        };

        // Append all fields to FormData
        Object.entries(courseLandingPage).forEach(([key, value]) => {
            appendToFormData(key, value);
        });

        if (courseLandingPage.tools && Array.isArray(courseLandingPage.tools.image)) {
            courseLandingPage.tools.image.forEach((tool, index) => {
                if (tool.image_icon instanceof File) {
                    formData.append(`tools[image][${index}]`, tool.image_icon);
                }
            });
        }

        // Log FormData contents for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        console.warn("Data being sent to the backend:", formData);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/course/create`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create course landing page');
            }

            const result = await response.json();
            console.log('Course landing page created successfully:', result);
            router.push('/cms/course-landing-pages');
        } catch (error) {
            console.error('Error creating course landing page:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Add Course Landing Page</Typography>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="course-select-label">Course</InputLabel>
                            <Select
                                labelId="course-select-label"
                                value={courseLandingPage.course_id}
                                onChange={(e) => setCourseLandingPage(prev => ({ ...prev, course_id: e.target.value as string }))}
                            >
                                {courses.map((course) => (
                                    <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ mb: 2 }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="logo-upload"
                                type="file"
                                onChange={(e) => handleFileChange(e, 'logo')}
                            />
                            <label htmlFor="logo-upload">
                                <Button variant="contained" component="span">Upload Logo</Button>
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
                                <Button variant="contained" component="span">Upload Image</Button>
                            </label>
                            {courseLandingPage.image && (
                                <Typography variant="body2">{courseLandingPage.image.name}</Typography>
                            )}
                        </Box>

                        <TextField
                            fullWidth
                            label="Application Deadline Text"
                            name="application_deadline_text"
                            value={courseLandingPage.application_deadline_text}
                            onChange={handleInputChange}
                            margin="normal"
                        />

                        <DatePicker
                            label="Application Deadline"
                            value={courseLandingPage.application_deadline}
                            onChange={(newValue) => setCourseLandingPage(prev => ({ ...prev, application_deadline: newValue }))}
                            slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                        />

                        <TextField
                            fullWidth
                            label="Batch Start Date Text"
                            name="batch_start_date_text"
                            value={courseLandingPage.batch_start_date_text}
                            onChange={handleInputChange}
                            margin="normal"
                        />

                        <DatePicker
                            label="Batch Start Date"
                            value={courseLandingPage.batch_start_date}
                            onChange={(newValue) => setCourseLandingPage(prev => ({ ...prev, batch_start_date: newValue }))}
                            slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
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

                        <Typography variant="h6" gutterBottom>User Learning</Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.user_learning.title}
                            onChange={(e) => handleNestedChange('user_learning', 'title', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={courseLandingPage.user_learning.description}
                            onChange={(e) => handleNestedChange('user_learning', 'description', e.target.value)}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                        {courseLandingPage.user_learning.points.map((point, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={point.title}
                                    onChange={(e) => handleArrayInputChange('user_learning.points', index, 'title', e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={point.description}
                                    onChange={(e) => handleArrayInputChange('user_learning.points', index, 'description', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={2}
                                />
                                <IconButton onClick={() => handleRemoveArrayItem('user_learning.points', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('user_learning.points', { title: '', description: '' })}>
                            Add User Learning Point
                        </Button>

                        <Typography variant="h6" gutterBottom>Course Benefits</Typography>
                        {courseLandingPage.course_benefits.map((benefit, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={benefit.title}
                                    onChange={(e) => handleArrayInputChange('course_benefits', index, 'title', e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={benefit.description}
                                    onChange={(e) => handleArrayInputChange('course_benefits', index, 'description', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={2}
                                />
                                <IconButton onClick={() => handleRemoveArrayItem('course_benefits', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('course_benefits', { title: '', description: '' })}>
                            Add Course Benefit
                        </Button>

                        <Typography variant="h6" gutterBottom>Skills Learning</Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.skills_learning.title}
                            onChange={(e) => handleNestedChange('skills_learning', 'title', e.target.value)}
                            margin="normal"
                        />

                        {/* Input field for adding a new skill tag */}
                        <TextField
                            fullWidth
                            label="New Skill Tag"
                            id="new-skill-tag"
                            margin="normal"
                        />

                        {/* Button to add new skill tag */}
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => {
                                const input = document.getElementById('new-skill-tag') as HTMLInputElement;
                                const newTagValue = input?.value.trim();

                                if (newTagValue) {
                                    handleAddArrayItem('skills_learning.tags', newTagValue);  // Add the tag to the array
                                    input.value = '';  // Clear the input field after adding
                                }
                            }}
                        >
                            Add Skill Tag
                        </Button>

                        {/* Display added tags */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                            {courseLandingPage.skills_learning.tags?.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    onDelete={() => handleRemoveArrayItem('skills_learning.tags', index)}  // Remove tag
                                />
                            ))}
                        </Box>

                        <TextField
                            fullWidth
                            label="Download Syllabus Link Text"
                            name="download_syllabus_link_text"
                            value={courseLandingPage.download_syllabus_link_text}
                            onChange={handleInputChange}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            label="Download Syllabus Link"
                            name="download_syllabus_link"
                            value={courseLandingPage.download_syllabus_link}
                            onChange={handleInputChange}
                            margin="normal"
                        />

                        <Card>
                            <CardContent>
                                <div>
                                    <Typography variant="h6">Syllabus Title</Typography>
                                    <TextField
                                        id="syllabus-title"
                                        variant="outlined"
                                        fullWidth
                                        value={courseLandingPage.syllabus?.title || ''}
                                        onChange={(e) => handleNestedChange('syllabus', 'title', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Typography variant="h6">Syllabus Description</Typography>
                                    <TextField
                                        id="syllabus-description"
                                        variant="outlined"
                                        multiline
                                        fullWidth
                                        rows={3}
                                        value={courseLandingPage.syllabus?.description || ''}
                                        onChange={(e) => handleNestedChange('syllabus', 'description', e.target.value)}
                                    />
                                </div>

                                {Array.isArray(courseLandingPage.syllabus.detailed_description) && courseLandingPage.syllabus.detailed_description.map((description, index) => (
                                    <Card key={index} className="p-4">
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            value={description.title}
                                            onChange={(e) => handleArrayInputChange('syllabus.detailed_description', index, 'title', e.target.value)}
                                            placeholder="Description Title"
                                        />

                                        {description.heading.map((heading, headingIndex) => (
                                            <div key={headingIndex} className="ml-4 space-y-2">
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    value={heading.title}
                                                    onChange={(e) => handleArrayInputChange(`syllabus.detailed_description.${index}.heading`, headingIndex, 'title', e.target.value)}
                                                    placeholder="Heading Title"
                                                />
                                                <TextField
                                                    variant="outlined"
                                                    type="number"
                                                    fullWidth
                                                    value={heading.lesson_no}
                                                    onChange={(e) => handleArrayInputChange(`syllabus.detailed_description.${index}.heading`, headingIndex, 'lesson_no', parseInt(e.target.value))}
                                                    placeholder="Lesson Number"
                                                />
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    value={heading.time}
                                                    onChange={(e) => handleArrayInputChange(`syllabus.detailed_description.${index}.heading`, headingIndex, 'time', e.target.value)}
                                                    placeholder="Time"
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleRemoveArrayItem(`syllabus.detailed_description.${index}.heading`, headingIndex)}
                                                >
                                                    Remove Heading
                                                </Button>
                                            </div>
                                        ))}

                                        <Button
                                            type="button"
                                            variant="outlined"
                                            onClick={() => handleAddArrayItem(`syllabus.detailed_description.${index}.heading`, { title: '', lesson_no: 0, time: '' })}
                                        >
                                            Add Heading
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleRemoveArrayItem('syllabus.detailed_description', index)}
                                        >
                                            Remove Description
                                        </Button>
                                    </Card>
                                ))}

                                <Button
                                    variant="outlined"
                                    onClick={() => handleAddArrayItem('syllabus.detailed_description', { title: '', heading: [] })}
                                >
                                    Add Syllabus Description
                                </Button>
                            </CardContent>
                        </Card>

                        <Typography variant="h6" gutterBottom>For Whom</Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.for_whom.title}
                            onChange={(e) => handleNestedChange('for_whom', 'title', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={courseLandingPage.for_whom.description}
                            onChange={(e) => handleNestedChange('for_whom', 'description', e.target.value)}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                        {courseLandingPage.for_whom.content.map((content, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={content.title}
                                    onChange={(e) => handleArrayInputChange('for_whom.content', index, 'title', e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={content.description}
                                    onChange={(e) => handleArrayInputChange('for_whom.content', index, 'description', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={2}
                                />
                                <IconButton onClick={() => handleRemoveArrayItem('for_whom.content', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('for_whom.content', { title: '', description: '' })}>
                            Add For Whom Content
                        </Button>

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="section-working-select-label">Section Working</InputLabel>
                            <Select
                                labelId="section-working-select-label"
                                value={courseLandingPage.section_working}
                                onChange={(e) => setCourseLandingPage(prev => ({ ...prev, section_working: e.target.value as string }))}
                            >
                                {sectionWorkings.map((section) => (
                                    <MenuItem key={section._id} value={section._id}>{section.title}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography variant="h6" gutterBottom>Course Highlights</Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.course_highlights.title}
                            onChange={(e) => handleNestedChange('course_highlights', 'title', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={courseLandingPage.course_highlights.description}
                            onChange={(e) => handleNestedChange('course_highlights', 'description', e.target.value)}
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
                                onChange={(e) => handleFileChange(e, 'course_highlights.image')}
                            />
                            <label htmlFor="course-highlights-image-upload">
                                <Button variant="contained" component="span">Upload Course Highlights Image</Button>
                            </label>
                            {courseLandingPage.course_highlights.image && (
                                <Typography variant="body2">{courseLandingPage.course_highlights.image.name}</Typography>
                            )}
                        </Box>
                        {courseLandingPage.course_highlights.points.map((point, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={point.title}
                                    onChange={(e) => handleArrayInputChange('course_highlights.points', index, 'title', e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={point.description}
                                    onChange={(e) => handleArrayInputChange('course_highlights.points', index, 'description', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={2}
                                />
                                <IconButton onClick={() => handleRemoveArrayItem('course_highlights.points', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('course_highlights.points', { title: '', description: '' })}>
                            Add Course Highlight Point
                        </Button>

                        <Typography variant="h6" gutterBottom>Tools</Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.tools.title}
                            onChange={(e) => handleNestedChange('tools', 'title', e.target.value)}
                            margin="normal"
                        />
                        {courseLandingPage.tools.image.map((tool, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id={`tool-image-upload-${index}`}
                                    type="file"
                                    onChange={(e) => handleFileChange(e, `tools.image[${index}].image_icon`)}
                                />
                                <label htmlFor={`tool-image-upload-${index}`}>
                                    <Button variant="contained" component="span">Upload Tool Icon</Button>
                                </label>
                                {tool.image_icon && (
                                    <Typography variant="body2">{tool.image_icon.name}</Typography>
                                )}
                                <IconButton onClick={() => handleRemoveArrayItem('tools.image', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('tools.image', { image_icon: null })}>
                            Add Tool
                        </Button>

                        <TextField
                            fullWidth
                            label="Certification Title"
                            name="certification_title"
                            value={courseLandingPage.certification_title}
                            onChange={handleInputChange}
                            margin="normal"
                        />

                        <TextField
                            fullWidth
                            label="Certification Heading"
                            name="certification_heading"
                            value={courseLandingPage.certification_heading}
                            onChange={handleInputChange}
                            margin="normal"
                        />

                        <Typography variant="h6" gutterBottom>Certification Details</Typography>
                        {courseLandingPage.certification_details.map((detail, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={detail.title}
                                    onChange={(e) => handleArrayInputChange('certification_details', index, 'title', e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={detail.description}
                                    onChange={(e) => handleArrayInputChange('certification_details', index, 'description', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={2}
                                />
                                <IconButton onClick={() => handleRemoveArrayItem('certification_details', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('certification_details', { title: '', description: '' })}>
                            Add Certification Detail
                        </Button>

                        <Box sx={{ mb: 2 }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="certificate-image-upload"
                                type="file"
                                onChange={(e) => handleFileChange(e, 'certificate_image')}
                            />
                            <label htmlFor="certificate-image-upload">
                                <Button variant="contained" component="span">Upload Certificate Image</Button>
                            </label>
                            {courseLandingPage.certificate_image && (
                                <Typography variant="body2">{courseLandingPage.certificate_image.name}</Typography>
                            )}
                        </Box>

                        <Typography variant="h6" gutterBottom>Feedbacks</Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.feedbacks.title}
                            onChange={(e) => handleNestedChange('feedbacks', 'title', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={courseLandingPage.feedbacks.description}
                            onChange={(e) => handleNestedChange('feedbacks', 'description', e.target.value)}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                        <TextField
                            fullWidth
                            label="Join Now Text"
                            value={courseLandingPage.feedbacks.join_now_text}
                            onChange={(e) => handleNestedChange('feedbacks', 'join_now_text', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Join Now URL"
                            value={courseLandingPage.feedbacks.join_now_url}
                            onChange={(e) => handleNestedChange('feedbacks', 'join_now_url', e.target.value)}
                            margin="normal"
                        />
                        {courseLandingPage.feedbacks.feedback.map((feedback, index) => (
                            <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={feedback.name}
                                    onChange={(e) => handleArrayInputChange('feedbacks.feedback', index, 'name', e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Feedback"
                                    value={feedback.feedback}
                                    onChange={(e) => handleArrayInputChange('feedbacks.feedback', index, 'feedback', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={3}
                                />
                                <DatePicker
                                    label="Date"
                                    value={feedback.date}
                                    onChange={(newValue) => handleArrayInputChange('feedbacks.feedback', index, 'date', newValue)}
                                    slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                                />
                                <IconButton onClick={() => handleRemoveArrayItem('feedbacks.feedback', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('feedbacks.feedback', { name: '', feedback: '', date: null })}>
                            Add Feedback
                        </Button>

                        <Typography variant="h6" gutterBottom>FAQ</Typography>
                        <TextField
                            fullWidth
                            label="Title"
                            value={courseLandingPage.faq.title}
                            onChange={(e) => handleNestedChange('faq', 'title', e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={courseLandingPage.faq.description}
                            onChange={(e) => handleNestedChange('faq', 'description', e.target.value)}
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
                                    onChange={(e) => handleArrayInputChange('faq.content', index, 'question', e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Answer"
                                    value={faq.answer}
                                    onChange={(e) => handleArrayInputChange('faq.content', index, 'answer', e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={3}
                                />
                                <IconButton onClick={() => handleRemoveArrayItem('faq.content', index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('faq.content', { question: '', answer: '' })}>
                            Add FAQ
                        </Button>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={courseLandingPage.is_active}
                                    onChange={(e) => setCourseLandingPage(prev => ({ ...prev, is_active: e.target.checked }))}
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
                        />

                        <TextField
                            fullWidth
                            label="Meta Description"
                            name="meta_description"
                            value={courseLandingPage.meta_description}
                            onChange={handleInputChange}
                            margin="normal"
                            multiline
                            rows={3}
                        />

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {courseLandingPage.meta_keywords.map((keyword, index) => (
                                <Chip
                                    key={index}
                                    label={keyword}
                                    onDelete={() => handleRemoveArrayItem('meta_keywords', index)}
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
                                    handleAddArrayItem('meta_keywords', target.value);
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