import * as React from "react";
import NextLink from 'next/link';
import AddCourseDetails from "@/components/LMS/AddCourseDetails";

export default function Page() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="breadcrumb-card">
                <h5>Add Course Details</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>LMS</li>
                    <li>Add Course Details</li>
                </ul>
            </div>

            <AddCourseDetails />
        </>
    );
}
