export interface CertLevel {
  id: string;
  title: string;
  subtitle: string;
  required: number;
  color: string;
  bg: string;
  icon: string;
  emoji: string;
}

export const CERT_LEVELS: CertLevel[] = [
  {
    id: "beginner",
    title: "Boshlovchi sertifikati",
    subtitle: "Boshlang'ich daraja",
    required: 10,
    color: "#16a34a",
    bg: "#dcfce7",
    icon: "🎖️",
    emoji: "🌱",
  },
  {
    id: "intermediate",
    title: "O'rta daraja sertifikati",
    subtitle: "O'rta daraja",
    required: 20,
    color: "#d97706",
    bg: "#fef3c7",
    icon: "🏅",
    emoji: "📗",
  },
  {
    id: "advanced",
    title: "Yuqori daraja sertifikati",
    subtitle: "Yuqori daraja",
    required: 35,
    color: "#7c3aed",
    bg: "#ede9fe",
    icon: "🥇",
    emoji: "🚀",
  },
  {
    id: "master",
    title: "Master sertifikati",
    subtitle: "Kursni tugatganlik",
    required: 50,
    color: "#dc2626",
    bg: "#fee2e2",
    icon: "🏆",
    emoji: "👑",
  },
];

export function getEarnedCerts(completedCount: number): CertLevel[] {
  return CERT_LEVELS.filter((c) => completedCount >= c.required);
}

export function getNextCert(completedCount: number): CertLevel | null {
  return CERT_LEVELS.find((c) => completedCount < c.required) || null;
}

export function getCurrentLevel(completedCount: number): string {
  const earned = getEarnedCerts(completedCount);
  if (earned.length === 0) return "Yangi boshlovchi";
  return earned[earned.length - 1].subtitle;
}
