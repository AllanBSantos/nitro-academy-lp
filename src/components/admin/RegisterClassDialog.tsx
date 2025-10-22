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
import { Plus, Calendar, Clock, BookOpen } from "lucide-react";
import { Input } from "../new-layout/ui/input";
import { Textarea } from "../new-layout/ui/textarea";
import { Label } from "../new-layout/ui/label";

export function RegisterClassDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering class:", formData);
    setOpen(false);
    setFormData({
      title: "",
      date: "",
      time: "",
      duration: "",
      description: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#599fe9] hover:bg-[#599fe9]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#599fe9]/20">
          <Plus className="w-5 h-5 mr-2" />
          Registrar nova aula
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#599fe9]" />
            Registrar Nova Aula
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Preencha os dados da aula para registrar no sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700">
              Título da Aula *
            </Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ex: Introdução ao Python"
              className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data *
              </Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Horário *
              </Label>
              <Input
                id="time"
                type="time"
                required
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-gray-700">
              Duração (minutos) *
            </Label>
            <Input
              id="duration"
              type="number"
              required
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              placeholder="Ex: 90"
              className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descreva o conteúdo da aula..."
              className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg min-h-[100px] resize-none"
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
              Registrar Aula
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
