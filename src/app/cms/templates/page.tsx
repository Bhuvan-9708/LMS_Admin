import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import Templates from "@/components/CMS/TemplateListing";

export default function Page() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="breadcrumb-card">
                <h5>Template Details</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>Template</li>
                    <li>Template Details</li>
                </ul>
            </div>
            <Templates />
        </>
    );
}
