import * as React from "react";
import NextLink from 'next/link';
import Application from "@/components/CRM/ApplicationForm";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>Application Form</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CRM</li>
                    <li>Application Form</li>
                </ul>
            </div>
            <Application />
        </>
    );
}
