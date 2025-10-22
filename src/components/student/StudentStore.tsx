import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../new-layout/ui/dialog";
import {
  ShoppingBag,
  Star,
  Sparkles,
  Gift,
  Trophy,
  Shirt,
  BookOpen,
  Users,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { SpinnerIcon } from "../SpinnerIcon";

interface StoreItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: "benefits" | "digital" | "physical" | "experiences";
  image: string;
  icon: string;
  stock: number | "unlimited";
  popular?: boolean;
}

const mockStoreItems: StoreItem[] = [
  // Benefits
  {
    id: 1,
    name: "Sessão 1:1 com Mentor",
    description:
      "45 minutos de mentoria exclusiva com um dos nossos professores",
    price: 500,
    category: "benefits",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    icon: "👨‍🏫",
    stock: 10,
    popular: true,
  },
  {
    id: 2,
    name: "Material Complementar Premium",
    description: "Acesso a apostilas e exercícios exclusivos do curso",
    price: 200,
    category: "benefits",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop",
    icon: "📚",
    stock: "unlimited",
  },
  {
    id: 3,
    name: "Revisão de Projeto",
    description: "Feedback detalhado do mentor sobre seu projeto",
    price: 300,
    category: "benefits",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    icon: "✅",
    stock: 15,
  },
  // Digital
  {
    id: 4,
    name: "Avatar Personalizado",
    description: "Avatar exclusivo para seu perfil na plataforma",
    price: 150,
    category: "digital",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
    icon: "🎨",
    stock: "unlimited",
    popular: true,
  },
  {
    id: 5,
    name: "Badge Especial",
    description: "Badge exclusivo 'Membro VIP' visível no ranking",
    price: 250,
    category: "digital",
    image:
      "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=400&h=300&fit=crop",
    icon: "⭐",
    stock: "unlimited",
  },
  {
    id: 6,
    name: "Tema Premium",
    description: "Personalize a interface da sua plataforma",
    price: 400,
    category: "digital",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
    icon: "🎨",
    stock: "unlimited",
  },
  // Physical
  {
    id: 7,
    name: "Camiseta Nitro Academy",
    description: "Camiseta oficial da Nitro Academy (tamanhos P, M, G, GG)",
    price: 800,
    category: "physical",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    icon: "👕",
    stock: 25,
    popular: true,
  },
  {
    id: 8,
    name: "Kit Adesivos",
    description: "Pack com 10 adesivos exclusivos da Nitro Academy",
    price: 300,
    category: "physical",
    image:
      "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=400&h=300&fit=crop",
    icon: "🎁",
    stock: 50,
  },
  {
    id: 9,
    name: "Caneca Personalizada",
    description: "Caneca com logo da Nitro Academy e seu nome",
    price: 600,
    category: "physical",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop",
    icon: "☕",
    stock: 20,
  },
  // Experiences
  {
    id: 10,
    name: "Workshop Exclusivo",
    description: "Acesso a workshop especial com expert da indústria",
    price: 1000,
    category: "experiences",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    icon: "🎯",
    stock: 8,
    popular: true,
  },
  {
    id: 11,
    name: "Visita à Empresa Parceira",
    description: "Visita guiada a uma das empresas parceiras da Nitro",
    price: 1500,
    category: "experiences",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    icon: "🏢",
    stock: 5,
  },
  {
    id: 12,
    name: "Certificação Extra",
    description: "Certificação adicional em habilidade específica",
    price: 700,
    category: "experiences",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    icon: "🏆",
    stock: 12,
  },
];

export function StudentStore() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<number[]>([]);
  const studentSpinners = 2450; // Mock - should come from props/context

  const categories = [
    { id: "all", label: "Tudo", icon: ShoppingBag },
    { id: "benefits", label: "Benefícios", icon: Star },
    { id: "digital", label: "Digital", icon: Sparkles },
    { id: "physical", label: "Físico", icon: Gift },
    { id: "experiences", label: "Experiências", icon: Trophy },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? mockStoreItems
      : mockStoreItems.filter((item) => item.category === selectedCategory);

  const handlePurchase = (item: StoreItem) => {
    if (studentSpinners >= item.price) {
      setPurchasedItems([...purchasedItems, item.id]);
      setSelectedItem(null);
      toast.success(`${item.name} adquirido com sucesso! 🎉`, {
        description: `Você gastou ${item.price} Spinners`,
      });
    } else {
      toast.error("Spinners insuficientes", {
        description: `Você precisa de ${
          item.price - studentSpinners
        } Spinners a mais`,
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "benefits":
        return "bg-[#599fe9]/10 text-[#599fe9] border-[#599fe9]/30";
      case "digital":
        return "bg-purple-500/10 text-purple-500 border-purple-500/30";
      case "physical":
        return "bg-[#f54a12]/10 text-[#f54a12] border-[#f54a12]/30";
      case "experiences":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.label || category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl text-gray-900">Loja de Spinners</h1>
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#f54a12] to-[#ff6b35] px-4 py-2 rounded-xl">
            <SpinnerIcon className="w-5 h-5 text-white" />
            <span className="text-white">
              {studentSpinners.toLocaleString()} Spinners
            </span>
          </div>
        </div>
        <p className="text-gray-600">
          Troque seus Spinners por recompensas incríveis!
        </p>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#19184b] text-white shadow-lg shadow-[#19184b]/20"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{category.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {item.popular && (
                    <Badge className="absolute top-3 right-3 bg-[#f54a12] text-white border-0">
                      Popular
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-3">
                    <Badge
                      className={`text-xs mb-2 ${getCategoryColor(
                        item.category
                      )}`}
                    >
                      {getCategoryLabel(item.category)}
                    </Badge>
                    <h3 className="text-gray-900 mb-1 group-hover:text-[#f54a12] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <SpinnerIcon className="w-4 h-4 text-[#f54a12]" />
                        <span className="text-gray-900">
                          {item.price.toLocaleString()}
                        </span>
                      </div>
                      {typeof item.stock === "number" && (
                        <span className="text-xs text-gray-500">
                          {item.stock}{" "}
                          {item.stock === 1 ? "disponível" : "disponíveis"}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => setSelectedItem(item)}
                      className="w-full bg-gradient-to-r from-[#f54a12] to-[#ff6b35] hover:shadow-lg hover:shadow-[#f54a12]/30 text-white"
                      disabled={
                        purchasedItems.includes(item.id) ||
                        (typeof item.stock === "number" && item.stock === 0)
                      }
                    >
                      {purchasedItems.includes(item.id) ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Adquirido
                        </>
                      ) : typeof item.stock === "number" && item.stock === 0 ? (
                        "Esgotado"
                      ) : (
                        "Trocar Spinners"
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-gray-900 mb-2">Nenhum item encontrado</h3>
          <p className="text-gray-600">Tente selecionar outra categoria</p>
        </motion.div>
      )}

      {/* Purchase Dialog */}
      <Dialog
        open={selectedItem !== null}
        onOpenChange={() => setSelectedItem(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-3">
                  <span className="text-3xl">{selectedItem.icon}</span>
                  {selectedItem.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-64 object-cover rounded-xl"
                />

                <div>
                  <Badge
                    className={`${getCategoryColor(
                      selectedItem.category
                    )} mb-3`}
                  >
                    {getCategoryLabel(selectedItem.category)}
                  </Badge>
                  <p className="text-gray-600">{selectedItem.description}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Preço:</span>
                    <div className="flex items-center gap-2">
                      <SpinnerIcon className="w-5 h-5 text-[#f54a12]" />
                      <span className="text-xl text-gray-900">
                        {selectedItem.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Seus Spinners:</span>
                    <div className="flex items-center gap-2">
                      <SpinnerIcon className="w-5 h-5 text-[#599fe9]" />
                      <span className="text-xl text-gray-900">
                        {studentSpinners.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-gray-900">Após a troca:</span>
                    <div className="flex items-center gap-2">
                      <SpinnerIcon className="w-5 h-5 text-gray-400" />
                      <span
                        className={`text-xl ${
                          studentSpinners - selectedItem.price >= 0
                            ? "text-gray-900"
                            : "text-red-500"
                        }`}
                      >
                        {(
                          studentSpinners - selectedItem.price
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {typeof selectedItem.stock === "number" && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Gift className="w-4 h-4" />
                    <span>
                      {selectedItem.stock > 0
                        ? `${selectedItem.stock} ${
                            selectedItem.stock === 1
                              ? "unidade disponível"
                              : "unidades disponíveis"
                          }`
                        : "Esgotado"}
                    </span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedItem(null)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => handlePurchase(selectedItem)}
                    disabled={
                      studentSpinners < selectedItem.price ||
                      (typeof selectedItem.stock === "number" &&
                        selectedItem.stock === 0)
                    }
                    className="flex-1 bg-gradient-to-r from-[#f54a12] to-[#ff6b35] hover:shadow-lg hover:shadow-[#f54a12]/30 text-white"
                  >
                    {studentSpinners < selectedItem.price ? (
                      "Spinners Insuficientes"
                    ) : typeof selectedItem.stock === "number" &&
                      selectedItem.stock === 0 ? (
                      "Esgotado"
                    ) : (
                      <>
                        <SpinnerIcon className="w-4 h-4 mr-2 text-white" />
                        Confirmar Troca
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
