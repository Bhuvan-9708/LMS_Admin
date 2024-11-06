"use client"

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
    IconButton,
    SelectChangeEvent,
    Snackbar,
    Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface QnA {
    question: string;
    possible_answers: string[];
    is_required: boolean;
    question_type: 'text' | 'multiple-choice';
}

interface ApplicationForm {
    course_id?: string;
    event_id?: string;
    qna: QnA[];
    is_active: boolean;
}

interface Course {
    _id: string;
    title: string;
}

interface Event {
    _id: string;
    title: string;
}

export default function AddCourseEnrollmentForm() {
    const [form, setForm] = useState<ApplicationForm>({
        qna: [],
        is_active: true,
    });
    const router = useRouter();
    const [selectionType, setSelectionType] = useState<'course' | 'event'>('course');
    const [courses, setCourses] = useState<Course[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course`);
                const data = await response.json();
                setCourses(data.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        const fetchEvents = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event/get-all-events`)
                const data = await response.json()
                if (data.success) {
                    setEvents(data.data)
                }
            } catch (error) {
                console.error('Error fetching events:', error)
            }
        }

        fetchCourses();
        fetchEvents();
    }, []);

    const handleSelectionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedType = event.target.value as 'course' | 'event';
        setSelectionType(selectedType);

        setForm((prevForm) => ({
            ...prevForm,
            course_id: selectedType === 'course' ? '' : undefined,
            event_id: selectedType === 'event' ? '' : undefined,
        }));
    };

    const handleFieldChange = (event: SelectChangeEvent<string>, field: 'course_id' | 'event_id') => {
        setForm({ ...form, [field]: event.target.value });
    };

    const handleAddQuestion = () => {
        setForm({
            ...form,
            qna: [
                ...form.qna,
                { question: '', possible_answers: [], is_required: true, question_type: 'text' },
            ],
        });
    };

    const handleQuestionChange = (index: number, field: keyof QnA, value: any) => {
        const updatedQnA = [...form.qna];
        updatedQnA[index] = { ...updatedQnA[index], [field]: value };
        setForm({ ...form, qna: updatedQnA });
    };

    const handleAddAnswer = (questionIndex: number) => {
        const updatedQnA = [...form.qna];
        updatedQnA[questionIndex].possible_answers.push('');
        setForm({ ...form, qna: updatedQnA });
    };

    const handleAnswerChange = (questionIndex: number, answerIndex: number, value: string) => {
        const updatedQnA = [...form.qna];
        updatedQnA[questionIndex].possible_answers[answerIndex] = value;
        setForm({ ...form, qna: updatedQnA });
    };

    const handleRemoveQuestion = (index: number) => {
        const updatedQnA = form.qna.filter((_, i) => i !== index);
        setForm({ ...form, qna: updatedQnA });
    };

    const handleRemoveAnswer = (questionIndex: number, answerIndex: number) => {
        const updatedQnA = [...form.qna];
        updatedQnA[questionIndex].possible_answers = updatedQnA[questionIndex].possible_answers.filter((_, i) => i !== answerIndex);
        setForm({ ...form, qna: updatedQnA });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const submissionData = { ...form };
        if (selectionType === 'course') {
            delete submissionData.event_id;
        } else {
            delete submissionData.course_id;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/application-form/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (responseData.error === "Course not found or marked as inactive !") {
                    alert("The selected course could not be found or is inactive. Please choose a different course.");
                } else if (responseData.error === "Event not found or marked as inactive !") {
                    alert("The selected event could not be found or is inactive. Please choose a different event.");
                } else {
                    throw new Error(responseData.error || 'Failed to create enrollment form');
                }
            } else {
                setSnackbar({
                    open: true,
                    message: 'Enroll created successfully!',
                    severity: 'success',
                });
                router.push('/lms/enroll-courses/');
            }
        } catch (error) {
            console.error('Error creating enrollment form:', error);
            setSnackbar({
                open: true,
                message: 'Error creating Enrollment. Please try again.',
                severity: 'error',
            });
            alert("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Add Course Enrollment Form</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <RadioGroup row value={selectionType} onChange={handleSelectionTypeChange}>
                                    <FormControlLabel value="course" control={<Radio />} label="Course" />
                                    <FormControlLabel value="event" control={<Radio />} label="Event" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        {selectionType === 'course' && (
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="course-select-label">Course</InputLabel>
                                    <Select
                                        labelId="course-select-label"
                                        value={form.course_id || ''}
                                        onChange={(e) => handleFieldChange(e, 'course_id')}
                                        required
                                    >
                                        {courses.map((course) => (
                                            <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                        {selectionType === 'event' && (
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="event-select-label">Event</InputLabel>
                                    <Select
                                        labelId="event-select-label"
                                        value={form.event_id || ''}
                                        onChange={(e) => handleFieldChange(e, 'event_id')}
                                        required
                                    >
                                        {events.map((event) => (
                                            <MenuItem key={event._id} value={event._id}>{event.title}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                        {form.qna.map((qna, qnaIndex) => (
                            <Grid item xs={12} key={qnaIndex}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Question"
                                                    value={qna.question}
                                                    onChange={(e) => handleQuestionChange(qnaIndex, 'question', e.target.value)}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth>
                                                    <InputLabel id={`question-type-label-${qnaIndex}`}>Question Type</InputLabel>
                                                    <Select
                                                        labelId={`question-type-label-${qnaIndex}`}
                                                        value={qna.question_type}
                                                        onChange={(e) => handleQuestionChange(qnaIndex, 'question_type', e.target.value)}
                                                    >
                                                        <MenuItem value="text">Text</MenuItem>
                                                        <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            {qna.question_type === 'multiple-choice' && (
                                                <Grid item xs={12}>
                                                    {qna.possible_answers.map((answer, answerIndex) => (
                                                        <Box key={answerIndex} display="flex" alignItems="center" mb={1}>
                                                            <TextField
                                                                fullWidth
                                                                label={`Answer ${answerIndex + 1}`}
                                                                value={answer}
                                                                onChange={(e) => handleAnswerChange(qnaIndex, answerIndex, e.target.value)}
                                                                required
                                                            />
                                                            <IconButton onClick={() => handleRemoveAnswer(qnaIndex, answerIndex)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    ))}
                                                    <Button startIcon={<AddIcon />} onClick={() => handleAddAnswer(qnaIndex)}>
                                                        Add Answer
                                                    </Button>
                                                </Grid>
                                            )}
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={qna.is_required}
                                                            onChange={(e) => handleQuestionChange(qnaIndex, 'is_required', e.target.checked)}
                                                        />
                                                    }
                                                    label="Required"
                                                />
                                            </Grid>
                                        </Grid>
                                        <Box mt={2}>
                                            <Button variant="outlined" color="secondary" onClick={() => handleRemoveQuestion(qnaIndex)}>
                                                Remove Question
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button startIcon={<AddIcon />} onClick={handleAddQuestion}>
                                Add Question
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.is_active}
                                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    />
                                }
                                label="Active"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
            < Snackbar
                open={snackbar.open}
                autoHideDuration={1000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Card>
    );
}
