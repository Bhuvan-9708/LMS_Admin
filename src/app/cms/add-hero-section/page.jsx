import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import AddHeroSection from "@/components/CMS/AddHeroSection";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>Add Hero Section</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>Add Hero Section</li>
                </ul>
            </div>
            <AddHeroSection />
        </>
    );
}
