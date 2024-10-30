import * as React from "react";
import NextLink from 'next/link';
import CustomersTable from "@/components/CRM/LandingPageQueries";

export default function Page() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb-card">
        <h5>Landing Page Queries</h5>

        <ul className="breadcrumb">
          <li>
            <NextLink href="/dashboard/ecommerce/">
              <i className="material-symbols-outlined">home</i>
              Dashboard
            </NextLink>
          </li>
          <li>CRM</li>
          <li>Queries</li>
        </ul>
      </div>

      <CustomersTable />
    </>
  );
}
