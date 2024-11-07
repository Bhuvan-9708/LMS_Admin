"use client";
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import NextLink from 'next/link';
import EditFaq from "@/components/CMS/EditFaq";

export default function EditFaqPage() {
    const { id } = useParams();
    const [faqId, setFaqId] = useState("");

    useEffect(() => {
        if (Array.isArray(id)) {
            setFaqId(id[0]);
        } else if (id) {
            setFaqId(id);
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
            <EditFaq faqId={faqId} />
        </>
    );
}
