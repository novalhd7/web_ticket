"use client";

import { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import Link from "next/link";

export default function NavbarWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <Navbar className="sticky inset-x-0 top-0 z-40 w-full bg-black backdrop-blur-sm shadow-md">
      {/* DESKTOP */}
      <NavBody>
        <NavbarLogo />

        <NavItems
          items={[
            { name: "Home", link: "/" },
            { name: "Booking", link: "/booking" },
            { name: "About", link: "/about" },
          ]}
        />

        <NavbarButton as={Link} href="/auth/Login">
          Login
        </NavbarButton>
      </NavBody>

      {/* MOBILE */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={open} onClick={() => setOpen(!open)} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={open} onClose={() => setOpen(false)}>
          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/booking" onClick={() => setOpen(false)}>
            Booking
          </Link>
          <Link href="/about" onClick={() => setOpen(false)}>
            About
          </Link>
          <NavbarButton as={Link} href="/auth/Login">
            Login
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
