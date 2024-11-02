import * as React from "react";
import NextLink from 'next/link';
import EditHomepage from "@/components/CMS/EditHomepage";
import { useRouter } from 'next/router';

export default function Page() {
    const router = useRouter();
    const { id } = router.query;

    if (!id) {
        return <div>Loading...</div>;
    }
    
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
                    <li>Edit Homepage</li>
                </ul>
            </div>
            <EditHomepage homepageId={id as string} />
        </>
    );
}