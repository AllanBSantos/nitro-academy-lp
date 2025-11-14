import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Card } from "../new-layout/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../new-layout/ui/tabs";
import {
  PlayCircle,
  CheckCircle,
  ClipboardList,
  Video,
  Inbox,
} from "lucide-react";

export function AdminHome() {
  const t = useTranslations("Admin.panel.admin_home");
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl text-gray-900 mb-2">
          {t("welcome")}
        </h1>
        <p className="text-gray-600">{t("manage_classes")}</p>
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
              {t("tabs.classes")}
            </TabsTrigger>
            <TabsTrigger
              value="tarefas"
              className="flex items-center gap-2 data-[state=active]:bg-white text-gray-900"
            >
              <ClipboardList className="w-4 h-4" />
              {t("tabs.homework")}
            </TabsTrigger>
          </TabsList>

          {/* Aba Aulas */}
          <TabsContent value="aulas" className="mt-6 space-y-6">
            {/* Próximas Aulas */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-[#599fe9]" />
                  <h2 className="text-xl text-gray-900">{t("upcoming_classes.title")}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Inbox className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">{t("upcoming_classes.no_classes")}</h3>
                  <p className="text-gray-500">{t("upcoming_classes.no_classes_description")}</p>
                </div>
              </div>
            </Card>

            {/* Aulas Realizadas */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl text-gray-900">{t("past_classes.title")}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Inbox className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">{t("past_classes.no_classes")}</h3>
                  <p className="text-gray-500">{t("past_classes.no_classes_description")}</p>
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
                  <h3 className="text-lg text-gray-900 mb-2">{t("homework.no_homework")}</h3>
                  <p className="text-gray-500">{t("homework.no_homework_description")}</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
