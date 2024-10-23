import * as React from "react";
import NextLink from 'next/link';
import AddCourseInfo from "@/components/LMS/AddCourseInfo";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>Add Course Info</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>LMS</li>
                    <li>Add Course Info</li>
                </ul>
            </div>

            <AddCourseInfo />
        </>
    );
}
