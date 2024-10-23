'use client'

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, Checkbox, FormControl, FormControlLabel, Grid,
  InputLabel, MenuItem, Select, TextField, Typography, CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@mantine/rte"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    special_price: '',
    duration: '',
    special_price_from: null,
    special_price_to: null,
    image: null,
    syllabus: null,
    instructor: [],
    is_active: true,
    course_level: 'beginner',
    course_category: [],
    sessions: 1,
    status: 'pending',
    is_featured: false,
    is_popular: false,
    is_new: false,
    is_upcoming: false,
    enrolled_users: 0,
    averageRating: 0,
    totalReviews: 0,
    reviews: [],
    description: '',
    start_time: '',
    start_date: null,
    languages: [],
    tools_and_technology: [],
    tags: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    meta_url: '',
    course_includes: [],
    your_learning: {
      title: '',
      tags: [''],
      text: '',
      points: [''],
    },
    for_whom: {
      title: '',
      tags: [''],
      text: '',
      points: [''],
    },
    certification_text: '',
    certification_points: [],
    certificate_image: null,
  });

  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch data from the API
      const [instructorsResponse, categoriesResponse, reviewResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/instructor`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/get-all-categories`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/`),
      ]);

      // Check for successful responses
      const instructorsData = await instructorsResponse.json();
      const categoriesData = await categoriesResponse.json();
      const reviewData = await reviewResponse.json();

      if (instructorsData.success) {
        setInstructors(instructorsData.data);
      } else {
        console.error('Failed to fetch instructors:', instructorsData.message);
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data.categories);
      } else {
        console.error('Failed to fetch categories:', categoriesData.message);
      }

      if (reviewData.success) {
        setReviews(reviewData.data);
      } else {
        console.error('Failed to fetch reviews:', reviewData.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const keys = name.split('.');
    if (keys.length === 2) {
      setFormData((prevData) => ({
        ...prevData,
        [keys[0]]: {
          ...prevData[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    console.log(formData); // Check if state updates correctly
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: checked
    }));
  };

  const handleDateChange = (date, fieldName) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: date
    }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (files && files.length > 0) {
      setFormData(prevData => ({
        ...prevData,
        [name]: files[0]
      }));
    }
  };

  const handleArrayChange = (index, value, field, nestedField) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      if (nestedField) {
        newData[field][nestedField][index] = value;
      } else {
        newData[field][index] = value;
      }
      return newData;
    });
  };

  const handleAddArrayItem = (field, nestedField) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      if (nestedField) {
        newData[field][nestedField].push('');
      } else {
        newData[field].push('');
      }
      return newData;
    });
  };

  const handleRemoveArrayItem = (index, field, nestedField) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      if (nestedField) {
        newData[field][nestedField] = newData[field][nestedField].filter((_, i) => i !== index);
      } else {
        newData[field] = newData[field].filter((_, i) => i !== index);
      }
      return newData;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();

    // Append files correctly
    if (formData.image) formDataToSend.append('image', formData.image);
    if (formData.certificate_image) formDataToSend.append('certificate_image', formData.certificate_image);
    if (formData.syllabus) formDataToSend.append('syllabus', formData.syllabus);

    // Append other non-file fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!['image', 'certificate_image', 'syllabus'].includes(key)) {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/new-course`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create course: ${errorData.message}`);
      }

      const result = await response.json();
      console.log('Course created successfully:', result);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>Create New Course</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Special Price"
                name="special_price"
                type="number"
                value={formData.special_price}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Special Price From"
                value={formData.special_price_from}
                onChange={(date) => handleDateChange(date, 'special_price_from')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Special Price To"
                value={formData.special_price_to}
                onChange={(date) => handleDateChange(date, 'special_price_to')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                placeholder="6-10 Week"
                fullWidth
                label="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file-image"
                type="file"
                name="image"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file-image">
                <Button variant="contained" component="span">
                  Upload Course Image
                </Button>
              </label>
              {formData.image && <Typography>{formData.image.name}</Typography>}
            </Grid>

            <Grid item xs={12}>
              <input
                accept="application/pdf"
                style={{ display: 'none' }}
                id="raised-button-file-syllabus"
                type="file"
                name="syllabus"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file-syllabus">
                <Button variant="contained" component="span">
                  Upload Syllabus PDF
                </Button>
              </label>
              {formData.syllabus && <Typography>{formData.syllabus.name}</Typography>}
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="instructor-label">Instructors</InputLabel>
                <Select
                  labelId="instructor-label"
                  multiple
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleSelectChange}
                  required
                >
                  {instructors.map((instructor) => (
                    <MenuItem key={instructor._id} value={instructor._id}>
                      {`${instructor.first_name} ${instructor.last_name}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_active}
                    onChange={handleCheckboxChange}
                    name="is_active"
                  />
                }
                label="Is Active"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="course-level-label">Course Level</InputLabel>
                <Select
                  labelId="course-level-label"
                  name="course_level"
                  value={formData.course_level}
                  onChange={handleSelectChange}
                  required
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="expert">Expert</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="course-category-label">Course Categories</InputLabel>
                <Select
                  labelId="course-category-label"
                  multiple
                  name="course_category"
                  value={formData.course_category}
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
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="course-review">Course Review</InputLabel>
                <Select
                  labelId="course-review"
                  multiple
                  name="reviews"
                  value={formData.reviews} // Bind to the state
                  onChange={handleSelectChange}
                  required
                >
                  {reviews?.map((review) => (
                    <MenuItem key={review._id} value={review._id}>
                      {review.review}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData(prevData => ({ ...prevData, description: value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Start Time"
                name="start_time"
                type="time"
                value={formData.start_time}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Start Date"
                value={formData.start_date}
                onChange={(date) => handleDateChange(date, 'start_date')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="languages-label">Languages</InputLabel>
                <Select
                  labelId="languages-label"
                  multiple
                  name="languages"
                  value={formData.languages}
                  onChange={handleSelectChange}
                >
                  {['English', 'Spanish', 'French', 'German', 'Chinese'].map((language) => (
                    <MenuItem key={language} value={language}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {formData.tools_and_technology.map((tool, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Tool/Technology ${index + 1}`}
                  value={tool}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'tools_and_technology')}
                />
                <Button onClick={() => handleRemoveArrayItem(index, 'tools_and_technology')}>Remove</Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddArrayItem('tools_and_technology')}>Add Tool/Technology</Button>
            </Grid>
            {formData.tags.map((tag, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Tag ${index + 1}`}
                  value={tag}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'tags')}
                />
                <Button onClick={() => handleRemoveArrayItem(index, 'tags')}>Remove</Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddArrayItem('tags')}>Add Tag</Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Title"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Description"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Keywords"
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta URL"
                name="meta_url"
                value={formData.meta_url}
                onChange={handleInputChange}
              />
            </Grid>
            {formData.course_includes.map((item, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Course Include ${index + 1}`}
                  value={item}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'course_includes')}
                />
                <Button onClick={() => handleRemoveArrayItem(index, 'course_includes')}>Remove</Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddArrayItem('course_includes')}>Add Course Include</Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Your Learning</Typography>
              <TextField
                fullWidth
                label="Title"
                name="your_learning.title"
                value={formData.your_learning.title}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Text"
                name="your_learning.text"
                value={formData.your_learning.text}
                onChange={handleInputChange}
                multiline
                rows={3}
              />

              {formData.your_learning.tags.map((tag, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label={`Tag ${index + 1}`}
                    value={tag}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'your_learning', 'tags')}
                  />
                  <Button onClick={() => handleRemoveArrayItem(index, 'your_learning', 'tags')}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={() => handleAddArrayItem('your_learning', 'tags')}>Add Tag</Button>

              {formData.your_learning.points.map((point, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label={`Point ${index + 1}`}
                    value={point}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'your_learning', 'points')}
                  />
                  <Button onClick={() => handleRemoveArrayItem(index, 'your_learning', 'points')}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={() => handleAddArrayItem('your_learning', 'points')}>Add Point</Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">For Whom</Typography>
              <TextField
                fullWidth
                label="Title"
                name="for_whom.title"
                value={formData.for_whom.title}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                label="Text"
                name="for_whom.text"
                value={formData.for_whom.text}
                onChange={handleInputChange}
                multiline
                rows={3}
              />

              {formData.for_whom.tags.map((tag, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label={`Tag ${index + 1}`}
                    value={tag}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'for_whom', 'tags')}
                  />
                  <Button onClick={() => handleRemoveArrayItem(index, 'for_whom', 'tags')}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={() => handleAddArrayItem('for_whom', 'tags')}>Add Tag</Button>

              {formData.for_whom.points.map((point, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label={`Point ${index + 1}`}
                    value={point}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'for_whom', 'points')}
                  />
                  <Button onClick={() => handleRemoveArrayItem(index, 'for_whom', 'points')}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={() => handleAddArrayItem('for_whom', 'points')}>Add Point</Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Certification</Typography>
              <TextField
                fullWidth
                label="Certification Text"
                name="certification_text"
                value={formData.certification_text}
                onChange={handleInputChange}
                multiline
                rows={3}
              />

              {formData.certification_points.map((point, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    label={`Certification Point ${index + 1}`}
                    value={point}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'certification_points')}
                  />
                  <Button onClick={() => handleRemoveArrayItem(index, 'certification_points')}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={() => handleAddArrayItem('certification_points')}>Add Certification Point</Button>

              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="certificate-image-upload"
                type="file"
                name="certificate_image"
                onChange={handleFileChange}
              />
              <label htmlFor="certificate-image-upload">
                <Button variant="contained" component="span">
                  Upload Certificate Image
                </Button>
              </label>
              {formData.certificate_image && <Typography>{formData.certificate_image.name}</Typography>}
            </Grid>

          </Grid>
        </Card>
        <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
          Create Course
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateCourse;