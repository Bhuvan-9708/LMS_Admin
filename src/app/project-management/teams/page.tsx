import * as React from "react";
import NextLink from 'next/link';  
import TeamsCard from "@/components/ProjectManagement/TeamsCard";

export default function Page() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb-card">
        <h5>Teams</h5>

        <ul className="breadcrumb">
          <li>
            <NextLink href="/dashboard/ecommerce/">
              <i className="material-symbols-outlined">home</i>
              Dashboard
            </NextLink>
          </li>
          <li>Project Management</li>
          <li>Teams</li>
        </ul>
      </div>

      <TeamsCard />
    </>
  );
}
