import * as React from "react";
import NextLink from 'next/link';
import Categories from "@/components/LMS/Categories/CategoriesTable";

export default function Page() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="breadcrumb-card">
                <h5>Create Categories</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>LMS</li>
                    <li>Add Categories</li>
                </ul>
            </div>

            <Categories />
        </>
    );
}
