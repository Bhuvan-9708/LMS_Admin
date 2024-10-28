"use client"

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    Chip,
    IconButton,
    Paper,
    Snackbar,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useRouter } from 'next/navigation';

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
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
        <Box sx={{ flexShrink: 0, display: 'flex', gap: '10px', padding: '0 20px' }}>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
                sx={{ borderRadius: '4px', padding: '6px' }}
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
                sx={{ borderRadius: '4px', padding: '6px' }}
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
        </Box>
    );
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface CourseLandingPage {
    _id: string;
    course_id: {
        _id: string;
        title: string;
    };
    title: string;
    is_active: boolean;
    createdAt: string;
}

const CourseLandingPageList: React.FC = () => {
    const [landingPages, setLandingPages] = useState<CourseLandingPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
    const router = useRouter();

    useEffect(() => {
        const fetchLandingPages = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/course/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch Course Landing Pages');
                }
                const data = await response.json();
                setLandingPages(data.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLandingPages();
    }, []);

    const handleAddLandingPage = () => {
        router.push('/cms/add-course-landing');
    };
    const handleAddLandingPageDetails = () => {
        router.push('/cms/add-course-landing-details');
    };
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredLandingPages = landingPages.filter(page =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleToggleActive = async (id: string, isChecked: boolean) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/course/status/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: isChecked }),
            });
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            setLandingPages(prevPages =>
                prevPages.map(page =>
                    page._id === id ? { ...page, is_active: isChecked } : page
                )
            );
            setSnackbarMessage('Landing page status updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Failed to update landing page status', error);
            setSnackbarMessage('Failed to update landing page status');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/landing-page/course/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete Landing Page');
            }
            setLandingPages(prevPages => prevPages.filter(page => page._id !== id));
            setSnackbarMessage('Landing page deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Failed to delete Landing Page', error);
            setSnackbarMessage('Failed to delete Landing Page');
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
            <Card sx={{ boxShadow: 'none', borderRadius: '7px', mb: '25px', padding: { xs: '18px', sm: '20px', lg: '25px' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '25px' }}>
                    <Box component="form" sx={{ width: { sm: '265px' } }}>
                        <input
                            type="text"
                            placeholder="Search Course Landing Page here..."
                            onChange={handleSearchChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </Box>

                    <Box sx={{ padding: 2, display: "flex", gap: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleAddLandingPage}>
                            Add Course Landing Page
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleAddLandingPageDetails}>
                            Add Course Landing Details
                        </Button>
                    </Box>
                </Box>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="course landing pages table">
                        <TableHead>
                            <TableRow>
                                {['ID', 'Title', 'Created At', 'Status', 'Action'].map((header, index) => (
                                    <TableCell key={index} sx={{ fontWeight: '500', padding: '10px 24px', fontSize: '14px' }}>
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredLandingPages
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((landingPage, index) => (
                                    <TableRow key={landingPage._id}>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        {/* <TableCell>{landingPage.course_id}</TableCell> */}
                                        <TableCell>{landingPage.title}</TableCell>
                                        <TableCell>{new Date(landingPage.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={landingPage.is_active}
                                                onChange={(e) => handleToggleActive(landingPage._id, e.target.checked)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                aria-label="view"
                                                color="primary"
                                                onClick={() => router.push(`/cms/course-landing-pages/${landingPage._id}`)}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>
                                            </IconButton>
                                            <IconButton
                                                aria-label="edit"
                                                color="secondary"
                                                onClick={() => router.push(`/cms/edit-course-landing-page/${landingPage._id}`)}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                                            </IconButton>
                                            <IconButton
                                                aria-label="delete"
                                                color="error"
                                                onClick={() => handleDelete(landingPage._id)}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50]}
                                    colSpan={6}
                                    count={filteredLandingPages.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
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
            </Card>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CourseLandingPageList;