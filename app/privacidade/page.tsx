import type { Metadata } from 'next'
import LegalPage, { type LegalSection } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como a Casa Criative Digital coleta, usa e protege seus dados pessoais, conforme a LGPD.',
  alternates: { canonical: 'https://casacriative.com.br/privacidade' },
}

const sections: LegalSection[] = [
  { h: 'Controlador dos dados', body: 'A Casa Criative Digital, sediada em Curitiba/PR, é a controladora dos dados pessoais tratados por meio deste site. Contato: contato@casacriative.com.br.' },
  { h: 'Dados que coletamos', body: (
    <>Coletamos: (a) <b>dados fornecidos por você</b> no formulário de contato — nome, e-mail, telefone/WhatsApp e informações sobre seu negócio; e (b) <b>dados de navegação</b> coletados automaticamente por cookies e ferramentas de análise (páginas visitadas, dispositivo, origem do acesso, identificadores de campanha).</>
  ) },
  { h: 'Finalidades do tratamento', body: 'Utilizamos os dados para responder a solicitações de contato, elaborar propostas, prestar os serviços contratados, melhorar o site e mensurar campanhas de marketing.' },
  { h: 'Base legal (LGPD)', body: 'O tratamento fundamenta-se no consentimento do titular, na execução de contrato/procedimentos preliminares e no legítimo interesse, conforme a Lei nº 13.709/2018 (LGPD).' },
  { h: 'Compartilhamento com terceiros', body: (
    <>Podemos compartilhar dados com operadores que viabilizam o serviço, como <b>Google Analytics</b> (análise), <b>Cloudflare</b> (hospedagem/segurança) e <b>Supabase</b> (banco de dados do CRM), sempre no limite das finalidades acima. Não vendemos dados pessoais.</>
  ) },
  { h: 'Cookies', body: 'Utilizamos cookies essenciais e de análise. Você pode gerenciar ou bloquear cookies nas configurações do seu navegador; alguns recursos podem ser afetados.' },
  { h: 'Direitos do titular', body: 'Nos termos da LGPD (art. 18), você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação e informações sobre compartilhamento, além de revogar o consentimento. Basta contatar contato@casacriative.com.br.' },
  { h: 'Segurança e retenção', body: 'Adotamos medidas técnicas e organizacionais para proteger seus dados. Os dados são mantidos pelo tempo necessário às finalidades ou conforme exigência legal, sendo eliminados de forma segura após esse período.' },
  { h: 'Alterações desta política', body: 'Esta Política pode ser atualizada. A versão vigente é a publicada nesta página, com a respectiva data de atualização.' },
  { h: 'Contato do encarregado', body: 'Para exercer seus direitos ou tirar dúvidas sobre privacidade, contate contato@casacriative.com.br.' },
]

export default function PrivacidadePage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      updatedAt="8 de agosto de 2026"
      intro="Esta Política descreve como a Casa Criative Digital coleta, utiliza, compartilha e protege dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD)."
      sections={sections}
    />
  )
}
