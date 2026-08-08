import type { Metadata } from 'next'
import LegalPage, { type LegalSection } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de Uso do site e serviços da Casa Criative Digital.',
  alternates: { canonical: 'https://casacriative.com.br/termos' },
}

const sections: LegalSection[] = [
  { h: 'Aceitação dos termos', body: 'Ao acessar e utilizar o site casacriative.com.br e os serviços da Casa Criative Digital, você concorda com estes Termos de Uso. Caso não concorde, não utilize o site.' },
  { h: 'Serviços', body: 'A Casa Criative Digital é uma agência de marketing digital que oferece tráfego pago, criação de sites e landing pages, SEO, social media e design gráfico. O escopo, prazos e valores de cada serviço são definidos em proposta comercial específica.' },
  { h: 'Uso do site', body: 'Você concorda em utilizar o site apenas para fins lícitos, sem violar direitos de terceiros ou prejudicar o funcionamento do serviço. É proibido tentar obter acesso não autorizado a sistemas, dados ou áreas restritas.' },
  { h: 'Propriedade intelectual', body: 'Todo o conteúdo do site (marca, logotipo, textos, imagens, layout e código) pertence à Casa Criative Digital ou a seus licenciantes e é protegido por lei. É vedada a reprodução sem autorização prévia por escrito.' },
  { h: 'Conteúdo de terceiros e links', body: 'O site pode conter links para sites de terceiros. A Casa Criative Digital não se responsabiliza pelo conteúdo, políticas ou práticas desses sites.' },
  { h: 'Limitação de responsabilidade', body: 'O site é fornecido "no estado em que se encontra". A Casa Criative Digital empenha-se em manter as informações corretas e o serviço disponível, mas não garante ausência de erros ou interrupções, na medida permitida pela lei aplicável.' },
  { h: 'Alterações destes termos', body: 'Estes Termos podem ser atualizados a qualquer momento. A versão vigente é sempre a publicada nesta página, com a respectiva data de atualização.' },
  { h: 'Legislação e foro', body: 'Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de Curitiba/PR para dirimir eventuais controvérsias, com renúncia a qualquer outro.' },
  { h: 'Contato', body: 'Dúvidas sobre estes Termos podem ser enviadas para contato@casacriative.com.br.' },
]

export default function TermosPage() {
  return (
    <LegalPage
      title="Termos de Uso"
      updatedAt="8 de agosto de 2026"
      intro="Estes Termos de Uso regem o acesso e a utilização do site e dos serviços da Casa Criative Digital (Curitiba/PR, Brasil)."
      sections={sections}
    />
  )
}
