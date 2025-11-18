import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../new-layout/ui/dialog";
import { Button } from "../new-layout/ui/button";
import { Plus, Calendar, Clock } from "lucide-react";
import { Label } from "../new-layout/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../new-layout/ui/select";
import { useTranslations } from "next-intl";

interface AddScheduleDialogProps {
  onAdd: (schedule: { dayOfWeek: string; startTime: string }) => void;
  existingSchedules?: Array<{
    dayOfWeek: string;
    startTime: string;
  }>;
}

interface SelectOption {
  value: string;
  label: string;
}

// Mapeamento de dias da semana do Strapi para valores do frontend
const dayOfWeekMap: Record<string, string> = {
  "Segunda-Feira": "monday",
  "Terça-Feira": "tuesday",
  "Quarta-Feira": "wednesday",
  "Quinta-Feira": "thursday",
  "Sexta-Feira": "friday",
};

export function AddScheduleDialog({
  onAdd,
  existingSchedules = [],
}: AddScheduleDialogProps) {
  const t = useTranslations("Admin.panel.course_details.schedules");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: "",
    startTime: "",
  });
  const [daysOfWeek, setDaysOfWeek] = useState<SelectOption[]>([]);
  const [timeSlots, setTimeSlots] = useState<SelectOption[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<SelectOption[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Buscar opções do enum do Strapi
  useEffect(() => {
    async function loadOptions() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/cronograma-options");

        if (!response.ok) {
          throw new Error("Erro ao carregar opções");
        }

        const data = await response.json();
        if (data.success && data.data) {
          // Converter dias da semana do Strapi para formato do frontend
          const diasOptions: SelectOption[] = data.data.diasSemana.map(
            (dia: string) => {
              const dayValue = dayOfWeekMap[dia] || dia.toLowerCase();
              return {
                value: dayValue,
                label: t(`days.${dayValue}`),
              };
            }
          );
          setDaysOfWeek(diasOptions);

          // Converter horários (remover BRT se houver)
          const horariosOptions: SelectOption[] = data.data.horarios.map(
            (horario: string) => ({
              value: horario,
              label: horario,
            })
          );
          setTimeSlots(horariosOptions);
          // Inicialmente todos os horários estão disponíveis
          setAvailableTimeSlots(horariosOptions);
        }
      } catch (error) {
        console.error("Erro ao carregar opções:", error);
        // Fallback para valores padrão
        setDaysOfWeek([
          { value: "monday", label: t("days.monday") },
          { value: "tuesday", label: t("days.tuesday") },
          { value: "wednesday", label: t("days.wednesday") },
          { value: "thursday", label: t("days.thursday") },
          { value: "friday", label: t("days.friday") },
        ]);
        const defaultTimes = [
          { value: "14:00", label: "14:00" },
          { value: "15:00", label: "15:00" },
          { value: "16:00", label: "16:00" },
          { value: "17:00", label: "17:00" },
          { value: "18:00", label: "18:00" },
          { value: "19:00", label: "19:00" },
          { value: "20:00", label: "20:00" },
        ];
        setTimeSlots(defaultTimes);
        setAvailableTimeSlots(defaultTimes);
      } finally {
        setLoading(false);
      }
    }

    loadOptions();
  }, [t]);

  // Filtrar horários disponíveis baseado no dia selecionado e turmas existentes
  useEffect(() => {
    if (!formData.dayOfWeek || timeSlots.length === 0) {
      setAvailableTimeSlots(timeSlots);
      // Limpar horário selecionado se não houver dia selecionado
      if (!formData.dayOfWeek) {
        setFormData((prev) => ({ ...prev, startTime: "" }));
      }
      return;
    }

    // Função auxiliar para converter horário para minutos
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    // Função para verificar sobreposição
    const hasTimeOverlap = (
      time1: string,
      time2: string,
      durationMinutes: number = 50
    ): boolean => {
      const start1 = timeToMinutes(time1);
      const end1 = start1 + durationMinutes;
      const start2 = timeToMinutes(time2);
      const end2 = start2 + durationMinutes;
      return start1 < end2 && end1 > start2;
    };

    // Filtrar horários disponíveis
    const available = timeSlots.filter((timeSlot) => {
      // Verificar se já existe uma turma com mesmo dia e horário
      const isDuplicate = existingSchedules.some(
        (schedule) =>
          schedule.dayOfWeek === formData.dayOfWeek &&
          schedule.startTime === timeSlot.value
      );

      if (isDuplicate) {
        return false;
      }

      // Verificar sobreposição com turmas existentes no mesmo dia
      const hasOverlap = existingSchedules.some((schedule) => {
        if (schedule.dayOfWeek !== formData.dayOfWeek) {
          return false;
        }
        return hasTimeOverlap(timeSlot.value, schedule.startTime, 50);
      });

      return !hasOverlap;
    });

    setAvailableTimeSlots(available);

    // Limpar horário selecionado se não estiver mais disponível
    if (
      formData.startTime &&
      !available.some((slot) => slot.value === formData.startTime)
    ) {
      setFormData((prev) => ({ ...prev, startTime: "" }));
    }
  }, [formData.dayOfWeek, formData.startTime, timeSlots, existingSchedules]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setOpen(false);
    setFormData({
      dayOfWeek: "",
      startTime: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#599fe9] hover:bg-[#599fe9]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#599fe9]/20">
          <Plus className="w-5 h-5 mr-2" />
          {t("add_schedule")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#599fe9]" />
            {t("add_new_schedule")}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {t("add_schedule_description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#599fe9] mx-auto"></div>
              <p className="text-gray-600 mt-2 text-sm">
                {t("loading_options")}
              </p>
            </div>
          ) : (
            <>
              {/* Day of Week */}
              <div className="space-y-2">
                <Label
                  htmlFor="dayOfWeek"
                  className="text-gray-700 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  {t("day_of_week")}
                </Label>
                <Select
                  value={formData.dayOfWeek}
                  onValueChange={(value) =>
                    setFormData({ ...formData, dayOfWeek: value })
                  }
                  required
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg">
                    <SelectValue placeholder={t("select_day")} />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Time */}
              <div className="space-y-2">
                <Label
                  htmlFor="startTime"
                  className="text-gray-700 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  {t("start_time")}
                </Label>
                <Select
                  value={formData.startTime}
                  onValueChange={(value) =>
                    setFormData({ ...formData, startTime: value })
                  }
                  required
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg">
                    <SelectValue placeholder={t("select_time")} />
                  </SelectTrigger>
                  <SelectContent
                    side="bottom"
                    className="max-h-[200px] overflow-y-auto"
                  >
                    {availableTimeSlots.length === 0 ? (
                      <SelectItem value="" disabled>
                        {t("no_time_available")}
                      </SelectItem>
                    ) : (
                      availableTimeSlots.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">{t("class_duration")}</p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 bg-[#f54a12] hover:bg-[#f54a12]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("add_schedule")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
