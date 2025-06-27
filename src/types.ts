export type Option = {
  id: string;
  text: string;
  image?: string; // Optional image property for photo grid options
};

export type Question = {
  id: string;
  text: string;
  options: Option[];
  condition?: {
    questionId: string;
    optionId: string | string[];
  };
};

export type UserAnswer = {
  questionId: string;
  optionId: string;
};

export type StyleType = {
  id: string;
  name: string;
  description: string;
  score: number;
};

export const styleTypes: StyleType[] = [
  {
    id: "A",
    name: "Estilo Casual",
    description: "Prioriza conforto e praticidade no dia a dia.",
    score: 0
  },
  {
    id: "B",
    name: "Estilo Elegante",
    description: "Valoriza peças refinadas e sofisticadas.",
    score: 0
  },
  {
    id: "C",
    name: "Estilo Romântico",
    description: "Prefere peças delicadas com cores suaves.",
    score: 0
  },
  {
    id: "D",
    name: "Estilo Sexy",
    description: "Gosta de valorizar o corpo com peças que destacam a silhueta.",
    score: 0
  },
  {
    id: "E",
    name: "Estilo Moderno",
    description: "Segue tendências atuais da moda.",
    score: 0
  },
  {
    id: "F",
    name: "Estilo Tradicional",
    description: "Opta por peças clássicas e atemporais.",
    score: 0
  },
  {
    id: "G",
    name: "Estilo Criativo",
    description: "Mistura diferentes estilos de forma única e inovadora.",
    score: 0
  }
];
