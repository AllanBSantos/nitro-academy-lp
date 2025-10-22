import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Badge } from "../new-layout/ui/badge";
import { Dialog, DialogContent } from "../new-layout/ui/dialog";
import { Trophy, Lock, Sparkles, Calendar, Star } from "lucide-react";

const mockAchievements = [
  {
    id: 1,
    name: "Primeira Jornada",
    description: "Complete sua primeira aula",
    icon: "🎯",
    spinners: 50,
    unlocked: true,
    unlockedDate: "15/10/2024",
    category: "Iniciante",
  },
  {
    id: 2,
    name: "Projeto Completo",
    description: "Finalize seu primeiro projeto",
    icon: "🚀",
    spinners: 200,
    unlocked: true,
    unlockedDate: "20/10/2024",
    category: "Realizações",
  },
  {
    id: 3,
    name: "Mente Criativa",
    description: "Crie 3 projetos inovadores",
    icon: "💡",
    spinners: 300,
    unlocked: true,
    unlockedDate: "25/10/2024",
    category: "Criatividade",
  },
  {
    id: 4,
    name: "Top 10",
    description: "Entre no top 10 do ranking",
    icon: "⭐",
    spinners: 500,
    unlocked: false,
    category: "Ranking",
  },
  {
    id: 5,
    name: "Colaborador Expert",
    description: "Ajude 10 colegas em projetos",
    icon: "🤝",
    spinners: 250,
    unlocked: false,
    category: "Comunidade",
  },
  {
    id: 6,
    name: "Mestre da IA",
    description: "Complete o curso de IA com 100%",
    icon: "🤖",
    spinners: 1000,
    unlocked: false,
    category: "Cursos",
  },
  {
    id: 7,
    name: "Mentor Destaque",
    description: "Receba 5 elogios de mentores",
    icon: "👑",
    spinners: 750,
    unlocked: false,
    category: "Reconhecimento",
  },
  {
    id: 8,
    name: "Inovador Nitro",
    description: "Crie um projeto premiado",
    icon: "🏆",
    spinners: 2000,
    unlocked: false,
    category: "Elite",
  },
];

export function StudentAchievements() {
  const [selectedAchievement, setSelectedAchievement] = useState<typeof mockAchievements[0] | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(mockAchievements.map(a => a.category)))];
  
  const filteredAchievements = filter === "all" 
    ? mockAchievements 
    : mockAchievements.filter(a => a.category === filter);

  const unlockedCount = mockAchievements.filter(a => a.unlocked).length;
  const totalSpinners = mockAchievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.spinners, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl text-gray-900 mb-2">Conquistas</h1>
        <p className="text-gray-600">Desbloqueie badges e ganhe Spinners!</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-[#f54a12] to-[#ff6b35] border-0 p-4 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <Trophy className="w-8 h-8 text-white mb-3 drop-shadow-lg" />
              <p className="text-white/90 text-xs mb-1">Conquistas Desbloqueadas</p>
              <p className="text-3xl text-white">{unlockedCount}/{mockAchievements.length}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-[#599fe9] to-[#4a8ed9] border-0 p-4 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <Star className="w-8 h-8 text-white mb-3 drop-shadow-lg fill-white" />
              <p className="text-white/90 text-xs mb-1">Spinners de Conquistas</p>
              <p className="text-3xl text-white">{totalSpinners}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-amber-500 to-yellow-500 border-0 p-4 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative">
              <Sparkles className="w-8 h-8 text-white mb-3 drop-shadow-lg" />
              <p className="text-white/90 text-xs mb-1">Progresso</p>
              <p className="text-3xl text-white">{Math.round((unlockedCount / mockAchievements.length) * 100)}%</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-2 flex-wrap"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === category
                ? "bg-[#f54a12] text-white shadow-lg shadow-[#f54a12]/20"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {category === "all" ? "Todas" : category}
          </button>
        ))}
      </motion.div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            onClick={() => setSelectedAchievement(achievement)}
            className="cursor-pointer"
          >
            <Card className={`border-2 transition-all hover:shadow-xl ${
              achievement.unlocked
                ? "bg-gradient-to-br from-white to-amber-50 border-amber-200 hover:border-amber-300"
                : "bg-gray-50 border-gray-200 opacity-60 hover:opacity-80"
            }`}>
              <div className="p-6">
                {/* Icon */}
                <div className="mb-4 relative">
                  <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-amber-100 to-orange-100 shadow-lg"
                      : "bg-gray-200 grayscale"
                  }`}>
                    {achievement.unlocked ? achievement.icon : <Lock className="w-8 h-8 text-gray-400" />}
                  </div>
                  {achievement.unlocked && (
                    <motion.div
                      className="absolute -top-2 -right-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.05, type: "spring" }}
                    >
                      <div className="bg-emerald-500 text-white rounded-full p-1.5">
                        <Trophy className="w-4 h-4" />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Category Badge */}
                <Badge className={`mb-2 text-xs ${
                  achievement.unlocked
                    ? "bg-amber-500/20 text-amber-700 border-amber-300"
                    : "bg-gray-300 text-gray-600 border-gray-400"
                }`}>
                  {achievement.category}
                </Badge>

                {/* Name */}
                <h3 className={`mb-2 ${
                  achievement.unlocked ? "text-gray-900" : "text-gray-500"
                }`}>
                  {achievement.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {achievement.description}
                </p>

                {/* Spinners */}
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  achievement.unlocked
                    ? "bg-gradient-to-r from-amber-50 to-orange-50"
                    : "bg-gray-100"
                }`}>
                  <div className="flex items-center gap-2">
                    <Star className={`w-5 h-5 ${achievement.unlocked ? "text-amber-500 fill-amber-500" : "text-gray-400"}`} />
                    <span className={`text-sm ${
                      achievement.unlocked ? "text-gray-900" : "text-gray-500"
                    }`}>
                      {achievement.spinners}
                    </span>
                  </div>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {achievement.unlockedDate}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
            <DialogContent className="max-w-md">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="text-center"
              >
                {/* Animated Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="mb-6"
                >
                  <div className={`w-32 h-32 mx-auto rounded-3xl flex items-center justify-center text-6xl ${
                    selectedAchievement.unlocked
                      ? "bg-gradient-to-br from-amber-100 to-orange-100 shadow-2xl shadow-amber-500/20"
                      : "bg-gray-200 grayscale"
                  }`}>
                    {selectedAchievement.unlocked ? selectedAchievement.icon : <Lock className="w-16 h-16 text-gray-400" />}
                  </div>
                </motion.div>

                {/* Badge */}
                <Badge className={`mb-3 ${
                  selectedAchievement.unlocked
                    ? "bg-amber-500/20 text-amber-700 border-amber-300"
                    : "bg-gray-300 text-gray-600 border-gray-400"
                }`}>
                  {selectedAchievement.category}
                </Badge>

                {/* Name */}
                <h2 className="text-2xl text-gray-900 mb-3">
                  {selectedAchievement.name}
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  {selectedAchievement.description}
                </p>

                {/* Spinners Reward */}
                <div className={`p-4 rounded-xl mb-4 ${
                  selectedAchievement.unlocked
                    ? "bg-gradient-to-r from-amber-50 to-orange-50"
                    : "bg-gray-100"
                }`}>
                  <div className="flex items-center justify-center gap-3">
                    <Star className={`w-8 h-8 ${selectedAchievement.unlocked ? "text-amber-500 fill-amber-500" : "text-gray-400"}`} />
                    <div className="text-left">
                      <p className="text-xs text-gray-600">Recompensa</p>
                      <p className="text-2xl text-gray-900">+{selectedAchievement.spinners}</p>
                    </div>
                  </div>
                </div>

                {/* Unlock Date */}
                {selectedAchievement.unlocked && selectedAchievement.unlockedDate && (
                  <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Desbloqueado em {selectedAchievement.unlockedDate}
                  </p>
                )}

                {!selectedAchievement.unlocked && (
                  <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Continue progredindo para desbloquear!
                  </p>
                )}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
