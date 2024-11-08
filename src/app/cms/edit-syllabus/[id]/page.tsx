"use client";
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import NextLink from 'next/link';
import EditSyllabus from "@/components/CMS/EditSyllabus";

export default function EditSyllabusPage() {
    const { id } = useParams();
    console.log(">>>>>>>>", id);
    const [syllabusId, setSyllabusId] = useState<string>("");

    useEffect(() => {
        if (Array.isArray(id)) {
            setSyllabusId(id[0]);
        } else if (id) {
            setSyllabusId(id);
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
                    <li>Edit Syllabus</li>
                </ul>
            </div>
            <EditSyllabus syllabusId={syllabusId} />
        </>
    );
}
