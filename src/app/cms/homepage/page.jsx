import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import HomePage from "@/components/CMS/Homepage";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>CMS</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>HomePage Templates</li>
                    <li>HomePage Content</li>
                </ul>
            </div>
            <HomePage />
        </>
    );
}
