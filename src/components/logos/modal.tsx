"use client";

/**
 * Modal é um alias semântico de Dialog — mesma API, sem duplicação de lógica.
 * Use Modal em fluxos de confirmação; Dialog em overlays genéricos.
 */
export {
  Dialog as Modal,
  DialogClose as ModalClose,
  DialogContent as ModalContent,
  DialogDescription as ModalDescription,
  DialogFooter as ModalFooter,
  DialogHeader as ModalHeader,
  DialogTitle as ModalTitle,
  DialogTrigger as ModalTrigger,
  modalContentVariants,
} from "./dialog";
