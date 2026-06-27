// ── Layout ──
export { Container, containerVariants } from "./container";
export { Section, sectionVariants } from "./section";

// ── Actions ──
export { Button, logosButtonVariants } from "./button";
export { CtaButton } from "./cta-button";
export { GlowButton } from "./glow-button";

// ── Display ──
export { Badge, logosBadgeVariants } from "./badge";
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
} from "./card";

// ── Form ──
export { Input, logosInputVariants } from "./input";
export { Textarea } from "./textarea";

// ── Overlay ──
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  modalContentVariants,
} from "./dialog";
export {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "./modal";
export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  drawerContentVariants,
} from "./drawer";

// ── Navigation & Disclosure ──
export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  accordionVariants,
} from "./accordion";
export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  logosTabsListVariants,
  tabsRootVariants,
} from "./tabs";
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  tooltipContentVariants,
} from "./tooltip";
export {
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarInner,
  NavbarItem,
  NavbarLink,
  NavbarMobileTrigger,
  NavbarNav,
  navbarVariants,
} from "./navbar";
export {
  Footer,
  FooterBottom,
  FooterBrand,
  FooterColumn,
  FooterColumnTitle,
  FooterCopyright,
  FooterInner,
  FooterLink,
  FooterNav,
  FooterTop,
  footerVariants,
} from "./footer";

// ── Shared utilities ──
export { cnVariants } from "./lib/cn-variants";
export type { FieldControlProps } from "./lib/form-field";
export { getFieldAriaProps } from "./lib/form-field";
export type { PolymorphicProps } from "./lib/polymorphic";

// ── Premium visual effects ──
export {
  AnimatedBackground,
  AnimatedGradient,
  AnimatedGrid,
  AuroraBackground,
  BackgroundBlur,
  CursorSpotlight,
  EffectContainer,
  EffectLayer,
  FloatingShapes,
  GlowBorder,
  GradientBorder,
  LightRays,
  MouseGlow,
  NoiseLayer,
  Particles,
  Spotlight,
  getIntensityConfig,
  INTENSITY_CONFIG,
} from "./effects";
export type {
  BaseEffectProps,
  EffectIntensity,
  EffectWrapperProps,
  IntensityConfig,
} from "./effects";

// ── Sections ──
export { HeroSection, HeroVisual } from "./sections/hero";
export {
  CasesSection,
  FaqSection,
  HomeFooter,
  ServicesSection,
  TechnologiesSection,
  TestimonialsSection,
} from "./sections/home";
