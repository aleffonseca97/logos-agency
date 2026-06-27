const HTML_TAG_REGEX = /<[^>]*>/g;
const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Remove tags HTML e caracteres de controle de strings de texto. */
export function sanitizeText(value: string, maxLength = 2000): string {
  return value
    .replace(HTML_TAG_REGEX, "")
    .replace(CONTROL_CHARS_REGEX, "")
    .trim()
    .slice(0, maxLength);
}

/** Normaliza e-mail para comparação e armazenamento. */
export function sanitizeEmail(value: string): string {
  return sanitizeText(value, 255).toLowerCase();
}

/** Mantém apenas dígitos e símbolos comuns de telefone. */
export function sanitizePhone(value: string): string {
  return sanitizeText(value, 30).replace(/[^\d+\-().\s]/g, "");
}
