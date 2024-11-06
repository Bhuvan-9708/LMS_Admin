// "use client"
// export const dynamic = 'force-dynamic';
// import { useState, useEffect } from "react";
// import * as React from "react";
// import { useParams } from 'next/navigation';
// import NextLink from 'next/link';
// import EditHomepage from "@/components/CMS/EditHomepage";

// export default function EditHomepagePage() {
//     const { id } = useParams();
//     console.log("homepage Id", id);
//     const [homepageId, setHomepageId] = useState<string>("");

//     useEffect(() => {
//         if (Array.isArray(id)) {
//             setHomepageId(id[0]); 
//         } else if (id) {
//             setHomepageId(id); 
//         }
//     }, [id]);

//     return (
//         <>
//             <div className="breadcrumb-card">
//                 <h5>CMS</h5>
//                 <ul className="breadcrumb">
//                     <li>
//                         <NextLink href="/dashboard/ecommerce/">
//                             <i className="material-symbols-outlined">home</i>
//                             Dashboard
//                         </NextLink>
//                     </li>
//                     <li>CMS</li>
//                     <li>Edit Homepage</li>
//                 </ul>
//             </div>
//             <EditHomepage homepageId={homepageId} />
//         </>
//     );
// }
