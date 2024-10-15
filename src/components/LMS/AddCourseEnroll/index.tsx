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
    Select,
    TextField,
    Typography,
    IconButton,
    SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Question {
    question: string;
    possible_answers: string[];
    is_required: boolean;
    question_type: 'text' | 'multiple-choice' | 'checkbox';
}

interface CourseEnrollmentForm {
    course_id: string;
    questions: Question[];
    is_active: boolean;
}

interface Course {
    _id: string;
    title: string;
}

export default function AddCourseEnrollmentForm() {
    const [enrollmentForm, setEnrollmentForm] = useState<CourseEnrollmentForm>({
        course_id: '',
        questions: [],
        is_active: true,
    });
    const router = useRouter();
    const [courseId, setCourseId] = useState<String>("")
    console.log("courseID", courseId);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/course`);
                const data = await response.json();
                setCourses(data.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const handleCourseChange = (event: SelectChangeEvent<string>) => {
        setEnrollmentForm({ ...enrollmentForm, course_id: event.target.value });
        setCourseId(event.target.value);
    };

    const handleAddQuestion = () => {
        setEnrollmentForm({
            ...enrollmentForm,
            questions: [
                ...enrollmentForm.questions,
                { question: '', possible_answers: [], is_required: true, question_type: 'text' },
            ],
        });
    };

    const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
        const updatedQuestions = [...enrollmentForm.questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setEnrollmentForm({ ...enrollmentForm, questions: updatedQuestions });
    };

    const handleAddAnswer = (questionIndex: number) => {
        const updatedQuestions = [...enrollmentForm.questions];
        updatedQuestions[questionIndex].possible_answers.push('');
        setEnrollmentForm({ ...enrollmentForm, questions: updatedQuestions });
    };

    const handleAnswerChange = (questionIndex: number, answerIndex: number, value: string) => {
        const updatedQuestions = [...enrollmentForm.questions];
        updatedQuestions[questionIndex].possible_answers[answerIndex] = value;
        setEnrollmentForm({ ...enrollmentForm, questions: updatedQuestions });
    };

    const handleRemoveQuestion = (index: number) => {
        const updatedQuestions = enrollmentForm.questions.filter((_, i) => i !== index);
        setEnrollmentForm({ ...enrollmentForm, questions: updatedQuestions });
    };

    const handleRemoveAnswer = (questionIndex: number, answerIndex: number) => {
        const updatedQuestions = [...enrollmentForm.questions];
        updatedQuestions[questionIndex].possible_answers = updatedQuestions[questionIndex].possible_answers.filter((_, i) => i !== answerIndex);
        setEnrollmentForm({ ...enrollmentForm, questions: updatedQuestions });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enrollmentform/create/${courseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(enrollmentForm),
            });

            if (!response.ok) {
                throw new Error('Failed to create course enrollment form');
            }

            router.push('/course-enrollment-forms');
        } catch (error) {
            console.error('Error creating course enrollment form:', error);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Add Course Enrollment Form</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="course-select-label">Course</InputLabel>
                                <Select
                                    labelId="course-select-label"
                                    value={enrollmentForm.course_id}
                                    onChange={handleCourseChange}
                                    required
                                >
                                    {courses.map((course) => (
                                        <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {enrollmentForm.questions.map((question, questionIndex) => (
                            <Grid item xs={12} key={questionIndex}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Question"
                                                    value={question.question}
                                                    onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth>
                                                    <InputLabel id={`question-type-label-${questionIndex}`}>Question Type</InputLabel>
                                                    <Select
                                                        labelId={`question-type-label-${questionIndex}`}
                                                        value={question.question_type}
                                                        onChange={(e) => handleQuestionChange(questionIndex, 'question_type', e.target.value)}
                                                    >
                                                        <MenuItem value="text">Text</MenuItem>
                                                        <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                                                        <MenuItem value="checkbox">Checkbox</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            {(question.question_type === 'multiple-choice' || question.question_type === 'checkbox') && (
                                                <Grid item xs={12}>
                                                    {question.possible_answers.map((answer, answerIndex) => (
                                                        <Box key={answerIndex} display="flex" alignItems="center" mb={1}>
                                                            <TextField
                                                                fullWidth
                                                                label={`Answer ${answerIndex + 1}`}
                                                                value={answer}
                                                                onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
                                                                required
                                                            />
                                                            <IconButton onClick={() => handleRemoveAnswer(questionIndex, answerIndex)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    ))}
                                                    <Button startIcon={<AddIcon />} onClick={() => handleAddAnswer(questionIndex)}>
                                                        Add Answer
                                                    </Button>
                                                </Grid>
                                            )}
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={question.is_required}
                                                            onChange={(e) => handleQuestionChange(questionIndex, 'is_required', e.target.checked)}
                                                        />
                                                    }
                                                    label="Required"
                                                />
                                            </Grid>
                                        </Grid>
                                        <Box mt={2}>
                                            <Button variant="outlined" color="secondary" onClick={() => handleRemoveQuestion(questionIndex)}>
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
                                        checked={enrollmentForm.is_active}
                                        onChange={(e) => setEnrollmentForm({ ...enrollmentForm, is_active: e.target.checked })}
                                    />
                                }
                                label="Active"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Create Enrollment Form
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
}