import { useState } from "react";
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

interface Schedule {
  id: number;
  dayOfWeek: string;
  startTime: string;
  maxStudents: number;
  currentStudents: number;
}

// Helper function to add 50 minutes to a time string
const addMinutes = (time: string, minutes: number): string => {
  const [hours, mins] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`;
};

const dayLabels: { [key: string]: string } = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
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

  const occupancyPercentage = (schedule.currentStudents / schedule.maxStudents) * 100;
  const isFull = schedule.currentStudents >= schedule.maxStudents;
  const endTime = addMinutes(schedule.startTime, 50);

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`transition-opacity ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <Card
        className={`bg-white border-gray-200 p-6 hover:shadow-md transition-all ${
          isActive ? "ring-2 ring-[#599fe9]" : ""
        } ${isLocked ? "bg-gray-50" : ""}`}
      >
        <div className="flex items-start gap-4">
          {/* Drag Handle or Lock Icon */}
          <div className={`pt-1 ${isLocked ? "text-gray-400" : "cursor-move text-gray-400 hover:text-gray-600"}`}>
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
                    {dayLabels[schedule.dayOfWeek]}
                  </h3>
                  {isActive && (
                    <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
                      Ativa
                    </Badge>
                  )}
                  {isFull && !isActive && (
                    <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
                      Lotada
                    </Badge>
                  )}
                  {isLocked && (
                    <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Bloqueada
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
                    {schedule.currentStudents} / {schedule.maxStudents} alunos
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
                <span>Ocupação</span>
                <span className="text-gray-900">{Math.round(occupancyPercentage)}%</span>
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

export function CourseSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: 1,
      dayOfWeek: "monday",
      startTime: "14:00",
      maxStudents: 30,
      currentStudents: 30,
    },
    {
      id: 2,
      dayOfWeek: "wednesday",
      startTime: "14:00",
      maxStudents: 30,
      currentStudents: 15,
    },
    {
      id: 3,
      dayOfWeek: "friday",
      startTime: "09:00",
      maxStudents: 25,
      currentStudents: 0,
    },
  ]);

  const moveSchedule = (dragIndex: number, hoverIndex: number) => {
    // Prevent moving if either schedule is locked
    const dragSchedule = schedules[dragIndex];
    const hoverSchedule = schedules[hoverIndex];
    
    if (dragSchedule.currentStudents > 0 || hoverSchedule.currentStudents > 0) {
      toast.error("Não é possível reordenar turmas com alunos matriculados");
      return;
    }
    
    const updatedSchedules = [...schedules];
    const [removed] = updatedSchedules.splice(dragIndex, 1);
    updatedSchedules.splice(hoverIndex, 0, removed);
    setSchedules(updatedSchedules);
  };

  const handleAddSchedule = (newSchedule: {
    dayOfWeek: string;
    startTime: string;
    maxStudents: number;
  }) => {
    const schedule: Schedule = {
      id: Date.now(),
      ...newSchedule,
      currentStudents: 0,
    };
    setSchedules([...schedules, schedule]);
    toast.success("Turma adicionada com sucesso!");
  };

  const handleDeleteSchedule = (id: number) => {
    const schedule = schedules.find((s) => s.id === id);
    if (schedule && schedule.currentStudents > 0) {
      toast.error("Não é possível remover turmas com alunos matriculados");
      return;
    }
    setSchedules(schedules.filter((s) => s.id !== id));
    toast.success("Turma removida com sucesso!");
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl text-gray-900 mb-2">Turmas Disponíveis</h2>
            <p className="text-gray-600">
              Organize as turmas por ordem de prioridade. A primeira turma não lotada
              será exibida no site.
            </p>
          </div>
          <AddScheduleDialog onAdd={handleAddSchedule} />
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200 p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm text-gray-900">
              <p>
                <span className="font-medium">Como funciona:</span> As turmas são exibidas
                no site pela ordem de prioridade. Quando uma turma fica lotada, a próxima
                da lista automaticamente fica disponível para novas matrículas.
              </p>
              <p className="text-gray-700 mt-2">
                💡 <span className="font-medium">Dica:</span> Arraste os cards para
                reorganizar a ordem de prioridade. Turmas com alunos matriculados ficam
                bloqueadas e não podem ser movidas ou removidas.
              </p>
            </div>
          </div>
        </Card>

        {/* Priority Label */}
        {schedules.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Ordem de Prioridade (1 = Maior prioridade)</span>
          </div>
        )}

        {/* Schedules List */}
        {schedules.length === 0 ? (
          <Card className="bg-white border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">Nenhuma turma cadastrada</h3>
            <p className="text-gray-500 mb-6">
              Comece adicionando a primeira turma disponível para o curso.
            </p>
            <AddScheduleDialog onAdd={handleAddSchedule} />
          </Card>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule, index) => {
              const isLocked = schedule.currentStudents > 0;
              return (
                <div key={schedule.id} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-medium mt-3 ${
                    isLocked ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                  }`}>
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
