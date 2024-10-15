import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import Blogs from "@/components/CMS/Blogs";

export default function Page() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="breadcrumb-card">
                <h5>Blog Listing</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>Blog</li>
                    <li>Blog Listing</li>
                </ul>
            </div>
            <Blogs />
        </>
    );
}
