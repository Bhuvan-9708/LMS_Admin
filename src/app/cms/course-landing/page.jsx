import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import CourseLanding from "@/components/CMS/CourseLanding";

export default function Page() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="breadcrumb-card">
                <h5>Course Landing</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>CourseLanding</li>
                </ul>
            </div>
            <CourseLanding />
        </>
    );
}
