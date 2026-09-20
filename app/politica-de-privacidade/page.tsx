import type { Metadata } from 'next'
import LegalLayout, { type Section } from '@/components/LegalLayout'

const BASE = 'https://casacriative.com.br'
const UPDATED = '20 de setembro de 2026'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Como a Casa Criative Digital coleta, usa, compartilha e protege dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
  alternates: { canonical: `${BASE}/politica-de-privacidade` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Política de Privacidade | Casa Criative Digital',
    description: 'Quais dados coletamos, para quê, com quem compartilhamos e como você exerce seus direitos.',
    url: `${BASE}/politica-de-privacidade`,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Política de Privacidade',
  url: `${BASE}/politica-de-privacidade`,
  inLanguage: 'pt-BR',
  dateModified: '2026-09-20',
  isPartOf: { '@type': 'WebSite', name: 'Casa Criative Digital', url: BASE },
  publisher: { '@id': `${BASE}/#organization` },
}

const sections: Section[] = [
  {
    id: 'quem-somos',
    title: 'Quem é responsável pelos seus dados',
    blocks: [
      {
        p: 'A Casa Criative Digital é uma agência de marketing digital sediada em Curitiba, no Paraná. Somos a controladora dos dados pessoais coletados neste site, o que significa que somos nós que decidimos por que e como eles são tratados.',
      },
      {
        dl: [
          { term: 'Controlador', desc: 'Casa Criative Digital, Curitiba, Paraná, Brasil.' },
          { term: 'Contato para assuntos de privacidade', desc: 'contato@casacriative.com.br' },
          { term: 'WhatsApp', desc: '+55 (41) 99817-0428' },
        ],
      },
      {
        p: 'Quando prestamos serviço para um cliente e tratamos dados dos clientes dele, atuamos como operadores. Nesse caso a empresa contratante continua sendo a controladora e é a ela que o titular deve se dirigir em primeiro lugar.',
      },
    ],
  },
  {
    id: 'dados-coletados',
    title: 'Quais dados coletamos',
    blocks: [
      { p: 'Coletamos apenas o que precisamos para responder você e para entender de onde vêm nossos contatos.' },
      {
        dl: [
          {
            term: 'Dados que você digita',
            desc: 'Nome, e-mail, telefone ou WhatsApp, perfil do Instagram, nicho de atuação e serviço de interesse, informados no formulário da página de Contato ou nas nossas landing pages.',
          },
          {
            term: 'Dados de origem do anúncio',
            desc: 'Se você chegou por um anúncio, guardamos no seu navegador os identificadores gclid e fbclid e os parâmetros utm_source, utm_medium, utm_campaign, utm_term e utm_content. Eles ficam no armazenamento local do navegador e são enviados junto com o formulário para sabermos qual campanha trouxe você.',
          },
          {
            term: 'Dados de navegação',
            desc: 'Páginas visitadas, tempo de permanência, tipo de dispositivo, navegador, sistema operacional, idioma e localização aproximada por cidade. Coletados pelo Google Analytics apenas se você aceitar os cookies de medição.',
          },
          {
            term: 'Dados de formulários de anúncio',
            desc: 'Quando você preenche um formulário de lead dentro do Google Ads, sem passar pelo site, recebemos nome, e-mail, telefone e empresa diretamente do Google.',
          },
          {
            term: 'Dados técnicos de segurança',
            desc: 'Endereço IP e registros de acesso tratados pela Cloudflare para proteger o site contra ataques e abuso.',
          },
        ],
      },
      {
        p: 'Não coletamos dados sensíveis, como origem racial, convicção religiosa, opinião política, filiação sindical ou dados de saúde. Não pedimos nem armazenamos dados de cartão de crédito neste site. Também não direcionamos nossos serviços a menores de 18 anos.',
      },
    ],
  },
  {
    id: 'finalidades',
    title: 'Para que usamos e com que base legal',
    blocks: [
      {
        p: 'A LGPD exige que todo tratamento tenha uma finalidade clara e uma base legal. Abaixo está o nosso mapa.',
      },
      {
        dl: [
          {
            term: 'Responder ao seu contato e enviar proposta',
            desc: 'Base legal: procedimentos preliminares relacionados a contrato, previstos no artigo 7º, inciso V, da LGPD. Sem esses dados não conseguimos retornar.',
          },
          {
            term: 'Executar o serviço contratado',
            desc: 'Base legal: execução de contrato, artigo 7º, inciso V.',
          },
          {
            term: 'Medir audiência e desempenho do site',
            desc: 'Base legal: seu consentimento, artigo 7º, inciso I, dado no banner de cookies. Você pode retirar a qualquer momento.',
          },
          {
            term: 'Publicidade e remarketing',
            desc: 'Base legal: seu consentimento, dado no banner de cookies.',
          },
          {
            term: 'Segurança do site e prevenção a fraude',
            desc: 'Base legal: legítimo interesse, artigo 7º, inciso IX.',
          },
          {
            term: 'Cumprir obrigação legal ou fiscal',
            desc: 'Base legal: artigo 7º, inciso II, quando aplicável a clientes contratantes.',
          },
        ],
      },
      {
        p: 'Não vendemos seus dados. Não usamos suas informações para decisões automatizadas que produzam efeito jurídico sobre você.',
      },
    ],
  },
  {
    id: 'compartilhamento',
    title: 'Com quem compartilhamos',
    blocks: [
      {
        p: 'Para operar o site e o atendimento usamos serviços de terceiros. Cada um recebe apenas o necessário para cumprir sua função.',
      },
      {
        dl: [
          {
            term: 'Google (Analytics e Ads)',
            desc: 'Medição de audiência, conversões e publicidade. Recebe dados de navegação apenas com o seu consentimento. Também é a origem dos leads gerados pelos formulários de anúncio.',
          },
          {
            term: 'Cloudflare',
            desc: 'Hospedagem, rede de distribuição de conteúdo e proteção do site. Processa o tráfego e os dados enviados pelo formulário em trânsito.',
          },
          {
            term: 'Supabase',
            desc: 'Banco de dados do nosso CRM, onde o seu contato é registrado para que a equipe possa dar seguimento.',
          },
          {
            term: 'Resend',
            desc: 'Serviço de envio de e-mail que entrega na nossa caixa a mensagem do formulário de contato.',
          },
          {
            term: 'Meta (Facebook e Instagram)',
            desc: 'Publicidade e remarketing, quando você aceita os cookies de marketing e quando interage com nossos perfis.',
          },
          {
            term: 'WhatsApp',
            desc: 'Se você escolher falar por WhatsApp, a conversa passa pela infraestrutura da Meta e segue a política de privacidade dela.',
          },
        ],
      },
      {
        p: 'Também podemos compartilhar dados com autoridades públicas quando houver ordem judicial ou obrigação legal, e com nossos advogados e contadores quando necessário para defender nossos direitos.',
      },
    ],
  },
  {
    id: 'transferencia',
    title: 'Transferência internacional',
    blocks: [
      {
        p: 'Google, Cloudflare, Supabase, Resend e Meta são empresas com servidores fora do Brasil. Isso significa que seus dados podem ser processados e armazenados em outros países, principalmente nos Estados Unidos e na União Europeia.',
      },
      {
        p: 'Essas transferências acontecem com base no artigo 33 da LGPD e nas cláusulas contratuais de proteção de dados firmadas com cada fornecedor. Escolhemos serviços que oferecem garantias contratuais de segurança e confidencialidade equivalentes às exigidas pela legislação brasileira.',
      },
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies e tecnologias similares',
    blocks: [
      {
        p: 'Cookie é um arquivo pequeno que o site guarda no seu navegador. Usamos também o armazenamento local, que funciona de forma parecida. Dividimos em três grupos.',
      },
      {
        dl: [
          {
            term: 'Necessários',
            desc: 'Fazem o site funcionar com segurança e guardam a sua escolha sobre cookies. Não dependem de consentimento porque sem eles o site não opera.',
          },
          {
            term: 'Medição',
            desc: 'Google Analytics. Mostram quantas pessoas visitam o site e quais páginas funcionam melhor. Só são ativados se você aceitar.',
          },
          {
            term: 'Marketing',
            desc: 'Google Ads e Meta. Permitem medir conversões de campanha e exibir anúncios relevantes. Só são ativados se você aceitar.',
          },
        ],
      },
      {
        p: 'Enquanto você não decide, os cookies de medição e de marketing ficam bloqueados. Usamos o Consent Mode do Google, que mantém esses sinais negados por padrão até a sua escolha.',
      },
      {
        p: 'Para mudar de ideia depois, clique em "Preferências de cookies" no rodapé de qualquer página. Você também pode apagar cookies e bloquear novos diretamente nas configurações do seu navegador, o que pode afetar o funcionamento de alguns recursos.',
      },
    ],
  },
  {
    id: 'retencao',
    title: 'Por quanto tempo guardamos',
    blocks: [
      {
        dl: [
          {
            term: 'Contatos que não viraram cliente',
            desc: 'Até 24 meses a partir do último contato, para retomarmos a conversa. Depois disso apagamos ou anonimizamos.',
          },
          {
            term: 'Clientes e ex-clientes',
            desc: 'Durante o contrato e por até 5 anos após o encerramento, prazo ligado à prescrição de cobranças e à guarda de documentos fiscais.',
          },
          {
            term: 'Dados de navegação do Analytics',
            desc: 'Até 14 meses, conforme a configuração de retenção da ferramenta.',
          },
          {
            term: 'Escolha de cookies',
            desc: 'Até 12 meses, quando voltamos a perguntar.',
          },
        ],
      },
      {
        p: 'Passados esses prazos, os dados são eliminados ou anonimizados, salvo quando a lei exigir guarda maior ou quando forem necessários para o exercício regular de direitos em processo.',
      },
    ],
  },
  {
    id: 'direitos',
    title: 'Seus direitos',
    blocks: [
      { p: 'O artigo 18 da LGPD garante que você pode, a qualquer momento:' },
      {
        ul: [
          'Confirmar se tratamos dados seus e acessar esses dados',
          'Corrigir dados incompletos, inexatos ou desatualizados',
          'Pedir anonimização, bloqueio ou eliminação de dados desnecessários ou tratados fora da lei',
          'Pedir a portabilidade dos seus dados para outro fornecedor',
          'Pedir a eliminação dos dados tratados com base no seu consentimento',
          'Saber com quais entidades públicas e privadas compartilhamos seus dados',
          'Ser informado sobre a possibilidade de não consentir e o que acontece se você recusar',
          'Revogar o consentimento a qualquer momento',
          'Opor-se a tratamento feito com base em legítimo interesse',
        ],
      },
      {
        p: 'Para exercer qualquer um desses direitos, escreva para contato@casacriative.com.br com o assunto "LGPD". Respondemos em até 15 dias. Podemos pedir uma confirmação de identidade antes de atender, justamente para não entregar seus dados a outra pessoa.',
      },
      {
        p: 'Se você não ficar satisfeito com a nossa resposta, pode reclamar à Autoridade Nacional de Proteção de Dados, a ANPD, pelo site gov.br/anpd.',
      },
    ],
  },
  {
    id: 'seguranca',
    title: 'Segurança',
    blocks: [
      {
        p: 'Adotamos medidas técnicas e administrativas para proteger seus dados: tráfego do site sempre em HTTPS, acesso ao CRM restrito por autenticação e por regras de segurança em nível de linha no banco, credenciais e chaves de API guardadas em variáveis de ambiente e nunca no código, e arquivos anexados em armazenamento privado com links temporários.',
      },
      {
        p: 'Nenhum sistema é totalmente imune. Se acontecer um incidente de segurança capaz de gerar risco relevante a você, comunicaremos você e a ANPD nos prazos previstos em lei.',
      },
    ],
  },
  {
    id: 'alteracoes',
    title: 'Mudanças nesta política',
    blocks: [
      {
        p: 'Esta política pode mudar quando alterarmos nossos serviços, nossas ferramentas ou quando a legislação exigir. A data de atualização no topo da página indica a versão vigente. Mudanças relevantes, como uma nova finalidade de uso, serão avisadas no site antes de entrarem em vigor, e quando o tratamento depender de consentimento pediremos uma nova autorização.',
      },
    ],
  },
]

export default function PoliticaDePrivacidade() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalLayout
        tag="Privacidade"
        title="Seus dados,"
        highlight="sem letra miúda."
        desc="O que coletamos, por que coletamos, com quem compartilhamos e como você pede para apagar tudo. Em português claro, como manda a LGPD."
        updatedAt={UPDATED}
        sections={sections}
      />
    </>
  )
}
