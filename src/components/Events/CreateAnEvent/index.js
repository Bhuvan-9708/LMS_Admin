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
  TextField,
  Button,
  IconButton,
  Select,
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
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from 'next/navigation';

import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("@mantine/rte"), {
  ssr: false,
});

const eventTypes = ['workshop', 'Webinar', 'presentation', 'workshop-Webinar', 'workshop-presentation'];
const eventLevels = ['all', 'beginner', 'intermediate', 'expert'];
const status = ['pending', 'approved', 'rejected'];

const CreateAnEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    event_type: '',
    event_level: 'all',
    start_date: null,
    start_time: null,
    end_time: null,
    instructor: [],
    is_active: true,
    category: [],
    is_paid: false,
    price: {
      amount: 0,
      currency: 'INR',
    },
    special_price: 0,
    special_price_from: null,
    special_price_to: null,
    image: null,
    description: '',
    language: [''],
    includes: [''],
    skills: [],
    your_learning: [],
    for_whom: [],
    is_certificate: true,
    certificate_description: null,
    syllabus: null,
    faq: null,
    schedule: [{ day: 0, time: '', date: null }],
    organizer: '',
    status: 'pending',
  });
  const router = useRouter();
  const [instructors, setInstructors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [certificate, setCertificate] = useState([]);
  const [errors, setErrors] = useState({});
  const [syllabus, setSyllabus] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [submitError, setSubmitError] = useState(null);
  const [snackbar, setSnackbar] = useState({
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

    const fetchCertificate = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/certificate/`);
        const data = await response.json();
        if (data.success) {
          setCertificate(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    const fetchSyllabus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/syllabus/`);
        const data = await response.json();
        if (data.success) {
          setSyllabus(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    const fetchFaq = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/faq/`);
        const data = await response.json();
        if (data.success) {
          setFaqs(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchFaq();
    fetchSyllabus();
    fetchCertificate();
    fetchInstructors();
    fetchCategories();
  }, []);

  const handleCertificateChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      certificate_description: event.target.value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: Array.isArray(value) ? value : [value],
    }));
  };

  const handleChange = (e, index, fieldName) => {
    const updatedArray = [...formData[fieldName]];
    updatedArray[index] = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: updatedArray,
    }));
  };

  const handleAddField = (fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: [...prevData[fieldName], ""],
    }));
  };

  const handleRemoveField = (index, fieldName) => {
    const updatedArray = [...formData[fieldName]];
    updatedArray.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: updatedArray,
    }));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: Array.isArray(value) ? value : [value],
    }));
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;

    const newValue = Array.isArray(value) ? value : [value];
    setFormData((prevData) => ({
      ...prevData,
      category: newValue,
    }));

    validateField('category', newValue);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: checked };

      if (name === 'is_paid') {
        if (!checked) {
          updatedData = {
            ...updatedData,
            price: { amount: 0, currency: 'INR' },
            special_price: 0,
            special_price_from: null,
            special_price_to: null,
          };
        }
      }

      if (name === 'is_certificate') {
        if (!checked) {
          updatedData = { ...updatedData, certificate_description: '' };
        }
      }

      return updatedData;
    });
  };


  const handleDateChange = (date, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
    validateField(name, date);
  };

  const handleScheduleDateChange = (date, index) => {
    setFormData((prevData) => {
      const updatedSchedule = [...prevData.schedule];
      updatedSchedule[index].date = date;
      return {
        ...prevData,
        schedule: updatedSchedule,
      };
    });
  };

  const handleTimeChange = (time, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: time,
    }));
    validateField(name, time);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (name.startsWith('price')) {
        return {
          ...prevData,
          price: {
            ...prevData.price,
            [name.split('.')[1]]: name === 'price.amount'
              ? (value === '' ? 0 : parseFloat(value))
              : value,
          },
        };
      } else if (name === 'special_price' || name === 'special_price_from' || name === 'special_price_to') {
        return {
          ...prevData,
          [name]: name === 'special_price' ? (value === '' ? 0 : parseFloat(value)) : value,
        };
      }

      return prevData;
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleArrayItemChange = (index, field, subField, value) => {
    setFormData((prevData) => {
      const newArray = [...prevData[field]];
      newArray[index] = { ...newArray[index], [subField]: value };
      return { ...prevData, [field]: newArray };
    });
  };

  const handleAddArrayItem = (field) => {
    setFormData((prevData) => {
      const newItem = field === 'skills' ? { tag: '', learning: '' } :
        field === 'your_learning' || field === 'for_whom' ? { tag: '', description: '' } :
          field === 'schedule' ? { day: prevData.schedule.length + 1, time: '', date: null } :
            {};
      return { ...prevData, [field]: [...prevData[field], newItem] };
    });
  };

  const handleRemoveArrayItem = (index, field) => {
    setFormData((prevData) => {
      const newArray = [...prevData[field]];
      newArray.splice(index, 1);
      return { ...prevData, [field]: newArray };
    });
  };

  const handleFaqChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      faq: value,
    }));
  };

  const handleSyllabusChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      syllabus: value,
    }));
  };

  const validateField = (name, value) => {
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
      case 'instructor':
        error = value.length > 0 ? '' : 'At least one instructor is required';
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
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });
    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e) => {
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

      formData.instructor.forEach((instructor, index) => {
        formDataToSend.append(`event[instructor][${index}]`, instructor);
      });

      formData.category.forEach((categoryId, index) => {
        formDataToSend.append(`event[category][${index}]`, categoryId);
      });

      if (formData.is_paid) {
        formDataToSend.append('event[price][amount]', formData.price.amount.toString());
        formDataToSend.append('event[price][currency]', formData.price.currency);
        formDataToSend.append('event[special_price]', formData.special_price.toString());
        formDataToSend.append('event[special_price_from]', formData.special_price_from ? dayjs(formData.special_price_from).format('YYYY-MM-DD') : '');
        formDataToSend.append('event[special_price_to]', formData.special_price_to ? dayjs(formData.special_price_to).format('YYYY-MM-DD') : '');
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

      formDataToSend.append('eventDetails[faq]', formData.faq);

      formDataToSend.append('eventDetails[is_certificate]', formData.is_certificate.toString());
      if (formData.is_certificate && formData.certificate_description) {
        formDataToSend.append('eventDetails[certificate_description]', formData.certificate_description);
      }

      formDataToSend.append('eventDetails[syllabus]', formData.syllabus);

      formData.includes.forEach((includeItem, index) => {
        const includeObject = { title: includeItem };
        formDataToSend.append(`eventDetails[includes][${index}]`, JSON.stringify(includeObject));
      });

      formData.language.forEach((language, index) => {
        formDataToSend.append(`eventDetails[language][${index}]`, language);
      });

      if (formData.image) {
        formDataToSend.append('event[image]', formData.image);
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/event/create`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Event created successfully!',
          severity: 'success',
        });
        router.push('/events')
      } else {
        throw new Error(response.data.message || 'Failed to create event');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server response:', error.response.data);
        if (error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          const newErrors = {};
          serverErrors.forEach((err) => {
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
                    required
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
                    required
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

            <Grid item xs={12} sm={6} lg={6} xl={6}>
              <Box>
                <Typography component="label" sx={labelStyle} className="text-black">
                  Instructors
                </Typography>
                <FormControl fullWidth error={!!errors.instructor}>
                  <Select
                    required
                    multiple
                    id="instructor"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleSelectChange}
                    sx={selectStyle}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const instructor = instructors.find(i => i._id === value);
                          return (
                            <Chip
                              key={value}
                              label={instructor ? `${instructor.first_name} ${instructor.last_name}` : value}
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
                  {errors.instructor && <Typography color="error">{errors.instructor}</Typography>}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={6}>
              <Box>
                <Typography component="label" sx={labelStyle} className="text-black">
                  Category
                </Typography>
                <FormControl fullWidth error={!!errors.category}>
                  <Select
                    required
                    id="category"
                    name="category"
                    multiple
                    value={formData.category}
                    onChange={handleCategoryChange}
                    sx={selectStyle}
                    renderValue={(selected) => {
                      return selected
                        .map((id) => {
                          const category = categories.find((cat) => cat._id === id);
                          return category ? category.name : '';
                        })
                        .join(', ');
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        <Checkbox checked={formData.category.includes(category._id)} />
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && <Typography color="error">{errors.category}</Typography>}
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={6}>
              <Box>
                <Typography component="label" sx={labelStyle} className="text-black">
                  Syllabus
                </Typography>
                <FormControl fullWidth margin="normal" required>
                  <Select
                    required
                    name="syllabus"
                    value={formData.syllabus || ''}
                    onChange={handleSyllabusChange}
                  >
                    {syllabus?.map(syllabuses => (
                      <MenuItem key={syllabuses._id} value={syllabuses._id}>{syllabuses.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={6}>
              <Box>
                <Typography component="label" sx={labelStyle} className="text-black">
                  Faq
                </Typography>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Faq</InputLabel>
                  <Select
                    required
                    name="faq"
                    value={formData.faq || ''}
                    onChange={handleFaqChange}
                  >
                    {faqs.map(page => (
                      <MenuItem key={page._id} value={page._id}>{page.title}</MenuItem>
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
                {/* Price Amount */}
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
                        name="price.amount"
                        type="number"
                        value={formData.price.amount}
                        onChange={handlePriceChange}
                        required
                        sx={inputStyle}
                      />
                    </FormControl>
                  </Box>
                </Grid>

                {/* Price Currency */}
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
                        name="price.currency"
                        value={formData.price.currency}
                        onChange={handlePriceChange}
                        required
                        sx={inputStyle}
                      />
                    </FormControl>
                  </Box>
                </Grid>

                {/* Special Price */}
                <Grid item xs={12} sm={6} lg={6} xl={4}>
                  <Typography component="h5" sx={labelStyle} className="text-black">
                    Special Price Amount
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    name="special_price"
                    value={formData.special_price}
                    onChange={handlePriceChange}
                    sx={{ ...selectStyle }}
                  />
                </Grid>

                {/* Special Price Start Date */}
                <Grid item xs={12} sm={6} lg={6} xl={4}>
                  <Typography component="h5" sx={labelStyle} className="text-black">
                    Special Price Start Date
                  </Typography>
                  <DatePicker
                    value={formData.special_price_from}
                    onChange={(date) => handleDateChange(date, 'special_price_from')}
                    sx={{ width: '100%', ...selectStyle }}
                    slotProps={{
                      textField: {
                        helperText: errors.special_price_from,
                        error: !!errors.special_price_from,
                      },
                    }}
                  />
                </Grid>

                {/* Special Price End Date */}
                <Grid item xs={12} sm={6} lg={6} xl={4}>
                  <Typography component="h5" sx={labelStyle} className="text-black">
                    Special Price End Date
                  </Typography>
                  <DatePicker
                    value={formData.special_price_to}
                    onChange={(date) => handleDateChange(date, 'special_price_to')}
                    sx={{ width: '100%', ...selectStyle }}
                    slotProps={{
                      textField: {
                        helperText: errors.special_price_to,
                        error: !!errors.special_price_to,
                      },
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Typography component="label">Languages</Typography>
              {formData.language.map((lang, index) => (
                <Box key={index} display="flex" alignItems="center" mb={1}>
                  <TextField
                    fullWidth
                    label={`Language ${index + 1}`}
                    value={lang}
                    onChange={(e) => handleChange(e, index, "language")}
                  />
                  <IconButton onClick={() => handleRemoveField(index, "language")} disabled={formData.language.length === 1}>
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button onClick={() => handleAddField("language")} startIcon={<AddIcon />}>
                Add Language
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography component="label">Includes</Typography>
              {formData.includes.map((inc, index) => (
                <Box key={index} display="flex" alignItems="center" mb={1}>
                  <TextField
                    fullWidth
                    label={`Includes ${index + 1}`}
                    value={inc}
                    onChange={(e) => handleChange(e, index, "includes")}
                  />
                  <IconButton onClick={() => handleRemoveField(index, "includes")} disabled={formData.includes.length === 1}>
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button onClick={() => handleAddField("includes")} startIcon={<AddIcon />}>
                Add Includes
              </Button>
            </Grid>

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
                required
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
                    required
                    label="Tag"
                    value={skill.tag}
                    onChange={(e) => handleArrayItemChange(index, 'skills', 'tag', e.target.value)}
                    sx={inputStyle}
                  />
                  <TextField
                    required
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
                    required
                    label="Tag"
                    value={item.tag}
                    onChange={(e) => handleArrayItemChange(index, 'your_learning', 'tag', e.target.value)}
                    sx={inputStyle}
                  />
                  <TextField
                    required
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
                    required
                    label="Tag"
                    value={item.tag}
                    onChange={(e) => handleArrayItemChange(index, 'for_whom', 'tag', e.target.value)}
                    sx={inputStyle}
                  />
                  <TextField
                    required
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
              <Grid item xs={12} sm={12} lg={12} xl={12}>
                <Typography variant="h6" gutterBottom>Certificate</Typography>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Certificate Description</InputLabel>
                  <Select
                    label="Enter certificate description"
                    required
                    name="certificate_description"
                    value={formData.certificate_description ?? ""}
                    onChange={handleCertificateChange}
                  >
                    {certificate.map((page) => (
                      <MenuItem key={page._id} value={page._id}>
                        {page.certification_title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography component="h5" sx={labelStyle} className="text-black">
                Schedule
              </Typography>
              {formData.schedule.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    required
                    label="Day"
                    type="number"
                    value={item.day}
                    onChange={(e) => handleArrayItemChange(index, 'schedule', 'day', e.target.value)}
                    sx={inputStyle}
                  />
                  <TextField
                    required
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
                    required
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
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider >
  );
};

export default CreateAnEvent;