import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { createSuggestion } from "@/lib/strapi";

interface SuggestionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courseName: string;
  courseId: number;
}

export default function SuggestionModal({
  isOpen,
  onOpenChange,
  courseName,
  courseId,
}: SuggestionModalProps) {
  const t = useTranslations("TimeSelection");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const WEEKDAYS = [
    t("days.monday"),
    t("days.tuesday"),
    t("days.wednesday"),
    t("days.thursday"),
    t("days.friday"),
  ];

  const TIME_OPTIONS = [
    {
      label: t("suggestion.morning"),
      options: ["09:00", "10:00"],
    },
    {
      label: t("suggestion.afternoon"),
      options: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
    },
  ];

  const [suggestionData, setSuggestionData] = useState({
    weekdays: [] as Array<{ dia_da_semana: string }>,
    time: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWeekdayChange = (weekday: string) => {
    setSuggestionData((prev) => {
      const isSelected = prev.weekdays.some(
        (dia) => dia.dia_da_semana === weekday
      );
      const newWeekdays = isSelected
        ? prev.weekdays.filter((dia) => dia.dia_da_semana !== weekday)
        : [...prev.weekdays, { dia_da_semana: weekday }];

      return {
        ...prev,
        weekdays: newWeekdays,
      };
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSuggestionData((prev) => ({ ...prev, time: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!suggestionData.weekdays.length || !suggestionData.time) return;

    setIsSubmitting(true);
    try {
      // Primeiro, criar a sugestão no Strapi
      await createSuggestion({
        dias_da_semana: suggestionData.weekdays,
        horario: suggestionData.time,
        comentario: suggestionData.comment,
        curso: courseId,
      });

      // Depois, enviar o email
      const emailBody = `
        Nova sugestão de horário para o curso: ${courseName}
        
        Dias sugeridos: ${suggestionData.weekdays
          .map((dia) => dia.dia_da_semana)
          .join(", ")}
        Horário sugerido: ${suggestionData.time}
        Comentário: ${suggestionData.comment || "Sem comentários"}
      `;

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: process.env.NEXT_PUBLIC_ENROLLMENT_EMAIL,
          subject: `Sugestão de novo horário - ${courseName}`,
          text: emailBody,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send suggestion");
      }

      // Fechar o modal de sugestão e abrir o modal de sucesso
      onOpenChange(false);
      setIsSuccessModalOpen(true);

      // Limpar os dados do formulário
      setSuggestionData({
        weekdays: [],
        time: "",
        comment: "",
      });
    } catch (error) {
      console.error("Error sending suggestion:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-white text-[#1e1b4b] border-none rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6 text-[#1e1b4b]">
              {t("suggest_new_time")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {t("suggestion.weekdays")}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {WEEKDAYS.map((weekday) => (
                  <div key={weekday} className="flex items-center space-x-3">
                    <Checkbox
                      id={weekday}
                      checked={suggestionData.weekdays.some(
                        (dia) => dia.dia_da_semana === weekday
                      )}
                      onCheckedChange={() => handleWeekdayChange(weekday)}
                      className="h-5 w-5"
                    />
                    <Label htmlFor={weekday} className="text-base">
                      {weekday}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">{t("suggestion.time")}</Label>
              <select
                id="time"
                value={suggestionData.time}
                onChange={handleTimeChange}
                className="w-full bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6] rounded-md p-2"
                required
              >
                <option value="">{t("suggestion.select_time")}</option>
                {TIME_OPTIONS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">{t("suggestion.comment")}</Label>
              <Input
                id="comment"
                value={suggestionData.comment}
                onChange={(e) =>
                  setSuggestionData((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                className="bg-gray-50 border-gray-200 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={
                !suggestionData.weekdays.length ||
                !suggestionData.time ||
                isSubmitting
              }
              className="w-full bg-orange-600 text-white hover:bg-orange-500 py-6 text-lg font-semibold"
            >
              {isSubmitting ? t("suggestion.sending") : t("suggestion.submit")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-[#1e1b4b] border-none rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-6 text-[#1e1b4b]">
              {t("suggestion.success.title")}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-6">
            <p className="text-lg text-gray-700">
              {t("suggestion.success.message", { courseName })}
            </p>
            <Button
              onClick={() => setIsSuccessModalOpen(false)}
              className="bg-orange-600 text-white hover:bg-orange-500 py-6 text-lg font-semibold w-full"
            >
              {t("suggestion.success.ok")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
