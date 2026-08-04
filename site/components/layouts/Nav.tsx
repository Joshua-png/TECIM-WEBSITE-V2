"use client";

import { useEffect, useState } from "react";
import type { NavLink } from "@/lib/chrome";

const DEFAULT_LINKS: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#values", label: "Values" },
  { href: "#vision", label: "Vision" },
  { href: "#services", label: "Services" },
  { href: "#events", label: "Events" },
  { href: "#gallery", label: "Gallery" },
];

export default function Nav({ links = DEFAULT_LINKS }: { links?: NavLink[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href !== "#contact" && active === href ? "active-link" : "";
  const isCta = (href: string) => href === "#contact";

  return (
    <>
      <nav className={`site-nav${scrolled ? " scrolled" : ""}`}>
        <a href="#" className="logo">
          TECIM<span>.</span>
        </a>
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={isCta(link.href) ? "nav-cta" : isActive(link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          className={`nav-toggle${open ? " open" : ""}`}
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
      <div className={`mobile-menu${open ? " open" : ""}`}>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={isCta(link.href) ? "mm-cta" : isActive(link.href)}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
