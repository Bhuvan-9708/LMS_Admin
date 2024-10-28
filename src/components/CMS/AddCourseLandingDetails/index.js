"use client"
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box
} from '@mui/material';

function CourseLandingPageDetailsForm() {
  const [formData, setFormData] = useState({
    course_landing_page_id: '',
    course_highlights: {
      title: '',
      description: '',
      image: null,
      points: []
    },
    section_working: '',
    feedbacks: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: [],
    seo_url: ''
  });

  const [courseLandingPages, setCourseLandingPages] = useState([]);
  const [sectionWorkings, setSectionWorkings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseLandingPagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/course`);
        const courseLandingPagesData = await courseLandingPagesResponse.json();
        setCourseLandingPages(courseLandingPagesData.data);

        const sectionWorkingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/section-working/`);
        const sectionWorkingsData = await sectionWorkingsResponse.json();
        setSectionWorkings(sectionWorkingsData.data);

        const feedbacksResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`);
        const feedbacksData = await feedbacksResponse.json();
        setFeedbacks(feedbacksData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (section, index, field, value) => {
    setFormData(prevData => {
      const newArray = [...prevData[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prevData,
        [section]: newArray
      };
    });
  };

  const addArrayItem = (section, newItem) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: [...prevData[section], newItem]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prevData => ({
      ...prevData,
      course_highlights: {
        ...prevData.course_highlights,
        image: file
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Append all text fields
    Object.keys(formData).forEach(key => {
      if (key !== 'course_highlights' && key !== 'meta_keywords') {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append nested objects and arrays
    formDataToSend.append('course_highlights[title]', formData.course_highlights.title);
    formDataToSend.append('course_highlights[description]', formData.course_highlights.description);
    if (formData.course_highlights.image) {
      formDataToSend.append('course_highlights[image]', formData.course_highlights.image);
    }
    formDataToSend.append('course_highlights[points]', JSON.stringify(formData.course_highlights.points));

    formData.meta_keywords.forEach((keyword, index) => {
      formDataToSend.append(`meta_keywords[${index}]`, keyword);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/course/details/v1/create`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create course landing page details');
      }

      const result = await response.json();
      console.log('Course landing page details created:', result);
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error('Error creating course landing page details:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>Add Course Landing Page Details</Typography>

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Course Landing Page</InputLabel>
        <Select
          name="course_landing_page_id"
          value={formData.course_landing_page_id}
          onChange={handleInputChange}
        >
          {courseLandingPages.map(page => (
            <MenuItem key={page._id} value={page._id}>{page.title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="h6" gutterBottom>Course Highlights</Typography>
      <TextField
        fullWidth
        label="Title"
        value={formData.course_highlights.title}
        onChange={(e) => handleNestedInputChange('course_highlights', 'title', e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Description"
        value={formData.course_highlights.description}
        onChange={(e) => handleNestedInputChange('course_highlights', 'description', e.target.value)}
        margin="normal"
        multiline
        rows={4}
      />
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="course-highlights-image"
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor="course-highlights-image">
        <Button variant="contained" component="span">
          Upload Course Highlights Image
        </Button>
      </label>
      {formData.course_highlights.image && (
        <Typography variant="body2">{formData.course_highlights.image.name}</Typography>
      )}
      {formData.course_highlights.points.map((point, index) => (
        <Box key={index} mb={2}>
          <TextField
            fullWidth
            label={`Point ${index + 1} Title`}
            value={point.title}
            onChange={(e) => handleArrayInputChange('course_highlights.points', index, 'title', e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label={`Point ${index + 1} Description`}
            value={point.description}
            onChange={(e) => handleArrayInputChange('course_highlights.points', index, 'description', e.target.value)}
            margin="normal"
          />
        </Box>
      ))}
      <Button
        type="button"
        onClick={() => addArrayItem('course_highlights.points', { title: '', description: '' })}
        variant="outlined"
        color="primary"
      >
        Add Highlight Point
      </Button>

      <FormControl fullWidth margin="normal">
        <InputLabel>Section Working</InputLabel>
        <Select
          name="section_working"
          value={formData.section_working}
          onChange={handleInputChange}
        >
          {sectionWorkings.map(section => (
            <MenuItem key={section._id} value={section._id}>{section.title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Feedbacks</InputLabel>
        <Select
          name="feedbacks"
          value={formData.feedbacks}
          onChange={handleInputChange}
        >
          {feedbacks.map(feedback => (
            <MenuItem key={feedback._id} value={feedback._id}>{feedback.title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Meta Title"
        name="meta_title"
        value={formData.meta_title}
        onChange={handleInputChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Meta Description"
        name="meta_description"
        value={formData.meta_description}
        onChange={handleInputChange}
        margin="normal"
        multiline
        rows={4}
      />

      {formData.meta_keywords.map((keyword, index) => (
        <TextField
          key={index}
          fullWidth
          label={`Meta Keyword ${index + 1}`}
          value={keyword}
          onChange={(e) => handleArrayInputChange('meta_keywords', index, '', e.target.value)}
          margin="normal"
        />
      ))}
      <Button
        type="button"
        onClick={() => addArrayItem('meta_keywords', '')}
        variant="outlined"
        color="primary"
      >
        Add Meta Keyword
      </Button>

      <TextField
        fullWidth
        label="SEO URL"
        name="seo_url"
        value={formData.seo_url}
        onChange={handleInputChange}
        margin="normal"
      />

      <Box mt={2}>
        <Button type="submit" variant="contained" color="primary">
          Create Course Landing Page Details
        </Button>
      </Box>
    </form>
  );
}

export default CourseLandingPageDetailsForm;