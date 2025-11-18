import { useState } from "react";
import { useTranslations } from "next-intl";
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
import { toast } from "sonner";

interface RegisterClassDialogProps {
  courseId: number;
  onSuccess?: () => void;
}

export function RegisterClassDialog({ courseId, onSuccess }: RegisterClassDialogProps) {
  const t = useTranslations("Admin.panel.register_class");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await fetch("/api/aulas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: formData.title,
          data: formData.date,
          time: formData.time,
          descricao: formData.description,
          cursoId: courseId.toString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t("error"));
      }

      toast.success(t("success"));
      setOpen(false);
      setFormData({
        title: "",
        date: "",
        time: "",
        description: "",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao criar aula:", error);
      toast.error(error instanceof Error ? error.message : t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#599fe9] hover:bg-[#599fe9]/90 text-white h-11 px-6 rounded-lg shadow-lg shadow-[#599fe9]/20">
          <Plus className="w-5 h-5 mr-2" />
          {t("title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#599fe9]" />
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700">
              {t("title_label")} *
            </Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder={t("title_placeholder")}
              className="bg-gray-50 border-gray-200 text-gray-900 h-11 rounded-lg"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t("date_label")} *
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
                {t("time_label")} *
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">
              {t("description_label")}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t("description_placeholder")}
              className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg min-h-[100px] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 h-11 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 bg-[#f54a12] hover:bg-[#f54a12]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("registering") : t("register")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
