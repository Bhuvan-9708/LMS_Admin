"use client";

import React, { useState, useEffect } from "react";
import {
    Button,
    FormControlLabel,
    Card,
    CardContent,
    Checkbox,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Snackbar,
    Alert
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material/Select';

const RichTextEditor = dynamic(() => import("@mantine/rte"), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
});

interface Instructor {
    _id: string;
    first_name: string;
    last_name: string;
}

interface Category {
    _id: string;
    name: string;
}

interface BlogPost {
    title: string;
    content: string;
    author: string;
    published_date: Date | null;
    tags: string[];
    meta_url: string[];
    meta_description: string;
    meta_title: string;
    meta_keywords: string[];
    is_active: boolean;
    status: "draft" | "published" | "archived";
    category: string[];
}

export default function CreateBlog() {
    const [blogPost, setBlogPost] = useState<BlogPost>({
        title: "",
        content: "",
        author: "",
        published_date: null,
        tags: [],
        meta_url: [],
        meta_description: "",
        meta_title: "",
        meta_keywords: [],
        is_active: true,
        status: "draft",
        category: [],
    });

    const router = useRouter();
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/instructor`
                );
                const data = await response.json();
                if (data.success) {
                    setInstructors(data.data);
                }
            } catch (error) {
                console.error("Error fetching instructors:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/category/get-all-categories`
                );
                const data = await response.json();
                if (data.success) {
                    setCategories(data.data.categories);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchInstructors();
        fetchCategories();
    }, []);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setBlogPost((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string | string[]>) => {
        const { name, value } = event.target;
        setBlogPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setBlogPost((prev) => ({ ...prev, [name]: checked }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            if (selectedImage) {
                formData.append("blog-image", selectedImage);
            }
            Object.entries(blogPost).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item);
                    });
                } else if (value instanceof Date) {
                    formData.append(key, value.toISOString());
                } else {
                    formData.append(key, value as string);
                }
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/create`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to create blog post");
            }

            const result = await response.json();
            setSnackbar({ open: true, message: "Blog post created successfully!", severity: "success" });
            router.push('/cms/blog');
            resetForm();
        } catch (error) {
            setSnackbar({ open: true, message: "Error creating blog post", severity: "error" });
            console.error("Error creating blog post:", error);
        }
    };

    const resetForm = () => {
        setBlogPost({
            title: "",
            content: "",
            author: "",
            published_date: null,
            tags: [],
            meta_url: [],
            meta_description: "",
            meta_title: "",
            meta_keywords: [],
            is_active: true,
            status: "draft",
            category: [],
        });
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} >
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom > Create New Blog Post </Typography>
                    < form onSubmit={handleSubmit} >
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={blogPost.title}
                            onChange={handleInputChange}
                            required
                            margin="normal"
                        />
                        <RichTextEditor
                            value={blogPost.content}
                            onChange={(value) => setBlogPost(prev => ({ ...prev, content: value }))
                            }
                        />
                        < FormControl fullWidth margin="normal" >
                            <InputLabel id="author-label" > Author </InputLabel>
                            < Select
                                labelId="author-label"
                                id="author"
                                name="author"
                                value={blogPost.author}
                                onChange={handleSelectChange}
                                required
                            >
                                {
                                    instructors.map((instructor) => (
                                        <MenuItem key={instructor._id} value={instructor._id} >
                                            {`${instructor.first_name} ${instructor.last_name}`}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        < DatePicker
                            label="Published Date"
                            value={blogPost.published_date}
                            onChange={(date) => setBlogPost(prev => ({ ...prev, published_date: date }))}
                        />
                        < Box sx={{ mt: 2, mb: 2 }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="raised-button-file" >
                                <Button variant="contained" component="span" >
                                    Upload Image
                                </Button>
                            </label>
                            {
                                imagePreview && (
                                    <Box sx={{ mt: 2 }}>
                                        <Image src={imagePreview} alt="Blog post image preview" width={200} height={200} objectFit="cover" />
                                    </Box>
                                )
                            }
                        </Box>
                        < FormControlLabel
                            control={
                                < Checkbox
                                    checked={blogPost.is_active}
                                    onChange={handleCheckboxChange}
                                    name="is_active"
                                />
                            }
                            label="Is Active"
                        />
                        <FormControl fullWidth margin="normal" >
                            <InputLabel id="status-label" > Status </InputLabel>
                            < Select
                                labelId="status-label"
                                name="status"
                                value={blogPost.status}
                                onChange={(e) => setBlogPost((prev) => ({ ...prev, status: e.target.value as BlogPost["status"] }))}
                                required
                            >
                                <MenuItem value="draft" > Draft </MenuItem>
                                < MenuItem value="published" > Published </MenuItem>
                                < MenuItem value="archived" > Archived </MenuItem>
                            </Select>
                        </FormControl>
                        < Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            Create Blog
                        </Button>
                    </form>
                </CardContent>
            </Card>
            < Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </LocalizationProvider>
    );
}
