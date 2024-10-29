"use client";

import * as React from "react";
import {
    Card,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    IconButton,
    Button,
    Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import styles from "@/components/LMS/Search.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface Course {
    _id: string;
    course_id: String;
    questions: Array<{
        question: string;
        possible_answers: string[];
        is_required: boolean;
        question_type: string;
        _id: string;
    }>;
    is_active: boolean;
    createdAt: string;
}

const CourseEnrollmentList: React.FC = () => {
    const [enrollmentForms, setEnrollmentForms] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const router = useRouter();

    const handleAddCourses = () => {
        router.push('/lms/add-course-enroll');
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredCourses = enrollmentForms.filter((enrollmentForm) =>
        enrollmentForm.course_id
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredCourses.length) : 0;

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banner/delete/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete Banner");
            }
            setEnrollmentForms(prevCourses => prevCourses.filter(course => course._id !== id));

        } catch (error) {
            console.error("Failed to delete Banner", error);

        }
    };

    useEffect(() => {
        const fetchEnrollmentForms = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/enrollmentform/`
                );
                const data = await response.json();
                setEnrollmentForms(data.data);
            } catch (error) {
                console.error("Error fetching course enrollment forms:", error);
            }
        };

        fetchEnrollmentForms();
    }, []);

    return (
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
                        placeholder="Search course here..."
                        onChange={handleSearchChange}
                    />
                </Box>

                <Box sx={{ padding: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Button variant="contained" color="primary" onClick={handleAddCourses}>
                        Add Course
                    </Button>
                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="courses table">
                    <TableHead className="bg-primary-50">
                        <TableRow>
                            {["ID", "Course", "Questions", "Status", "Created At", "Action"].map((header, index) => (
                                <TableCell
                                    key={index}
                                    sx={{
                                        fontWeight: "500",
                                        padding: "10px 24px",
                                        fontSize: "14px",
                                    }}
                                    className="text-black border-bottom"
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course) => (
                            <TableRow key={course._id}>
                                <TableCell>{course._id}</TableCell>
                                <TableCell>{course.course_id}</TableCell>
                                <TableCell>{course.questions.length}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={course.is_active ? 'Active' : 'Inactive'}
                                        color={course.is_active ? 'success' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton aria-label="view" color="primary" onClick={() => router.push(`/cms/view-enroll-course/${course._id}`)}>
                                        <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>visibility</i>
                                    </IconButton>
                                    <IconButton aria-label="edit" color="secondary" onClick={() => router.push(`/cms/edit-enroll-course/${course._id}`)}>
                                        <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</i>
                                    </IconButton>
                                    <IconButton aria-label="delete" color="error" onClick={() => handleDelete(course._id)}>
                                        <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</i>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}

export default CourseEnrollmentList;
