import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import AboutUs from "@/components/CMS/AboutUs";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>About Us</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>About Us</li>
                </ul>
            </div>
            <AboutUs />
        </>
    );
}
