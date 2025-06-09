import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function TeacherDialog({ children }: PropsWithChildren) {
  const t = useTranslations("Faq");
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle>
            {t("Convite para Educadores - Faça Parte da Nitro Academy")}
          </DialogTitle>
          <div id="radix-:r5:" className="text-sm text-left text-black pt-4">
            <p className="pt-2">{t("teacher_dialog.description")}</p>
          </div>
          <div className="pt-4">
            <Link
              href="https://u4zgaidr6x8.typeform.com/nitroprof"
              className="underline text-blue-300 pl-1"
            >
              {t("Faça parte do nosso time")}
            </Link>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
