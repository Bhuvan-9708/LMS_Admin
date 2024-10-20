"use client"

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@mantine/rte"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

interface Category {
  _id: string;
  name: string;
}

interface Instructor {
  _id: string;
  first_name: string;
  last_name: string;
}

interface CourseData {
  title: string;
  price: string;
  special_price?: string;
  duration?: string;
  special_price_from?: Date;
  special_price_to?: Date;
  slug: string;
  image?: string;
  syllabus: string;
  instructor: string[];
  is_active: boolean;
  course_level: 'all' | 'beginner' | 'intermediate' | 'expert';
  course_category: string[];
  sessions: number;
  status: 'pending' | 'approved' | 'rejected';
  is_featured?: boolean;
  is_popular?: boolean;
  is_new?: boolean;
  is_upcoming?: boolean;
  enrolled_users?: number;
  averageRating?: number;
  totalReviews?: number;
  reviews?: string[];
}

interface CourseDetails {
  description: string;
  start_time: string;
  is_upcoming: boolean;
  start_date: string;
  prerequisites: string[];
  resources: string[];
  video_url: string;
  who_this_course_for: {
    general: string[];
    your_learning: string[];
  };
  what_you_will_learn: {
    skills_you_learn: string[];
    special_for: string[];
  };
  learning_path: Array<{ title: string; description: string }>;
  certificate_description: string[];
  certificate_image: string;
  languages: string[];
  tools_and_technology: string[];
  tags: string[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  course_structure: string[];
  admission_details: {
    description: string;
    application_submit: string;
    application_review: string;
    application_acceptance: string;
  };
  placement: any;
  placement_opportunity: any;
  company_placement: string[];
  course_includes: any;
  curriculum: any;
  projects: Array<{
    level: string;
    title: string;
    tags: string[];
    image: string;
  }>;
  faq: Array<{ title: string; description: string }>;
  technical: string[];
}

const CreateCourse: React.FC = () => {
  const [course, setCourse] = useState<CourseData>({
    title: '',
    price: '',
    special_price: '',
    duration: '',
    special_price_from: undefined,
    special_price_to: undefined,
    slug: '',
    image: '',
    syllabus: '',
    instructor: [],
    is_active: true,
    course_level: 'beginner',
    course_category: [],
    sessions: 1,
    status: 'pending',
    is_featured: true,
    is_popular: true,
    is_new: true,
    is_upcoming: true,
    enrolled_users: 0,
    averageRating: 0,
    totalReviews: 0,
    reviews: [],
  });

  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    description: '',
    start_time: '',
    is_upcoming: false,
    start_date: '',
    prerequisites: [],
    resources: [],
    video_url: '',
    who_this_course_for: {
      general: [],
      your_learning: [],
    },
    what_you_will_learn: {
      skills_you_learn: [],
      special_for: [],
    },
    learning_path: [],
    certificate_description: [],
    certificate_image: '',
    languages: [],
    tools_and_technology: [],
    tags: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    course_structure: [],
    admission_details: {
      description: '',
      application_submit: '',
      application_review: '',
      application_acceptance: '',
    },
    placement: {},
    placement_opportunity: {},
    company_placement: [],
    course_includes: {},
    curriculum: {},
    projects: [],
    faq: [],
    technical: [],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instructorsResponse, categoriesResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/instructor`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/get-all-categories`)
        ]);

        const instructorsData = await instructorsResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (instructorsData.success) {
          setInstructors(instructorsData.data);
        }
        if (categoriesData.success) {
          setCategories(categoriesData.data.categories);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value
    }));
  };

  const handleCourseDetailsChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    setCourseDetails(prevDetails => ({
      ...prevDetails,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string | string[]>) => {
    const { name, value } = event.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      [name]: value
    }));
  };

  const handleArrayChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof CourseDetails | keyof CourseData,
    subfield?: string
  ) => {
    const { value } = event.target;
    if (field in course) {
      setCourse(prevCourse => {
        const updatedField = [...(prevCourse[field as keyof CourseData] as any[])];
        updatedField[index] = value;
        return { ...prevCourse, [field]: updatedField };
      });
    } else {
      setCourseDetails(prevDetails => {
        const updatedField = [...(prevDetails[field as keyof CourseDetails] as any[])];
        if (subfield) {
          updatedField[index] = { ...updatedField[index], [subfield]: value };
        } else {
          updatedField[index] = value;
        }
        return { ...prevDetails, [field]: updatedField };
      });
    }
  };

  const handleNestedArrayChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof CourseDetails,
    nestedField: string,
    subfield?: string
  ) => {
    const { value } = event.target;
    setCourseDetails(prevDetails => {
      const updatedField = { ...(prevDetails[field] as any) };
      if (subfield) {
        updatedField[nestedField][index] = { ...updatedField[nestedField][index], [subfield]: value };
      } else {
        updatedField[nestedField][index] = value;
      }
      return { ...prevDetails, [field]: updatedField };
    });
  };

  const handleAddArrayItem = (field: keyof CourseDetails | keyof CourseData, subfield?: string) => {
    if (field in course) {
      setCourse(prevCourse => {
        const currentField = prevCourse[field as keyof CourseData];

        if (Array.isArray(currentField)) {
          return {
            ...prevCourse,
            [field]: [...currentField, '']
          };
        } else {
          console.warn(`${field} is not an array.`);
          return prevCourse;
        }
      });
    } else {
      setCourseDetails(prevDetails => {
        const updatedField = Array.isArray(prevDetails[field as keyof CourseDetails])
          ? [...prevDetails[field as keyof CourseDetails]]
          : [];

        if (subfield) {
          updatedField.push({ [subfield]: '' });
        } else {
          updatedField.push('');
        }

        return { ...prevDetails, [field]: updatedField };
      });
    }
  };

  const handleRemoveArrayItem = (index: number, field: keyof CourseDetails | keyof CourseData) => {
    if (field in course) {
      setCourse(prevCourse => {
        const updatedField = [...(prevCourse[field as keyof CourseData] as any[])];
        updatedField.splice(index, 1);
        return { ...prevCourse, [field]: updatedField };
      });
    } else {
      setCourseDetails(prevDetails => {
        const updatedField = [...(prevDetails[field as keyof CourseDetails] as any[])];
        updatedField.splice(index, 1);
        return { ...prevDetails, [field]: updatedField };
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();

    // Append course data
    Object.entries(course).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`course[${key}][${index}]`, item);
        });
      } else {
        formData.append(`course[${key}]`, value.toString());
      }
    });

    // Append course details
    Object.entries(courseDetails).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object') {
              Object.entries(item).forEach(([subKey, subValue]) => {
                formData.append(`courseDetails[${key}][${index}][${subKey}]`, subValue as string);
              });
            } else {
              formData.append(`courseDetails[${key}][${index}]`, item);
            }
          });
        } else {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (Array.isArray(subValue)) {
              subValue.forEach((item, index) => {
                formData.append(`courseDetails[${key}][${subKey}][${index}]`, item);
              });
            } else {
              formData.append(`courseDetails[${key}][${subKey}]`, subValue as string);
            }
          });
        }
      } else {
        formData.append(`courseDetails[${key}]`, value as string);
      }
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/course/create-course`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
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
                required
                fullWidth
                label="Title"
                name="title"
                value={course.title}
                onChange={handleCourseChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={course.price}
                onChange={handleCourseChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Special Price"
                name="special_price"
                type="number"
                value={course.special_price}
                onChange={handleCourseChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Special Price From"
                value={course.special_price_from ? new Date(course.special_price_from) : null}
                onChange={(date) => setCourse({
                  ...course,
                  special_price_from: date ? date : undefined
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Special Price To"
                value={course.special_price_to ? new Date(course.special_price_to) : null}
                onChange={(date) => setCourse({
                  ...course,
                  special_price_to: date ? date : undefined
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Slug"
                name="slug"
                value={course.slug}
                onChange={handleCourseChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={course.image}
                onChange={handleCourseChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Syllabus"
                name="syllabus"
                multiline
                rows={4}
                value={course.syllabus}
                onChange={handleCourseChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="course-level-label">Course Level</InputLabel>
                <Select
                  labelId="course-level-label"
                  name="course_level"
                  value={course.course_level}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="expert">Expert</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Sessions"
                name="sessions"
                type="number"
                value={course.sessions}
                onChange={handleCourseChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="course-category-label">Course Categories</InputLabel>
                <Select
                  labelId="course-category-label"
                  multiple
                  name="course_category"
                  value={course.course_category}
                  onChange={handleSelectChange}
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
                <InputLabel id="instructor-label">Instructors</InputLabel>
                <Select
                  labelId="instructor-label"
                  multiple
                  name="instructor"
                  value={course.instructor}
                  onChange={handleSelectChange}
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
                    checked={course.is_active}
                    onChange={(e) => setCourse({ ...course, is_active: e.target.checked })}
                    name="is_active"
                  />
                }
                label="Is Active"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={course.is_featured}
                    onChange={(e) => setCourse({ ...course, is_featured: e.target.checked })}
                    name="is_featured"
                  />
                }
                label="Is Featured"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={course.is_popular}
                    onChange={(e) => setCourse({ ...course, is_popular: e.target.checked })}
                    name="is_popular"
                  />
                }
                label="Is Popular"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={course.is_new}
                    onChange={(e) => setCourse({ ...course, is_new: e.target.checked })}
                    name="is_new"
                  />
                }
                label="Is New"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={course.is_upcoming}
                    onChange={(e) => setCourse({ ...course, is_upcoming: e.target.checked })}
                    name="is_upcoming"
                  />
                }
                label="Is Upcoming"
              />
            </Grid>
          </Grid>
        </Card>

        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>Course Details</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RichTextEditor
                value={courseDetails.description}
                onChange={(value) => setCourseDetails({ ...courseDetails, description: value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                name="start_time"
                type="time"
                value={courseDetails.start_time}
                onChange={handleCourseDetailsChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={courseDetails.is_upcoming}
                    onChange={(e) => setCourseDetails({ ...courseDetails, is_upcoming: e.target.checked })}
                    name="is_upcoming"
                  />
                }
                label="Is Upcoming"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={courseDetails.start_date ? new Date(courseDetails.start_date) : null}
                onChange={(date) => setCourseDetails({ ...courseDetails, start_date: date ? date.toISOString().split('T')[0] : '' })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Video URL"
                name="video_url"
                value={courseDetails.video_url}
                onChange={handleCourseDetailsChange}
              />
            </Grid>
            {courseDetails.prerequisites.map((prerequisite, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Prerequisite ${index + 1}`}
                  value={prerequisite}
                  onChange={(e) => handleArrayChange(e, index, 'prerequisites')}
                />
                <Button onClick={() => handleRemoveArrayItem(index, 'prerequisites')}>Remove</Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddArrayItem('prerequisites')}>Add Prerequisite</Button>
            </Grid>
            {courseDetails.resources.map((resource, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Resource ${index + 1}`}
                  value={resource}
                  onChange={(e) => handleArrayChange(e, index, 'resources')}
                />
                <Button onClick={() => handleRemoveArrayItem(index, 'resources')}>Remove</Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddArrayItem('resources')}>Add Resource</Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Who This Course Is For</Typography>
              {/* Check if who_this_course_for and general are defined */}
              {courseDetails.who_this_course_for?.general?.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    fullWidth
                    label={`General ${index + 1}`}
                    value={item}
                    onChange={(e) => handleNestedArrayChange(e, index, 'who_this_course_for', 'general')}
                  />
                  <Button onClick={() => handleRemoveArrayItem(index, 'who_this_course_for')}>Remove</Button>
                </Grid>
              ))}

              {/* Add button should be enabled even if the array is not yet initialized */}
              <Button onClick={() => handleAddArrayItem('who_this_course_for', 'general')}>Add General</Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">What You Will Learn</Typography>
              {courseDetails.what_you_will_learn.skills_you_learn.map((skill, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    fullWidth
                    label={`Skill ${index + 1}`}
                    value={skill}
                    onChange={(e) => handleNestedArrayChange(e, index, 'what_you_will_learn', 'skills_you_learn')}
                  />
                  <Button onClick={() => handleRemoveArrayItem(index, 'what_you_will_learn')}>Remove</Button>
                </Grid>
              ))}
              <Button onClick={() => handleAddArrayItem('what_you_will_learn', 'skills_you_learn')}>Add Skill</Button>
            </Grid>
            {courseDetails.learning_path.map((path, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Learning Path Title ${index + 1}`}
                  value={path.title}
                  onChange={(e) => handleArrayChange(e, index, 'learning_path', 'title')}
                />
                <TextField
                  fullWidth
                  label={`Learning Path Description ${index + 1}`}
                  value={path.description}
                  onChange={(e) => handleArrayChange(e, index, 'learning_path', 'description')}
                />
                <Button onClick={() => handleRemoveArrayItem(index, 'learning_path')}>Remove</Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddArrayItem('learning_path')}>Add Learning Path</Button>
            </Grid>
            {courseDetails.certificate_description.map((desc, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Certificate Description ${index + 1}`}
                  value={desc}
                  onChange={(e) => handleArrayChange(e, index, 'certificate_description')}
                />
                <Button onClick={() => handleRemoveArrayItem(index, 'certificate_description')}>Remove</Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddArrayItem('certificate_description')}>Add Certificate Description</Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Certificate Image URL"
                name="certificate_image"
                value={courseDetails.certificate_image}
                onChange={handleCourseDetailsChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="languages-label">Languages</InputLabel>
                <Select
                  labelId="languages-label"
                  multiple
                  name="languages"
                  value={courseDetails.languages}
                  onChange={(e) => setCourseDetails({ ...courseDetails, languages: e.target.value as string[] })}
                >
                  {['English', 'Spanish', 'French', 'German', 'Chinese'].map((language) => (
                    <MenuItem key={language} value={language}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {courseDetails.tools_and_technology.map((tool, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Tool/Technology ${index + 1}`}
                  value={tool}
                  onChange={(e) => handleArrayChange(e, index, 'tools_and_technology')}
                />
                <Button onClick={() => handleRemoveArrayItem(index, 'tools_and_technology')}>Remove</Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddArrayItem('tools_and_technology')}>Add Tool/Technology</Button>
            </Grid>
            {courseDetails.tags.map((tag, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Tag ${index + 1}`}
                  value={tag}
                  onChange={(e) => handleArrayChange(e, index, 'tags')}
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
                value={courseDetails.meta_title}
                onChange={handleCourseDetailsChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Description"
                name="meta_description"
                value={courseDetails.meta_description}
                onChange={handleCourseDetailsChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Keywords"
                name="meta_keywords"
                value={courseDetails.meta_keywords}
                onChange={handleCourseDetailsChange}
              />
            </Grid>
            {courseDetails.course_structure.map((structure, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Course Structure ${index + 1}`}
                  value={structure}
                  onChange={(e) => handleArrayChange(e, index, 'course_structure')}
                />
                <Button onClick={() => handleRemoveArrayItem(index, 'course_structure')}>Remove</Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddArrayItem('course_structure')}>Add Course Structure</Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Admission Details</Typography>
              <TextField
                fullWidth
                label="Description"
                name="admission_details.description"
                value={courseDetails.admission_details.description}
                onChange={handleCourseDetailsChange}
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Application Submit"
                name="admission_details.application_submit"
                value={courseDetails.admission_details.application_submit}
                onChange={handleCourseDetailsChange}
              />
              <TextField
                fullWidth
                label="Application Review"
                name="admission_details.application_review"
                value={courseDetails.admission_details.application_review}
                onChange={handleCourseDetailsChange}
              />
              <TextField
                fullWidth
                label="Application Acceptance"
                name="admission_details.application_acceptance"
                value={courseDetails.admission_details.application_acceptance}
                onChange={handleCourseDetailsChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Placement</Typography>
              <TextField
                fullWidth
                label="Placement Details"
                name="placement"
                value={JSON.stringify(courseDetails.placement)}
                onChange={(e) => setCourseDetails({ ...courseDetails, placement: JSON.parse(e.target.value) })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Placement Opportunity</Typography>
              <TextField
                fullWidth
                label="Placement Opportunity Details"
                name="placement_opportunity"
                value={JSON.stringify(courseDetails.placement_opportunity)}
                onChange={(e) => setCourseDetails({ ...courseDetails, placement_opportunity: JSON.parse(e.target.value) })}
                multiline
                rows={3}
              />
            </Grid>
            {courseDetails.company_placement.map((company, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Company Placement ${index + 1}`}
                  value={company}
                  onChange={(e) => handleArrayChange(e, index, 'company_placement')}
                />
                <Button onClick={() => handleRemoveArrayItem(index, 'company_placement')}>Remove</Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddArrayItem('company_placement')}>Add Company Placement</Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Course Includes</Typography>
              <TextField
                fullWidth
                label="Course Includes Details"
                name="course_includes"
                value={JSON.stringify(courseDetails.course_includes)}
                onChange={(e) => setCourseDetails({ ...courseDetails, course_includes: JSON.parse(e.target.value) })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Curriculum</Typography>
              <TextField
                fullWidth
                label="Curriculum Details"
                name="curriculum"
                value={JSON.stringify(courseDetails.curriculum)}
                onChange={(e) => setCourseDetails({ ...courseDetails, curriculum: JSON.parse(e.target.value) })}
                multiline
                rows={3}
              />
            </Grid>
            {courseDetails.projects.map((project, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Project Level ${index + 1}`}
                  value={project.level}
                  onChange={(e) => handleArrayChange(e, index, 'projects', 'level')}
                />
                <TextField
                  fullWidth
                  label={`Project Title ${index + 1}`}
                  value={project.title}
                  onChange={(e) => handleArrayChange(e, index, 'projects', 'title')}
                />
                <TextField
                  fullWidth
                  label={`Project Tags ${index + 1}`}
                  value={project.tags.join(', ')}
                  onChange={(e) => handleArrayChange(e, index, 'projects', 'tags')}
                  helperText="Separate tags with commas"
                />
                <TextField
                  fullWidth
                  label={`Project Image URL ${index + 1}`}
                  value={project.image}
                  onChange={(e) => handleArrayChange(e, index, 'projects', 'image')}
                />
                <Button onClick={() => handleRemoveArrayItem(index, 'projects')}>Remove Project</Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddArrayItem('projects')}>Add Project</Button>
            </Grid>
            {courseDetails.faq.map((faq, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`FAQ Question ${index + 1}`}
                  value={faq.title}
                  onChange={(e) => handleArrayChange(e, index, 'faq', 'title')}
                />
                <TextField
                  fullWidth
                  label={`FAQ Answer ${index + 1}`}
                  value={faq.description}
                  onChange={(e) => handleArrayChange(e, index, 'faq', 'description')}
                  multiline
                  rows={2}
                />
                <Button onClick={() => handleRemoveArrayItem(index, 'faq')}>Remove FAQ</Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddArrayItem('faq')}>Add FAQ</Button>
            </Grid>
            {courseDetails.technical.map((tech, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Technical Requirement ${index + 1}`}
                  value={tech}
                  onChange={(e) => handleArrayChange(e, index, 'technical')}
                />
                <Button onClick={() => handleRemoveArrayItem(index, 'technical')}>Remove</Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={() => handleAddArrayItem('technical')}>Add Technical Requirement</Button>
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