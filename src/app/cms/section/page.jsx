import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import Section from "@/components/CMS/Section";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>Page Templates Listing</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>Page Templates</li>
                    <li>Pages Content</li>
                </ul>
            </div>
            <Section />
        </>
    );
}
