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
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function NavbarWrapper() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  const role = session?.user?.role;

  const menuItems = [
    { name: "Home", link: "/" },
    { name: "Booking", link: "/booking" },

    ...(session && role === "USER"
      ? [{ name: "My Booking", link: "/mybooking" }]
      : []),

    ...(session && role === "ADMIN"
      ? [
          { name: "Dashboard", link: "/admin/dashboard" },
          { name: "My Booking", link: "/mybooking" },
        ]
      : []),

    { name: "About", link: "/about" },
  ];

  return (
    <Navbar className="sticky inset-x-0 top-0 z-40 w-full bg-black/80 backdrop-blur-sm shadow-md">
      {/* DESKTOP */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={menuItems} />

        {!session ? (
          <NavbarButton as={Link} href="/auth/Login">
            Login
          </NavbarButton>
        ) : (
          <NavbarButton
            className="rounded hover:bg-red-600"
            onClick={() => signOut()}
          >
            Logout
          </NavbarButton>
        )}
      </NavBody>

      {/* MOBILE */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={open} onClick={() => setOpen(!open)} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={open} onClose={() => setOpen(false)}>
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {!session ? (
            <NavbarButton as={Link} href="/auth/Login">
              Login
            </NavbarButton>
          ) : (
            <NavbarButton
              className="rounded hover:bg-red-600"
              onClick={() => signOut()}
            >
              Logout
            </NavbarButton>
          )}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
