import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import AddSectionWorking from "@/components/CMS/AddSectionWorking";

export default function Page() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="breadcrumb-card">
                <h5>Add Section Working</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li> Add Section Working</li>
                </ul>
            </div>
            <AddSectionWorking />
        </>
    );
}
