import * as React from "react";
import Grid from "@mui/material/Grid";
import NextLink from 'next/link';
import FeedBack from "@/components/CMS/FeedBack";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>FeedBack</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>FeedBack</li>
                </ul>
            </div>
            <FeedBack />
        </>
    );
}
