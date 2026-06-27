/** Props compartilhadas para campos de formulário acessíveis. */
export type FieldControlProps = {
  invalid?: boolean;
  /** ID do elemento que descreve o erro — use com aria-describedby */
  errorId?: string;
};

export function getFieldAriaProps({
  invalid,
  errorId,
  ariaInvalid,
}: FieldControlProps & {
  ariaInvalid?: React.AriaAttributes["aria-invalid"];
}) {
  return {
    "aria-invalid": invalid ?? ariaInvalid,
    ...(errorId ? { "aria-describedby": errorId } : {}),
  } as const;
}
