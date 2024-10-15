"use client";

import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Button,
    Box,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select'; // Import SelectChangeEvent here
import dynamic from "next/dynamic";
import { useRouter } from 'next/navigation';

const RichTextEditor = dynamic(() => import("@mantine/rte"), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
});

const NOTIFICATION_TYPES = {
    COURSE_LAUNCH: 'COURSE_LAUNCH',
    COURSE_START_REMINDER: 'COURSE_START_REMINDER',
    COURSE_UPDATE: 'COURSE_UPDATE',
    UPCOMING_COURSE: 'UPCOMING_COURSE',
    NEW_USER: 'NEW_USER',
    MOBILE_LOGIN_OTP: 'MOBILE_LOGIN_OTP',
    EMAIL_LOGIN_OTP: 'EMAIL_LOGIN_OTP',
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
    RESET_PASSWORD: 'RESET_PASSWORD',
    NEW_COURSE: 'NEW_COURSE',
    NEW_ENROLLMENT: 'NEW_ENROLLMENT',
    NEW_DISCUSSION: 'NEW_DISCUSSION',
    NEW_COMMENT: 'NEW_COMMENT',
    NEW_QUIZ: 'NEW_QUIZ',
    NEW_ATTENDANCE: 'NEW_ATTENDANCE',
    NEW_ASSESSMENT: 'NEW_ASSESSMENT',
    NEW_GRADE: 'NEW_GRADE',
    NEW_ADMIN_MESSAGE: 'NEW_ADMIN_MESSAGE',
    NEW_INSTRUCTOR_MESSAGE: 'NEW_INSTRUCTOR_MESSAGE',
    NEW_STUDENT_MESSAGE: 'NEW_STUDENT_MESSAGE',
    NEW_TEACHER_MESSAGE: 'NEW_TEACHER_MESSAGE',
    NEW_ADMIN_MESSAGE_REPLY: 'NEW_ADMIN_MESSAGE_REPLY',
    NEW_INSTRUCTOR_MESSAGE_REPLY: 'NEW_INSTRUCTOR_MESSAGE_REPLY',
    NEW_STUDENT_MESSAGE_REPLY: 'NEW_STUDENT_MESSAGE_REPLY',
    INSTRUCTOR_VERIFICATION_MESSAGE: 'INSTRUCTOR_VERIFICATION_MESSAGE'
};

export default function AddEmailTemplate() {
    const [template, setTemplate] = useState({
        notification_type: '',
        subject: '',
        description: '',
        is_active: true,
    });
    const router = useRouter();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = event.target;
        setTemplate(prevState => ({
            ...prevState,
            [name as string]: value,
        }));
    };

    // New handler for Select component
    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setTemplate(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTemplate(prevState => ({
            ...prevState,
            is_active: event.target.checked,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/template/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(template),
            });

            if (!response.ok) {
                throw new Error('Failed to create email template');
            }

            const data = await response.json();
            console.log('Email template created:', data);
            router.push('/cms/templates');
            resetForm();
        } catch (error) {
            console.error('Error creating email template:', error);
            // Show error message to user
        }
    };

    const resetForm = () => {
        setTemplate({
            notification_type: '',
            subject: '',
            description: '',
            is_active: true,
        })
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                    Add Email Template
                </Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="notification-type-label">Notification Type</InputLabel>
                        <Select
                            labelId="notification-type-label"
                            id="notification_type"
                            name="notification_type"
                            value={template.notification_type}
                            onChange={handleSelectChange}
                            required
                        >
                            {Object.entries(NOTIFICATION_TYPES).map(([key, value]) => (
                                <MenuItem key={key} value={value}>
                                    {key.replace(/_/g, ' ')}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Subject"
                        name="subject"
                        value={template.subject}
                        onChange={handleChange}
                        required
                    />
                    <RichTextEditor
                        value={template.description}
                        onChange={(value) => setTemplate(prev => ({ ...prev, description: value }))}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={template.is_active}
                                onChange={handleSwitchChange}
                                name="is_active"
                                color="primary"
                            />
                        }
                        label="Active"
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Create Template
                        </Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    );
}
