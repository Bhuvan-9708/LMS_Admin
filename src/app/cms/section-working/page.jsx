import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import SectionWorking from "@/components/CMS/SectionWorking";

export default function Page() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="breadcrumb-card">
                <h5>Section Working</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>Section Working</li>
                </ul>
            </div>
            <SectionWorking />
        </>
    );
}
