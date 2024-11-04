import * as React from "react";
import NextLink from 'next/link';
import EditHomepage from "@/components/CMS/EditHomepage";

interface Homepage {
    _id: string;
}

export async function generateStaticParams() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home`);
    const homepages = await response.json();

    console.log("API response for homepages:", homepages); 

    const data = Array.isArray(homepages)
        ? homepages
        : Array.isArray(homepages.data)
            ? homepages.data
            : null;

    if (!data) {
        throw new Error("Expected an array but got something else");
    }

    return data.map((homepage: Homepage) => ({
        id: homepage._id,
    }));
}


interface PageProps {
    params: {
        id: string;
    };
}

export default async function Page({ params }: PageProps) {
    const { id } = params;

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
            <EditHomepage homepageId={id} />
        </>
    );
}
