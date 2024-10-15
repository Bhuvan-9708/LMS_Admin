"use client"

import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Box,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material';

interface NavigationBar {
    name: string;
    link: string;
}

interface WhatYouCanDo {
    title: string;
    image_icon: File | null;
    short_description: string;
    description: string;
    image: File | null;
}

interface AboutUsDescription {
    title: string;
    description: string;
}

interface PointsDescription {
    title: string;
    description: string;
    image: File | null;
}

interface FAQ {
    question: string;
    answer: string;
}

interface Homepage {
    header_logo: File | null;
    header_text: string;
    title: string;
    sub_title: string;
    navigation_bars: NavigationBar[];
    image: File | null;
    what_you_can_do_heading: string;
    what_you_can_do_text: string;
    what_you_can_do: WhatYouCanDo[];
    popular_category_heading: string;
    popular_category_text: string;
    popular_categories: string[];
    popular_course_heading: string;
    popular_course_text: string;
    popular_courses: string[];
    upcoming_course_heading: string;
    upcoming_course_text: string;
    upcoming_courses: string[];
    upcoming_webinar_heading: string;
    upcoming_webinar_text: string;
    upcoming_webinar: string[];
    banner: string[];
    about_us_text: string;
    about_us_heading: string;
    about_us_image: File | null;
    about_us_sub_heading: string;
    about_us_description: AboutUsDescription[];
    points_title: string;
    points_heading: string;
    points_sub_title: string;
    points_description: PointsDescription[];
    article_title: string;
    article_heading: string;
    article_description: string;
    articles: string[];
    testimonials_heading: string;
    testimonials_sub_title: string;
    testimonials: string[];
    faq_title: string;
    faq_heading: string;
    faqs: FAQ[];
    is_active: boolean;
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
    seo_url: string;
}

export default function AddHomepageForm() {
    const [homepage, setHomepage] = useState<Homepage>({
        header_logo: null,
        header_text: '',
        title: '',
        sub_title: '',
        navigation_bars: [],
        image: null,
        what_you_can_do_heading: '',
        what_you_can_do_text: '',
        what_you_can_do: [],
        popular_category_heading: '',
        popular_category_text: '',
        popular_categories: [],
        popular_course_heading: '',
        popular_course_text: '',
        popular_courses: [],
        upcoming_course_heading: '',
        upcoming_course_text: '',
        upcoming_courses: [],
        upcoming_webinar_heading: '',
        upcoming_webinar_text: '',
        upcoming_webinar: [],
        banner: [],
        about_us_text: '',
        about_us_heading: '',
        about_us_image: null,
        about_us_sub_heading: '',
        about_us_description: [],
        points_title: '',
        points_heading: '',
        points_sub_title: '',
        points_description: [],
        article_title: '',
        article_heading: '',
        article_description: '',
        articles: [],
        testimonials_heading: '',
        testimonials_sub_title: '',
        testimonials: [],
        faq_title: '',
        faq_heading: '',
        faqs: [],
        is_active: true,
        meta_title: '',
        meta_description: '',
        meta_keywords: [],
        seo_url: '',
    });

    const [categories, setCategories] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [banners, setBanners] = useState<any[]>([]);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [courseReviews, setCourseReviews] = useState<any[]>([]);

    const router = useRouter();

    useEffect(() => {
        fetchCategories();
        fetchCourses();
        fetchEvents();
        fetchBanners();
        fetchBlogs();
        fetchCourseReviews();
    }, []);

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
            console.error('Error fetching categories:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/course`
            );
            const data = await response.json();
            if (data.success) {
                setCourses(data.data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/event/get-all-events`
            );
            const data = await response.json();
            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchBanners = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/banner`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch banners");
            }
            const data = await response.json();
            setBanners(data.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    const fetchBlogs = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/blog/`
            );
            const data = await response.json();
            setBlogs(data.data.blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const fetchCourseReviews = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/`
            );
            const data = await response.json();
            if (data.success && data.data) {
                setCourseReviews(data.data);
            } else {
                console.error('Unexpected API response:', data);
            }
        } catch (error) {
            console.error('Error fetching course reviews:', error);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setHomepage(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof Homepage) => {
        const file = event.target.files?.[0] || null;
        setHomepage(prev => ({ ...prev, [field]: file }));
    };

    const handleArrayInputChange = (index: number, field: keyof Homepage, subField: string, value: string | File) => {
        setHomepage(prev => {
            const newArray = [...(prev[field] as any[])];
            newArray[index] = { ...newArray[index], [subField]: value };
            return { ...prev, [field]: newArray };
        });
    };

    const handleAddArrayItem = (field: keyof Homepage) => {
        setHomepage(prev => ({
            ...prev,
            [field]: [...(prev[field] as any[]), {}]
        }));
    };

    const handleRemoveArrayItem = (field: keyof Homepage, index: number) => {
        setHomepage(prev => ({
            ...prev,
            [field]: (prev[field] as any[]).filter((_, i) => i !== index)
        }));
    };

    const handleMultiSelectChange = (event: SelectChangeEvent<string[]>, field: keyof Homepage) => {
        const {
            target: { value }
        } = event;
        setHomepage(prev => ({
            ...prev,
            [field]: typeof value === 'string' ? value.split(',') : value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();

        // Append all text fields
        Object.entries(homepage).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'boolean') {
                formData.append(key, value.toString());
            } else if (Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            }
        });

        // Append file fields
        if (homepage.header_logo) formData.append('header_logo', homepage.header_logo);
        if (homepage.image) formData.append('image', homepage.image);
        if (homepage.about_us_image) formData.append('about_us_image', homepage.about_us_image);

        // Append What You Can Do images
        homepage.what_you_can_do.forEach((item, index) => {
            if (item.image_icon) formData.append(`what_you_can_do[${index}][image_icon]`, item.image_icon);
            if (item.image) formData.append(`what_you_can_do[${index}][image]`, item.image);
        });

        // Append Points Description images
        homepage.points_description.forEach((item, index) => {
            if (item.image) formData.append(`points_description[${index}][image]`, item.image);
        });

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/home/create`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Failed to create homepage');
            }

            const result = await response.json();
            console.log('Homepage created successfully:', result);
            router.push('/cms/homepage');
        } catch (error) {
            console.error('Error creating homepage:', error);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Add New Homepage</Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 2 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="header-logo-upload"
                            type="file"
                            onChange={(e) => handleFileChange(e, 'header_logo')}
                        />
                        <label htmlFor="header-logo-upload">
                            <Button variant="contained" component="span">
                                Upload Header Logo
                            </Button>
                        </label>
                        {homepage.header_logo && <Typography variant="body2">{homepage.header_logo.name}</Typography>}
                    </Box>

                    <TextField
                        fullWidth
                        label="Header Text"
                        name="header_text"
                        value={homepage.header_text}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={homepage.title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Sub Title"
                        name="sub_title"
                        value={homepage.sub_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <Typography variant="h6" gutterBottom>Navigation Bars</Typography>
                    {homepage.navigation_bars.map((nav, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                label="Name"
                                value={nav.name}
                                onChange={(e) => handleArrayInputChange(index, 'navigation_bars', 'name', e.target.value)}
                            />
                            <TextField
                                label="Link"
                                value={nav.link}
                                onChange={(e) => handleArrayInputChange(index, 'navigation_bars', 'link', e.target.value)}
                            />
                            <IconButton onClick={() => handleRemoveArrayItem('navigation_bars', index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('navigation_bars')}>
                        Add Navigation Bar
                    </Button>

                    <Box sx={{ mb: 2, mt: 2 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="main-image-upload"
                            type="file"
                            onChange={(e) => handleFileChange(e, 'image')}
                        />
                        <label htmlFor="main-image-upload">
                            <Button variant="contained" component="span">
                                Upload Main Image
                            </Button>
                        </label>
                        {homepage.image && <Typography variant="body2">{homepage.image.name}</Typography>}
                    </Box>

                    <TextField
                        fullWidth
                        label="What You Can Do Heading"
                        name="what_you_can_do_heading"
                        value={homepage.what_you_can_do_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="What You Can Do Text"
                        name="what_you_can_do_text"
                        value={homepage.what_you_can_do_text}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <Typography variant="h6" gutterBottom>What You Can Do</Typography>
                    {homepage.what_you_can_do.map((item, index) => (
                        <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={item.title}
                                onChange={(e) => handleArrayInputChange(index, 'what_you_can_do', 'title', e.target.value)}
                                margin="normal"
                            />
                            <Box sx={{ mb: 2 }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id={`what - you - can -do -icon - ${index}`}
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleArrayInputChange(index, 'what_you_can_do', 'image_icon', file);
                                        }
                                    }
                                    }
                                />
                                <label htmlFor={`what - you - can -do -icon - ${index}`}>
                                    <Button variant="contained" component="span">
                                        Upload Icon
                                    </Button>
                                </label>
                                {item.image_icon && <Typography variant="body2">{item.image_icon.name}</Typography>}
                            </Box>
                            <TextField
                                fullWidth
                                label="Short Description"
                                value={item.short_description}

                                onChange={(e) => handleArrayInputChange(index, 'what_you_can_do', 'short_description', e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={item.description}
                                onChange={(e) => handleArrayInputChange(index, 'what_you_can_do', 'description', e.target.value)}
                                margin="normal"
                                multiline
                                rows={3}
                            />
                            <Box sx={{ mb: 2 }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id={`what - you - can -do -image - ${index}`}
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleArrayInputChange(index, 'what_you_can_do', 'image', file);
                                        }
                                    }}
                                />
                                <label htmlFor={`what - you - can -do -image - ${index}`}>
                                    <Button variant="contained" component="span">
                                        Upload Image
                                    </Button>
                                </label>
                                {item.image && <Typography variant="body2">{item.image.name}</Typography>}
                            </Box>
                            <IconButton onClick={() => handleRemoveArrayItem('what_you_can_do', index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('what_you_can_do')}>
                        Add What You Can Do Item
                    </Button>

                    <TextField
                        fullWidth
                        label="Popular Category Heading"
                        name="popular_category_heading"
                        value={homepage.popular_category_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Popular Category Text"
                        name="popular_category_text"
                        value={homepage.popular_category_text}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Popular Categories</InputLabel>
                        <Select
                            multiple
                            value={homepage.popular_categories}
                            onChange={(e) => handleMultiSelectChange(e, 'popular_categories')}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).map((value) => (
                                        <Chip key={value} label={categories.find(cat => cat._id === value)?.name || value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category._id} value={category._id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Popular Course Heading"
                        name="popular_course_heading"
                        value={homepage.popular_course_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Popular Course Text"
                        name="popular_course_text"
                        value={homepage.popular_course_text}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Popular Courses</InputLabel>
                        <Select
                            multiple
                            value={homepage.popular_courses}
                            onChange={(e) => handleMultiSelectChange(e, 'popular_courses')}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).map((value) => (
                                        <Chip key={value} label={courses.find(course => course._id === value)?.title || value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {courses.map((course) => (
                                <MenuItem key={course._id} value={course._id}>
                                    {course.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Upcoming Course Heading"
                        name="upcoming_course_heading"
                        value={homepage.upcoming_course_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Upcoming Course Text"
                        name="upcoming_course_text"
                        value={homepage.upcoming_course_text}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Upcoming Courses</InputLabel>
                        <Select
                            multiple
                            value={homepage.upcoming_courses}
                            onChange={(e) => handleMultiSelectChange(e, 'upcoming_courses')}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).map((value) => (
                                        <Chip key={value} label={courses.find(course => course._id === value)?.title || value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {courses.map((course) => (
                                <MenuItem key={course._id} value={course._id}>
                                    {course.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Upcoming Webinar Heading"
                        name="upcoming_webinar_heading"
                        value={homepage.upcoming_webinar_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Upcoming Webinar Text"
                        name="upcoming_webinar_text"
                        value={homepage.upcoming_webinar_text}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Upcoming Webinars</InputLabel>
                        <Select
                            multiple
                            value={homepage.upcoming_webinar}
                            onChange={(e) => handleMultiSelectChange(e, 'upcoming_webinar')}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).map((value) => (
                                        <Chip key={value} label={events.find(event => event._id === value)?.title || value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {events.map((event) => (
                                <MenuItem key={event._id} value={event._id}>
                                    {event.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Banners</InputLabel>
                        <Select
                            multiple
                            value={homepage.banner}
                            onChange={(e) => handleMultiSelectChange(e, 'banner')}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).map((value) => (
                                        <Chip key={value} label={banners.find(banner => banner._id === value)?.title || value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {banners.map((banner) => (
                                <MenuItem key={banner._id} value={banner._id}>
                                    {banner.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="About Us Text"
                        name="about_us_text"
                        value={homepage.about_us_text}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="About Us Heading"
                        name="about_us_heading"
                        value={homepage.about_us_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <Box sx={{ mb: 2, mt: 2 }}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="about-us-image-upload"
                            type="file"
                            onChange={(e) => handleFileChange(e, 'about_us_image')}
                        />
                        <label htmlFor="about-us-image-upload">
                            <Button variant="contained" component="span">
                                Upload About Us Image
                            </Button>
                        </label>
                        {homepage.about_us_image && <Typography variant="body2">{homepage.about_us_image.name}</Typography>}
                    </Box>
                    <TextField
                        fullWidth
                        label="About Us Sub Heading"
                        name="about_us_sub_heading"
                        value={homepage.about_us_sub_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <Typography variant="h6" gutterBottom>About Us Description</Typography>
                    {homepage.about_us_description.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                label="Title"
                                value={item.title}
                                onChange={(e) => handleArrayInputChange(index, 'about_us_description', 'title', e.target.value)}
                            />
                            <TextField
                                label="Description"
                                value={item.description}
                                onChange={(e) => handleArrayInputChange(index, 'about_us_description', 'description', e.target.value)}
                            />
                            <IconButton onClick={() => handleRemoveArrayItem('about_us_description', index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('about_us_description')}>
                        Add About Us Description
                    </Button>

                    <TextField
                        fullWidth
                        label="Points Title"
                        name="points_title"
                        value={homepage.points_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Points Heading"
                        name="points_heading"
                        value={homepage.points_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Points Sub Title"
                        name="points_sub_title"
                        value={homepage.points_sub_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <Typography variant="h6" gutterBottom>Points Description</Typography>
                    {homepage.points_description.map((item, index) => (
                        <Box key={index} sx={{ border: '1px solid #ccc', p: 2, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={item.title}
                                onChange={(e) => handleArrayInputChange(index, 'points_description', 'title', e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={item.description}
                                onChange={(e) => handleArrayInputChange(index, 'points_description', 'description', e.target.value)}
                                margin="normal"
                                multiline
                                rows={3}
                            />
                            <Box sx={{ mb: 2 }}>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id={`points - description - image - ${index} `}
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleArrayInputChange(index, 'points_description', 'image', file);
                                        }
                                    }}
                                />
                                <label htmlFor={`points - description - image - ${index} `}>
                                    <Button variant="contained" component="span">
                                        Upload Image
                                    </Button>
                                </label>
                                {item.image && <Typography variant="body2">{item.image.name}</Typography>}
                            </Box>
                            <IconButton onClick={() => handleRemoveArrayItem('points_description', index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('points_description')}>
                        Add Points Description
                    </Button>

                    <TextField
                        fullWidth
                        label="Article Title"
                        name="article_title"
                        value={homepage.article_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Article Heading"
                        name="article_heading"
                        value={homepage.article_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Article Description"
                        name="article_description"
                        value={homepage.article_description}
                        onChange={handleInputChange}
                        margin="normal"
                        multiline
                        rows={3}
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Articles</InputLabel>
                        <Select
                            multiple
                            value={homepage.articles}
                            onChange={(e) => handleMultiSelectChange(e, 'articles')}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).map((value) => (
                                        <Chip key={value} label={blogs.find(blog => blog._id === value)?.title || value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {blogs.map((blog) => (
                                <MenuItem key={blog._id} value={blog._id}>
                                    {blog.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Testimonials Heading"
                        name="testimonials_heading"
                        value={homepage.testimonials_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Testimonials Sub Title"
                        name="testimonials_sub_title"
                        value={homepage.testimonials_sub_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <FormControl fullWidth margin="normal">
        //                 <InputLabel>Testimonials</InputLabel>
        //                 <Select
                            multiple
                            value={homepage.testimonials}  // Ensure this state stores the selected testimonial IDs
                            onChange={(e) => handleMultiSelectChange(e, 'testimonials')}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).map((value) => (
                                        <Chip
                                            key={value}
                                            label={
                                                courseReviews.find(review => review._id === value)?.review || value
                                            }
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {courseReviews.map((review) => (
                                <MenuItem key={review._id} value={review._id}>
                                    {review.review} - Rated: {review.rating} ⭐
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="FAQ Title"
                        name="faq_title"
                        value={homepage.faq_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="FAQ Heading"
                        name="faq_heading"
                        value={homepage.faq_heading}
                        onChange={handleInputChange}
                        margin="normal"
                    />

                    <Typography variant="h6" gutterBottom>FAQs</Typography>
                    {homepage.faqs.map((faq, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                label="Question"
                                value={faq.question}
                                onChange={(e) => handleArrayInputChange(index, 'faqs', 'question', e.target.value)}
                            />
                            <TextField
                                label="Answer"
                                value={faq.answer}
                                onChange={(e) => handleArrayInputChange(index, 'faqs', 'answer', e.target.value)}
                            />
                            <IconButton onClick={() => handleRemoveArrayItem('faqs', index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('faqs')}>
                        Add FAQ
                    </Button>

                    <TextField
                        fullWidth
                        label="Meta Title"
                        name="meta_title"
                        value={homepage.meta_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Meta Description"
                        name="meta_description"
                        value={homepage.meta_description}
                        onChange={handleInputChange}
                        margin="normal"
                        multiline
                        rows={3}
                    />

                    <Typography variant="h6" gutterBottom>Meta Keywords</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {homepage.meta_keywords.map((keyword, index) => (
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
                                setHomepage(prev => ({
                                    ...prev,
                                    meta_keywords: [...prev.meta_keywords, target.value]
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
                        value={homepage.seo_url}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Create Homepage
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}