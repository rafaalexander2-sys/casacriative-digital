import type { Metadata } from 'next'
import LegalLayout, { type Section } from '@/components/LegalLayout'

const BASE = 'https://casacriative.com.br'
const UPDATED = '20 de setembro de 2026'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description:
    'Regras de uso do site da Casa Criative Digital: propriedade intelectual, responsabilidades, contratação de serviços e foro aplicável.',
  alternates: { canonical: `${BASE}/termos-de-uso` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Termos de Uso | Casa Criative Digital',
    description: 'As regras de uso deste site e as condições gerais dos nossos serviços.',
    url: `${BASE}/termos-de-uso`,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Termos de Uso',
  url: `${BASE}/termos-de-uso`,
  inLanguage: 'pt-BR',
  dateModified: '2026-09-20',
  isPartOf: { '@type': 'WebSite', name: 'Casa Criative Digital', url: BASE },
  publisher: { '@id': `${BASE}/#organization` },
}

const sections: Section[] = [
  {
    id: 'aceitacao',
    title: 'Aceitação',
    blocks: [
      {
        p: 'Ao navegar em casacriative.com.br, preencher qualquer formulário ou entrar em contato pelos canais indicados no site, você concorda com estes Termos de Uso e com a nossa Política de Privacidade. Se não concordar com algum ponto, o caminho é simples: não use o site.',
      },
      {
        p: 'Estes termos valem para o site institucional. A contratação de serviços é regida por proposta e contrato próprios, assinados entre as partes, que prevalecem sobre este documento em caso de divergência.',
      },
    ],
  },
  {
    id: 'servicos',
    title: 'O que oferecemos aqui',
    blocks: [
      {
        p: 'A Casa Criative Digital é uma agência de marketing digital. Este site apresenta nossos serviços de tráfego pago, criação de sites e landing pages, SEO e otimização local, gestão de mídias sociais e design gráfico, e serve como canal de contato.',
      },
      {
        p: 'O conteúdo publicado no site e no blog tem caráter informativo. Não é consultoria personalizada e não garante resultado específico para o seu negócio. Cada projeto depende de mercado, investimento, produto, concorrência e execução, variáveis que não controlamos sozinhos.',
      },
    ],
  },
  {
    id: 'uso-permitido',
    title: 'Uso permitido e proibido',
    blocks: [
      { p: 'Você pode navegar, ler, compartilhar links e entrar em contato. Ao usar o site, você se compromete a não:' },
      {
        ul: [
          'Enviar dados falsos, de terceiros sem autorização ou preencher formulários em nome de outra pessoa',
          'Usar robôs, raspadores ou qualquer automação para extrair conteúdo ou sobrecarregar o serviço',
          'Tentar acessar áreas restritas, contas de clientes ou sistemas internos sem autorização',
          'Explorar falhas de segurança, injetar código malicioso ou interferir no funcionamento do site',
          'Reproduzir o conteúdo do site para fins comerciais sem autorização por escrito',
          'Praticar qualquer conduta ilícita ou que viole direitos de terceiros',
        ],
      },
      {
        p: 'Podemos bloquear acessos, remover conteúdo e tomar as medidas legais cabíveis diante de qualquer uma dessas condutas.',
      },
    ],
  },
  {
    id: 'propriedade',
    title: 'Propriedade intelectual',
    blocks: [
      {
        p: 'A marca Casa Criative Digital, o logotipo, os textos, as imagens, os vídeos, o código e o layout deste site pertencem à Casa Criative Digital ou foram licenciados para uso dela, e são protegidos pela Lei de Direitos Autorais e pela Lei da Propriedade Industrial.',
      },
      {
        p: 'Você pode citar trechos do nosso conteúdo desde que credite a fonte e inclua link para a página original. Qualquer reprodução integral, adaptação ou uso comercial depende de autorização prévia por escrito.',
      },
      {
        p: 'Peças de portfólio exibidas no site foram produzidas para clientes e as marcas exibidas pertencem aos respectivos titulares. Aparecem aqui apenas a título de referência de trabalho realizado.',
      },
    ],
  },
  {
    id: 'links',
    title: 'Links e serviços de terceiros',
    blocks: [
      {
        p: 'O site contém links para serviços de terceiros, como WhatsApp, Instagram, Facebook, LinkedIn e Behance, e usa ferramentas de terceiros para funcionar, como Google Analytics, Cloudflare, Supabase e Resend.',
      },
      {
        p: 'Não controlamos o conteúdo, as políticas nem a disponibilidade desses serviços. Ao sair do nosso site você passa a se relacionar diretamente com esses fornecedores, sob os termos deles. Recomendamos ler as políticas de cada um.',
      },
    ],
  },
  {
    id: 'disponibilidade',
    title: 'Disponibilidade e limitação de responsabilidade',
    blocks: [
      {
        p: 'Trabalhamos para manter o site no ar e com informação correta, mas ele é oferecido no estado em que se encontra. Pode haver interrupção por manutenção, falha de fornecedor, instabilidade de rede ou evento fora do nosso controle.',
      },
      {
        p: 'Dentro dos limites da lei, não respondemos por danos indiretos, lucros cessantes ou perda de oportunidade decorrentes do uso ou da indisponibilidade do site, nem por decisões que você tome com base apenas no conteúdo informativo aqui publicado.',
      },
      {
        p: 'Nada nestes termos afasta direitos garantidos ao consumidor pelo Código de Defesa do Consumidor.',
      },
    ],
  },
  {
    id: 'contratacao',
    title: 'Contratação de serviços',
    blocks: [
      {
        p: 'Preencher um formulário ou pedir orçamento não cria contrato nem obriga qualquer das partes. É apenas o início de uma conversa.',
      },
      {
        p: 'A contratação se formaliza com proposta aceita por escrito, onde ficam definidos escopo, prazos, valores, forma de pagamento, condições de reajuste e regras de rescisão. Valores eventualmente citados no site são referências e podem mudar conforme o projeto.',
      },
      {
        p: 'Verbas de mídia pagas ao Google, à Meta ou a qualquer plataforma de anúncios não se confundem com os honorários da agência e são de responsabilidade do contratante, salvo previsão diferente em contrato.',
      },
    ],
  },
  {
    id: 'privacidade',
    title: 'Dados pessoais',
    blocks: [
      {
        p: 'O tratamento de dados pessoais neste site está descrito na Política de Privacidade, que é parte integrante destes termos. Lá você encontra quais dados coletamos, com que base legal, com quem compartilhamos, por quanto tempo guardamos e como exercer seus direitos previstos na LGPD.',
      },
    ],
  },
  {
    id: 'alteracoes',
    title: 'Alterações destes termos',
    blocks: [
      {
        p: 'Podemos atualizar estes termos a qualquer momento para refletir mudanças nos serviços ou na legislação. A versão vigente é sempre a publicada nesta página, com a data de atualização indicada no topo. Continuar usando o site após uma alteração significa concordância com a nova versão.',
      },
    ],
  },
  {
    id: 'foro',
    title: 'Lei aplicável e foro',
    blocks: [
      {
        p: 'Estes termos são regidos pela lei brasileira, em especial pelo Marco Civil da Internet, pelo Código de Defesa do Consumidor e pela Lei Geral de Proteção de Dados.',
      },
      {
        p: 'Fica eleito o foro da Comarca de Curitiba, no Paraná, para resolver qualquer questão decorrente destes termos, ressalvado o direito do consumidor de ajuizar ação no foro do seu domicílio.',
      },
    ],
  },
]

export default function TermosDeUso() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalLayout
        tag="Termos"
        title="As regras do jogo,"
        highlight="sem enrolação."
        desc="O que você pode fazer neste site, o que é nosso, do que respondemos e do que não respondemos. Curto e direto."
        updatedAt={UPDATED}
        sections={sections}
      />
    </>
  )
}
