import { Question } from './types.ts';

const questions: Question[] = [
  {
    id: "gender",
    text: "Com qual genero você mais se identifica?",
    options: [
      { id: "male", text: "Masculino" },
      { id: "female", text: "Feminino" },
      { id: "prefer_not_to_say", text: "Prefiro não informar" }
    ]
  },
  // Feminino path questions
  {
    id: "q1",
    text: "DESCREVA SUA PERSONALIDADE:",
    options: [
      { id: "A", text: "Informal, espontânea, alegre, ativa, energética." },
      { id: "B", text: "Exigente, refinada, bem-sucedida, reservada." },
      { id: "C", text: "Feminina, meiga, delicada." },
      { id: "D", text: "Glamourosa, excitante, sensual." },
      { id: "E", text: "Sofisticada, moderna, firme." },
      { id: "F", text: "Conservadora, séria, organizada." },
      { id: "G", text: "Exótica, aventureira, inovadora." }
    ],
    condition: { questionId: "gender", optionId: "female" }
  },
  {
    id: "q2",
    text: "QUAL SEU TIPO DE ROUPA PREFERIDO?",
    options: [
      { id: "A", text: "Roupas confortáveis, práticas de usar e cuidar." },
      { id: "B", text: "Roupas discretas, mas com toques refinados." },
      { id: "C", text: "Roupas delicadas de cores suaves." },
      { id: "D", text: "Estampa animal, detalhes que valorizam o corpo." },
      { id: "E", text: "Roupas estruturadas, modernas." },
      { id: "F", text: "Roupas discretas que passem desapercebidas." },
      { id: "G", text: '"Mix" na hora de se vestir, roupas de brechó.' }
    ],
    condition: { questionId: "gender", optionId: "female" }
  },
  {
    id: "q3",
    text: "PENSANDO NO SEU DIA A DIA, QUAIS SÃO AS COMBINAÇÕES DE CORES FAVORITAS?",
    options: [
      { id: "A", text: "Combinações simples; não gosto de perder tempo pensando em combinações." },
      { id: "B", text: "Combinações de tons diferentes de uma mesma cor; gosto de escolher uma cor e variar as diferentes tonalidades dela em roupas e sapatos – monocromático." },
      { id: "C", text: "Combinações delicadas em cores suaves, pois não gosto de grandes contrastes." },
      { id: "D", text: "Combino só o que valoriza meu corpo, pois gosto de ver meu corpo bonito." },
      { id: "E", text: "Faço combinações da moda, gosto de seguir tendências." },
      { id: "F", text: "Combinações bem certinhas, de preferência cores neutras." },
      { id: "G", text: "Não tenho preferência de combinações, cada dia combino de um jeito conforme o meu estado de espírito." }
    ],
    condition: { questionId: "gender", optionId: "female" }
  },
  {
    id: "q4",
    text: "COMO GOSTO DE FAZER COMPRAS?",
    options: [
      { id: "A", text: "Compro quando preciso; não gosto de perder tempo. Gosto de facilidades." },
      { id: "B", text: "Compro pensando em atualizar o que eu já tenho. Gosto de qualidade e atualidade." },
      { id: "C", text: "Adoro ir às compras, compro por prazer e adoro tudo que tenha detalhes delicados." },
      { id: "D", text: "Adoro comprar peças que valorizam o meu corpo. Gosto de tendência também." },
      { id: "E", text: "Compro o que está nas vitrines, nas novelas, nas revistas. Adoro lançamentos." },
      { id: "F", text: "Faço compras planejadas. Gosto de qualidade e não ligo pra moda." },
      { id: "G", text: "Adoro lugares alternativos, brechós, feiras de artesanatos, pois adoro o incomum" }
    ],
    condition: { questionId: "gender", optionId: "female" }
  },
  {
    id: "q5",
    text: "VOCÊ ESCOLHE CERTOS TECIDOS PRINCIPALMENTE PORQUE ELES...",
    options: [
      { id: "A", text: "São fáceis de cuidar." },
      { id: "B", text: "São sofisticados." },
      { id: "C", text: "São delicados." },
      { id: "D", text: "São perfeitos no corpo." },
      { id: "E", text: "São atuais, estão na moda." },
      { id: "F", text: "São de qualidade." },
      { id: "G", text: "São interessantes, diferentes, incomuns." }
    ],
    condition: { questionId: "gender", optionId: "female" }
  },
  {
    id: "q6",
    text: "COMO SÃO SEUS SAPATOS FAVORITOS?",
    options: [
      { id: "A", text: "São essencialmente confortáveis." },
      { id: "B", text: "São essencialmente sofisticados." },
      { id: "C", text: "São essencialmente delicados." },
      { id: "D", text: "São essencialmente perfeitos para meu corpo." },
      { id: "E", text: "São essencialmente lançamentos." },
      { id: "F", text: "São essencialmente duráveis." },
      { id: "G", text: "São essencialmente diferentes." }
    ],
    condition: { questionId: "gender", optionId: "female" }
  },
  // Photo grid questions with image property
  {
    id: "q7",
    text: "ESCOLHA O BRINCO QUE MAIS COMBINE COM VOCÊ.",
    options: [
      { id: "A", text: "", image: "/src/assets/female/q7/a.jpg" },
      { id: "B", text: "", image: "/src/assets/female/q7/b.jpg" },
      { id: "C", text: "", image: "/src/assets/female/q7/c.jpg" },
      { id: "D", text: "", image: "/src/assets/female/q7/d.jpg" },
      { id: "E", text: "", image: "/src/assets/female/q7/e.jpg" },
      { id: "F", text: "", image: "/src/assets/female/q7/f.jpg" },
      { id: "G", text: "", image: "/src/assets/female/q7/g.jpg" }
    ],
    condition: { questionId: "gender", optionId: "female" }
  },
  {
    id: "q8",
    text: "QUAL DESSAS CAMISAS VOCÊ USARIA NO SEU DIA A DIA?",
    options: [
      { id: "A", text: "", image: "/src/assets/female/q8/a.jpg" },
      { id: "B", text: "", image: "/src/assets/female/q8/b.jpg" },
      { id: "C", text: "", image: "/src/assets/female/q8/c.jpg" },
      { id: "D", text: "", image: "/src/assets/female/q8/d.jpg" },
      { id: "E", text: "", image: "/src/assets/female/q8/e.jpg" },
      { id: "F", text: "", image: "/src/assets/female/q8/f.jpg" },
      { id: "G", text: "", image: "/src/assets/female/q8/g.jpg" }
    ],
    condition: { questionId: "gender", optionId: "female" }
  },
  {
    id: "q9",
    text: "ESCOLHA UM VESTIDO PARA UM HAPPY HOUR.",
    options: [
      { id: "A", text: "", image: "/src/assets/female/q9/a.jpg" },
      { id: "B", text: "", image: "/src/assets/female/q9/b.jpg" },
      { id: "C", text: "", image: "/src/assets/female/q9/c.jpg" },
      { id: "D", text: "", image: "/src/assets/female/q9/d.jpg" },
      { id: "E", text: "", image: "/src/assets/female/q9/e.jpg" },
      { id: "F", text: "", image: "/src/assets/female/q9/f.jpg" },
      { id: "G", text: "", image: "/src/assets/female/q9/g.jpg" }
    ],
    condition: { questionId: "gender", optionId: "female" }
  },
  {
    id: "q10",
    text: "ESCOLHA UMA CALÇA PARA UM PASSEIO NO SHOPPING.",
    options: [
      { id: "A", text: "", image: "/src/assets/female/q10/a.jpg" },
      { id: "B", text: "", image: "/src/assets/female/q10/b.jpg" },
      { id: "C", text: "", image: "/src/assets/female/q10/c.jpg" },
      { id: "D", text: "", image: "/src/assets/female/q10/d.jpg" },
      { id: "E", text: "", image: "/src/assets/female/q10/e.jpg" },
      { id: "F", text: "", image: "/src/assets/female/q10/f.jpg" },
      { id: "G", text: "", image: "/src/assets/female/q10/g.jpg" }
    ],
    condition: { questionId: "gender", optionId: "female" }
  },
  {
    id: "q11",
    text: "QUAL DESSAS SAIAS MAIS COMBINA COM VOCÊ?",
    options: [
      { id: "A", text: "", image: "/src/assets/female/q11/a.jpg" },
      { id: "B", text: "", image: "/src/assets/female/q11/b.jpg" },
      { id: "C", text: "", image: "/src/assets/female/q11/c.jpg" },
      { id: "D", text: "", image: "/src/assets/female/q11/d.jpg" },
      { id: "E", text: "", image: "/src/assets/female/q11/e.jpg" },
      { id: "F", text: "", image: "/src/assets/female/q11/f.jpg" },
      { id: "G", text: "", image: "/src/assets/female/q11/g.jpg" }
    ],
    condition: { questionId: "gender", optionId: "female" }
  },
  {
    id: "q12",
    text: "QUAL DESSES SAPATOS MAIS COMBINAM COM VOCÊ?",
    options: [
      { id: "A", text: "", image: "/src/assets/female/q12/a.jpg" },
      { id: "B", text: "", image: "/src/assets/female/q12/b.jpg" },
      { id: "C", text: "", image: "/src/assets/female/q12/c.jpg" },
      { id: "D", text: "", image: "/src/assets/female/q12/d.jpg" },
      { id: "E", text: "", image: "/src/assets/female/q12/e.jpg" },
      { id: "F", text: "", image: "/src/assets/female/q12/f.jpg" },
      { id: "G", text: "", image: "/src/assets/female/q12/g.jpg" }
    ],
    condition: { questionId: "gender", optionId: "female" }
  },
  {
    id: "q13",
    text: "QUAL DESSAS BOLSAS VOCÊ USARIA PARA PASSEAR NO SHOPPING?",
    options: [
      { id: "A", text: "", image: "/src/assets/female/q13/a.jpg" },
      { id: "B", text: "", image: "/src/assets/female/q13/b.jpg" },
      { id: "C", text: "", image: "/src/assets/female/q13/c.jpg" },
      { id: "D", text: "", image: "/src/assets/female/q13/d.jpg" },
      { id: "E", text: "", image: "/src/assets/female/q13/e.jpg" },
      { id: "F", text: "", image: "/src/assets/female/q13/f.jpg" },
      { id: "G", text: "", image: "/src/assets/female/q13/g.jpg" }
    ],
    condition: { questionId: "gender", optionId: "female" }
  }
];

export default questions;
