"use client";

import * as React from "react";
import {
  Grid,
  Box,
  Typography,
  FormControl,
  TextField,
  styled,
  Button,
} from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import Image from "next/image";

const ContactUs: React.FC = () => {
  // Textarea
  const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#605DFF",
  };

  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    font-family: "Inter", sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 7px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: none;

    &:hover {
      border-color: ${blue[900]};
    }

    &:focus {
      border-color: ${blue[900]};
      box-shadow: none;
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
  );

  return (
    <>
      <Box
        className="contact-area"
        sx={{
          pb: { xs: "60px", sm: "60px", md: "80px", lg: "100px", xl: "150px" },
        }}
      >
        <Box
          sx={{
            maxWidth: {
              xs: "100%",
              sm: "700px",
              md: "720px",
              lg: "1140px",
              xl: "1320px",
            },
            mx: "auto",
            px: "12px",
          }}
        >
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 2, lg: 3 }}>
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <div className="fp-contact-image border-radius">
                <Image
                  src="/images/front-pages/contact.jpg"
                  className="border-radius"
                  alt="contact-image"
                  width={813}
                  height={1083}
                />
              </div>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={6}>
              <div className="fp-contact-content">
                <div className="section-title">
                  <div className="sub-title">
                    <span className="d-inline-block position-relative text-purple">
                      Contact Us
                    </span>
                  </div>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: {
                        xs: "24px",
                        md: "28px",
                        lg: "34px",
                        xl: "36px",
                      },
                    }}
                  >
                    How Can We Help? We Love to Hear From You. Send Us a
                    Message!
                  </Typography>
                </div>

                <Box component="form">
                  <Box mt="25px">
                    <FormControl fullWidth>
                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                        className="text-black"
                      >
                        Full Name
                      </Typography>

                      <TextField
                        label="Your full name"
                        variant="filled"
                        id="fullName"
                        name="fullName"
                        sx={{
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
                        }}
                      />
                    </FormControl>
                  </Box>

                  <Box mt="25px">
                    <FormControl fullWidth>
                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                        className="text-black"
                      >
                        Email Address
                      </Typography>

                      <TextField
                        label="Your email address"
                        variant="filled"
                        id="email"
                        name="email"
                        type="email"
                        sx={{
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
                        }}
                      />
                    </FormControl>
                  </Box>

                  <Box mt="25px">
                    <FormControl fullWidth>
                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                        className="text-black"
                      >
                        Phone Number
                      </Typography>

                      <TextField
                        label="Your phone number"
                        variant="filled"
                        id="email"
                        name="email"
                        sx={{
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
                        }}
                      />
                    </FormControl>
                  </Box>

                  <Box mt="25px">
                    <FormControl fullWidth>
                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                        className="text-black"
                      >
                        Message
                      </Typography>

                      <Textarea
                        aria-label="minimum height"
                        minRows={5}
                        placeholder="Type here..."
                      />
                    </FormControl>
                  </Box>

                  <Box mt="25px">
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "capitalize",
                        borderRadius: "6px",
                        fontWeight: "500",
                        fontSize: { xs: "13px", sm: "16px" },
                        padding: { xs: "10px 20px", sm: "10px 24px" },
                        color: "#fff !important",
                        boxShadow: "none",
                        width: "100%",
                      }}
                    >
                      <i className="material-symbols-outlined mr-5">
                        autorenew
                      </i>
                      Send
                    </Button>
                  </Box>
                </Box>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default ContactUs;
