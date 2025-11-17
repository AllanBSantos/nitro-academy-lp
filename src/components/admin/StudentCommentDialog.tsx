import { useState, useEffect } from "react";
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
import { MessageSquare } from "lucide-react";
import { Textarea } from "../new-layout/ui/textarea";

interface StudentCommentDialogProps {
  studentName: string;
  comment: string;
  onSave: (comment: string) => void;
}

export function StudentCommentDialog({
  studentName,
  comment,
  onSave,
}: StudentCommentDialogProps) {
  const t = useTranslations("Admin.panel.class_details.comment_dialog");
  const [open, setOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState(comment);

  useEffect(() => {
    if (!open) {
      setCurrentComment(comment);
    }
  }, [comment, open]);

  const handleSave = () => {
    onSave(currentComment);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-9 w-9 p-0 ${
            comment
              ? "text-[#599fe9] hover:text-[#599fe9] hover:bg-[#599fe9]/10"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
          title={comment ? t("edit_comment") : t("add_comment")}
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4" />
            {comment && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#599fe9]" />
            {t("title", { name: studentName })}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Textarea
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
            placeholder={t("placeholder")}
            className="bg-gray-50 border-gray-200 text-gray-900 rounded-lg min-h-[150px] resize-none"
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCurrentComment(comment);
                setOpen(false);
              }}
              className="flex-1 h-11 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 h-11 bg-[#f54a12] hover:bg-[#f54a12]/90 text-white"
            >
              {t("save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
