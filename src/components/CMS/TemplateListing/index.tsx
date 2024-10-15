"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Button,
  IconButton,
  Box,
  TablePagination,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "@/components/LMS/Search.module.css";
import { useRouter } from "next/navigation";

interface EmailTemplate {
  _id: string;
  notification_type: string;
  subject: string;
  description: string;
  is_active: boolean;
}

export default function EmailTemplateList() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();

  // Fetch email templates on mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Fetch templates function
  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://lms-v1-xi.vercel.app/api/template/");
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();
      setTemplates(data.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/email-templates/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update template status");
      }

      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template._id === id ? { ...template, is_active: !currentStatus } : template
        )
      );
    } catch (error) {
      console.error("Error updating template status:", error);
    }
  };

  // Handle Edit template
  const handleEdit = (id: string) => {
    // Implement edit functionality
    console.log("Edit template:", id);
  };

  // Handle Delete template
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/email-templates/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete template");
      }

      setTemplates((prevTemplates) =>
        prevTemplates.filter((template) => template._id !== id)
      );
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter templates based on search term
  const filteredTemplates = templates.filter((template) =>
    template.subject.toLowerCase().includes(searchTerm) ||
    template.notification_type.toLowerCase().includes(searchTerm)
  );

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
              placeholder="Search email templates..."
              onChange={handleSearchChange}
            />
          </Box>

          <Box
            sx={{
              padding: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button variant="contained" color="primary" onClick={() => router.push("/cms/create-template")}>
              Add Template
            </Button>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Table Container */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1200 }} aria-label="email templates table">
            <TableHead className="bg-primary-50">
              <TableRow>
                {["Notification Type", "Subject", "Description", "Active", "Actions"].map((header, index) => (
                  <TableCell key={index} sx={{ fontWeight: "500", fontSize: "14px" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((template) => (
                    <TableRow key={template._id}>
                      <TableCell>{template.notification_type}</TableCell>
                      <TableCell>{template.subject}</TableCell>
                      <TableCell>{template.description}</TableCell>
                      <TableCell>
                        <Switch
                          checked={template.is_active}
                          onChange={() => handleToggleActive(template._id, template.is_active)}
                          inputProps={{ "aria-label": "toggle active status" }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton aria-label="view" color="primary" onClick={() => router.push(`/cms/blogs/${template._id}`)}>
                          <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>visibility</i>
                        </IconButton>
                        <IconButton aria-label="edit" color="secondary" onClick={() => router.push(`/cms/edit-blog/${template._id}`)}>
                          <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</i>
                        </IconButton>
                        <IconButton aria-label="delete" color="error" onClick={() => handleDelete(template._id)}>
                          <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</i>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTemplates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Card>
    </>
  );
}
