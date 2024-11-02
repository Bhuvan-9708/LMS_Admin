import * as React from "react";
import NextLink from 'next/link';
import HireFromUs from "@/components/CRM/HireFromUs";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>Hire From Us</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CRM</li>
                    <li>Hire From Us</li>
                </ul>
            </div>
            <HireFromUs />
        </>
    );
}
