'use client'

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Dialog,
  Card,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import styles from "@/components/LMS/Search.module.css";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    parent_category: '',
    image: null,
    image_icon: null,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/get-all-categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data.data.categories);
      console.log(data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleSwitchChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      is_active: e.target.checked
    }));
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach(key => {
      if (key === 'image' || key === 'image_icon') {
        if (formData[key]) {
          formDataToSend.append(key === 'image' ? 'category-image' : 'category-image-icon', formData[key]);
        }
      } else if (key === 'parent_category' && formData[key] === '') {
        formDataToSend.append(key, 'null');
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const url = editingCategory
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/category/update-category/${editingCategory._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/category/create`;
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to save category');
      }

      const result = await response.json();
      console.log('Category saved successfully:', result);
      setSnackbar({
        open: true,
        message: 'Category created successfully!',
        severity: 'success',
      });
      setOpenDialog(false);
      setEditingCategory(null);
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      setSnackbar({
        open: true,
        message: 'Error creating Category. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      parent_category: category.parent_category || '',
      image: null,
      image_icon: null,
    });
    setOpenDialog(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${categoryId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete category');
        }

        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      is_active: true,
      parent_category: '',
      image: null,
      image_icon: null,
    });
  };

  const renderCategoryOptions = (categories, level = 0) => {
    return categories.map(category => (
      <MenuItem key={category._id} value={category._id} style={{ paddingLeft: `${level * 20}px` }}>
        {category.name}
      </MenuItem>
    ));
  };

  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "7px",
          mb: "25px",
          padding: { xs: "18px", sm: "20px", lg: "25px" },
        }}
        className="rmui-card"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "25px",
          }}
        >
          <Box
            component="form"
            className={styles.searchBox}
            sx={{
              width: { sm: "265px" },
            }}
          >
            <label>
              <i className="material-symbols-outlined">search</i>
            </label>
            <input
              type="text"
              className={styles.inputSearch}
              placeholder="Search Category here..."
              onChange={handleSearchChange}
            />
          </Box>
          <Box sx={{ padding: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                resetForm();
                setEditingCategory(null);
                setOpenDialog(true);
              }}
              sx={{ mb: 2 }}
            >
              Add New Category
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="categories table">
            <TableHead className="bg-primary-50">
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Parent Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.is_active ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{category.parent_category ? categories.find(c => c._id === category.parent_category)?.name : 'None'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(category)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(category._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
            <IconButton
              aria-label="close"
              onClick={() => setOpenDialog(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="description"
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Switch
                        checked={formData.is_active}
                        onChange={handleSwitchChange}
                        name="is_active"
                        color="primary"
                      />
                      <Typography variant="body1">
                        {formData.is_active ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={1000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Card>
    </>
  );
};

export default CategoryManagement; 