import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Badge } from "../new-layout/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../new-layout/ui/tabs";
import { Bell, MessageCircle, Zap, Trash2, CheckCheck, Trophy, Star } from "lucide-react";
import { Button } from "../new-layout/ui/button";

const mockMessages = [
  {
    id: 1,
    type: "reward",
    title: "Você ganhou Spinners!",
    message: "Parabéns! Você completou a aula 'Introdução ao Machine Learning' e ganhou 50 Spinners.",
    timestamp: "Há 2 horas",
    read: false,
    spinners: 50,
  },
  {
    id: 2,
    type: "mentor",
    title: "Feedback do Mentor",
    message: "Prof. Carlos Silva comentou em seu projeto: 'Excelente trabalho! Sua apresentação está muito bem estruturada.'",
    timestamp: "Há 5 horas",
    read: false,
    mentor: "Prof. Carlos Silva",
  },
  {
    id: 3,
    type: "alert",
    title: "Aula ao vivo em breve!",
    message: "A aula 'Validação de Ideias' do curso de Empreendedorismo começa em 30 minutos.",
    timestamp: "Há 6 horas",
    read: true,
  },
  {
    id: 4,
    type: "mentor",
    title: "Novo material disponível",
    message: "Prof. Maria Santos adicionou novos materiais complementares no curso de Empreendedorismo.",
    timestamp: "Ontem",
    read: true,
    mentor: "Prof. Maria Santos",
  },
  {
    id: 5,
    type: "alert",
    title: "Prazo de projeto",
    message: "Lembrete: O projeto final do curso de Marketing Digital deve ser entregue até sexta-feira.",
    timestamp: "2 dias atrás",
    read: true,
  },
];

export function StudentMessages() {
  const [messages, setMessages] = useState(mockMessages);
  const [filter, setFilter] = useState("all");

  const filteredMessages = filter === "all" 
    ? messages 
    : filter === "unread"
    ? messages.filter(m => !m.read)
    : messages.filter(m => m.type === filter);

  const unreadCount = messages.filter(m => !m.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "reward":
      case "achievement":
        return <Star className="w-6 h-6 text-amber-500 fill-amber-500" />;
      case "mentor":
        return <MessageCircle className="w-6 h-6 text-[#599fe9]" />;
      case "alert":
        return <Bell className="w-6 h-6 text-amber-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-400" />;
    }
  };

  const getBgColor = (type: string, read: boolean) => {
    if (read) return "bg-gray-50";
    switch (type) {
      case "reward":
      case "achievement":
        return "bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-[#f54a12]";
      case "mentor":
        return "bg-blue-50 border-l-4 border-[#599fe9]";
      case "alert":
        return "bg-amber-50 border-l-4 border-amber-500";
      default:
        return "bg-gray-50";
    }
  };

  const markAsRead = (id: number) => {
    setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = (id: number) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  const markAllAsRead = () => {
    setMessages(messages.map(m => ({ ...m, read: true })));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Mensagens e Notificações</h1>
          <p className="text-gray-600">
            {unreadCount > 0 
              ? `Você tem ${unreadCount} ${unreadCount === 1 ? 'mensagem não lida' : 'mensagens não lidas'}`
              : 'Você está em dia com suas mensagens!'
            }
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            className="border-[#599fe9] text-[#599fe9] hover:bg-[#599fe9] hover:text-white"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#599fe9]" />
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-xl text-gray-900">{messages.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-[#f54a12] to-[#ff6b35] border-0 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-white" />
              <div>
                <p className="text-xs text-white/90">Não lidas</p>
                <p className="text-xl text-white">{unreadCount}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-[#599fe9]" />
              <div>
                <p className="text-xs text-gray-600">Mentores</p>
                <p className="text-xl text-gray-900">
                  {messages.filter(m => m.type === "mentor").length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-xs text-gray-600">Recompensas</p>
                <p className="text-xl text-gray-900">
                  {messages.filter(m => m.type === "reward" || m.type === "achievement").length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <TabsList className="bg-gray-100 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">
              Todas
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-white">
              Não Lidas {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="mentor" className="data-[state=active]:bg-white">
              Mentores
            </TabsTrigger>
            <TabsTrigger value="reward" className="data-[state=active]:bg-white">
              Recompensas
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Card className="bg-gray-50 border-2 border-dashed border-gray-300 p-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl text-gray-600 mb-2">Nenhuma mensagem</h3>
              <p className="text-gray-500">
                Você não tem mensagens {filter !== "all" && `em "${filter}"`}
              </p>
            </Card>
          </motion.div>
        ) : (
          filteredMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
            >
              <Card className={`${getBgColor(message.type, message.read)} border-gray-200 hover:shadow-lg transition-all`}>
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 pt-1">
                      {getIcon(message.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`${!message.read ? "text-gray-900" : "text-gray-700"}`}>
                          {message.title}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className={`text-sm mb-2 ${!message.read ? "text-gray-700" : "text-gray-600"}`}>
                        {message.message}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {message.mentor && (
                          <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30 text-xs">
                            {message.mentor}
                          </Badge>
                        )}
                        {message.spinners && (
                          <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30 text-xs flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-600" />
                            +{message.spinners}
                          </Badge>
                        )}
                        {!message.read && (
                          <Badge className="bg-[#f54a12]/20 text-[#f54a12] border-[#f54a12]/30 text-xs">
                            Nova
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex gap-2">
                      {!message.read && (
                        <button
                          onClick={() => markAsRead(message.id)}
                          className="text-gray-400 hover:text-[#599fe9] transition-colors"
                          title="Marcar como lida"
                        >
                          <CheckCheck className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
