"use client";
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import NextLink from 'next/link';
import EditSection from "@/components/CMS/EditSection"; 

export default function EditSectionPage() {
    const { id } = useParams();
    const [sectionId, setSectionId] = useState<string>("");

    useEffect(() => {
        if (Array.isArray(id)) {
            setSectionId(id[0]);
        } else if (id) {
            setSectionId(id);
        }
    }, [id]);

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
                    <li>Edit Section</li>
                </ul>
            </div>
            <EditSection sectionId={sectionId} />
        </>
    );
}
