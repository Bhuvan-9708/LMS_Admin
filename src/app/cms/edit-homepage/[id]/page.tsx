import * as React from "react";
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import EditHomepage from "@/components/CMS/EditHomepage";

interface Homepage {
    _id: string;
    title: string;
}

async function getHomepage(id: string): Promise<Homepage | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home/${id}`, { next: { revalidate: 60 } });
        if (!res.ok) throw new Error('Failed to fetch homepage');
        return res.json();
    } catch (error) {
        console.error('Error fetching homepage:', error);
        return null;
    }
}

export async function generateMetadata(
    { params }: { params: { id: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const homepage = await getHomepage(params.id);

    if (!homepage) {
        return {
            title: 'Homepage Not Found',
        };
    }

    return {
        title: `Edit Homepage - ${homepage.title}`,
    };
}

export default async function EditHomepagePage({ params }: { params: { id: string } }) {
    const homepage = await getHomepage(params.id);

    if (!homepage) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Homepage</h1>
            <EditHomepage homepageId={params.id} />
        </div>
    );
}