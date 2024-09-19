// File path: /styles/left-sidebar-menu.scss

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { Box, Typography } from "@mui/material";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#3a4252" : "#f6f7f9",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    // marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  // borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

interface LeftSidebarProps {
  toggleActive: () => void;
}

const LeftSidebarMenu: React.FC<LeftSidebarProps> = ({ toggleActive }) => {
  const pathname = usePathname();

  const [expanded, setExpanded] = React.useState<string | false>("panel1");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <>
      <div className="leftSidebarDark">
        <div className="left-sidebar-menu">
          <div className="logo">
            <Link href="/dashboard/ecommerce/">
              <Image
                src="/images/logo-icon.svg"
                alt="logo-icon"
                width={26}
                height={26}
              />
              <span>Trezo</span>
            </Link>
          </div>

          <Box className="burger-menu" onClick={toggleActive}>
            <span className="top-bar"></span>
            <span className="middle-bar"></span>
            <span className="bottom-bar"></span>
          </Box>

          <div className="sidebar-inner">
            <div className="sidebar-menu">
              <Typography
                className="sub-title"
                sx={{
                  display: "block",
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                MAIN
              </Typography>

              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <i className="material-symbols-outlined">dashboard</i>
                  <span className="title">Dashboard</span>
                  <span className="trezo-badge">5</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/dashboard/ecommerce/"
                        className={`sidemenu-link ${
                          pathname === "/dashboard/ecommerce/" ? "active" : ""
                        }`}
                      >
                        eCommerce
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/dashboard/crm/"
                        className={`sidemenu-link ${
                          pathname === "/dashboard/crm/" ? "active" : ""
                        }`}
                      >
                        CRM
                        <span className="trezo-badge">Hot</span>
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/dashboard/project-management/"
                        className={`sidemenu-link ${
                          pathname === "/dashboard/project-management/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Project Management
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/dashboard/lms/"
                        className={`sidemenu-link ${
                          pathname === "/dashboard/lms/" ? "active" : ""
                        }`}
                      >
                        LMS
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/dashboard/helpdesk/"
                        className={`sidemenu-link ${
                          pathname === "/dashboard/helpdesk/" ? "active" : ""
                        }`}
                      >
                        HelpDesk
                        <span className="trezo-badge style-two">Top</span>
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel2d-content"
                  id="panel2d-header"
                >
                  <i className="material-symbols-outlined">note_stack</i>
                  <span className="title">Front Pages</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/"
                        className={`sidemenu-link ${
                          pathname === "/" ? "active" : ""
                        }`}
                      >
                        Home
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/front-pages/features/"
                        className={`sidemenu-link ${
                          pathname === "/front-pages/features/" ? "active" : ""
                        }`}
                      >
                        Features
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/front-pages/team/"
                        className={`sidemenu-link ${
                          pathname === "/front-pages/team/" ? "active" : ""
                        }`}
                      >
                        Our Team
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/front-pages/faq/"
                        className={`sidemenu-link ${
                          pathname === "/front-pages/faq/" ? "active" : ""
                        }`}
                      >
                        FAQ’s
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/front-pages/contact/"
                        className={`sidemenu-link ${
                          pathname === "/front-pages/contact/" ? "active" : ""
                        }`}
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Typography
                className="sub-title"
                sx={{
                  display: "block",
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                APPS
              </Typography>

              <Link
                href="/apps/to-do-list/"
                className={`sidebar-menu-link ${
                  pathname === "/apps/to-do-list/" ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined">
                  format_list_bulleted
                </i>
                <span className="title">To Do List</span>
              </Link>

              <Link
                href="/apps/calendar/"
                className={`sidebar-menu-link ${
                  pathname === "/apps/calendar/" ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined">date_range</i>
                <span className="title">Calendar</span>
              </Link>

              <Link
                href="/apps/contacts/"
                className={`sidebar-menu-link ${
                  pathname === "/apps/contacts/" ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined">contact_page</i>
                <span className="title">Contacts</span>
              </Link>

              <Link
                href="/apps/chat/"
                className={`sidebar-menu-link ${
                  pathname === "/apps/chat/" ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined">chat</i>
                <span className="title">Chat</span>
              </Link>

              <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel3d-content"
                  id="panel3d-header"
                >
                  <i className="material-symbols-outlined">mail</i>
                  <span className="title">Email</span>
                  <span className="trezo-badge style-two">3</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/apps/email/"
                        className={`sidemenu-link ${
                          pathname === "/apps/email/" ? "active" : ""
                        }`}
                      >
                        Inbox
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/apps/email/compose/"
                        className={`sidemenu-link ${
                          pathname === "/apps/email/compose/" ? "active" : ""
                        }`}
                      >
                        Compose
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/apps/email/read/"
                        className={`sidemenu-link ${
                          pathname === "/apps/email/read/" ? "active" : ""
                        }`}
                      >
                        Read
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Link
                href="/apps/kanban-board/"
                className={`sidebar-menu-link ${
                  pathname === "/apps/kanban-board/" ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined">team_dashboard</i>
                <span className="title">Kanban Board</span>
              </Link>

              <Accordion
                expanded={expanded === "panel4"}
                onChange={handleChange("panel4")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel4d-content"
                  id="panel4d-header"
                >
                  <i className="material-symbols-outlined">folder_open</i>
                  <span className="title">File Manager</span>
                  <span className="trezo-badge style-three">7</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/apps/file-manager/"
                        className={`sidemenu-link ${
                          pathname === "/apps/file-manager/" ? "active" : ""
                        }`}
                      >
                        My Drive
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/apps/file-manager/assets/"
                        className={`sidemenu-link ${
                          pathname === "/apps/file-manager/assets/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Assets
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/apps/file-manager/projects/"
                        className={`sidemenu-link ${
                          pathname === "/apps/file-manager/projects/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Projects
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/apps/file-manager/personal/"
                        className={`sidemenu-link ${
                          pathname === "/apps/file-manager/personal/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Personal
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/apps/file-manager/applications/"
                        className={`sidemenu-link ${
                          pathname === "/apps/file-manager/applications/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Applications
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/apps/file-manager/documents/"
                        className={`sidemenu-link ${
                          pathname === "/apps/file-manager/documents/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Documents
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/apps/file-manager/media/"
                        className={`sidemenu-link ${
                          pathname === "/apps/file-manager/media/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Media
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Typography
                className="sub-title"
                sx={{
                  display: "block",
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                PAGES
              </Typography>

              <Accordion
                expanded={expanded === "panel5"}
                onChange={handleChange("panel5")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel5d-content"
                  id="panel5d-header"
                >
                  <i className="material-symbols-outlined">shopping_cart</i>
                  <span className="title">eCommerce</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/" ? "active" : ""
                        }`}
                      >
                        Products Grid
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/products-list/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/products-list/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Products List
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/products-list/details/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/products-list/details/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Product Details
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/create-product/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/create-product/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Create Product
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/edit-product/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/edit-product/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Edit Product
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/cart/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/cart/" ? "active" : ""
                        }`}
                      >
                        Cart
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/checkout/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/checkout/" ? "active" : ""
                        }`}
                      >
                        Checkout
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/orders/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/orders/" ? "active" : ""
                        }`}
                      >
                        Orders
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/orders/details/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/orders/details/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Order Details
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/orders/create/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/orders/create/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Create Order
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/orders/tracking/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/orders/tracking/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Order Tracking
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/customers/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/customers/" ? "active" : ""
                        }`}
                      >
                        Customers
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/customers/details/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/customers/details/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Customer Details
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/categories/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/categories/" ? "active" : ""
                        }`}
                      >
                        Categories
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/sellers/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/sellers/" ? "active" : ""
                        }`}
                      >
                        Sellers
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/sellers/details/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/sellers/details/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Seller Details
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/sellers/create/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/sellers/create/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Create Seller
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/reviews/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/reviews/" ? "active" : ""
                        }`}
                      >
                        Reviews
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ecommerce/refunds/"
                        className={`sidemenu-link ${
                          pathname === "/ecommerce/refunds/" ? "active" : ""
                        }`}
                      >
                        Refunds
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel6"}
                onChange={handleChange("panel6")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel6d-content"
                  id="panel6d-header"
                >
                  <i className="material-symbols-outlined">handshake</i>
                  <span className="title">CRM</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/crm/contacts/"
                        className={`sidemenu-link ${
                          pathname === "/crm/contacts/" ? "active" : ""
                        }`}
                      >
                        Contacts
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/crm/customers/"
                        className={`sidemenu-link ${
                          pathname === "/crm/customers/" ? "active" : ""
                        }`}
                      >
                        Customers
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/crm/leads/"
                        className={`sidemenu-link ${
                          pathname === "/crm/leads/" ? "active" : ""
                        }`}
                      >
                        Leads
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/crm/deals/"
                        className={`sidemenu-link ${
                          pathname === "/crm/deals/" ? "active" : ""
                        }`}
                      >
                        Deals
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel7"}
                onChange={handleChange("panel7")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel7d-content"
                  id="panel7d-header"
                >
                  <i className="material-symbols-outlined">description</i>
                  <span className="title">Project Management</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/project-management/project-overview/"
                        className={`sidemenu-link ${
                          pathname === "/project-management/project-overview/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Project Overview
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/project-management/projects-list/"
                        className={`sidemenu-link ${
                          pathname === "/project-management/projects-list/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Projects List
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/project-management/create-project/"
                        className={`sidemenu-link ${
                          pathname === "/project-management/create-project/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Create Project
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/project-management/clients/"
                        className={`sidemenu-link ${
                          pathname === "/project-management/clients/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Clients
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/project-management/teams/"
                        className={`sidemenu-link ${
                          pathname === "/project-management/teams/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Teams
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/project-management/kanban-board/"
                        className={`sidemenu-link ${
                          pathname === "/project-management/kanban-board/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Kanban Board
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/project-management/users/"
                        className={`sidemenu-link ${
                          pathname === "/project-management/users/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Users
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel8"}
                onChange={handleChange("panel8")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel8d-content"
                  id="panel8d-header"
                >
                  <i className="material-symbols-outlined">auto_stories</i>
                  <span className="title">LMS</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/lms/courses/"
                        className={`sidemenu-link ${
                          pathname === "/lms/courses/" ? "active" : ""
                        }`}
                      >
                        Courses List
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/lms/courses/details/"
                        className={`sidemenu-link ${
                          pathname === "/lms/courses/details/" ? "active" : ""
                        }`}
                      >
                        Course Details
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/lms/courses/lesson-preview/"
                        className={`sidemenu-link ${
                          pathname === "/lms/courses/lesson-preview/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Lesson Preview
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/lms/create-course/"
                        className={`sidemenu-link ${
                          pathname === "/lms/create-course/" ? "active" : ""
                        }`}
                      >
                        Create Course
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/lms/edit-course/"
                        className={`sidemenu-link ${
                          pathname === "/lms/edit-course/" ? "active" : ""
                        }`}
                      >
                        Edit Course
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/lms/instructors/"
                        className={`sidemenu-link ${
                          pathname === "/lms/instructors/" ? "active" : ""
                        }`}
                      >
                        Instructors
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel9"}
                onChange={handleChange("panel9")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel9d-content"
                  id="panel9d-header"
                >
                  <i className="material-symbols-outlined">support</i>
                  <span className="title">HelpDesk</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/helpdesk/tickets/"
                        className={`sidemenu-link ${
                          pathname === "/helpdesk/tickets/" ? "active" : ""
                        }`}
                      >
                        Tickets
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/helpdesk/tickets/details/"
                        className={`sidemenu-link ${
                          pathname === "/helpdesk/tickets/details/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Ticket Details
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/helpdesk/agents/"
                        className={`sidemenu-link ${
                          pathname === "/helpdesk/agents/" ? "active" : ""
                        }`}
                      >
                        Agents
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/helpdesk/reports/"
                        className={`sidemenu-link ${
                          pathname === "/helpdesk/reports/" ? "active" : ""
                        }`}
                      >
                        Reports
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel10"}
                onChange={handleChange("panel10")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel10d-content"
                  id="panel10d-header"
                >
                  <i className="material-symbols-outlined">local_activity</i>
                  <span className="title">Events</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/events/"
                        className={`sidemenu-link ${
                          pathname === "/events/" ? "active" : ""
                        }`}
                      >
                        Events Grid
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/events/list"
                        className={`sidemenu-link ${
                          pathname === "/events/list/" ? "active" : ""
                        }`}
                      >
                        Events List
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/events/details/"
                        className={`sidemenu-link ${
                          pathname === "/events/details/" ? "active" : ""
                        }`}
                      >
                        Event Details
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/events/create-an-event/"
                        className={`sidemenu-link ${
                          pathname === "/events/create-an-event/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Create An Event
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/events/edit-an-event/"
                        className={`sidemenu-link ${
                          pathname === "/events/edit-an-event/" ? "active" : ""
                        }`}
                      >
                        Edit An Event
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel11"}
                onChange={handleChange("panel11")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel11d-content"
                  id="panel11d-header"
                >
                  <i className="material-symbols-outlined">share</i>
                  <span className="title">Social</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/social/profile/"
                        className={`sidemenu-link ${
                          pathname === "/social/profile/" ? "active" : ""
                        }`}
                      >
                        Profile
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/social/settings/"
                        className={`sidemenu-link ${
                          pathname === "/social/settings/" ? "active" : ""
                        }`}
                      >
                        Settings
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel12"}
                onChange={handleChange("panel12")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel12d-content"
                  id="panel12d-header"
                >
                  <i className="material-symbols-outlined">content_paste</i>
                  <span className="title">Invoices</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/invoices/"
                        className={`sidemenu-link ${
                          pathname === "/invoices/" ? "active" : ""
                        }`}
                      >
                        Invoices
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/invoices/details/"
                        className={`sidemenu-link ${
                          pathname === "/invoices/details/" ? "active" : ""
                        }`}
                      >
                        Invoice Details
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/invoices/create/"
                        className={`sidemenu-link ${
                          pathname === "/invoices/create/" ? "active" : ""
                        }`}
                      >
                        Create Invoice
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/invoices/edit/"
                        className={`sidemenu-link ${
                          pathname === "/invoices/edit/" ? "active" : ""
                        }`}
                      >
                        Edit Details
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel13"}
                onChange={handleChange("panel13")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel13d-content"
                  id="panel13d-header"
                >
                  <i className="material-symbols-outlined">person</i>
                  <span className="title">Users</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/users/"
                        className={`sidemenu-link ${
                          pathname === "/users/" ? "active" : ""
                        }`}
                      >
                        Team Members
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/users/users-list/"
                        className={`sidemenu-link ${
                          pathname === "/users/users-list/" ? "active" : ""
                        }`}
                      >
                        Users List
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/users/add-user/"
                        className={`sidemenu-link ${
                          pathname === "/users/add-user/" ? "active" : ""
                        }`}
                      >
                        Add User
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel14"}
                onChange={handleChange("panel14")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel14d-content"
                  id="panel14d-header"
                >
                  <i className="material-symbols-outlined">account_box</i>
                  <span className="title">Profile</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/profile/"
                        className={`sidemenu-link ${
                          pathname === "/profile/" ? "active" : ""
                        }`}
                      >
                        User Profile
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/profile/teams/"
                        className={`sidemenu-link ${
                          pathname === "/profile/teams/" ? "active" : ""
                        }`}
                      >
                        Teams
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/profile/projects/"
                        className={`sidemenu-link ${
                          pathname === "/profile/projects/" ? "active" : ""
                        }`}
                      >
                        Projects
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Link href="/starter/" className="sidebar-menu-link">
                <i className="material-symbols-outlined">star_border</i>
                <span className="title">Starter</span>
              </Link>

              <Typography
                className="sub-title"
                sx={{
                  display: "block",
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                MODULES
              </Typography>

              <Accordion
                expanded={expanded === "panel15"}
                onChange={handleChange("panel15")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel15d-content"
                  id="panel15d-header"
                >
                  <i className="material-symbols-outlined">emoji_emotions</i>
                  <span className="title">Icons</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/icons/material-symbols/"
                        className={`sidemenu-link ${
                          pathname === "/icons/material-symbols/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Material Symbols
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/icons/remixicon/"
                        className={`sidemenu-link ${
                          pathname === "/icons/remixicon/" ? "active" : ""
                        }`}
                      >
                        RemixIcon
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel16"}
                onChange={handleChange("panel16")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel16d-content"
                  id="panel16d-header"
                >
                  <i className="material-symbols-outlined">qr_code_scanner</i>
                  <span className="title">UI Elements</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/autocomplete/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/autocomplete/" ? "active" : ""
                        }`}
                      >
                        Autocomplete
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/buttons/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/buttons/" ? "active" : ""
                        }`}
                      >
                        Buttons
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/checkbox/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/checkbox/" ? "active" : ""
                        }`}
                      >
                        Checkbox
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/radio/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/radio/" ? "active" : ""
                        }`}
                      >
                        Radio
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/rating/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/rating/" ? "active" : ""
                        }`}
                      >
                        Rating
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/select/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/select/" ? "active" : ""
                        }`}
                      >
                        Select
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/slider/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/slider/" ? "active" : ""
                        }`}
                      >
                        Slider
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/switch/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/switch/" ? "active" : ""
                        }`}
                      >
                        Switch
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/transfer-list/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/transfer-list/" ? "active" : ""
                        }`}
                      >
                        Transfer List
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/avatar/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/avatar/" ? "active" : ""
                        }`}
                      >
                        Avatar
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/badge/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/badge/" ? "active" : ""
                        }`}
                      >
                        Badge
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/chip/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/chip/" ? "active" : ""
                        }`}
                      >
                        Chip
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/divider/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/divider/" ? "active" : ""
                        }`}
                      >
                        Divider
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/table/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/table/" ? "active" : ""
                        }`}
                      >
                        Table
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/tooltip/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/tooltip/" ? "active" : ""
                        }`}
                      >
                        Tooltip
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/typography/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/typography/" ? "active" : ""
                        }`}
                      >
                        Typography
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/alerts/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/alerts/" ? "active" : ""
                        }`}
                      >
                        Alerts
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/dialog/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/dialog/" ? "active" : ""
                        }`}
                      >
                        Dialog
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/progress/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/progress/" ? "active" : ""
                        }`}
                      >
                        Progress
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/snackbar/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/snackbar/" ? "active" : ""
                        }`}
                      >
                        Snackbar
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/accordion/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/accordion/" ? "active" : ""
                        }`}
                      >
                        Accordion
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/card/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/card/" ? "active" : ""
                        }`}
                      >
                        Card
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/breadcrumbs/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/breadcrumbs/" ? "active" : ""
                        }`}
                      >
                        Breadcrumbs
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/drawer/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/drawer/" ? "active" : ""
                        }`}
                      >
                        Drawer
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/pagination/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/pagination/" ? "active" : ""
                        }`}
                      >
                        Pagination
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/speed-dial/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/speed-dial/" ? "active" : ""
                        }`}
                      >
                        Speed Dial
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/stepper/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/stepper/" ? "active" : ""
                        }`}
                      >
                        Stepper
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/tabs/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/tabs/" ? "active" : ""
                        }`}
                      >
                        Tabs
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/image-list/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/image-list/" ? "active" : ""
                        }`}
                      >
                        Image List
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/transitions/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/transitions/" ? "active" : ""
                        }`}
                      >
                        Transitions
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/tree-view/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/tree-view/" ? "active" : ""
                        }`}
                      >
                        Tree View
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/masonry/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/masonry/" ? "active" : ""
                        }`}
                      >
                        Masonry
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/ui-kit/timeline/"
                        className={`sidemenu-link ${
                          pathname === "/ui-kit/timeline/" ? "active" : ""
                        }`}
                      >
                        Timeline
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel17"}
                onChange={handleChange("panel17")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel17d-content"
                  id="panel17d-header"
                >
                  <i className="material-symbols-outlined">table_chart</i>
                  <span className="title">Tables</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/tables/"
                        className={`sidemenu-link ${
                          pathname === "/tables/" ? "active" : ""
                        }`}
                      >
                        Basic Table
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/tables/data-table/"
                        className={`sidemenu-link ${
                          pathname === "/tables/data-table/" ? "active" : ""
                        }`}
                      >
                        Data Table
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel18"}
                onChange={handleChange("panel18")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel18d-content"
                  id="panel18d-header"
                >
                  <i className="material-symbols-outlined">forum</i>
                  <span className="title">Forms</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/forms/basic-elements/"
                        className={`sidemenu-link ${
                          pathname === "/forms/basic-elements/" ? "active" : ""
                        }`}
                      >
                        Basic Elements
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/forms/advanced-elements/"
                        className={`sidemenu-link ${
                          pathname === "/forms/advanced-elements/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Advanced Elements
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/forms/editors/"
                        className={`sidemenu-link ${
                          pathname === "/forms/editors/" ? "active" : ""
                        }`}
                      >
                        Editors
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/forms/file-uploader/"
                        className={`sidemenu-link ${
                          pathname === "/forms/file-uploader/" ? "active" : ""
                        }`}
                      >
                        File Uploader
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel19"}
                onChange={handleChange("panel19")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel19d-content"
                  id="panel19d-header"
                >
                  <i className="material-symbols-outlined">pie_chart</i>
                  <span className="title">Charts</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/charts/line/"
                        className={`sidemenu-link ${
                          pathname === "/charts/line/" ? "active" : ""
                        }`}
                      >
                        Line
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/charts/area/"
                        className={`sidemenu-link ${
                          pathname === "/charts/area/" ? "active" : ""
                        }`}
                      >
                        Area
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/charts/column/"
                        className={`sidemenu-link ${
                          pathname === "/charts/column/" ? "active" : ""
                        }`}
                      >
                        Column
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/charts/mixed/"
                        className={`sidemenu-link ${
                          pathname === "/charts/mixed/" ? "active" : ""
                        }`}
                      >
                        Mixed
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/charts/radialbar/"
                        className={`sidemenu-link ${
                          pathname === "/charts/radialbar/" ? "active" : ""
                        }`}
                      >
                        RadialBar
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/charts/radar/"
                        className={`sidemenu-link ${
                          pathname === "/charts/radar/" ? "active" : ""
                        }`}
                      >
                        Radar
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/charts/pie/"
                        className={`sidemenu-link ${
                          pathname === "/charts/pie/" ? "active" : ""
                        }`}
                      >
                        Pie
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/charts/polar/"
                        className={`sidemenu-link ${
                          pathname === "/charts/polar/" ? "active" : ""
                        }`}
                      >
                        Polar
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/charts/more/"
                        className={`sidemenu-link ${
                          pathname === "/charts/more/" ? "active" : ""
                        }`}
                      >
                        More
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel20"}
                onChange={handleChange("panel20")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel20d-content"
                  id="panel20d-header"
                >
                  <i className="material-symbols-outlined">lock_open</i>
                  <span className="title">Authentication</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/authentication/sign-in/"
                        className={`sidemenu-link ${
                          pathname === "/authentication/sign-in/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Sign In
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/authentication/sign-up/"
                        className={`sidemenu-link ${
                          pathname === "/authentication/sign-up/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Sign Up
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/authentication/forgot-password/"
                        className={`sidemenu-link ${
                          pathname === "/authentication/forgot-password/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Forgot Password
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/authentication/reset-password/"
                        className={`sidemenu-link ${
                          pathname === "/authentication/reset-password/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Reset Password
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/authentication/confirm-email/"
                        className={`sidemenu-link ${
                          pathname === "/authentication/confirm-email/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Confirm Email
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/authentication/lock-screen/"
                        className={`sidemenu-link ${
                          pathname === "/authentication/lock-screen/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Lock Screen
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/authentication/logout/"
                        className="sidemenu-link"
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel21"}
                onChange={handleChange("panel21")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel21d-content"
                  id="panel21d-header"
                >
                  <i className="material-symbols-outlined">content_copy</i>
                  <span className="title">Extra Pages</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/pricing/"
                        className={`sidemenu-link ${
                          pathname === "/pricing/" ? "active" : ""
                        }`}
                      >
                        Pricing
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/timeline/"
                        className={`sidemenu-link ${
                          pathname === "/timeline/" ? "active" : ""
                        }`}
                      >
                        Timeline
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/faq/"
                        className={`sidemenu-link ${
                          pathname === "/faq/" ? "active" : ""
                        }`}
                      >
                        FAQ
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/gallery/"
                        className={`sidemenu-link ${
                          pathname === "/gallery/" ? "active" : ""
                        }`}
                      >
                        Gallery
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/testimonials/"
                        className={`sidemenu-link ${
                          pathname === "/testimonials/" ? "active" : ""
                        }`}
                      >
                        Testimonials
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/search/"
                        className={`sidemenu-link ${
                          pathname === "/search/" ? "active" : ""
                        }`}
                      >
                        Search
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/coming-soon/"
                        className={`sidemenu-link ${
                          pathname === "/coming-soon/" ? "active" : ""
                        }`}
                      >
                        Coming Soon
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/blank-page/"
                        className={`sidemenu-link ${
                          pathname === "/blank-page/" ? "active" : ""
                        }`}
                      >
                        Blank Page
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel22"}
                onChange={handleChange("panel22")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel22d-content"
                  id="panel22d-header"
                >
                  <i className="material-symbols-outlined">error</i>
                  <span className="title">Errors</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/not-found/"
                        className={`sidemenu-link ${
                          pathname === "/not-found/" ? "active" : ""
                        }`}
                      >
                        404 Error Page
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/internal-error/"
                        className={`sidemenu-link ${
                          pathname === "/internal-error/" ? "active" : ""
                        }`}
                      >
                        Internal Error
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Link
                href="/widgets/"
                className={`sidebar-menu-link ${
                  pathname === "/widgets/" ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined">widgets</i>
                <span className="title">Widgets</span>
              </Link>

              <Link
                href="/maps/"
                className={`sidebar-menu-link ${
                  pathname === "/maps/" ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined">map</i>
                <span className="title">Maps</span>
              </Link>

              <Link
                href="/notifications/"
                className={`sidebar-menu-link ${
                  pathname === "/notifications/" ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined">notifications</i>
                <span className="title">Notifications</span>
              </Link>

              <Link
                href="/members/"
                className={`sidebar-menu-link ${
                  pathname === "/members/" ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined">people</i>
                <span className="title">Members</span>
              </Link>

              <Typography
                className="sub-title"
                sx={{
                  display: "block",
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                OTHERS
              </Typography>

              <Link href="/my-profile" className="sidebar-menu-link">
                <i className="material-symbols-outlined">account_circle</i>
                <span className="title">My Profile</span>
              </Link>

              <Accordion
                expanded={expanded === "panel23"}
                onChange={handleChange("panel23")}
                className="mat-accordion"
              >
                <AccordionSummary
                  className="mat-summary"
                  aria-controls="panel23d-content"
                  id="panel23d-header"
                >
                  <i className="material-symbols-outlined">settings</i>
                  <span className="title">Settings</span>
                </AccordionSummary>

                <AccordionDetails className="mat-details">
                  <ul className="sidebar-sub-menu">
                    <li className="sidemenu-item">
                      <Link
                        href="/settings/"
                        className={`sidemenu-link ${
                          pathname === "/settings/" ? "active" : ""
                        }`}
                      >
                        Account Settings
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/settings/change-password/"
                        className={`sidemenu-link ${
                          pathname === "/settings/change-password/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Change Password
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/settings/connections/"
                        className={`sidemenu-link ${
                          pathname === "/settings/connections/" ? "active" : ""
                        }`}
                      >
                        Connections
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/settings/privacy-policy/"
                        className={`sidemenu-link ${
                          pathname === "/settings/privacy-policy/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Privacy Policy
                      </Link>
                    </li>

                    <li className="sidemenu-item">
                      <Link
                        href="/settings/terms-conditions/"
                        className={`sidemenu-link ${
                          pathname === "/settings/terms-conditions/"
                            ? "active"
                            : ""
                        }`}
                      >
                        Terms & Conditions
                      </Link>
                    </li>
                  </ul>
                </AccordionDetails>
              </Accordion>

              <Link
                href="/authentication/logout/"
                className="sidebar-menu-link"
              >
                <i className="material-symbols-outlined">logout</i>
                <span className="title">Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebarMenu;
