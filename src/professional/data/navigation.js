// Menu do perfil e navegação do profissional · sem API
import {
  Bell,
  BarChart3,
  Calendar,
  Clock,
  CreditCard,
  Gift,
  HelpCircle,
  Images,
  Home,
  MessageCircle,
  Search,
  ShieldCheck,
  Star,
  User,
  Users,
  Crown,
  Scissors,
  UserPlus,
} from "lucide-react";

export const proProfileMenu = [
  {
    title: "Minha atividade",
    items: [
      { label: "Editar perfil", icon: User, go: "proProfileEdit" },
      { label: "Minha agenda", icon: Calendar, go: "proAgendaDash" },
      { label: "Meus clientes", icon: Users, go: "proClients" },
      { label: "Conversas", icon: MessageCircle, go: "proConversations" },
      { label: "Notificações", icon: Bell, go: "proNotifications" },
      { label: "Meus serviços", icon: Scissors, go: "proManageServices" },
      { label: "Minha equipe", icon: UserPlus, go: "proStaff" },
      { label: "Meu portfólio", icon: Images, go: "proPortfolio" },
      { label: "Horário de funcionamento", icon: Clock, go: "proBusinessHours" },
      { label: "Financeiro", icon: CreditCard, go: "proFinance" },
    ],
  },
  {
    title: "Ganhos e recompensas",
    items: [
      { label: "Gift Cards Kira", icon: Gift, go: "proGiftCards" },
      { label: "Programa de fidelidade", icon: Star, go: "proLoyalty" },
      { label: "Plano Premium", icon: Crown, go: "proPremium" },
    ],
  },
  {
    title: "Segurança e confiança",
    items: [{ label: "Segurança Kira", icon: ShieldCheck, go: "proSecurity" }],
  },
  {
    title: "Suporte",
    items: [{ label: "Ajuda e suporte", icon: HelpCircle, go: "proHelp" }],
  },
];

export const proBottomNavItems = [
  { label: "Início", icon: Home, key: "proHome" },
  { label: "Buscar", icon: Search, key: "proSearch" },
  { label: "Analytics", icon: BarChart3, key: "proAnalytics" },
  { label: "Agenda", icon: Calendar, key: "proAgendaDash" },
  { label: "Perfil", icon: User, key: "proProfileMenu" },
];
