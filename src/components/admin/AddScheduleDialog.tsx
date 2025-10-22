import { useState } from "react";
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
import { Input } from "../new-layout/ui/input";
import { Label } from "../new-layout/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../new-layout/ui/select";

interface AddScheduleDialogProps {
  onAdd: (schedule: {
    dayOfWeek: string;
    startTime: string;
    maxStudents: number;
  }) => void;
}

const daysOfWeek = [
  { value: "monday", label: "Segunda-feira" },
  { value: "tuesday", label: "Terça-feira" },
  { value: "wednesday", label: "Quarta-feira" },
  { value: "thursday", label: "Quinta-feira" },
  { value: "friday", label: "Sexta-feira" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

export function AddScheduleDialog({ onAdd }: AddScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: "",
    startTime: "",
    maxStudents: 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setOpen(false);
    setFormData({
      dayOfWeek: "",
      startTime: "",
      maxStudents: 30,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#599fe9] hover:bg-[#599fe9]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#599fe9]/20">
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Turma
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#599fe9]" />
            Adicionar Nova Turma
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Configure o dia, horário e capacidade máxima da turma
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Day of Week */}
          <div className="space-y-2">
            <Label htmlFor="dayOfWeek" className="text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Dia da Semana *
            </Label>
            <Select
              value={formData.dayOfWeek}
              onValueChange={(value) =>
                setFormData({ ...formData, dayOfWeek: value })
              }
              required
            >
              <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg">
                <SelectValue placeholder="Selecione o dia" />
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
            <Label htmlFor="startTime" className="text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horário de Início *
            </Label>
            <Input
              id="startTime"
              type="time"
              required
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg"
            />
            <p className="text-sm text-gray-500">
              Duração da aula: 50 minutos
            </p>
          </div>

          {/* Max Students */}
          <div className="space-y-2">
            <Label htmlFor="maxStudents" className="text-gray-700">
              Capacidade Máxima de Alunos *
            </Label>
            <Input
              id="maxStudents"
              type="number"
              required
              min="1"
              value={formData.maxStudents}
              onChange={(e) =>
                setFormData({ ...formData, maxStudents: parseInt(e.target.value) || 30 })
              }
              className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-[#f54a12] hover:bg-[#f54a12]/90 text-white"
            >
              Adicionar Turma
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
