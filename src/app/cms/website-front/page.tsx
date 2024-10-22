import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import WebsiteFront from "@/components/CMS/WebsiteFront";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>Website Front</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>Website Front</li>
                </ul>
            </div>
            <WebsiteFront />
        </>
    );
}
