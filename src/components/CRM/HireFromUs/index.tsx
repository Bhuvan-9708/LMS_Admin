"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Box,
    TablePagination,
    Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "@/components/LMS/Search.module.css";
import { useRouter } from "next/navigation";

interface Contact {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    designation: string;
    company_name: string;
}

export default function ApplicationList() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const router = useRouter();

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hire-from-us/form-data`);
            if (!response.ok) throw new Error("Failed to fetch contact details");

            const data = await response.json();
            if (data && Array.isArray(data.data)) {
                setContacts(data.data);
                console.log(">>>", data.data);
            } else {
                setContacts([]);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete contact");

            setContacts((prevContacts) => prevContacts.filter((contact) => contact._id !== id));
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredContacts = contacts.filter((contact) =>
        Object.values(contact)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm)
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
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: "25px" }}>
                    <Box component="form" className={styles.searchBox} sx={{ width: { sm: "265px" } }}>
                        <label>
                            <i className="material-symbols-outlined">search</i>
                        </label>
                        <input
                            type="text"
                            className={styles.inputSearch}
                            placeholder="Search contacts..."
                            onChange={handleSearchChange}
                        />
                    </Box>
                </Box>

                {error && <Alert severity="error">{error}</Alert>}

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 800 }} aria-label="contact list table">
                        <TableHead className="bg-primary-50">
                            <TableRow>
                                {["Name", "Email", "Phone", "Designation", "Company Name", "Message", "Actions"].map(
                                    (header, index) => (
                                        <TableCell key={index} sx={{ fontWeight: "500", fontSize: "14px" }}>
                                            {header}
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredContacts
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((contact) => (
                                        <TableRow key={contact._id}>
                                            <TableCell>{contact.name}</TableCell>
                                            <TableCell>{contact.email}</TableCell>
                                            <TableCell>{contact.phone}</TableCell>
                                            <TableCell>{contact.designation}</TableCell>
                                            <TableCell>{contact.company_name}</TableCell>
                                            <TableCell>{contact.message}</TableCell>
                                            <TableCell>
                                                <IconButton aria-label="delete" color="error" onClick={() => handleDelete(contact._id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredContacts.length}
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
