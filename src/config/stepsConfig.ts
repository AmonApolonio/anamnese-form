import { StepConfig } from '../types/coloracao';

export const STEPS_CONFIG: StepConfig[] = [
  {
    type: 'frente_solto',
    title: 'Foto de Frente – Solto',
    description: 'Cabelo solto, rosto centralizado e luz natural.',
    imageUrls: ['https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/frente_solto.png'],
    stateKey: 'frenteSolto'
  },
  {
    type: 'frente_preso',
    title: 'Foto de Frente – Preso',
    description: 'Cabelo preso, rosto livre, luz natural suave.',
    imageUrls: ['https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/frente_preso.png'],
    stateKey: 'frentePreso'
  },
  {
    type: 'perfil',
    title: 'Foto de Perfil',
    description: 'Lado do rosto, cabelo preso e boa luz natural.',
    imageUrls: ['https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/perfil.png'],
    stateKey: 'perfil'
  },
  {
    type: 'olho',
    title: 'Foto dos Olhos',
    description: 'Close dos olhos, sem maquiagem, bem iluminado.',
    imageUrls: ['https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/olhos.png'],
    stateKey: 'olhos'
  },
  {
    type: 'pulso',
    title: 'Foto do Pulso',
    description: 'Pulso virado para cima, luz natural, sem sombras.',
    imageUrls: ['https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/pulso.png'],
    stateKey: 'pulso'
  }
];
