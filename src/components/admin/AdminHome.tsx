import { motion } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Button } from "../new-layout/ui/button";
import { Badge } from "../new-layout/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../new-layout/ui/tabs";
import {
  Calendar,
  Clock,
  PlayCircle,
  CheckCircle,
  ClipboardList,
  AlertCircle,
  Video,
  Edit,
  Inbox,
} from "lucide-react";

export function AdminHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl text-gray-900 mb-2">
          Bem-vindo, Professor! 👋
        </h1>
        <p className="text-gray-600">Gerencie suas aulas e tarefas de casa</p>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="aulas" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 h-auto">
            <TabsTrigger
              value="aulas"
              className="flex items-center gap-2 data-[state=active]:bg-white text-gray-900"
            >
              <Video className="w-4 h-4" />
              Aulas
            </TabsTrigger>
            <TabsTrigger
              value="tarefas"
              className="flex items-center gap-2 data-[state=active]:bg-white text-gray-900"
            >
              <ClipboardList className="w-4 h-4" />
              Tarefas de Casa
            </TabsTrigger>
          </TabsList>

          {/* Aba Aulas */}
          <TabsContent value="aulas" className="mt-6 space-y-6">
            {/* Próximas Aulas */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-[#599fe9]" />
                  <h2 className="text-xl text-gray-900">Próximas Aulas</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Inbox className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">Nenhuma aula agendada</h3>
                  <p className="text-gray-500">Não há aulas próximas no momento.</p>
                </div>
              </div>
            </Card>

            {/* Aulas Realizadas */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl text-gray-900">Aulas Realizadas</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Inbox className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">Nenhuma aula realizada</h3>
                  <p className="text-gray-500">Não há aulas realizadas no momento.</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Aba Tarefas de Casa */}
          <TabsContent value="tarefas" className="mt-6 space-y-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Inbox className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">Nenhuma tarefa de casa</h3>
                  <p className="text-gray-500">Não há tarefas de casa cadastradas no momento.</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
