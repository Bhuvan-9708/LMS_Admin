import * as React from "react";
import NextLink from 'next/link';
import AddCourseLandingDetails from "@/components/CMS/AddCourseLandingDetails";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>Add Course Landing Details</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>Add Course Landing Details</li>
                </ul>
            </div>
            <AddCourseLandingDetails />
        </>
    );
}
