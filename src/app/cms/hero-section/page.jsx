import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import HeroSection from "@/components/CMS/HeroSection";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>HeroSection</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>Hero Section</li>
                </ul>
            </div>
            <HeroSection />
        </>
    );
}
