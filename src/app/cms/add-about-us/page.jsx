import * as React from "react";
import NextLink from 'next/link';
import AddAboutUs from "@/components/CMS/AddAboutUs";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>Add About Us</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>About Us Content</li>
                </ul>
            </div>
            <AddAboutUs />
        </>
    );
}
