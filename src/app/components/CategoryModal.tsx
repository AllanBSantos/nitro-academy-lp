"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { ReactNode } from "react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: ReactNode;
}

export default function CategoryModal({
  isOpen,
  onClose,
  title,
  description,
}: CategoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white text-[#1e1b4b] border-none max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6 text-[#1e1b4b]">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">{description}</div>
      </DialogContent>
    </Dialog>
  );
}
