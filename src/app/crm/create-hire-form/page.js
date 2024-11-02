import * as React from "react";
import NextLink from 'next/link';
import CreateHireForm from "@/components/CRM/CreateHireForm";

export default function Page() {
    return (
        <>
            <div className="breadcrumb-card">
                <h5>Create Hire Form</h5>

                <ul className="breadcrumb">
                    <li>
                        <NextLink href="/dashboard/ecommerce/">
                            <i className="material-symbols-outlined">home</i>
                            Dashboard
                        </NextLink>
                    </li>
                    <li>CRM</li>
                    <li>Create Hire Form</li>
                </ul>
            </div>
            <CreateHireForm />
        </>
    );
}
