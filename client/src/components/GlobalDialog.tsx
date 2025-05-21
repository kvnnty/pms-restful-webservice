"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type ReactNode } from "react";

type GlobalDialogProps = {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  maxWidth?: number;
};

export default function GlobalDialog({ title, isOpen, setIsOpen, children, maxWidth }: GlobalDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent style={{ maxWidth: `${maxWidth}px` }}>
        <DialogTitle>{title}</DialogTitle>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
