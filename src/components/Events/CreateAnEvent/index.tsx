"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  Box,
  Typography,
  FormControl,
  TextField,
  Button,
  Select,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel,
  Chip,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';

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
// interface ScheduleItem {
//   day: number;
//   time: string;
//   date: Dayjs | null;
// };

interface EventFormData {
  title: string;
  event_type: string;
  event_level: string;
  start_date: Dayjs | null;
  start_time: Dayjs | null;
  end_time: Dayjs | null;
  registration_link: string;
  instructor: string[];
  is_active: boolean;
  category: string;
  is_paid: boolean;
  organizer: string;
  price: {
    amount: number;
    currency: string;
  };
  image: File | null;
  status: string;
  description: string;
  skills: { tag: string; learning: string }[];
  your_learning: { tag: string; description: string }[];
  for_whom: { tag: string; description: string }[];
  is_certificate: boolean;
  certificate: string;
  certificate_description: string;
  schedule: Array<{ day: number; time: string; date: Dayjs | null }>;
}

interface FormErrors {
  [key: string]: string;
}

const eventTypes = ['workshop', 'seminar', 'presentation', 'workshop-seminar', 'workshop-presentation'];
const eventLevels = ['all', 'beginner', 'intermediate', 'expert'];
const status = ['pending', 'approved', 'rejected'];

const CreateAnEvent: React.FC = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    event_type: '',
    event_level: 'all',
    start_date: null,
    start_time: null,
    end_time: null,
    registration_link: '',
    instructor: [],
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
    schedule: [{ day: 0, time: '', date: null }],
    organizer: '',
    status: 'pending',
  });
  const router = useRouter();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/instructor`);
        const data = await response.json();
        if (data.success) {
          setInstructors(data.data);
        }
      } catch (error) {
        console.error('Error fetching instructors:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/category/get-all-categories`);
        const data = await response.json();
        if (data.success) {
          setCategories(data.data.categories);
        }
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
    validateField(name, value);
  };

  const handleSelectChange = (e: SelectChangeEvent<string | string[]>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
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
    validateField(name, date);
  };
  const handleScheduleDateChange = (date: Dayjs | null, index: number) => {
    setFormData((prevData) => {
      const updatedSchedule = [...prevData.schedule];
      updatedSchedule[index].date = date;
      return {
        ...prevData,
        schedule: updatedSchedule,
      };
    });
  };
  const handleTimeChange = (time: Dayjs | null, name: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: time,
    }));
    validateField(name, time);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      price: {
        ...prevData.price,
        [name]: name === 'amount' ? (value === '' ? 0 : parseFloat(value)) : value,
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

  const validateField = (name: string, value: any) => {
    let error = '';
    switch (name) {
      case 'title':
        error = value ? '' : 'Title is required';
        break;
      case 'event_type':
        error = eventTypes.includes(value) ? '' : 'Invalid event type';
        break;
      case 'event_level':
        error = eventLevels.includes(value) ? '' : 'Invalid event level';
        break;
      case 'start_date':
        error = value && dayjs(value).isValid() ? '' : 'Start date is required';
        break;
      case 'start_time':
      case 'end_time':
        error = value && dayjs(value).isValid() ? '' : `${name === 'start_time' ? 'Start' : 'End'} time is required`;
        break;
      case 'registration_link':
        error = value ? (/^https?:\/\/.+/.test(value) ? '' : 'Invalid URL format') : 'Registration link is required';
        break;
      case 'instructor':
        error = (value as string[]).length > 0 ? '' : 'At least one instructor is required';
        break;
      case 'category':
        error = value ? '' : 'Category is required';
        break;
      case 'description':
        error = value ? '' : 'Description is required';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key as keyof EventFormData]);
    });
    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      console.error('Form validation failed');
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Event data
      formDataToSend.append('event[title]', formData.title);
      formDataToSend.append('event[event_type]', formData.event_type);
      formDataToSend.append('event[event_level]', formData.event_level);
      formDataToSend.append('event[start_date]', formData.start_date ? dayjs(formData.start_date).format('YYYY-MM-DD') : '');
      formDataToSend.append('event[start_time]', formData.start_time ? dayjs(formData.start_time).toISOString() : '');
      formDataToSend.append('event[end_time]', formData.end_time ? dayjs(formData.end_time).toISOString() : '');
      formDataToSend.append('event[registration_link]', formData.registration_link);
      formData.instructor.forEach((instructor, index) => {
        formDataToSend.append(`event[instructor][${index}]`, instructor);
      });
      formDataToSend.append('event[category]', formData.category);
      formDataToSend.append('event[is_paid]', formData.is_paid.toString());
      if (formData.is_paid) {
        formDataToSend.append('event[price][amount]', formData.price.amount.toString());
        formDataToSend.append('event[price][currency]', formData.price.currency);
      }
      formDataToSend.append('event[status]', 'pending');
      formDataToSend.append('event[organizer]', formData.organizer);

      // Event details
      formDataToSend.append('eventDetails[description]', formData.description);
      formData.skills.forEach((skill, index) => {
        formDataToSend.append(`eventDetails[skills][${index}][tag]`, skill.tag);
        formDataToSend.append(`eventDetails[skills][${index}][learning]`, skill.learning);
      });
      formData.your_learning.forEach((item, index) => {
        formDataToSend.append(`eventDetails[your_learning][${index}][tag]`, item.tag);
        formDataToSend.append(`eventDetails[your_learning][${index}][description]`, item.description);
      });
      formData.for_whom.forEach((item, index) => {
        formDataToSend.append(`eventDetails[for_whom][${index}][tag]`, item.tag);
        formDataToSend.append(`eventDetails[for_whom][${index}][description]`, item.description);
      });
      formData.schedule.forEach((item, index) => {
        formDataToSend.append(`eventDetails[schedule][${index}][day]`, item.day.toString());
        formDataToSend.append(`eventDetails[schedule][${index}][time]`, item.time || '');
        const formattedDate = item.date ? dayjs(item.date).format('YYYY-MM-DD') : '';
        formDataToSend.append(`eventDetails[schedule][${index}][date]`, formattedDate);
      });
      formData.instructor.forEach((instructor, index) => {
        formDataToSend.append(`eventDetails[instructors][${index}]`, instructor);
      });
      formDataToSend.append('eventDetails[is_certificate]', formData.is_certificate.toString());
      formDataToSend.append('eventDetails[certificate]', formData.certificate);
      formDataToSend.append('eventDetails[certificate_description]', formData.certificate_description);

      if (formData.image) {
        formDataToSend.append('event[image]', formData.image);
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/event/create`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        alert('Event created successfully!');
        setSnackbar({
          open: true,
          message: 'Event created successfully!',
          severity: 'success',
        });
        router.push('/events/list');
      } else {
        throw new Error(response.data.message || 'Failed to create event');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response:', error.response.data);
        if (error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          const newErrors: FormErrors = {};
          serverErrors.forEach((err: any) => {
            const field = err.path.split('.').pop();
            newErrors[field] = err.msg;
          });
          setErrors(newErrors);
        } else {
          setSubmitError('An error occurred while creating the event. Please try again.');
        }
      } else {
        console.error('Error creating event:', error);
        setSnackbar({
          open: true,
          message: 'Error creating Event. Please try again.',
          severity: 'error',
        });
        setSubmitError('An unexpected error occurred. Please try again.');
      }
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
        <Card sx={{
          boxShadow: "none",
          borderRadius: "7px",
          mb: "25px",
          padding: { xs: "18px", sm: "20px", lg: "25px" },
        }} className="rmui-card">
          <Grid container spacing={3} columnSpacing={{ xs: 1, sm: 2, md: 2, lg: 3 }}>
            {submitError && (
              <Grid item xs={12}>
                <Alert severity="error">{submitError}</Alert>
              </Grid>
            )}

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
                    error={!!errors.title}
                    helperText={errors.title}
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
                <FormControl fullWidth error={!!errors.event_type}>
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
                  {errors.event_type && <Typography color="error">{errors.event_type}</Typography>}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={4}>
              <Box>
                <Typography component="label" sx={labelStyle} className="text-black">
                  Event Level
                </Typography>
                <FormControl fullWidth error={!!errors.event_level}>
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
                  {errors.event_level && <Typography color="error">{errors.event_level}</Typography>}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={3}>
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
                slotProps={{
                  textField: {
                    helperText: errors.start_date,
                    error: !!errors.start_date,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={3}>
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
                slotProps={{
                  textField: {
                    helperText: errors.start_time,
                    error: !!errors.start_time,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={3}>
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
                slotProps={{
                  textField: {
                    helperText: errors.end_time,
                    error: !!errors.end_time,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={6} xl={3}>
              <Box>
                <FormControl fullWidth>
                  <Typography component="label" sx={labelStyle} className="text-black">
                    Organizer
                  </Typography>
                  <TextField
                    label="Enter event Organizer"
                    placeholder="E.g. Media Dynox"
                    variant="filled"
                    id="organizer"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    required
                    error={!!errors.organizer}
                    helperText={errors.organizer}
                    sx={inputStyle}
                  />
                </FormControl>
              </Box>
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
                    error={!!errors.registration_link}
                    helperText={errors.registration_link}
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
                <FormControl fullWidth error={!!errors.instructor}>
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
                              label={instructor ? `${instructor.first_name} ${instructor.last_name} ` : value}
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {instructors.map((instructor) => (
                      <MenuItem key={instructor._id} value={instructor._id}>
                        {`${instructor.first_name} ${instructor.last_name} `}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.instructor && <Typography color="error">{errors.instructor}</Typography>}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={4}>
              <Box>
                <Typography component="label" sx={labelStyle} className="text-black">
                  Category
                </Typography>
                <FormControl fullWidth error={!!errors.category}>
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
                  {errors.category && <Typography color="error">{errors.category}</Typography>}
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
                        Price
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
                  onChange={(value) => {
                    setFormData((prevData) => ({ ...prevData, description: value }));
                    validateField('description', value);
                  }}
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
                {errors.description && <Typography color="error">{errors.description}</Typography>}
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
                    onChange={(date) => handleScheduleDateChange(date, index)}
                    sx={selectStyle}
                  />
                  <Button onClick={() => handleRemoveArrayItem(index, 'schedule')}>Remove</Button>
                </Box>
              ))}
              <Button onClick={() => handleAddArrayItem('schedule')}>Add Schedule</Button>
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Box>
                <Typography component="label" sx={labelStyle} className="text-black">
                  Status
                </Typography>
                <FormControl fullWidth error={!!errors.event_level}>
                  <Select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleSelectChange}
                    sx={selectStyle}
                  >
                    {status.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.status && <Typography color="error">{errors.status}</Typography>}
                </FormControl>
              </Box>
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
        < Snackbar
          open={snackbar.open}
          autoHideDuration={1000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateAnEvent;