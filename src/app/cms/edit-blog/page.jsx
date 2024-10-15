import * as React from "react";
import NextLink from 'next/link';
import EditBlog from "@/components/CMS/EditBlog";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>Blogs</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>Blogs</li>
                </ul>
            </div>
            <EditBlog />
        </>
    );
}
