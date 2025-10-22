import { motion } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Input } from "../new-layout/ui/input";
import { Label } from "../new-layout/ui/label";
import { Avatar, AvatarFallback } from "../new-layout/ui/avatar";
import { Badge } from "../new-layout/ui/badge";
import { 
  Trophy,
  Calendar,
  TrendingUp
} from "lucide-react";
import { Progress } from "../new-layout/ui/progress";

export function StudentProfile() {
  const profileData = {
    name: "Lucas Silva",
    email: "lucas.silva@email.com",
    phone: "(11) 98765-4321",
    school: "Colégio Anglo Araçatuba",
    guardianName: "Maria Silva",
    guardianPhone: "(11) 98888-7777",
    guardianEmail: "maria.silva@email.com",
  };

  const stats = {
    coursesCompleted: 2,
    coursesInProgress: 3,
    achievements: 8,
    joinDate: "Janeiro 2024",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl text-gray-900 mb-2">Perfil e Configurações</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl text-gray-900">Informações Pessoais</h2>
              </div>

              <div className="p-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
                  <Avatar className="w-24 h-24 border-4 border-[#599fe9]/20">
                    <AvatarFallback className="bg-gradient-to-br from-[#599fe9] to-[#4a8ed9] text-white text-2xl">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl text-gray-900 mb-1">{profileData.name}</h3>
                    <p className="text-gray-600 mb-3">{profileData.school}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30">
                        Aluno Nitro
                      </Badge>
                      <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
                        Nível 5
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 mb-2 block">Nome Completo</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        disabled
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700 mb-2 block">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-gray-700 mb-2 block">Telefone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        disabled
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="school" className="text-gray-700 mb-2 block">Escola</Label>
                      <Input
                        id="school"
                        value={profileData.school}
                        disabled
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-gray-900 mb-4">Dados do Responsável</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="guardianName" className="text-gray-700 mb-2 block">Nome Responsável</Label>
                          <Input
                            id="guardianName"
                            value={profileData.guardianName}
                            disabled
                            className="bg-gray-50 border-gray-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="guardianPhone" className="text-gray-700 mb-2 block">Telefone Responsável</Label>
                          <Input
                            id="guardianPhone"
                            type="tel"
                            value={profileData.guardianPhone}
                            disabled
                            className="bg-gray-50 border-gray-200"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="guardianEmail" className="text-gray-700 mb-2 block">Email Responsável</Label>
                        <Input
                          id="guardianEmail"
                          type="email"
                          value={profileData.guardianEmail}
                          disabled
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg text-gray-900">Estatísticas</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Trophy className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">Cursos Concluídos</span>
                  </div>
                  <span className="text-gray-900">{stats.coursesCompleted}</span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-4 h-4 text-[#599fe9]" />
                    <span className="text-sm">Em Progresso</span>
                  </div>
                  <span className="text-gray-900">{stats.coursesInProgress}</span>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">Conquistas</span>
                  </div>
                  <span className="text-gray-900">{stats.achievements}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Membro desde</span>
                  </div>
                  <span className="text-gray-900">{stats.joinDate}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Level Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg text-gray-900">Nível 5</h3>
                  <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30">
                    2450 XP
                  </Badge>
                </div>
                <div className="mb-2">
                  <Progress value={65} className="h-2 bg-gray-200" />
                </div>
                <p className="text-xs text-gray-600">
                  550 XP para o próximo nível
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
