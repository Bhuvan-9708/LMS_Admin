import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import AddEventLanding from "@/components/CMS/AddEventLandingDetails";

export default function Page() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="breadcrumb-card">
                <h5>Event Landing</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>Event Landing</li>
                </ul>
            </div>
            <AddEventLanding />
        </>
    );
}
