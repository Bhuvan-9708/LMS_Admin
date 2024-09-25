"use client";

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  OutlinedInput,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("@mantine/rte"), {
  ssr: false,
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const courseLevels = ['all', 'beginner', 'intermediate', 'expert'] as const;
const statusOptions = ['pending', 'approved', 'rejected'] as const;
const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'] as const;

type CourseLevel = typeof courseLevels[number];
type StatusOption = typeof statusOptions[number];
type Language = typeof languages[number];

interface CourseData {
  title: string;
  price: string;
  special_price: string;
  special_price_from: string;
  special_price_to: string;
  slug: string;
  image: string;
  syllabus: string;
  instructor: string;
  is_active: boolean;
  course_level: CourseLevel;
  course_category: string[];
  sessions: string[];
  status: StatusOption;
  description: string;
  duration: string;
  start_time: string;
  topics: string[];
  is_upcoming: boolean;
  is_new: boolean;
  start_date: string;
  prerequisites: string[];
  resources: string[];
  video_url: string;
  who_this_course_for: string[];
  what_you_will_learn: string[];
  requirements: string[];
  certificate: string;
  languages: Language[];
  tags: string[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  course_structure: string[];
  admission_details: string;
  placement: string;
  placement_opportunity: string;
  company_placement: string;
  course_includes: string;
  curriculum: string;
  projects: string;
  faq: string;
  is_featured: boolean;
  is_popular: boolean;
}

const CreateCourse: React.FC = () => {
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    price: '',
    special_price: '',
    special_price_from: '',
    special_price_to: '',
    slug: '',
    image: '',
    syllabus: '',
    instructor: '',
    is_active: true,
    course_level: 'all',
    course_category: [],
    sessions: [''],
    status: 'pending',
    description: '',
    duration: '',
    start_time: '',
    topics: [''],
    is_upcoming: false,
    is_new: false,
    start_date: '',
    prerequisites: [''],
    resources: [''],
    video_url: '',
    who_this_course_for: [''],
    what_you_will_learn: [''],
    requirements: [''],
    certificate: '',
    languages: [],
    tags: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    course_structure: [''],
    admission_details: '',
    placement: '',
    placement_opportunity: '',
    company_placement: '',
    course_includes: '',
    curriculum: '',
    projects: '',
    faq: '',
    is_featured: false,
    is_popular: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCourseData({ ...courseData, [name]: value });
  };
  const handleRichTextChange = (value: string) => {
    setCourseData({ ...courseData, description: value });
  };

  const handleArrayChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: keyof CourseData
  ) => {
    if (Array.isArray(courseData[field])) {
      const newArray = [...(courseData[field] as string[])];
      newArray[index] = event.target.value;
      setCourseData({ ...courseData, [field]: newArray });
    }
  };

  const handleAddArrayItem = (field: keyof CourseData) => {
    if (Array.isArray(courseData[field])) {
      setCourseData({ ...courseData, [field]: [...courseData[field] as string[], ''] });
    }
  };

  const handleRemoveArrayItem = (index: number, field: keyof CourseData) => {
    if (Array.isArray(courseData[field])) {
      const newArray = [...courseData[field] as string[]];
      newArray.splice(index, 1);
      setCourseData({ ...courseData, [field]: newArray });
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string | string[]>) => {
    const { name, value } = event.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCourseData({ ...courseData, [name]: checked });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Course Data:', courseData);
    // Here you would typically send the data to your backend API
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Create New Course</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Title"
              name="title"
              value={courseData.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Slug"
              name="slug"
              value={courseData.slug}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={courseData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Special Price"
              name="special_price"
              type="number"
              value={courseData.special_price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Special Price From"
              name="special_price_from"
              type="date"
              value={courseData.special_price_from}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Special Price To"
              name="special_price_to"
              type="date"
              value={courseData.special_price_to}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="image"
              value={courseData.image}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Syllabus"
              name="syllabus"
              multiline
              rows={4}
              value={courseData.syllabus}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Instructor ID"
              name="instructor"
              value={courseData.instructor}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="course-level-label">Course Level</InputLabel>
              <Select
                labelId="course-level-label"
                // name="course_level"
                value={courseData.course_level}
                onChange={handleSelectChange}
              >
                {courseLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </MenuItem>
                ))}
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
                value={courseData.course_category}
                onChange={handleSelectChange}
                input={<OutlinedInput label="Course Categories" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {/* Replace with actual categories from your backend */}
                {['Web Development', 'Data Science', 'Mobile Development'].map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {courseData.sessions.map((session, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                fullWidth
                label={`Session ${index + 1}`}
                value={session}
                onChange={(e) => handleArrayChange(e, index, 'sessions')}
              />
              <Button onClick={() => handleRemoveArrayItem(index, 'sessions')}>Remove</Button>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={() => handleAddArrayItem('sessions')}>Add Session</Button>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={courseData.status}
                onChange={handleSelectChange}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Course Details</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Box>
              <Typography
                component="label"
                sx={{
                  fontWeight: "500",
                  fontSize: "14px",
                  mb: "10px",
                  display: "block",
                }}
                className="text-black"
              >
                Description
              </Typography>

              <RichTextEditor
                id="rte"
                value={courseData.description} 
                onChange={handleRichTextChange} 
                controls={[
                  ["bold", "italic", "underline", "link", "image"],
                  ["unorderedList", "h1", "h2", "h3"],
                  ["sup", "sub"],
                  ["alignLeft", "alignCenter", "alignRight"],
                ]}
                style={{
                  minHeight: "200px",
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration"
              name="duration"
              value={courseData.duration}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Start Time"
              name="start_time"
              type="time"
              value={courseData.start_time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {courseData.topics.map((topic, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                fullWidth
                label={`Topic ${index + 1}`}
                value={topic}
                onChange={(e) => handleArrayChange(e, index, 'topics')}
              />
              <Button onClick={() => handleRemoveArrayItem(index, 'topics')}>Remove</Button>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={() => handleAddArrayItem('topics')}>Add Topic</Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={courseData.is_upcoming}
                  onChange={handleCheckboxChange}
                  name="is_upcoming"
                />
              }
              label="Is Upcoming"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={courseData.is_new}
                  onChange={handleCheckboxChange}
                  name="is_new"
                />
              }
              label="Is New"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Start Date"
              name="start_date"
              type="date"
              value={courseData.start_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {courseData.prerequisites.map((prerequisite, index) => (
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
          {courseData.resources.map((resource, index) => (
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
            <TextField
              required
              fullWidth
              label="Video URL"
              name="video_url"
              value={courseData.video_url}
              onChange={handleChange}
            />
          </Grid>
          {courseData.who_this_course_for.map((item, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                fullWidth
                label={`Who This Course Is For ${index + 1}`}
                value={item}
                onChange={(e) => handleArrayChange(e, index, 'who_this_course_for')}
              />
              <Button onClick={() => handleRemoveArrayItem(index, 'who_this_course_for')}>Remove</Button>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={() => handleAddArrayItem('who_this_course_for')}>Add Who This Course Is For</Button>
          </Grid>
          {courseData.what_you_will_learn.map((item, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                fullWidth
                label={`What You Will Learn ${index + 1}`}
                value={item}
                onChange={(e) => handleArrayChange(e, index, 'what_you_will_learn')}
              />
              <Button onClick={() => handleRemoveArrayItem(index, 'what_you_will_learn')}>Remove</Button>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={() => handleAddArrayItem('what_you_will_learn')}>Add What You Will Learn</Button>
          </Grid>
          {courseData.requirements.map((requirement, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                fullWidth
                label={`Requirement ${index + 1}`}
                value={requirement}
                onChange={(e) => handleArrayChange(e, index, 'requirements')}
              />
              <Button onClick={() => handleRemoveArrayItem(index, 'requirements')}>Remove</Button>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={() => handleAddArrayItem('requirements')}>Add Requirement</Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Certificate"
              name="certificate"
              value={courseData.certificate}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="languages-label">Languages</InputLabel>
              <Select
                labelId="languages-label"
                multiple
                name="languages"
                value={courseData.languages}
                onChange={handleSelectChange}
                input={<OutlinedInput label="Languages" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {languages.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              name="tags"
              value={courseData.tags.join(', ')}
              onChange={(e) => setCourseData({ ...courseData, tags: e.target.value.split(', ') })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meta Title"
              name="meta_title"
              value={courseData.meta_title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meta Description"
              name="meta_description"
              multiline
              rows={2}
              value={courseData.meta_description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meta Keywords"
              name="meta_keywords"
              value={courseData.meta_keywords}
              onChange={handleChange}
            />
          </Grid>
          {courseData.course_structure.map((item, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                fullWidth
                label={`Course Structure ${index + 1}`}
                value={item}
                onChange={(e) => handleArrayChange(e, index, 'course_structure')}
              />
              <Button onClick={() => handleRemoveArrayItem(index, 'course_structure')}>Remove</Button>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={() => handleAddArrayItem('course_structure')}>Add Course Structure</Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Admission Details"
              name="admission_details"
              multiline
              rows={4}
              value={courseData.admission_details}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Placement"
              name="placement"
              multiline
              rows={4}
              value={courseData.placement}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Placement Opportunity"
              name="placement_opportunity"
              multiline
              rows={4}
              value={courseData.placement_opportunity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Placement"
              name="company_placement"
              multiline
              rows={4}
              value={courseData.company_placement}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Course Includes"
              name="course_includes"
              multiline
              rows={4}
              value={courseData.course_includes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Curriculum"
              name="curriculum"
              multiline
              rows={4}
              value={courseData.curriculum}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Projects"
              name="projects"
              multiline
              rows={4}
              value={courseData.projects}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="FAQ"
              name="faq"
              multiline
              rows={4}
              value={courseData.faq}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={courseData.is_featured}
                  onChange={handleCheckboxChange}
                  name="is_featured"
                />
              }
              label="Is Featured"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={courseData.is_popular}
                  onChange={handleCheckboxChange}
                  name="is_popular"
                />
              }
              label="Is Popular"
            />
          </Grid>
        </Grid>
      </Card>

      <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
        Create Course
      </Button>
    </Box>
  );
};

export default CreateCourse;