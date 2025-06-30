import { Question } from './types.ts';

const questions: Question[] = [
  {
    id: "gender",
    text: "Com qual gênero você mais se identifica?",
    options: [
      { id: "male", text: "Masculino" },
      { id: "female", text: "Feminino" },
      { id: "prefer_not_to_say", text: "Prefiro não informar" }
    ]
  },
  // Feminino path questions
  {
    id: "q1",
    text: "Caracterize a sua personalidade:",
    options: [
      { id: "A", text: "Descontraída, impulsiva, divertida, dinâmica, cheia de energia;" },
      { id: "B", text: "Rigorosa, elegante, realizada, discreta;" },
      { id: "C", text: "Delicada, doce, suave;" },
      { id: "D", text: "Atraente, provocante, sedutora;" },
      { id: "E", text: "Sofisticada, contemporânea, decidida;" },
      { id: "F", text: "Tradicional, formal, metódica;" },
      { id: "G", text: "Diferente, ousada, criativa." }
    ],
    condition: { questionId: "gender", optionId: ["female", "prefer_not_to_say"] }
  },
  {
    id: "q2",
    text: "Que estilo de roupa você mais gosta de usar?",
    options: [
      { id: "A", text: "Peças confortáveis, funcionais e fáceis de manter." },
      { id: "B", text: "Roupas discretas, mas com acabamentos elegante." },
      { id: "C", text: "Peças delicadas, femininas e em tons claros." },
      { id: "D", text: "Estampa animal print e modelagens que evidenciem o corpo." },
      { id: "E", text: "Modelagens estruturadas, atuais e alinhadas com a modernidade." },
      { id: "F", text: "Roupas discretas que não chamem atenção." },
      { id: "G", text: "Mistura criativa de estilos, incluindo peças de segunda mão." }
    ],
    condition: { questionId: "gender", optionId: ["female", "prefer_not_to_say"] }
  },
  {
    id: "q3",
    text: "Pensando no seu dia a dia, quais são as combinações de cores favoritas?",
    options: [
      { id: "A", text: "Combinações básicas; prefiro não gastar tempo escolhendo cores." },
      { id: "B", text: "Variações de tons de uma mesma cor; prefiro escolher uma cor principal e brincar com suas nuances em roupas e acessórios – monocromático." },
      { id: "C", text: "Combinações suaves e delicadas, evito contrastes marcantes." },
      { id: "D", text: "Misturo apenas o que valoriza minha silhueta, gosto de destacar meu corpo." },
      { id: "E", text: "Sigo combinações que estão em alta, adoro estar por dentro das tendências." },
      { id: "F", text: "Cores bem coordenadas, de preferência discretas e neutras." },
      { id: "G", text: "Minhas combinações mudam conforme meu humor; não sigo um padrão fixo." }
    ],
    condition: { questionId: "gender", optionId: ["female", "prefer_not_to_say"] }
  },
  {
    id: "q4",
    text: "Qual é o seu estilo de compra preferido?",
    options: [
      { id: "A", text: "Só compro quando é necessário, prezo pela praticidade" },
      { id: "B", text: "Faço compras para renovar o que já tenho; valorizo peças atuais e de boa qualidade." },
      { id: "C", text: "Gosto muito de fazer compras, é um momento prazeroso, especialmente quando encontro itens delicados." },
      { id: "D", text: "Prefiro adquirir peças que favoreçam minha silhueta. Também me interesso por tendências." },
      { id: "E", text: "Me atraio pelo que vejo nas vitrines, na internet/redes sociais e nas revistas. Amo novidades e lançamentos." },
      { id: "F", text: "Minhas compras são bem pensadas; busco durabilidade e não me preocupo com modismos." },
      { id: "G", text: "Curto explorar lugares alternativos, como brechós e feiras artesanais, porque gosto do diferente e do exclusivo." }
    ],
    condition: { questionId: "gender", optionId: ["female", "prefer_not_to_say"] }
  },
  {
    id: "q5",
    text: "Você prefere determinados tecidos principalmente porque eles...",
    options: [
      { id: "A", text: "São práticos e simples de manter." },
      { id: "B", text: "São sofisticados." },
      { id: "C", text: "Possuem um toque suave e são delicados." },
      { id: "D", text: "Valorizam bem o corpo e vestem com perfeição." },
      { id: "E", text: "Estão em alta e refletem as últimas tendências." },
      { id: "F", text: "Têm boa durabilidade e qualidade." },
      { id: "G", text: "Têm um visual único, criativo e fora do comum." }
    ],
    condition: { questionId: "gender", optionId: ["female", "prefer_not_to_say"] }
  },
  {
    id: "q6",
    text: "Como você descreveria seus sapatos preferidos?",
    options: [
      { id: "A", text: "São principalmente confortáveis e práticos." },
      { id: "B", text: "São principalmente elegantes." },
      { id: "C", text: "São principalmente delicados." },
      { id: "D", text: "São principalmente adequados ao meu corpo e valorizam minha postura." },
      { id: "E", text: "São principalmente modernos e geralmente as últimas novidades." },
      { id: "F", text: "São principalmente resistentes e de longa duração." },
      { id: "G", text: "São principalmente exóticos." }
    ],
    condition: { questionId: "gender", optionId: ["female", "prefer_not_to_say"] }
  },
  // Photo grid questions with image property
  {
    id: "q7",
    text: "Escolha o brinco que mais combine com você.",
    options: [
      { id: "A", text: "", image: "/assets/female/q7/a.png" },
      { id: "B", text: "", image: "/assets/female/q7/b.png" },
      { id: "C", text: "", image: "/assets/female/q7/c.png" },
      { id: "D", text: "", image: "/assets/female/q7/d.png" },
      { id: "E", text: "", image: "/assets/female/q7/e.png" },
      { id: "F", text: "", image: "/assets/female/q7/f.png" },
      { id: "G", text: "", image: "/assets/female/q7/g.png" }
    ],
    condition: { questionId: "gender", optionId: ["female", "prefer_not_to_say"] }
  },
  {
    id: "q8",
    text: "Qual dessas camisas você usaria no seu dia a dia?",
    options: [
      { id: "A", text: "", image: "/assets/female/q8/a.png" },
      { id: "B", text: "", image: "/assets/female/q8/b.png" },
      { id: "C", text: "", image: "/assets/female/q8/c.png" },
      { id: "D", text: "", image: "/assets/female/q8/d.png" },
      { id: "E", text: "", image: "/assets/female/q8/e.png" },
      { id: "F", text: "", image: "/assets/female/q8/f.png" },
      { id: "G", text: "", image: "/assets/female/q8/g.png" }
    ],
    condition: { questionId: "gender", optionId: ["female", "prefer_not_to_say"] }
  },
  {
    id: "q9",
    text: "Escolha um vestido para um happy hour.",
    options: [
      { id: "A", text: "", image: "/assets/female/q9/a.png" },
      { id: "B", text: "", image: "/assets/female/q9/b.png" },
      { id: "C", text: "", image: "/assets/female/q9/c.png" },
      { id: "D", text: "", image: "/assets/female/q9/d.png" },
      { id: "E", text: "", image: "/assets/female/q9/e.png" },
      { id: "F", text: "", image: "/assets/female/q9/f.png" },
      { id: "G", text: "", image: "/assets/female/q9/g.png" }
    ],
    condition: { questionId: "gender", optionId: ["female", "prefer_not_to_say"] }
  },
  {
    id: "q10",
    text: "Escolha uma calça para um passeio no shopping.",
    options: [
      { id: "A", text: "", image: "/assets/female/q10/a.png" },
      { id: "B", text: "", image: "/assets/female/q10/b.png" },
      { id: "C", text: "", image: "/assets/female/q10/c.png" },
      { id: "D", text: "", image: "/assets/female/q10/d.png" },
      { id: "E", text: "", image: "/assets/female/q10/e.png" },
      { id: "F", text: "", image: "/assets/female/q10/f.png" },
      { id: "G", text: "", image: "/assets/female/q10/g.png" }
    ],
    condition: { questionId: "gender", optionId: ["female", "prefer_not_to_say"] }
  },
  {
    id: "q11",
    text: "Qual dessas saias mais combina com você?",
    options: [
      { id: "A", text: "", image: "/assets/female/q11/a.png" },
      { id: "B", text: "", image: "/assets/female/q11/b.png" },
      { id: "C", text: "", image: "/assets/female/q11/c.png" },
      { id: "D", text: "", image: "/assets/female/q11/d.png" },
      { id: "E", text: "", image: "/assets/female/q11/e.png" },
      { id: "F", text: "", image: "/assets/female/q11/f.png" },
      { id: "G", text: "", image: "/assets/female/q11/g.png" }
    ],
    condition: { questionId: "gender", optionId: ["female", "prefer_not_to_say"] }
  },
  {
    id: "q12",
    text: "Qual desses sapatos mais combinam com você?",
    options: [
      { id: "A", text: "", image: "/assets/female/q12/a.png" },
      { id: "B", text: "", image: "/assets/female/q12/b.png" },
      { id: "C", text: "", image: "/assets/female/q12/c.png" },
      { id: "D", text: "", image: "/assets/female/q12/d.png" },
      { id: "E", text: "", image: "/assets/female/q12/e.png" },
      { id: "F", text: "", image: "/assets/female/q12/f.png" },
      { id: "G", text: "", image: "/assets/female/q12/g.png" }
    ],
    condition: { questionId: "gender", optionId: ["female", "prefer_not_to_say"] }
  },
  {
    id: "q13",
    text: "Qual dessas bolsas você usaria para passear no shopping?",
    options: [
      { id: "A", text: "", image: "/assets/female/q13/a.png" },
      { id: "B", text: "", image: "/assets/female/q13/b.png" },
      { id: "C", text: "", image: "/assets/female/q13/c.png" },
      { id: "D", text: "", image: "/assets/female/q13/d.png" },
      { id: "E", text: "", image: "/assets/female/q13/e.png" },
      { id: "F", text: "", image: "/assets/female/q13/f.png" },
      { id: "G", text: "", image: "/assets/female/q13/g.png" }
    ],
    condition: { questionId: "gender", optionId: ["female", "prefer_not_to_say"] }
  },
  // Masculino path questions
  {
    id: "m1",
    text: "Quais são os elogios que você mais costuma receber dos seus amigos?",
    options: [
      { id: "A", text: "Descontraído, espontâneo, bem-humorado, sociável e divertido." },
      { id: "B", text: "Tradicional, criterioso, confiável e discreto." },
      { id: "C", text: "Sentimental, cuidadoso, gentil e afetuoso." },
      { id: "D", text: "Atraente, destemido, envolvente, carismático e seguro de si." },
      { id: "E", text: "Criativo, ousado, intenso e autêntico." },
      { id: "F", text: "Sério, refinado e meticuloso." },
      { id: "G", text: "Sofisticado, atual e determinado." }
    ],
    condition: { questionId: "gender", optionId: "male" }
  },
  {
    id: "m2",
    text: "Qual é o seu estilo de roupa preferido?",
    options: [
      { id: "A", text: "Peças confortáveis, funcionais e fáceis de manter." },
      { id: "B", text: "Roupas discretas que não chamem atenção." },
      { id: "C", text: "Roupas delicadas em tons claros e com um toque suave." },
      { id: "D", text: "Roupas que destacam o físico." },
      { id: "E", text: "Estilo variado e criativo, com peças de brechó ou achados alternativos." },
      { id: "F", text: "Roupas discretas com detalhes sofisticados e elegantes." },
      { id: "G", text: "Roupas estruturadas, visual contemporâneo e atual." }
    ],
    condition: { questionId: "gender", optionId: "male" }
  },
  {
    id: "m3",
    text: "O que você considera mais importante na hora de comprar roupas?",
    options: [
      { id: "A", text: "Que sejam confortáveis e agradáveis de usar." },
      { id: "B", text: "Que tenham boa durabilidade e sejam de qualidade." },
      { id: "C", text: "Que sejam leves, com bom caimento e movimento." },
      { id: "D", text: "Que destaquem os pontos fortes do corpo." },
      { id: "E", text: "Que sejam autênticas e diferentes." },
      { id: "F", text: "Que transmitam elegância e bom gosto." },
      { id: "G", text: "Que sejam tendências." }
    ],
    condition: { questionId: "gender", optionId: "male" }
  },
  {
    id: "m4",
    text: "Se você tivesse que escolher uma roupa para usar pelo resto da vida, qual seria?",
    options: [
      { id: "A", text: "Jeans básico, camiseta lisa, tênis casual e relógio de pulso." },
      { id: "B", text: "Terno reto e estruturado, afastado do corpo e em tom neutro, e pasta executiva." },
      { id: "C", text: "Calça de linho folgada, suéter em 'V' e sapatênis de couro cru." },
      { id: "D", text: "Jeans justo, camisa slim, sapato social italiano e óculos escuros de marca." },
      { id: "E", text: "Jeans colorido, camiseta decotada em tom vibrante." },
      { id: "F", text: "Calça de alfaiataria, camisa branca, blazer clássico, cinto discreto e sapato formal." },
      { id: "G", text: "Jeans verde oliva, camisa de flanela xadrez e tênis de cano alto." }
    ],
    condition: { questionId: "gender", optionId: "male" }
  },
  {
    id: "m5",
    text: "Qual é o seu passeio favorito?",
    options: [
      { id: "A", text: "Um café da manhã reforçado seguido de uma caminhada ao sol no parque." },
      { id: "B", text: "Almoçar em um restaurante refinado e depois visitar uma galeria ou exposição." },
      { id: "C", text: "Jantar à luz de velas em um ambiente intimista." },
      { id: "D", text: "Happy hour em um barzinho com mesas ao ar livre." },
      { id: "E", text: "Ir a eventos, apresentações teatrais e experimentar culinárias exóticas." },
      { id: "F", text: "Comer em um restaurante famoso e assistir a um filme no cinema." },
      { id: "G", text: "Explorar um destino diferente, onde nunca tenha estado." }
    ],
    condition: { questionId: "gender", optionId: "male" }
  }
];

export default questions;
