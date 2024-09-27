"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Button,
  Select,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel,
  Chip,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from 'dayjs';

import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("@mantine/rte"), {
  ssr: false,
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

interface EventFormData {
  title: string;
  event_type: 'workshop' | 'seminar' | 'presentation' | 'workshop-seminar' | 'workshop-presentation';
  event_level: 'all' | 'beginner' | 'intermediate' | 'expert';
  start_date: Dayjs | null;
  start_time: Dayjs | null;
  end_time: Dayjs | null;
  registration_link: string;
  instructor: string[];
  is_active: boolean;
  category: string;
  is_paid: boolean;
  price: {
    amount: number;
    currency: string;
  };
  image: File | null;
  description: string;
  skills: { tag: string; learning: string }[];
  your_learning: { tag: string; description: string }[];
  for_whom: { tag: string; description: string }[];
  is_certificate: boolean;
  certificate: string;
  certificate_description: string;
  schedule: { day: number; time: string; date: Dayjs | null }[];
}

const eventTypes = ['workshop', 'seminar', 'presentation', 'workshop-seminar', 'workshop-presentation'] as const;
const eventLevels = ['all', 'beginner', 'intermediate', 'expert'] as const;

const CreateAnEvent: React.FC = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    event_type: 'workshop',
    event_level: 'all',
    start_date: null,
    start_time: null,
    end_time: null,
    registration_link: '',
    instructor: [] as string[],
    is_active: true,
    category: '',
    is_paid: false,
    price: {
      amount: 0,
      currency: 'INR',
    },
    image: null,
    description: '',
    skills: [],
    your_learning: [],
    for_whom: [],
    is_certificate: true,
    certificate: '',
    certificate_description: '',
    schedule: [],
  });

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch('https://lms-v1-mu.vercel.app/api/instructor');
        const data = await response.json();
        if (data.success) {
          setInstructors(data.data);
          console.log(">>>>>>", data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchInstructors();
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string | string[]>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRemoveInstructor = (instructorId: string) => {
    setFormData((prevData) => {
      const updatedInstructors = prevData.instructor.filter(
        (id) => id !== instructorId
      );
      return { ...prevData, instructor: updatedInstructors };
    });
  };


  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleDateChange = (date: Dayjs | null, name: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  const handleTimeChange = (time: Dayjs | null, name: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: time,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      price: {
        ...prevData.price,
        [name]: name === 'amount' ? parseFloat(value) : value,
      },
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleArrayItemChange = (index: number, field: keyof EventFormData, subField: string, value: string) => {
    setFormData((prevData) => {
      const newArray = [...prevData[field] as any[]];
      newArray[index] = { ...newArray[index], [subField]: value };
      return { ...prevData, [field]: newArray };
    });
  };

  const handleAddArrayItem = (field: keyof EventFormData) => {
    setFormData((prevData) => {
      const newItem = field === 'skills' ? { tag: '', learning: '' } :
        field === 'your_learning' || field === 'for_whom' ? { tag: '', description: '' } :
          field === 'schedule' ? { day: prevData.schedule.length + 1, time: '', date: null } :
            {};
      return { ...prevData, [field]: [...prevData[field] as any[], newItem] };
    });
  };

  const handleRemoveArrayItem = (index: number, field: keyof EventFormData) => {
    setFormData((prevData) => {
      const newArray = [...prevData[field] as any[]];
      newArray.splice(index, 1);
      return { ...prevData, [field]: newArray };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formDataToSend.append(key, value);
        } else if (typeof value === 'object' && value !== null) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      await axios.post('/api/events', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event. Please try again.');
    }
  };

  const labelStyle = {
    fontWeight: "500",
    fontSize: "14px",
    mb: "10px",
    display: "block",
  };

  const inputStyle = {
    "& .MuiInputBase-root": {
      border: "1px solid #D5D9E2",
      backgroundColor: "#fff",
      borderRadius: "7px",
    },
    "& .MuiInputBase-root::before": {
      border: "none",
    },
    "& .MuiInputBase-root:hover::before": {
      border: "none",
    },
  };

  const selectStyle = {
    "& fieldset": {
      border: "1px solid #D5D9E2",
      borderRadius: "7px",
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit}>
        <Card
          sx={{
            boxShadow: "none",
            borderRadius: "7px",
            mb: "25px",
            padding: { xs: "18px", sm: "20px", lg: "25px" },
          }}
          className="rmui-card"
        >
          <Grid
            container
            spacing={3}
            columnSpacing={{ xs: 1, sm: 2, md: 2, lg: 3 }}
          >
            <Grid item xs={12} sm={6} lg={6} xl={4}>
              <Box>
                <FormControl fullWidth>
                  <Typography component="label" sx={labelStyle} className="text-black">
                    Event Title
                  </Typography>
                  <TextField
                    label="Enter event title"
                    placeholder="E.g. Annual Conference 2024"
                    variant="filled"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    sx={inputStyle}
                  />
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={4}>
              <Box>
                <Typography component="label" sx={labelStyle} className="text-black">
                  Event Type
                </Typography>
                <FormControl fullWidth>
                  <Select
                    id="event_type"
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleSelectChange}
                    sx={selectStyle}
                  >
                    {eventTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={4}>
              <Box>
                <Typography component="label" sx={labelStyle} className="text-black">
                  Event Level
                </Typography>
                <FormControl fullWidth>
                  <Select
                    id="event_level"
                    name="event_level"
                    value={formData.event_level}
                    onChange={handleSelectChange}
                    sx={selectStyle}
                  >
                    {eventLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={4}>
              <Typography component="h5" sx={labelStyle} className="text-black">
                Start Date
              </Typography>
              <DatePicker
                value={formData.start_date}
                onChange={(date) => handleDateChange(date, 'start_date')}
                sx={{
                  width: "100%",
                  ...selectStyle,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={4}>
              <Typography component="h5" sx={labelStyle} className="text-black">
                Start Time
              </Typography>
              <TimePicker
                value={formData.start_time}
                onChange={(time) => handleTimeChange(time, 'start_time')}
                sx={{
                  width: "100%",
                  ...selectStyle,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={4}>
              <Typography component="h5" sx={labelStyle} className="text-black">
                End Time
              </Typography>
              <TimePicker
                value={formData.end_time}
                onChange={(time) => handleTimeChange(time, 'end_time')}
                sx={{
                  width: "100%",
                  ...selectStyle,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={4}>
              <Box>
                <FormControl fullWidth>
                  <Typography component="label" sx={labelStyle} className="text-black">
                    Registration Link
                  </Typography>
                  <TextField
                    label="Enter registration link"
                    placeholder="E.g. https://example.com/register"
                    variant="filled"
                    id="registration_link"
                    name="registration_link"
                    value={formData.registration_link}
                    onChange={handleInputChange}
                    required
                    sx={inputStyle}
                  />
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={4}>
              <Box>
                <Typography component="label" sx={labelStyle} className="text-black">
                  Instructors
                </Typography>
                <FormControl fullWidth>
                  <Select
                    multiple
                    id="instructor"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleSelectChange}
                    sx={selectStyle}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => {
                          const instructor = instructors.find(i => i._id === value);
                          return (
                            <Chip
                              key={value}
                              label={instructor ? `${instructor.first_name} ${instructor.last_name}` : value}
                              onDelete={() => handleRemoveInstructor(value)}
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
              </Box>
            </Grid>


            <Grid item xs={12} sm={6} lg={6} xl={4}>
              <Box>
                <Typography component="label" sx={labelStyle} className="text-black">
                  Category
                </Typography>
                <FormControl fullWidth>
                  <Select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleSelectChange}
                    sx={selectStyle}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={4}>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.is_paid}
                      onChange={handleCheckboxChange}
                      name="is_paid"
                    />
                  }
                  label="Is Paid Event"
                />
              </Box>
            </Grid>

            {formData.is_paid && (
              <>
                <Grid item xs={12} sm={6} lg={6} xl={4}>
                  <Box>
                    <FormControl fullWidth>
                      <Typography component="label" sx={labelStyle} className="text-black">
                        Price Amount
                      </Typography>
                      <TextField
                        label="Enter price amount"
                        placeholder="E.g. 1000"
                        variant="filled"
                        id="price-amount"
                        name="amount"
                        type="number"
                        value={formData.price.amount}
                        onChange={handlePriceChange}
                        required
                        sx={inputStyle}
                      />
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} lg={6} xl={4}>
                  <Box>
                    <FormControl fullWidth>
                      <Typography component="label" sx={labelStyle} className="text-black">
                        Price Currency
                      </Typography>
                      <TextField
                        label="Enter price currency"
                        placeholder="E.g. INR"
                        variant="filled"
                        id="price-currency"
                        name="currency"
                        value={formData.price.currency}
                        onChange={handlePriceChange}
                        required
                        sx={inputStyle}
                      />
                    </FormControl>
                  </Box>
                </Grid>
              </>
            )}

            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <Box>
                <Typography
                  component="label"
                  sx={labelStyle}
                  className="text-black"
                >
                  Event Description
                </Typography>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData((prevData) => ({ ...prevData, description: value }))}
                  id="rte"
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

            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <Typography
                component="h5"
                sx={labelStyle}
                className="text-black"
              >
                Event Image
              </Typography>
              <TextField
                type="file"
                fullWidth
                onChange={handleImageUpload}
                sx={{
                  "& fieldset": {
                    border: "1px solid #D5D9E2",
                    borderRadius: "7px",
                  },
                }}
              />
            </Grid>

            {/* Skills */}
            <Grid item xs={12}>
              <Typography component="h5" sx={labelStyle} className="text-black">
                Skills
              </Typography>
              {formData.skills.map((skill, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Tag"
                    value={skill.tag}
                    onChange={(e) => handleArrayItemChange(index, 'skills', 'tag', e.target.value)}
                    sx={inputStyle}
                  />
                  <TextField
                    label="Learning"
                    value={skill.learning}
                    onChange={(e) => handleArrayItemChange(index, 'skills', 'learning', e.target.value)}
                    sx={inputStyle}
                  />
                  <Button onClick={() => handleRemoveArrayItem(index, 'skills')}>Remove</Button>
                </Box>
              ))}
              <Button onClick={() => handleAddArrayItem('skills')}>Add Skill</Button>
            </Grid>

            {/* Your Learning */}
            <Grid item xs={12}>
              <Typography component="h5" sx={labelStyle} className="text-black">
                Your Learning
              </Typography>
              {formData.your_learning.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Tag"
                    value={item.tag}
                    onChange={(e) => handleArrayItemChange(index, 'your_learning', 'tag', e.target.value)}
                    sx={inputStyle}
                  />
                  <TextField
                    label="Description"
                    value={item.description}
                    onChange={(e) => handleArrayItemChange(index, 'your_learning', 'description', e.target.value)}
                    sx={inputStyle}
                  />
                  <Button onClick={() => handleRemoveArrayItem(index, 'your_learning')}>Remove</Button>
                </Box>
              ))}
              <Button onClick={() => handleAddArrayItem('your_learning')}>Add Learning</Button>
            </Grid>

            {/* For Whom */}
            <Grid item xs={12}>
              <Typography component="h5" sx={labelStyle} className="text-black">
                For Whom
              </Typography>
              {formData.for_whom.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Tag"
                    value={item.tag}
                    onChange={(e) => handleArrayItemChange(index, 'for_whom', 'tag', e.target.value)}
                    sx={inputStyle}
                  />
                  <TextField
                    label="Description"
                    value={item.description}
                    onChange={(e) => handleArrayItemChange(index, 'for_whom', 'description', e.target.value)}
                    sx={inputStyle}
                  />
                  <Button onClick={() => handleRemoveArrayItem(index, 'for_whom')}>Remove</Button>
                </Box>
              ))}
              <Button onClick={() => handleAddArrayItem('for_whom')}>Add For Whom</Button>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={4}>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.is_certificate}
                      onChange={handleCheckboxChange}
                      name="is_certificate"
                    />
                  }
                  label="Offer Certificate"
                />
              </Box>
            </Grid>

            {formData.is_certificate && (
              <>
                <Grid item xs={12} sm={6} lg={6} xl={4}>
                  <Box>
                    <FormControl fullWidth>
                      <Typography component="label" sx={labelStyle} className="text-black">
                        Certificate
                      </Typography>
                      <TextField
                        label="Enter certificate name"
                        variant="filled"
                        id="certificate"
                        name="certificate"
                        value={formData.certificate}
                        onChange={handleInputChange}
                        sx={inputStyle}
                      />
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={12} lg={12} xl={12}>
                  <Box>
                    <FormControl fullWidth>
                      <Typography component="label" sx={labelStyle} className="text-black">
                        Certificate Description
                      </Typography>
                      <TextField
                        label="Enter certificate description"
                        variant="filled"
                        id="certificate_description"
                        name="certificate_description"
                        value={formData.certificate_description}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        sx={inputStyle}
                      />
                    </FormControl>
                  </Box>
                </Grid>
              </>
            )}

            {/* Schedule */}
            <Grid item xs={12}>
              <Typography component="h5" sx={labelStyle} className="text-black">
                Schedule
              </Typography>
              {formData.schedule.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Day"
                    type="number"
                    value={item.day}
                    onChange={(e) => handleArrayItemChange(index, 'schedule', 'day', e.target.value)}
                    sx={inputStyle}
                  />
                  <TextField
                    label="Time"
                    value={item.time}
                    onChange={(e) => handleArrayItemChange(index, 'schedule', 'time', e.target.value)}
                    sx={inputStyle}
                  />
                  <DatePicker
                    label="Date"
                    value={item.date}
                    onChange={(date) => handleDateChange(date, 'start_date')}
                    sx={selectStyle}
                  />
                  <Button onClick={() => handleRemoveArrayItem(index, 'schedule')}>Remove</Button>
                </Box>
              ))}
              <Button onClick={() => handleAddArrayItem('schedule')}>Add Schedule</Button>
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: "10px", sm: "20px" },
                }}
              >
                <Button
                  type="button"
                  variant="contained"
                  color="error"
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: "6px",
                    fontWeight: "500",
                    fontSize: { xs: "13px", sm: "16px" },
                    padding: { xs: "10px 20px", sm: "10px 24px" },
                    color: "#fff !important",
                    boxShadow: "none",
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    textTransform: "capitalize",
                    borderRadius: "6px",
                    fontWeight: "500",
                    fontSize: { xs: "13px", sm: "16px" },
                    padding: { xs: "10px 20px", sm: "10px 24px" },
                    color: "#fff !important",
                    boxShadow: "none",
                  }}
                >
                  Create Event
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateAnEvent;