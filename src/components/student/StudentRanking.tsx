import { motion } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Avatar, AvatarFallback } from "../new-layout/ui/avatar";
import { Badge } from "../new-layout/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../new-layout/ui/tabs";
import { Trophy, TrendingUp, Medal, Crown, Zap, Star } from "lucide-react";

const mockRanking = [
  {
    id: 1,
    rank: 1,
    name: "Maria Oliveira",
    spinners: 5430,
    level: 12,
    change: "up",
  },
  {
    id: 2,
    rank: 2,
    name: "Pedro Santos",
    spinners: 4980,
    level: 11,
    change: "same",
  },
  {
    id: 3,
    rank: 3,
    name: "Ana Costa",
    spinners: 4520,
    level: 10,
    change: "down",
  },
  {
    id: 4,
    rank: 4,
    name: "Carlos Silva",
    spinners: 3890,
    level: 9,
    change: "up",
  },
  {
    id: 5,
    rank: 5,
    name: "Beatriz Lima",
    spinners: 3450,
    level: 9,
    change: "up",
  },
  {
    id: 6,
    rank: 6,
    name: "Lucas Silva",
    spinners: 2450,
    level: 5,
    change: "same",
    isCurrentUser: true,
  },
  {
    id: 7,
    rank: 7,
    name: "Juliana Souza",
    spinners: 2180,
    level: 5,
    change: "down",
  },
  {
    id: 8,
    rank: 8,
    name: "Rafael Mendes",
    spinners: 1950,
    level: 4,
    change: "up",
  },
];

const mockRecentActivities = [
  {
    id: 1,
    user: "Maria Oliveira",
    action: "completou o curso",
    detail: "Inteligência Artificial",
    time: "2h atrás",
    icon: "trophy",
  },
  {
    id: 2,
    user: "Pedro Santos",
    action: "desbloqueou conquista",
    detail: "Maratonista 🏃",
    time: "4h atrás",
    icon: "achievement",
  },
  {
    id: 3,
    user: "Ana Costa",
    action: "ganhou",
    detail: "500 Spinners",
    time: "5h atrás",
    icon: "spinner",
  },
  {
    id: 4,
    user: "Carlos Silva",
    action: "iniciou projeto",
    detail: "App de Finanças",
    time: "6h atrás",
    icon: "rocket",
  },
];

export function StudentRanking() {
  const currentUser = mockRanking.find(u => u.isCurrentUser);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-500 text-white";
    if (rank === 3) return "bg-gradient-to-br from-amber-500 to-amber-700 text-white";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl text-gray-900 mb-2">Ranking e Comunidade</h1>
        <p className="text-gray-600">Veja sua posição e acompanhe os melhores da semana</p>
      </motion.div>

      {/* Your Position */}
      {currentUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-[#599fe9] to-[#4a8ed9] border-0 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="p-6 relative">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
                    getRankBadgeColor(currentUser.rank)
                  } shadow-lg`}>
                    #{currentUser.rank}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white/80 text-sm mb-1">Sua Posição</p>
                  <h3 className="text-2xl text-white mb-2">{currentUser.name}</h3>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-white fill-white" />
                      <span className="text-white">{currentUser.spinners} Spinners</span>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30">
                      Nível {currentUser.level}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="bg-gray-100 p-1 w-full md:w-auto">
            <TabsTrigger value="week" className="data-[state=active]:bg-white">
              Esta Semana
            </TabsTrigger>
            <TabsTrigger value="month" className="data-[state=active]:bg-white">
              Este Mês
            </TabsTrigger>
            <TabsTrigger value="alltime" className="data-[state=active]:bg-white">
              Todos os Tempos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ranking List */}
              <div className="lg:col-span-2">
                <Card className="bg-white border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <h2 className="text-xl text-gray-900">Top Alunos</h2>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {mockRanking.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          user.isCurrentUser ? "bg-blue-50 border-l-4 border-[#599fe9]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              getRankBadgeColor(user.rank)
                            } shadow`}>
                              {user.rank <= 3 ? (
                                getRankIcon(user.rank)
                              ) : (
                                <span className="font-bold">#{user.rank}</span>
                              )}
                            </div>
                          </div>

                          {/* Avatar */}
                          <Avatar className="w-12 h-12 border-2 border-gray-200">
                            <AvatarFallback className="bg-gradient-to-br from-[#599fe9] to-[#4a8ed9] text-white">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`truncate ${
                                user.isCurrentUser ? "text-[#599fe9]" : "text-gray-900"
                              }`}>
                                {user.name}
                              </h3>
                              {user.isCurrentUser && (
                                <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30 text-xs">
                                  Você
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span>{user.spinners}</span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <span>Nv. {user.level}</span>
                            </div>
                          </div>

                          {/* Change Indicator */}
                          <div className="flex-shrink-0">
                            {user.change === "up" && (
                              <div className="flex items-center gap-1 text-emerald-500">
                                <TrendingUp className="w-4 h-4" />
                              </div>
                            )}
                            {user.change === "down" && (
                              <div className="flex items-center gap-1 text-red-500 rotate-180">
                                <TrendingUp className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Activity Feed */}
              <div>
                <Card className="bg-white border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#f54a12]" />
                      <h2 className="text-xl text-gray-900">Atividades Recentes</h2>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {mockRecentActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {activity.icon === "trophy" && <Trophy className="w-5 h-5 text-emerald-500" />}
                          {activity.icon === "achievement" && <Medal className="w-5 h-5 text-amber-500" />}
                          {activity.icon === "spinner" && <Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
                          {activity.icon === "rocket" && <span className="text-lg">🚀</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span>
                            {' '}{activity.action}{' '}
                            <span className="text-[#599fe9]">{activity.detail}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
