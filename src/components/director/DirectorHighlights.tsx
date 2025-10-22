import { motion } from "motion/react";
import { Card } from "../new-layout/ui/card";
import { Button } from "../new-layout/ui/button";
import { Badge } from "../new-layout/ui/badge";
import { 
  Star,
  Heart,
  MessageSquare,
  Trophy,
  Sparkles,
  Users,
  Clock,
  ThumbsUp
} from "lucide-react";

const classHighlights = [
  {
    id: 1,
    course: "Inteligência Artificial",
    title: "Introdução ao Machine Learning",
    date: "18 Out 2025",
    teacher: "Prof. Carlos Silva",
    highlights: [
      "Discussão muito engajada sobre redes neurais",
      "5 alunos apresentaram projetos incríveis",
      "Taxa de participação: 100%"
    ],
    engagement: 98,
    comments: 42,
    likes: 87,
    attendees: 24,
    category: "excelente"
  },
  {
    id: 2,
    course: "Empreendedorismo",
    title: "Validação de Ideias de Negócio",
    date: "17 Out 2025",
    teacher: "Prof. Marina Costa",
    highlights: [
      "Alunos criaram 8 protótipos durante a aula",
      "Debate intenso sobre MVP e validação",
      "3 ideias receberam feedback de mentores externos"
    ],
    engagement: 95,
    comments: 38,
    likes: 76,
    attendees: 18,
    category: "excelente"
  },
  {
    id: 3,
    course: "Marketing Digital",
    title: "Estratégias de Growth Hacking",
    date: "16 Out 2025",
    teacher: "Prof. João Santos",
    highlights: [
      "Case study de startup que cresceu 300%",
      "Alunos criaram 12 campanhas práticas",
      "Workshop interativo com especialista convidado"
    ],
    engagement: 92,
    comments: 31,
    likes: 68,
    attendees: 21,
    category: "bom"
  },
  {
    id: 4,
    course: "Desenvolvimento Web",
    title: "React Hooks Avançados",
    date: "15 Out 2025",
    teacher: "Prof. Ana Ferreira",
    highlights: [
      "Live coding de projeto real",
      "Todos os alunos conseguiram implementar useContext",
      "Grupo criou biblioteca de hooks customizados"
    ],
    engagement: 90,
    comments: 29,
    likes: 64,
    attendees: 22,
    category: "bom"
  },
  {
    id: 5,
    course: "Design UX/UI",
    title: "Design System e Componentização",
    date: "14 Out 2025",
    teacher: "Prof. Lucas Almeida",
    highlights: [
      "Criação colaborativa de design system completo",
      "6 alunos apresentaram portfolios impressionantes",
      "Simulação de apresentação para stakeholders"
    ],
    engagement: 88,
    comments: 25,
    likes: 59,
    attendees: 19,
    category: "bom"
  },
];

const topMoments = [
  {
    id: 1,
    student: "Ana Silva",
    moment: 'Criou um algoritmo de ML que impressionou toda a turma',
    course: "Inteligência Artificial",
    date: "18 Out 2025",
    reactions: 45
  },
  {
    id: 2,
    student: "Carlos Santos",
    moment: 'Apresentou pitch que recebeu standing ovation',
    course: "Empreendedorismo",
    date: "17 Out 2025",
    reactions: 38
  },
  {
    id: 3,
    student: "Mariana Costa",
    moment: 'Criou campanha viral que foi compartilhada 500+ vezes',
    course: "Marketing Digital",
    date: "16 Out 2025",
    reactions: 42
  },
  {
    id: 4,
    student: "Pedro Oliveira",
    moment: 'Desenvolveu componente reutilizável adotado pela turma',
    course: "Desenvolvimento Web",
    date: "15 Out 2025",
    reactions: 35
  },
];

const teacherInsights = [
  {
    teacher: "Prof. Carlos Silva",
    insight: "Esta turma de IA está entre as melhores que já tive. O nível de engajamento e curiosidade é excepcional!",
    course: "Inteligência Artificial",
    date: "18 Out 2025"
  },
  {
    teacher: "Prof. Marina Costa",
    insight: "Impressionada com a criatividade dos alunos. Várias ideias de negócio têm potencial real de mercado.",
    course: "Empreendedorismo",
    date: "17 Out 2025"
  },
  {
    teacher: "Prof. João Santos",
    insight: "Os alunos estão aplicando conceitos de marketing em projetos reais. Resultados práticos já na primeira semana!",
    course: "Marketing Digital",
    date: "16 Out 2025"
  },
];

export function DirectorHighlights() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl text-gray-900 mb-2">Destaques das Aulas</h2>
        <p className="text-gray-600">Os melhores momentos e conquistas recentes</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Aulas Destaque</p>
                  <p className="text-2xl text-gray-900">{classHighlights.filter(c => c.category === 'excelente').length}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Engajamento &gt; 95%</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Total de Likes</p>
                  <p className="text-2xl text-gray-900">{classHighlights.reduce((acc, c) => acc + c.likes, 0)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Nas últimas aulas</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Comentários</p>
                  <p className="text-2xl text-gray-900">{classHighlights.reduce((acc, c) => acc + c.comments, 0)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Feedback dos alunos</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Momentos Top</p>
                  <p className="text-2xl text-gray-900">{topMoments.length}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Esta semana</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Class Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-white border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#f54a12]" />
              <h3 className="text-xl text-gray-900">Aulas em Destaque</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {classHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                  highlight.category === 'excelente'
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-[#599fe9]/20 text-[#599fe9] border-[#599fe9]/30">
                        {highlight.course}
                      </Badge>
                      {highlight.category === 'excelente' && (
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                          <Trophy className="w-3 h-3 mr-1" />
                          Destaque
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-lg text-gray-900 mb-1">{highlight.title}</h4>
                    <p className="text-sm text-gray-600">
                      {highlight.teacher} • {highlight.date}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{highlight.attendees}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4 text-pink-500" />
                        <span>{highlight.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span>{highlight.comments}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#f54a12] to-[#ff6b35]"
                          style={{ width: `${highlight.engagement}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{highlight.engagement}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {highlight.highlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#f54a12] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Student Moments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#f54a12]" />
                <h3 className="text-xl text-gray-900">Momentos Memoráveis</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {topMoments.map((moment, index) => (
                <motion.div
                  key={moment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#f54a12] to-[#ff6b35] rounded-full flex items-center justify-center text-white flex-shrink-0">
                        {moment.student.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-gray-900">{moment.student}</p>
                        <p className="text-xs text-gray-500">{moment.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-pink-500">
                      <Heart className="w-4 h-4 fill-current" />
                      <span className="text-sm">{moment.reactions}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 ml-13">{moment.moment}</p>
                  <p className="text-xs text-gray-500 mt-2 ml-13">{moment.date}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Teacher Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#599fe9]" />
                <h3 className="text-xl text-gray-900">Feedback dos Professores</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {teacherInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#599fe9] to-[#4a8ed9] rounded-full flex items-center justify-center text-white flex-shrink-0">
                      {insight.teacher.split(" ")[1][0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{insight.teacher}</p>
                      <p className="text-xs text-gray-500">{insight.course}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{insight.insight}"</p>
                  <p className="text-xs text-gray-500 mt-2">{insight.date}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
