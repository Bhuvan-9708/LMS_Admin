import * as React from "react";
import NextLink from 'next/link';
import AddBanner from "@/components/CMS/AddBanner";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>CMS</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CMS</li>
                    <li>Add Banner</li>
                </ul>
            </div>
            <AddBanner />
        </>
    );
}
