import { setRequestLocale } from "next-intl/server";

import dynamic from "next/dynamic";

import { HeroSection } from "@/components/logos/sections/hero";
import { HomeFooter } from "@/components/logos/sections/home";
import { SectionSkeleton } from "@/components/layout/section-skeleton";
import { getWhatsAppNumber } from "@/lib/env";
import { isValidLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

const ServicesSection = dynamic(
  () =>
    import("@/components/logos/sections/services-section").then(
      (mod) => mod.ServicesSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

const ClientsSection = dynamic(
  () =>
    import("@/components/logos/sections/clients-section").then(
      (mod) => mod.ClientsSection,
    ),
  { loading: () => null },
);

const TechnologiesSection = dynamic(
  () =>
    import("@/components/logos/sections/technologies-section").then(
      (mod) => mod.TechnologiesSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

const CasesSection = dynamic(
  () =>
    import("@/components/logos/sections/cases-section").then(
      (mod) => mod.CasesSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

const TestimonialsSection = dynamic(
  () =>
    import("@/components/logos/sections/testimonials-section").then(
      (mod) => mod.TestimonialsSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

const FaqSection = dynamic(
  () =>
    import("@/components/logos/sections/faq-section").then(
      (mod) => mod.FaqSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

const ContactSection = dynamic(
  () =>
    import("@/components/contact/contact-section").then(
      (mod) => mod.ContactSection,
    ),
  { loading: () => <SectionSkeleton /> },
);

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const whatsappNumber = getWhatsAppNumber();

  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <HeroSection />
      <ServicesSection />
      <ClientsSection />
      <TechnologiesSection />
      <CasesSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection whatsappNumber={whatsappNumber} />
      <HomeFooter />
    </main>
  );
}
