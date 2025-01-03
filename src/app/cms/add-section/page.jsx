import * as React from "react";
import NextLink from 'next/link';
import AddSection from "@/components/CMS/AddSection";

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
                    <li>Add Section</li>
                </ul>
            </div>
            <AddSection />
        </>
    );
}
