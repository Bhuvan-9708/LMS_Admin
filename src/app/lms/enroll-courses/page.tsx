import * as React from "react";
import NextLink from 'next/link';
import EnrollCourses from "@/components/LMS/EnrollCoursesForm";

export default function Page() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="breadcrumb-card">
                <h5>Create Course</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>LMS</li>
                    <li>Course Enroll</li>
                </ul>
            </div>

            <EnrollCourses />
        </>
    );
}
