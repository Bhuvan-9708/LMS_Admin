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
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [courseLandingPages, setCourseLandingPages] = useState([]);
  const [sectionWorkings, setSectionWorkings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseLandingPagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/course`);
        const courseLandingPagesData = await courseLandingPagesResponse.json();
        const coursesWithIdAndTitle = courseLandingPagesData.data.dataWithEffectivePrice.map(course => ({
          _id: course._id,
          title: course.title,
        }));
        setCourseLandingPages(coursesWithIdAndTitle);

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

  const handleArrayInputChange = (field, index, key, value) => {
    setFormData((prevData) => {
      if (field === 'course_highlights.points') {
        const updatedPoints = prevData.course_highlights.points.map((point, idx) => {
          if (idx === index) {
            return {
              ...point,
              [key]: value
            };
          }
          return point;
        });
        return {
          ...prevData,
          course_highlights: {
            ...prevData.course_highlights,
            points: updatedPoints
          }
        };
      }
      console.error(`Field ${field} is not recognized.`);
      return prevData; // Return previous state if field is not recognized
    });
  };

  const addArrayItem = (field, initialValue) => {
    setFormData((prevData) => {
      if (field === 'course_highlights.points') {
        return {
          ...prevData,
          course_highlights: {
            ...prevData.course_highlights,
            points: [...prevData.course_highlights.points, initialValue]
          }
        };
      }
      return prevData;
    });
  };

  const removeArrayItem = (field, index) => {
    setFormData((prevData) => {
      if (field === 'course_highlights.points') {
        const updatedPoints = prevData.course_highlights.points.filter((_, i) => i !== index);
        return {
          ...prevData,
          course_highlights: {
            ...prevData.course_highlights,
            points: updatedPoints
          }
        };
      }
      console.error(`Field ${field} is not recognized.`);
      return prevData;
    });
  };

  const handleKeywordChange = (index, value) => {
    setFormData(prevData => {
      const updatedKeywords = prevData.meta_keywords.map((keyword, idx) => {
        if (idx === index) {
          return value;
        }
        return keyword;
      });
      return {
        ...prevData,
        meta_keywords: updatedKeywords
      };
    });
  };

  const addKeyword = () => {
    setFormData(prevData => ({
      ...prevData,
      meta_keywords: [...prevData.meta_keywords, '']
    }));
  };

  const removeKeyword = (index) => {
    setFormData(prevData => ({
      ...prevData,
      meta_keywords: prevData.meta_keywords.filter((_, idx) => idx !== index)
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

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach(key => {
      if (key !== 'course_highlights' && key !== 'meta_keywords') {
        formDataToSend.append(key, formData[key]);
      }
    });

    formDataToSend.append('course_highlights[title]', formData.course_highlights.title);
    formDataToSend.append('course_highlights[description]', formData.course_highlights.description);

    if (formData.course_highlights.image) {
      formDataToSend.append('course_highlights[image]', formData.course_highlights.image);
    }

    formData.course_highlights.points.forEach((point, index) => {
      formDataToSend.append(`course_highlights[points][${index}][title]`, point.title);
      formDataToSend.append(`course_highlights[points][${index}][description]`, point.description);
    });

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
      setSnackbar({
        open: true,
        message: 'Course Landing created successfully!',
        severity: 'success',
      });
      router.push('/cms/course-landing');
    } catch (error) {
      console.error('Error creating course landing page details:', error);
      setSnackbar({
        open: true,
        message: 'Error creating Course landing page. Please try again.',
        severity: 'error',
      });
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
          {courseLandingPages?.map(page => (
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
          <Button
            type="button"
            onClick={() => removeArrayItem('course_highlights.points', index)}
            variant="outlined"
            color="secondary"
          >
            Remove Highlight Point
          </Button>
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
        <Box key={index} mb={2}>
          <TextField
            key={index}
            fullWidth
            label={`Meta Keyword ${index + 1}`}
            value={keyword}
            onChange={(e) => handleKeywordChange(index, e.target.value)}
            margin="normal"
          />
          <Button
            type="button"
            onClick={() => removeKeyword(index)}
            variant="outlined"
            color="secondary"
          >
            Remove Meta Keyword
          </Button>
        </Box>
      ))}
      <Button
        type="button"
        onClick={addKeyword}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </form>
  );
}

export default CourseLandingPageDetailsForm;