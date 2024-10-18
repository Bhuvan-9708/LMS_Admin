'use client'

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
    FormControlLabel,
    Switch,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { SelectChangeEvent } from '@mui/material';

interface NavigationBar {
    name: string;
    link: string;
}

interface PopularCategory {
    category: string;
    background_color: string;
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
    section_working: string;
    popular_category_heading: string;
    popular_category_text: string;
    popular_categories: PopularCategory[];
    popular_course_title: string;
    popular_course_heading: string;
    popular_course_text: string;
    popular_courses: string[];
    upcoming_course_title: string;
    upcoming_course_heading: string;
    upcoming_course_text: string;
    upcoming_courses: string[];
    upcoming_webinar_title: string;
    upcoming_webinar_heading: string;
    upcoming_webinar_text: string;
    upcoming_webinar: string[];
    banner: string[];
    about: string;
    article_main: string;
    article_title: string;
    article_heading: string;
    article_description: string;
    articles: string[];
    testimonials_title: string;
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
    slug: string;
}

export default function AddHomepageForm() {
    const [homepage, setHomepage] = useState<Homepage>({
        header_logo: null,
        header_text: '',
        title: '',
        sub_title: '',
        navigation_bars: [],
        image: null,
        section_working: '',
        popular_category_heading: '',
        popular_category_text: '',
        popular_categories: [],
        popular_course_title: '',
        popular_course_heading: '',
        popular_course_text: '',
        popular_courses: [],
        upcoming_course_title: '',
        upcoming_course_heading: '',
        upcoming_course_text: '',
        upcoming_courses: [],
        upcoming_webinar_title: '',
        upcoming_webinar_heading: '',
        upcoming_webinar_text: '',
        upcoming_webinar: [],
        banner: [],
        about: '',
        article_main: '',
        article_title: '',
        article_heading: '',
        article_description: '',
        articles: [],
        testimonials_title: '',
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
        slug: '',
    });

    const [categories, setCategories] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [banners, setBanners] = useState<any[]>([]);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [courseReviews, setCourseReviews] = useState<any[]>([]);
    const [sectionWorkings, setSectionWorkings] = useState<any[]>([]);
    const [aboutUs, setAboutUs] = useState<any[]>([]);

    const router = useRouter();

    useEffect(() => {
        fetchCategories();
        fetchCourses();
        fetchEvents();
        fetchBanners();
        fetchBlogs();
        fetchCourseReviews();
        fetchSectionWorkings();
        fetchAboutUs();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/get-all-categories`);
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course`);
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/event/get-all-events`);
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banner`);
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/`);
            const data = await response.json();
            setBlogs(data.data.blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const fetchCourseReviews = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/`);
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

    const fetchSectionWorkings = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/section-working/`);
            const data = await response.json();
            setSectionWorkings(data.data);
        } catch (error) {
            console.error('Error fetching section workings:', error);
        }
    };

    const fetchAboutUs = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about-us/`);
            const data = await response.json();
            setAboutUs(data.data);
        } catch (error) {
            console.error('Error fetching about us:', error);
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

    const handleArrayInputChange = (index: number, field: keyof Homepage, subField: string, value: string) => {
        setHomepage(prev => {
            const newArray = [...(prev[field] as any[])];
            newArray[index] = { ...newArray[index], [subField]: value };
            return { ...prev, [field]: newArray };
        });
    };

    const handleAddArrayItem = (field: keyof Homepage, newItem: any = {}) => {
        setHomepage(prev => ({
            ...prev,
            [field]: [...(prev[field] as any[]), newItem]
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
    
        Object.entries(homepage).forEach(([key, value]) => {
            if (value instanceof File) {
                // If the value is a File, append it directly
                formData.append(key, value);
            } else if (Array.isArray(value)) {
                // For arrays of objects, append each object property individually
                value.forEach((item, index) => {
                    if (typeof item === 'object' && item !== null) {
                        // Append each key-value pair within the object
                        Object.entries(item).forEach(([subKey, subValue]) => {
                            if (typeof subValue === 'string' || subValue instanceof Blob) {
                                formData.append(`${key}[${index}][${subKey}]`, subValue);
                            } else if (subValue !== null && subValue !== undefined) {
                                formData.append(`${key}[${index}][${subKey}]`, String(subValue));
                            }
                        });
                    } else {
                        // If not an object, append as a simple array element
                        formData.append(`${key}[]`, String(item));
                    }
                });
            } else if (typeof value === 'boolean') {
                // Convert boolean to string
                formData.append(key, value.toString());
            } else if (value !== null && value !== undefined) {
                // Append other non-null values directly
                formData.append(key, value);
            }
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
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('navigation_bars', { name: '', link: '' })}>
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

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Section Working</InputLabel>
                        <Select
                            value={homepage.section_working}
                            onChange={(e) => setHomepage(prev => ({ ...prev, section_working: e.target.value }))}
                        >
                            {sectionWorkings.map((section) => (
                                <MenuItem key={section._id} value={section._id}>{section.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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

                    <Typography variant="h6" gutterBottom>Popular Categories</Typography>
                    {homepage.popular_categories.map((cat, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>

                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={cat.category}
                                    onChange={(e) => handleArrayInputChange(index, 'popular_categories', 'category', e.target.value)}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Background Color"
                                value={cat.background_color}
                                onChange={(e) => handleArrayInputChange(index, 'popular_categories', 'background_color', e.target.value)}
                            />
                            <IconButton onClick={() => handleRemoveArrayItem('popular_categories', index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('popular_categories', { category: '', background_color: '' })}>
                        Add Popular Category
                    </Button>

                    <TextField
                        fullWidth
                        label="Popular Course Title"
                        name="popular_course_title"
                        value={homepage.popular_course_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
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
                                <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Upcoming Course Title"
                        name="upcoming_course_title"
                        value={homepage.upcoming_course_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
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
                                <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Upcoming Webinar Title"
                        name="upcoming_webinar_title"
                        value={homepage.upcoming_webinar_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
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
                                <MenuItem key={event._id} value={event._id}>{event.title}</MenuItem>
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
                                <MenuItem key={banner._id} value={banner._id}>{banner.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>About Us</InputLabel>
                        <Select
                            value={homepage.about}
                            onChange={(e) => setHomepage(prev => ({ ...prev, about: e.target.value }))}
                        >
                            {aboutUs.map((about) => (
                                <MenuItem key={about._id} value={about._id}>{about.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Article Main"
                        name="article_main"
                        value={homepage.article_main}
                        onChange={handleInputChange}
                        margin="normal"
                    />
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
                                <MenuItem key={blog._id} value={blog._id}>{blog.title}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Testimonials Title"
                        name="testimonials_title"
                        value={homepage.testimonials_title}
                        onChange={handleInputChange}
                        margin="normal"
                    />
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
                        <InputLabel>Testimonials</InputLabel>
                        <Select
                            multiple
                            value={homepage.testimonials}
                            onChange={(e) => handleMultiSelectChange(e, 'testimonials')}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).map((value) => (
                                        <Chip key={value} label={courseReviews.find(review => review._id === value)?.review || value} />
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
                    <Button startIcon={<AddIcon />} onClick={() => handleAddArrayItem('faqs', { question: '', answer: '' })}>
                        Add FAQ
                    </Button>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={homepage.is_active}
                                onChange={(e) => setHomepage(prev => ({ ...prev, is_active: e.target.checked }))}
                                name="is_active"
                            />
                        }
                        label="Is Active"
                    />

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

                    <TextField
                        fullWidth
                        label="Slug"
                        name="slug"
                        value={homepage.slug}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                    />

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Create Homepage
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}