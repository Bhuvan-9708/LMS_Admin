"use client"
export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react";
import * as React from "react";
import { useParams } from 'next/navigation';
import NextLink from 'next/link';
import EditBanner from "@/components/CMS/EditBanner";

export default function EditBannerPage() {
    const { id } = useParams();
    const [bannerId, setbannerId] = useState<string>("");

    useEffect(() => {
        if (Array.isArray(id)) {
            setbannerId(id[0]);
        } else if (id) {
            setbannerId(id);
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
                    <li>Edit Banner</li>
                </ul>
            </div>
            <EditBanner bannerId={bannerId} />
        </>
    );
}