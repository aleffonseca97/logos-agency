"use client";

import { m, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FormEvent, useEffect, useMemo, useState } from "react";

import { useToast } from "@/components/logos/toast";
import { CtaButton } from "@/components/logos/cta-button";
import { cn } from "@/lib/utils";
import {
  createContactFormSchema,
  parseContactForm,
  validateContactField,
  zodErrorsToFormErrors,
  type ContactFormErrors,
  type ContactFormField,
} from "@/lib/validators/contact";

import { ContactSuccess } from "./contact-success";
import {
  ContactInput,
  ContactSelect,
  ContactTextarea,
} from "./contact-input";
import {
  INVESTMENT_RANGE_KEYS,
  PROJECT_TYPE_KEYS,
  initialContactFormData,
  type ContactFormData,
} from "./types";

export function ContactForm({ whatsappNumber }: { whatsappNumber: string }) {
  const t = useTranslations("contact");
  const tValidation = useTranslations("validation");
  const reduceMotion = useReducedMotion();
  const MotionButton = reduceMotion ? "div" : m.div;
  const { toast } = useToast();

  const validationMessages = useMemo(
    () => ({
      nameMin: tValidation("nameMin"),
      companyRequired: tValidation("companyRequired"),
      emailInvalid: tValidation("emailInvalid"),
      whatsappRequired: tValidation("whatsappRequired"),
      whatsappInvalid: tValidation("whatsappInvalid"),
      projectTypeRequired: tValidation("projectTypeRequired"),
      investmentRangeRequired: tValidation("investmentRangeRequired"),
      messageMin: tValidation("messageMin"),
      messageMax: tValidation("messageMax"),
    }),
    [tValidation],
  );

  const contactSchema = useMemo(
    () => createContactFormSchema(validationMessages),
    [validationMessages],
  );

  const projectTypeOptions = useMemo(
    () =>
      PROJECT_TYPE_KEYS.map((key) => ({
        value: key,
        label: t(`projectTypes.${key}`),
      })),
    [t],
  );

  const investmentRangeOptions = useMemo(
    () =>
      INVESTMENT_RANGE_KEYS.map((key) => ({
        value: key,
        label: t(`investmentRanges.${key}`),
      })),
    [t],
  );

  const [formData, setFormData] =
    useState<ContactFormData>(initialContactFormData);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      formLoadedAt: Date.now(),
    }));
  }, []);

  const updateField = (field: ContactFormField, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleBlur = (field: ContactFormField) => {
    const error = validateContactField(
      contactSchema,
      field,
      formData[field],
    );
    setErrors((current) => {
      if (!error) {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      }
      return { ...current, [field]: error };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = parseContactForm(contactSchema, formData);

    if (!parsed.success) {
      const validationErrors = zodErrorsToFormErrors(parsed.error);
      setErrors(validationErrors);
      toast({
        variant: "error",
        title: t("toastValidationTitle"),
        description: t("toastValidationDescription"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        errors?: ContactFormErrors;
      } | null;

      if (!response.ok) {
        if (payload?.errors) setErrors(payload.errors);

        throw new Error(payload?.error ?? t("submitError"));
      }

      setIsSuccess(true);
      toast({
        variant: "success",
        title: t("toastSuccessTitle"),
        description: t("toastSuccessDescription"),
      });
    } catch (error) {
      toast({
        variant: "error",
        title: t("toastErrorTitle"),
        description:
          error instanceof Error ? error.message : t("toastErrorDescription"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ...initialContactFormData,
      formLoadedAt: Date.now(),
    });
    setErrors({});
    setIsSuccess(false);
  };

  if (isSuccess) {
    return <ContactSuccess whatsappNumber={whatsappNumber} onReset={handleReset} />;
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label={t("formAriaLabel")}
    >
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={(event) =>
          setFormData((current) => ({
            ...current,
            website: event.target.value,
          }))
        }
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <fieldset
        disabled={isSubmitting}
        className="space-y-6 border-0 p-0 disabled:opacity-70"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <ContactInput
            label={t("fields.name")}
            name="name"
            autoComplete="name"
            placeholder={t("fields.namePlaceholder")}
            value={formData.name}
            error={errors.name}
            disabled={isSubmitting}
            onChange={(event) => updateField("name", event.target.value)}
            onBlur={() => handleBlur("name")}
            required
          />
          <ContactInput
            label={t("fields.company")}
            name="company"
            autoComplete="organization"
            placeholder={t("fields.companyPlaceholder")}
            value={formData.company}
            error={errors.company}
            disabled={isSubmitting}
            onChange={(event) => updateField("company", event.target.value)}
            onBlur={() => handleBlur("company")}
            required
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <ContactInput
            label={t("fields.email")}
            name="email"
            fieldType="email"
            autoComplete="email"
            placeholder={t("fields.emailPlaceholder")}
            value={formData.email}
            error={errors.email}
            disabled={isSubmitting}
            onChange={(event) => updateField("email", event.target.value)}
            onBlur={() => handleBlur("email")}
            required
          />
          <ContactInput
            label={t("fields.whatsapp")}
            name="whatsapp"
            fieldType="tel"
            autoComplete="tel"
            placeholder={t("fields.whatsappPlaceholder")}
            value={formData.whatsapp}
            error={errors.whatsapp}
            disabled={isSubmitting}
            onChange={(event) => updateField("whatsapp", event.target.value)}
            onBlur={() => handleBlur("whatsapp")}
            required
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <ContactSelect
            label={t("fields.projectType")}
            name="projectType"
            value={formData.projectType}
            error={errors.projectType}
            options={projectTypeOptions}
            placeholder={t("fields.selectPlaceholder")}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField("projectType", event.target.value)
            }
            onBlur={() => handleBlur("projectType")}
            required
          />
          <ContactSelect
            label={t("fields.investmentRange")}
            name="investmentRange"
            value={formData.investmentRange}
            error={errors.investmentRange}
            options={investmentRangeOptions}
            placeholder={t("fields.selectPlaceholder")}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField("investmentRange", event.target.value)
            }
            onBlur={() => handleBlur("investmentRange")}
            required
          />
        </div>

        <ContactTextarea
          label={t("fields.message")}
          name="message"
          placeholder={t("fields.messagePlaceholder")}
          value={formData.message}
          error={errors.message}
          disabled={isSubmitting}
          onChange={(event) => updateField("message", event.target.value)}
          onBlur={() => handleBlur("message")}
          required
        />
      </fieldset>

      <MotionButton
        className="flex justify-center pt-2 sm:justify-start"
        {...(!reduceMotion &&
          !isSubmitting && {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            transition: { type: "spring", stiffness: 400, damping: 20 },
          })}
      >
        <CtaButton
          type="submit"
          size="lg"
          showArrow={!isSubmitting}
          disabled={isSubmitting}
          className={cn(
            "w-full sm:w-auto",
            !isSubmitting && "hover:shadow-logos-glow-accent",
          )}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </CtaButton>
      </MotionButton>
    </form>
  );
}
