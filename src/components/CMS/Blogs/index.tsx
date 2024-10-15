"use client";

import * as React from "react";
import {
    Card,
    Box,
    Typography,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableFooter,
    TableRow,
    TablePagination,
    Paper,
    IconButton,
    Select,
    Switch,
    Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import styles from "@/components/LMS/Search.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number
    ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    return (
        <Box sx={{ flexShrink: 0, display: "flex", gap: "10px", padding: "0 20px" }}>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
                sx={{ borderRadius: "4px", padding: "6px" }}
            >
                {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
                sx={{ borderRadius: "4px", padding: "6px" }}
            >
                {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
        </Box>
    );
}

const BlogTable: React.FC = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
    const router = useRouter();

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleAddBlog = () => {
        router.push('/cms/add-blog');
    }

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch blogs");
                }
                const data = await response.json();
                setBlogs(data.data.blogs);
                console.log(">>>>>", data.data.blogs);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Table pagination
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredBlogs.length) : 0;

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleToggleActive = async (id: string, newStatus: boolean) => {
        try {
            const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/blog/status/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: newStatus }),
            });
            if (!response.ok) {
                throw new Error("Failed to update active status");
            }
            setBlogs(prevBlogs =>
                prevBlogs.map(blog =>
                    blog._id === id ? { ...blog, is_active: newStatus } : blog
                )
            );
            setSnackbarMessage('Blog active status updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Failed to update blog active status", error);
            setSnackbarMessage('Failed to update blog active status');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/blog/status/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                throw new Error("Failed to update blog status");
            }
            setBlogs(prevBlogs =>
                prevBlogs.map(blog =>
                    blog._id === id ? { ...blog, status: newStatus } : blog
                )
            );
            setSnackbarMessage('Blog status updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Failed to update blog status", error);
            setSnackbarMessage('Failed to update blog status');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };


    const handleDelete = async (id: string) => {
        try {
            const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/blog/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete blog");
            }
            setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== id));
        } catch (error) {
            console.error("Failed to delete blog", error);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

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
                            placeholder="Search blog here..."
                            onChange={handleSearchChange}
                        />
                    </Box>

                    <Box sx={{ padding: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Button variant="contained" color="primary" onClick={handleAddBlog}>
                            Add Blog
                        </Button>
                    </Box>
                </Box>

                <Box
                    sx={{
                        marginLeft: "-25px",
                        marginRight: "-25px",
                    }}
                >
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="email templates table">
                            <TableHead className="bg-primary-50">
                                <TableRow>
                                    {["ID", "Title", "Author", "Published Date", "Status", "Active", "Action"].map((header, index) => (
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
                                {filteredBlogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((blog, index) => (
                                    <TableRow key={blog._id}>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>{blog.title}</TableCell>
                                        <TableCell>{blog.author?.first_name} {blog.author?.last_name}</TableCell>
                                        <TableCell>{blog.published_date ? new Date(blog.published_date).toLocaleDateString() : "N/A"}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={blog.status}
                                                onChange={(e) => handleStatusChange(blog._id, e.target.value as string)}
                                            >
                                                <MenuItem value="draft">Draft</MenuItem>
                                                <MenuItem value="published">Published</MenuItem>
                                                <MenuItem value="archived">Archived</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={blog.is_active}
                                                onChange={(e) => handleToggleActive(blog._id, e.target.checked)}
                                                inputProps={{ "aria-label": "controlled" }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton aria-label="view" color="primary" onClick={() => router.push(`/cms/blogs/${blog._id}`)}>
                                                <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>visibility</i>
                                            </IconButton>
                                            <IconButton aria-label="edit" color="secondary" onClick={() => router.push(`/cms/edit-blog/${blog._id}`)}>
                                                <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</i>
                                            </IconButton>
                                            <IconButton aria-label="delete" color="error" onClick={() => handleDelete(blog._id)}>
                                                <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</i>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={7} />
                                    </TableRow>
                                )}
                            </TableBody>
                            <Snackbar
                                open={snackbarOpen}
                                autoHideDuration={6000}
                                onClose={() => setSnackbarOpen(false)}
                            >
                                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                                    {snackbarMessage}
                                </Alert>
                            </Snackbar>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 50]}
                                        colSpan={7}
                                        count={blogs.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: {
                                                "aria-label": "rows per page",
                                            },
                                            native: true,
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Box>
            </Card>
        </>
    );
};

export default BlogTable;