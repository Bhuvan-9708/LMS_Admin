'use client'

import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  CircularProgress
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [courseLandingPagesData, sectionWorkingsData, feedbacksData] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/course`).then(res => res.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/section-working/`).then(res => res.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`).then(res => res.json())
        ]);

        setCourseLandingPages(courseLandingPagesData.data || []);
        setSectionWorkings(sectionWorkingsData.data || []);
        setFeedbacks(feedbacksData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e, parent = null) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      if (parent) {
        return {
          ...prevData,
          [parent]: {
            ...prevData[parent],
            [name]: value
          }
        };
      }
      return {
        ...prevData,
        [name]: value
      };
    });
  };

  const handleArrayInputChange = (section, index, field, value) => {
    setFormData(prevData => {
      const [parent, nestedField] = section.split('.');
      const newArray = [...prevData[parent][nestedField]];
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [nestedField]: newArray
        }
      };
    });
  };

  const addArrayItem = (section, newItem) => {
    const [parent, nestedField] = section.split('.');
    setFormData(prevData => ({
      ...prevData,
      [parent]: {
        ...prevData[parent],
        [nestedField]: [...prevData[parent][nestedField], newItem]
      }
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

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'course_highlights' && key !== 'meta_keywords') {
        formDataToSend.append(key, value);
      }
    });

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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create course landing page details');
      }

      const result = await response.json();
      console.log('Course landing page details created:', result);
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error('Error creating course landing page details:', error);
      // Handle error (e.g., show an error message)
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

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
        name="title"
        value={formData.course_highlights.title}
        onChange={(e) => handleInputChange(e, 'course_highlights')}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={formData.course_highlights.description}
        onChange={(e) => handleInputChange(e, 'course_highlights')}
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