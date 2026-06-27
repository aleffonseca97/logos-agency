import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/logos/button";
import { Container } from "@/components/logos/container";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center"
    >
      <Container className="flex max-w-lg flex-col items-center gap-6">
        <p className="text-brand-primary logos-font-heading text-6xl font-bold">
          404
        </p>
        <h1 className="logos-text-display-sm text-logos-text">Page not found</h1>
        <p className="text-logos-text-muted text-base leading-relaxed">
          The resource you are looking for does not exist or has been moved.
          Return to the {siteConfig.name} homepage.
        </p>
        <Button render={<Link href="/" />} variant="cta" size="lg">
          Back to home
        </Button>
      </Container>
    </main>
  );
}
