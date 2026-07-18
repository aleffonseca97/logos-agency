"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { ContactScrollButton } from "@/components/contact";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Logo } from "@/components/ui/Logo";
import { siteCta, siteNav } from "@/config/navigation";
import { useActiveSection, useScrolled } from "@/hooks/use-section-nav";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/logos/drawer";
import {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarInner,
  NavbarItem,
  NavbarLink,
  NavbarMobileTrigger,
  NavbarNav,
} from "@/components/logos/navbar";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const mobileMenuId = "site-mobile-menu";

export function SiteHeader() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(24);
  const sectionIds = useMemo(
    () => siteNav.map((item) => item.href.replace("#", "")),
    [],
  );
  const activeSection = useActiveSection(sectionIds);

  return (
    <Navbar variant="floating" data-scrolled={scrolled ? "true" : "false"}>
      <NavbarInner>
        <NavbarBrand className="min-w-0 shrink-0">
          <Link
            href="/"
            className="inline-flex items-center rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            aria-label={t("homeAriaLabel")}
          >
            <Logo variant="navbar" priority />
          </Link>
        </NavbarBrand>

        <div className="flex min-w-0 items-center gap-1 sm:gap-2 lg:gap-4">
          <NavbarNav aria-label={t("mainNav")}>
            {siteNav.map((item) => {
              const sectionId = item.href.replace("#", "");
              return (
                <NavbarItem key={item.href}>
                  <NavbarLink
                    href={item.href}
                    active={activeSection === sectionId}
                  >
                    {t(item.labelKey)}
                  </NavbarLink>
                </NavbarItem>
              );
            })}
          </NavbarNav>

          <NavbarActions>
            <ContactScrollButton
              variant="nav-cta"
              size="md"
              className="hidden font-medium sm:inline-flex"
            >
              {t(siteCta.primary.labelKey)}
            </ContactScrollButton>

            <LanguageSwitcher />

            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <NavbarMobileTrigger
                  aria-controls={mobileMenuId}
                  aria-expanded={open}
                  aria-label={open ? t("closeMenu") : t("openMenu")}
                >
                  {open ? (
                    <X className="size-5" aria-hidden />
                  ) : (
                    <Menu className="size-5" aria-hidden />
                  )}
                </NavbarMobileTrigger>
              </DrawerTrigger>
              <DrawerContent id={mobileMenuId} variant="glass">
                <DrawerHeader>
                  <DrawerTitle className="sr-only">
                    {t("mobileMenuTitle")}
                  </DrawerTitle>
                </DrawerHeader>
                <nav
                  aria-label={t("mobileNav")}
                  className="flex flex-col gap-0.5 px-4 pb-6"
                >
                  {siteNav.map((item) => {
                    const sectionId = item.href.replace("#", "");
                    const isActive = activeSection === sectionId;
                    return (
                      <DrawerClose key={item.href} asChild>
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "rounded-lg px-3 py-3 text-base font-medium transition-colors",
                            isActive
                              ? "bg-logos-surface/60 text-logos-text"
                              : "text-logos-text-muted hover:bg-logos-surface/60 hover:text-logos-text",
                          )}
                        >
                          {t(item.labelKey)}
                        </Link>
                      </DrawerClose>
                    );
                  })}
                  <DrawerClose asChild>
                    <ContactScrollButton
                      variant="nav-cta"
                      size="lg"
                      fullWidth
                      className="mt-4 font-medium"
                      onClick={() => setOpen(false)}
                    >
                      {t(siteCta.primary.labelKey)}
                    </ContactScrollButton>
                  </DrawerClose>
                </nav>
              </DrawerContent>
            </Drawer>
          </NavbarActions>
        </div>
      </NavbarInner>
    </Navbar>
  );
}
