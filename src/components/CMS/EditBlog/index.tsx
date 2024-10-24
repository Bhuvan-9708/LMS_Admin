"use client";

import React, { useState, useEffect } from "react";
import {
    Button,
    FormControlLabel,
    Card,
    CardContent,
    Checkbox,
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { SelectChangeEvent } from "@mui/material/Select";
import dynamic from "next/dynamic";
import Image from "next/image";

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
    _id: string;
    title: string;
    content: string;
    author: string[];
    published_date: Date | null;
    image_url: string;
    tags: string[];
    meta_url: string[];
    meta_description: string;
    meta_title: string;
    meta_keywords: string[];
    is_active: boolean;
    status: "draft" | "published" | "archived";
    category: string[];
}

export default function EditBlog({ blogId }: { blogId: string }) {
    const [blogPost, setBlogPost] = useState<BlogPost>({
        _id: "",
        title: "",
        content: "",
        author: [],
        published_date: null,
        image_url: "",
        tags: [],
        meta_url: [],
        meta_description: "",
        meta_title: "",
        meta_keywords: [],
        is_active: true,
        status: "draft",
        category: [],
    });

    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogPost = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blogId}`);
                const data = await response.json();
                if (data.success) {
                    setBlogPost(data.data);
                    setImagePreview(data.data.image_url);
                }
            } catch (error) {
                console.error("Error fetching blog post:", error);
            }
        };

        const fetchInstructors = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/instructor`);
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/get-all-categories`);
                const data = await response.json();
                if (data.success) {
                    setCategories(data.data.categories);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchBlogPost();
        fetchInstructors();
        fetchCategories();
    }, [blogId]);

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setBlogPost((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
        const { name, value } = event.target;
        setBlogPost((prev) => ({
            ...prev,
            [name]: typeof value === "string" ? value.split(",") : value,
        }));
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setBlogPost((prev) => ({ ...prev, [name]: checked }));
    };

    const handleArrayInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number,
        field: keyof BlogPost
    ) => {
        const { value } = event.target;
        setBlogPost((prev) => {
            const updatedField = [...(prev[field] as string[])];
            updatedField[index] = value;
            return { ...prev, [field]: updatedField };
        });
    };

    const handleAddArrayItem = (field: keyof BlogPost) => {
        setBlogPost((prev) => ({
            ...prev,
            [field]: [...(prev[field] as string[]), ""],
        }));
    };

    const handleRemoveArrayItem = (index: number, field: keyof BlogPost) => {
        setBlogPost((prev) => {
            const updatedField = [...(prev[field] as string[])];
            updatedField.splice(index, 1);
            return { ...prev, [field]: updatedField };
        });
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
                formData.append("image", selectedImage);
            }
            formData.append("blogData", JSON.stringify(blogPost));

            const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blogId}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update blog post");
            }

            const result = await response.json();
            console.log("Blog post updated successfully:", result);
            // Handle success (e.g., show a success message, redirect to blog list)
        } catch (error) {
            console.error("Error updating blog post:", error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Edit Blog Post</Typography>
                    <form onSubmit={handleSubmit}>
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
                            onChange={(value) => setBlogPost(prev => ({ ...prev, content: value }))}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="author-label">Author</InputLabel>
                            <Select
                                multiple
                                id="author"
                                name="author"
                                value={blogPost.author}
                                onChange={handleSelectChange}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {(selected as string[]).map((value) => {
                                            const instructor = instructors.find(i => i._id === value);
                                            return (
                                                <Chip
                                                    key={value}
                                                    label={instructor ? `${instructor.first_name} ${instructor.last_name}` : value}
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                            >
                                {instructors.map((instructor) => (
                                    <MenuItem key={instructor._id} value={instructor._id}>
                                        {`${instructor.first_name} ${instructor.last_name}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <DatePicker
                            label="Published Date"
                            value={blogPost.published_date}
                            onChange={(date) => setBlogPost(prev => ({ ...prev, published_date: date }))}
                        />
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="raised-button-file">
                                <Button variant="contained" component="span">
                                    Upload Image
                                </Button>
                            </label>
                            {imagePreview && (
                                <Box sx={{ mt: 2 }}>
                                    <Image src={imagePreview} alt="Blog post image preview" width={200} height={200} objectFit="cover" />
                                </Box>
                            )}
                        </Box>
                        {blogPost.tags.map((tag, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    label={`Tag ${index + 1}`}
                                    value={tag}
                                    onChange={(e) => handleArrayInputChange(e, index, 'tags')}
                                    margin="normal"
                                />
                                <Button
                                    onClick={() => handleRemoveArrayItem(index, 'tags')}
                                    color="secondary"
                                    variant="contained"
                                    style={{ marginLeft: '10px' }}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button onClick={() => handleAddArrayItem('tags')}>Add Tag</Button>
                        {blogPost.meta_url.map((url, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    label={`Meta URL ${index + 1}`}
                                    value={url}
                                    onChange={(e) => handleArrayInputChange(e, index, 'meta_url')}
                                    margin="normal"
                                />
                                <Button
                                    onClick={() => handleRemoveArrayItem(index, 'meta_url')}
                                    color="secondary"
                                    variant="contained"
                                    style={{ marginLeft: '10px' }}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button onClick={() => handleAddArrayItem('meta_url')}>Add Meta URL</Button>
                        <TextField
                            fullWidth
                            label="Meta Description"
                            name="meta_description"
                            value={blogPost.meta_description}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Meta Title"
                            name="meta_title"
                            value={blogPost.meta_title}
                            onChange={handleInputChange}
                            margin="normal"
                        />
                        {blogPost.meta_keywords.map((keyword, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    label={`Meta Keyword ${index + 1}`}
                                    value={keyword}
                                    onChange={(e) => handleArrayInputChange(e, index, 'meta_keywords')}
                                    margin="normal"
                                />
                                <Button
                                    onClick={() => handleRemoveArrayItem(index, 'meta_keywords')}
                                    color="secondary"
                                    variant="contained"
                                    style={{ marginLeft: '10px' }}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button onClick={() => handleAddArrayItem('meta_keywords')}>Add Meta Keyword</Button>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={blogPost.is_active}
                                    onChange={handleCheckboxChange}
                                    name="is_active"
                                />
                            }
                            label="Is Active"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                name="status"
                                value={blogPost.status}
                                onChange={(e) => setBlogPost((prev) => ({ ...prev, status: e.target.value as BlogPost["status"] }))}
                                required
                            >
                                <MenuItem value="draft">Draft</MenuItem>
                                <MenuItem value="published">Published</MenuItem>
                                <MenuItem value="archived">Archived</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="category-label">Categories</InputLabel>
                            <Select
                                labelId="category-label"
                                name="category"
                                multiple
                                value={blogPost.category}
                                onChange={handleSelectChange}
                                required
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Update Blog Post
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </LocalizationProvider>
    );
}