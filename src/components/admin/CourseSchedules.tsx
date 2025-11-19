import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  GripVertical,
  Trash2,
  Users,
  Clock,
  Calendar,
  AlertCircle,
  Lock,
} from "lucide-react";
import { Card } from "../new-layout/ui/card";
import { Button } from "../new-layout/ui/button";
import { Badge } from "../new-layout/ui/badge";
import { AddScheduleDialog } from "./AddScheduleDialog";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface Schedule {
  id: number;
  index: number;
  dayOfWeek: string;
  startTime: string;
  maxStudents: number;
  currentStudents: number;
}

interface CourseSchedulesProps {
  courseId: number;
}

// Helper function to add 50 minutes to a time string
const addMinutes = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(
    2,
    "0"
  )}`;
};


interface DraggableScheduleProps {
  schedule: Schedule;
  index: number;
  moveSchedule: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (id: number) => void;
  isActive: boolean;
  isLocked: boolean;
}

const DraggableSchedule = ({
  schedule,
  index,
  moveSchedule,
  onDelete,
  isActive,
  isLocked,
}: DraggableScheduleProps) => {
  const t = useTranslations("Admin.panel.course_details.schedules");
  const [{ isDragging }, drag] = useDrag({
    type: "schedule",
    item: { index },
    canDrag: !isLocked,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "schedule",
    canDrop: () => !isLocked,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveSchedule(item.index, index);
        item.index = index;
      }
    },
  });

  const occupancyPercentage =
    (schedule.currentStudents / schedule.maxStudents) * 100;
  const isFull = schedule.currentStudents >= schedule.maxStudents;
  const endTime = addMinutes(schedule.startTime, 50);

  return (
    <div
      ref={(node) => {
        drag(drop(node));
      }}
      className={`transition-opacity ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <Card
        className={`bg-white border-gray-200 p-6 hover:shadow-md transition-all ${
          isActive ? "ring-2 ring-[#599fe9]" : ""
        } ${isLocked ? "bg-gray-50" : ""}`}
      >
        <div className="flex items-start gap-4">
          {/* Drag Handle or Lock Icon */}
          <div
            className={`pt-1 ${
              isLocked
                ? "text-gray-400"
                : "cursor-move text-gray-400 hover:text-gray-600"
            }`}
          >
            {isLocked ? (
              <Lock className="w-5 h-5" />
            ) : (
              <GripVertical className="w-5 h-5" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg text-gray-900">
                    {t(`days.${schedule.dayOfWeek}`)}
                  </h3>
                  {isActive && (
                    <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
                      {t("active")}
                    </Badge>
                  )}
                  {isFull && !isActive && (
                    <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
                      {t("full")}
                    </Badge>
                  )}
                  {isLocked && (
                    <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {t("locked")}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {schedule.startTime} - {endTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {schedule.currentStudents} / {schedule.maxStudents} {t("students")}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(schedule.id)}
                disabled={isLocked}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{t("occupation")}</span>
                <span className="text-gray-900">
                  {Math.round(occupancyPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isFull
                      ? "bg-red-500"
                      : occupancyPercentage >= 80
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${occupancyPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export function CourseSchedules({ courseId }: CourseSchedulesProps) {
  const t = useTranslations("Admin.panel.course_details.schedules");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar turmas do Strapi
  useEffect(() => {
    async function loadSchedules() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/admin/courses/${courseId}/turmas`
        );

        if (!response.ok) {
          throw new Error(t("error_loading"));
        }

        const data = await response.json();
        if (data.success) {
          setSchedules(data.data);
        } else {
          throw new Error(data.error || t("error_loading"));
        }
      } catch (err) {
        console.error("Error loading schedules:", err);
        setError(err instanceof Error ? err.message : t("error_loading"));
        toast.error(t("error_loading"));
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      loadSchedules();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const moveSchedule = async (dragIndex: number, hoverIndex: number) => {
    // Prevent moving if either schedule is locked
    const dragSchedule = schedules[dragIndex];
    const hoverSchedule = schedules[hoverIndex];

    if (dragSchedule.currentStudents > 0 || hoverSchedule.currentStudents > 0) {
      toast.error(t("error_reorder"));
      return;
    }

    // Criar nova ordem
    const newOrder = [...schedules];
    const [removed] = newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, removed);

    // Criar array de índices na nova ordem
    const newOrderIndices = newOrder.map((s) => s.index);

    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/turmas`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newOrder: newOrderIndices }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("error_reorder_message"));
      }

      // Recarregar do servidor para garantir que os índices estão sincronizados
      const loadResponse = await fetch(
        `/api/admin/courses/${courseId}/turmas`
      );
      if (loadResponse.ok) {
        const data = await loadResponse.json();
        if (data.success) {
          setSchedules(data.data);
        }
      }

      toast.success(t("success_reorder"));
    } catch (err) {
      console.error("Error reordering schedules:", err);
      toast.error(
        err instanceof Error ? err.message : t("error_reorder_message")
      );
    }
  };

  const handleAddSchedule = async (newSchedule: {
    dayOfWeek: string;
    startTime: string;
  }) => {
    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/turmas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dayOfWeek: newSchedule.dayOfWeek,
            startTime: newSchedule.startTime,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("error_add"));
      }

      // Recarregar turmas
      const loadResponse = await fetch(
        `/api/admin/courses/${courseId}/turmas`
      );
      if (loadResponse.ok) {
        const data = await loadResponse.json();
        if (data.success) {
          setSchedules(data.data);
        }
      }

      toast.success(t("success_add"));
    } catch (err) {
      console.error("Error adding schedule:", err);
      toast.error(
        err instanceof Error ? err.message : t("error_add")
      );
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    const schedule = schedules.find((s) => s.id === id);
    if (!schedule) return;

    if (schedule.currentStudents > 0) {
      toast.error(t("error_delete"));
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/turmas?index=${schedule.index}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("error_delete_message"));
      }

      // Recarregar turmas
      const loadResponse = await fetch(
        `/api/admin/courses/${courseId}/turmas`
      );
      if (loadResponse.ok) {
        const data = await loadResponse.json();
        if (data.success) {
          setSchedules(data.data);
        }
      }

      toast.success(t("success_delete"));
    } catch (err) {
      console.error("Error deleting schedule:", err);
      toast.error(
        err instanceof Error ? err.message : t("error_delete_message")
      );
    }
  };

  // Find the active schedule (first one that's not full)
  // Only a schedule can have students if all previous schedules are 100% full
  const activeScheduleIndex = schedules.findIndex((schedule, index) => {
    // Check if all previous schedules are full
    const allPreviousFull = schedules
      .slice(0, index)
      .every((s) => s.currentStudents >= s.maxStudents);

    // This schedule is active if all previous are full AND this one is not full
    return allPreviousFull && schedule.currentStudents < schedule.maxStudents;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#599fe9] mx-auto"></div>
          <p className="text-gray-600 mt-4">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl text-gray-900 mb-2">{t("title")}</h2>
            <p className="text-gray-600">
              {t("description")}
            </p>
          </div>
          <AddScheduleDialog 
            onAdd={handleAddSchedule}
            existingSchedules={schedules.map((s) => ({
              dayOfWeek: s.dayOfWeek,
              startTime: s.startTime,
            }))}
          />
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200 p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm text-gray-900">
              <p>
                <span className="font-medium">{t("how_it_works")}</span> {t("how_it_works_description")}
              </p>
              <p className="text-gray-700 mt-2">
                💡 <span className="font-medium">{t("tip")}</span> {t("tip_description")}
              </p>
            </div>
          </div>
        </Card>

        {/* Priority Label */}
        {schedules.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{t("priority_order")}</span>
          </div>
        )}

        {/* Schedules List */}
        {schedules.length === 0 ? (
          <Card className="bg-white border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">
              {t("no_schedules")}
            </h3>
            <p className="text-gray-500 mb-6">
              {t("no_schedules_description")}
            </p>
            <AddScheduleDialog 
              onAdd={handleAddSchedule}
              existingSchedules={schedules.map((s) => ({
                dayOfWeek: s.dayOfWeek,
                startTime: s.startTime,
              }))}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule, index) => {
              const isLocked = schedule.currentStudents > 0;
              return (
                <div key={schedule.id} className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-medium mt-3 ${
                      isLocked
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <DraggableSchedule
                      schedule={schedule}
                      index={index}
                      moveSchedule={moveSchedule}
                      onDelete={handleDeleteSchedule}
                      isActive={index === activeScheduleIndex}
                      isLocked={isLocked}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DndProvider>
  );
}
