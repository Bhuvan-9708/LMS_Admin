import * as React from "react";
import NextLink from 'next/link';
import AddTemplate from "@/components/CMS/CreateTemplates";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>Instructors</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>LMS</li>
                    <li>Instructors</li>
                </ul>
            </div>
            <AddTemplate />
        </>
    );
}
