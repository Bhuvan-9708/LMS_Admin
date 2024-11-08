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
    TableFooter,
    TableRow,
    TablePagination,
    Paper,
    IconButton,
    Switch,
    Button,
    Tooltip,
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

const WebsiteFront: React.FC = () => {
    const [websitefront, setWebsitefront] = useState<any[]>([]);
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

    const handleAddSection = () => {
        router.push('/cms/add-website-front');
    }

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/website-front/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch website-front");
                }
                const data = await response.json();
                setWebsitefront(data.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSections();
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filterWebsitefront = websitefront.filter(section =>
        section.page_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Table pagination
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filterWebsitefront.length) : 0;

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleToggleActive = async (id: string, newStatus: boolean) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/website-front/status/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: newStatus }),
            });
            if (!response.ok) {
                throw new Error("Failed to update active status");
            }
            setWebsitefront(prevSections =>
                prevSections.map(section =>
                    section._id === id ? { ...section, is_active: newStatus } : section
                )
            );
            setSnackbarMessage('Website Front active status updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Failed to update Website Front active status", error);
            setSnackbarMessage('Failed to update Website Front active status');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/section/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete Website Front");
            }
            setWebsitefront(prevSections => prevSections.filter(section => section._id !== id));
            setSnackbarMessage('Website Front deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Failed to delete Website Front", error);
            setSnackbarMessage('Failed to delete Website Front');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
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
                            placeholder="Search Website Front here..."
                            onChange={handleSearchChange}
                        />
                    </Box>

                    <Box sx={{ padding: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Button variant="contained" color="primary" onClick={handleAddSection}>
                            Add Website Front
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
                        <Table sx={{ minWidth: 650 }} aria-label="websitefront table">
                            <TableHead className="bg-primary-50">
                                <TableRow>
                                    {["ID", "Page Name", "Hero Section", "Banner", "Active", "Action"].map((header, index) => (
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
                                {filterWebsitefront.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((section, index) => (
                                    <TableRow key={section._id}>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>{section.page_name}</TableCell>
                                        <TableCell>
                                            {section.hero_section ? section.hero_section.title : "No Hero Section Title"}
                                        </TableCell>
                                        <TableCell>
                                            {section.banner ? section.banner.title : "No Banner Title"}
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={section.is_active}
                                                onChange={(e) => handleToggleActive(section._id, e.target.checked)}
                                                inputProps={{ "aria-label": "controlled" }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton aria-label="view" color="primary" onClick={() => router.push(`/cms/websitefront/${section._id}`)}>
                                                <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>visibility</i>
                                            </IconButton>
                                            <IconButton aria-label="edit" color="secondary" onClick={() => router.push(`/cms/edit-section/${section._id}`)}>
                                                <i className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</i>
                                            </IconButton>
                                            <IconButton aria-label="delete" color="error" onClick={() => handleDelete(section._id)}>
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
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 50]}
                                        colSpan={6}
                                        count={websitefront.length}
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
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default WebsiteFront;