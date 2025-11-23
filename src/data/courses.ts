const Logo = require('../assets/wrath.png');

export type Course = {
  id: string;
  title: string;
  image: any;
  short: string;
  description: string;
  duration?: string;
  activities?: string[];
}

export const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Assistente Administrativo',
    image: Logo,
    short: 'Gestão e rotinas administrativas',
    description: 'Aprenda os fundamentos da administração, organização de documentos, atendimento e suporte ao setor administrativo.',
    duration: '3 meses',
    activities: [
      'Gestão de documentos',
      'Atendimento ao público',
      'Rotinas administrativas',
      'Apoio na saúde mental',
      'Inclusão para o mundo do trabalho'
    ]
  },
  {
    id: '2',
    title: 'Programação de Dispositivos Móveis',
    image: Logo,
    short: 'Desenvolvimento de apps com React Native',
    description: 'Aprenda a criar aplicativos móveis, usar Expo, gerenciar ativos e publicar aplicativos nas lojas.',
    duration: '6 meses',
    activities: [
      'Desenvolvimento de trilhas formativas',
      'Projetos práticos com React Native',
      'Publicação de apps',
      'Mentorias técnicas',
      'Colaboração em equipe'
    ]
  },
  {
    id: '3',
    title: 'Recursos Humanos e Liderança',
    image: Logo,
    short: 'Gestão de pessoas e liderança',
    description: 'Desenvolva habilidades para atuar em RH, recrutamento, seleção, treinamento e liderança de equipes.',
    duration: '4 meses',
    activities: [
      'Recrutamento e seleção',
      'Treinamento de equipes',
      'Gestão de conflitos',
      'Mentorias de liderança',
      'Apoio psicossocial'
    ]
  },
  {
    id: '4',
    title: 'Design Gráfico e Criatividade',
    image: Logo,
    short: 'Criação visual e comunicação',
    description: 'Aprenda princípios de design, ferramentas gráficas, criação de identidade visual e comunicação digital.',
    duration: '5 meses',
    activities: [
      'Oficinas de design',
      'Projetos de identidade visual',
      'Comunicação digital',
      'Colaboração criativa',
      'Portfólio profissional'
    ]
  },
  {
    id: '5',
    title: 'Empreendedorismo Social',
    image: Logo,
    short: 'Inovação e impacto social',
    description: 'Desenvolva projetos de impacto social, aprenda sobre negócios sustentáveis e liderança comunitária.',
    duration: '4 meses',
    activities: [
      'Criação de projetos sociais',
      'Gestão sustentável',
      'Liderança comunitária',
      'Mentorias de impacto',
      'Parcerias e networking'
    ]
  },
  {
    id: '6',
    title: 'Tecnologia e Inovação',
    image: Logo,
    short: 'Ferramentas digitais e automação',
    description: 'Explore ferramentas tecnológicas, automação de processos e inovação para o mercado de trabalho.',
    duration: '3 meses',
    activities: [
      'Automação de processos',
      'Uso de ferramentas digitais',
      'Projetos de inovação',
      'Oficinas práticas',
      'Desenvolvimento de carreira'
    ]
  }
];

export default sampleCourses;
