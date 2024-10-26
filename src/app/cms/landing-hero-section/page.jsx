import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import LandingPageHeroSection from "@/components/CMS/LandingPageHeroSection";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>Homepage</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>Landing Page Hero Section</li>
                </ul>
            </div>
            <LandingPageHeroSection />
        </>
    );
}
