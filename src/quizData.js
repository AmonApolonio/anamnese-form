// Quiz questions and options based on README
export const quizQuestions = [
  {
    id: 'gender',
    question: 'Com qual gênero você mais se identifica?',
    options: [
      { label: 'Masculino', value: 'masculino' },
      { label: 'Feminino', value: 'feminino' },
      { label: 'Prefiro não informar', value: 'nao_informar' },
    ],
  },
  // Feminino branch
  {
    id: 'f1',
    question: 'DESCREVA SUA PERSONALIDADE:',
    options: [
      { label: 'Informal, espontânea, alegre, ativa, energética.', value: 'A' },
      { label: 'Exigente, refinada, bem-sucedida, reservada.', value: 'B' },
      { label: 'Feminina, meiga, delicada.', value: 'C' },
      { label: 'Glamourosa, excitante, sensual.', value: 'D' },
      { label: 'Sofisticada, moderna, firme.', value: 'E' },
      { label: 'Conservadora, séria, organizada.', value: 'F' },
      { label: 'Exótica, aventureira, inovadora.', value: 'G' },
    ],
    gender: 'feminino',
  },
  {
    id: 'f2',
    question: 'QUAL SEU TIPO DE ROUPA PREFERIDO?',
    options: [
      { label: 'Roupas confortáveis, práticas de usar e cuidar.', value: 'A' },
      { label: 'Roupas discretas, mas com toques refinados.', value: 'B' },
      { label: 'Roupas delicadas de cores suaves.', value: 'C' },
      { label: 'Estampa animal, detalhes que valorizam o corpo.', value: 'D' },
      { label: 'Roupas estruturadas, modernas.', value: 'E' },
      { label: 'Roupas discretas que passem desapercebidas.', value: 'F' },
      { label: '“Mix” na hora de se vestir, roupas de brechó.', value: 'G' },
    ],
    gender: 'feminino',
  },
  {
    id: 'f3',
    question: 'PENSANDO NO SEU DIA A DIA, QUAIS SÃO AS COMBINAÇÕES DE CORES FAVORITAS?',
    options: [
      { label: 'Combinações simples; não gosto de perder tempo pensando em combinações.', value: 'A' },
      { label: 'Combinações de tons diferentes de uma mesma cor; gosto de escolher uma cor e variar as diferentes tonalidades dela em roupas e sapatos – monocromático.', value: 'B' },
      { label: 'Combinações delicadas em cores suaves, pois não gosto de grandes contrastes.', value: 'C' },
      { label: 'Combino só o que valoriza meu corpo, pois gosto de ver meu corpo bonito.', value: 'D' },
      { label: 'Faço combinações da moda, gosto de seguir tendências.', value: 'E' },
      { label: 'Combinações bem certinhas, de preferência cores neutras.', value: 'F' },
      { label: 'Não tenho preferência de combinações, cada dia combino de um jeito conforme o meu estado de espírito.', value: 'G' },
    ],
    gender: 'feminino',
  },
  // ... Add all other questions in similar format ...
];

export const estilos = [
  'Estilo Casual',
  'Estilo Elegante',
  'Estilo Romântico',
  'Estilo Sexy',
  'Estilo Moderno',
  'Estilo Tradicional',
  'Estilo Criativo',
];
