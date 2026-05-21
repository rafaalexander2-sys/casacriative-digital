import { Prospect, SECTOR_OPTIONS } from './prospecting-types'

type Templates = Record<string, { PT: string; ES: string }>

const TEMPLATES: Templates = {
  'Restaurante / Alimentação': {
    PT: `{firstName}, reparei que {company} ainda não tem uma presença online que reflicta a qualidade do que fazem — e isso custa reservas todos os dias.

Ajudo restaurantes em Portugal com design, redes sociais e visibilidade no Google. Trabalho com uma equipa especializada no Brasil: entregamos qualidade de agência europeia a preços muito mais acessíveis.

Portfólio: {portfolioUrl}

Tem 10 minutos esta semana para uma chamada rápida?`,

    ES: `{firstName}, he visto que {company} aún no tiene una presencia online que refleje la calidad de lo que hacéis, y eso cuesta reservas cada día.

Ayudo a restaurantes en España con diseño, redes sociales y visibilidad en Google. Trabajo con un equipo especializado en Brasil: calidad de agencia europea a precios muy por debajo del mercado.

Portfolio: {portfolioUrl}

¿Tienes 10 minutos esta semana para una llamada rápida?`,
  },

  'Clínica / Saúde': {
    PT: `{firstName}, vi o trabalho de {company} e acredito que conseguimos trazer muito mais pacientes novos através da pesquisa local no Google — sem depender de plataformas ou publicidade cara.

Trabalho com clínicas em Portugal em design, SEO e páginas de conversão. Equipa especializada no Brasil: resultados de agência europeia, preços que fazem sentido para uma PME.

Portfólio: {portfolioUrl}

Faz sentido conversar 15 minutos?`,

    ES: `{firstName}, vi el trabajo de {company} y creo que podemos conseguir muchos más pacientes nuevos a través de la búsqueda local en Google, sin depender de plataformas ni publicidad cara.

Trabajo con clínicas en España en diseño, SEO y páginas de conversión. Equipo especializado en Brasil: resultados de agencia europea, precios que tienen sentido para una pyme.

Portfolio: {portfolioUrl}

¿Tiene sentido hablar 15 minutos?`,
  },

  'Advocacia / Jurídico': {
    PT: `{firstName}, para escritórios como {company} a primeira impressão online é quase tão importante quanto a reputação — e acredito que há margem para melhorar isso claramente.

Trabalho com advogados em Portugal em identidade visual, site e autoridade online. Equipa no Brasil com nível de agência europeia, a uma fracção do preço habitual.

Portfólio: {portfolioUrl}

Tem 10 minutos esta semana?`,

    ES: `{firstName}, para despachos como {company} la primera impresión online es casi tan importante como la reputación, y creo que hay margen para mejorar eso claramente.

Trabajo con abogados en España en identidad visual, web y autoridad online. Equipo en Brasil con nivel de agencia europea, a una fracción del precio habitual.

Portfolio: {portfolioUrl}

¿Tienes 10 minutos esta semana?`,
  },

  'Imobiliária / Construção': {
    PT: `{firstName}, vi o portfólio de {company} e acredito que a presença digital ainda não está a fazer jus à qualidade dos vossos projectos — o que limita os contactos que chegam.

Ajudo empresas do sector imobiliário e construção em Portugal com design, site e campanhas de captação. Trabalho com equipa no Brasil: qualidade premium, preços acessíveis para o mercado europeu.

Portfólio: {portfolioUrl}

Tem 15 minutos para uma chamada esta semana?`,

    ES: `{firstName}, vi el portfolio de {company} y creo que la presencia digital todavía no está haciendo justicia a la calidad de vuestros proyectos, lo que limita los contactos que llegan.

Ayudo a empresas del sector inmobiliario y construcción en España con diseño, web y campañas de captación. Equipo en Brasil: calidad premium, precios accesibles para el mercado europeo.

Portfolio: {portfolioUrl}

¿Tienes 15 minutos para una llamada esta semana?`,
  },

  'Estética / Beleza': {
    PT: `{firstName}, muitos negócios de estética com quem trabalho tinham o mesmo problema: agenda vazia a meio da semana, dependência total do passa-a-palavra.

Ajudo salões e clínicas em Portugal com design, Instagram e Google. Equipa especializada no Brasil — entregamos resultados de agência europeia por muito menos do que estão habituados a pagar.

Portfólio: {portfolioUrl}

Tem disponibilidade para conversar 10 minutos?`,

    ES: `{firstName}, muchos negocios de estética con los que trabajo tenían el mismo problema: agenda vacía a mitad de semana, dependencia total del boca a boca.

Ayudo a salones y clínicas en España con diseño, Instagram y Google. Equipo especializado en Brasil: resultados de agencia europea por mucho menos de lo que están acostumbrados a pagar.

Portfolio: {portfolioUrl}

¿Tienes disponibilidad para hablar 10 minutos?`,
  },

  'Comércio / Loja': {
    PT: `{firstName}, vi que {company} tem um negócio com potencial claro, e acredito que a presença digital ainda não está a trabalhar a favor de vocês tanto quanto podia.

Trabalho com comércio local em Portugal em design, redes sociais e campanhas de tráfego. Equipa no Brasil com qualidade de agência europeia — a preços muito mais acessíveis.

Portfólio: {portfolioUrl}

Faz sentido falarmos 10 minutos?`,

    ES: `{firstName}, vi que {company} tiene un negocio con potencial claro, y creo que la presencia digital todavía no está trabajando a vuestro favor tanto como podría.

Trabajo con comercio local en España en diseño, redes sociales y campañas de tráfico. Equipo en Brasil con calidad de agencia europea, a precios mucho más accesibles.

Portfolio: {portfolioUrl}

¿Tiene sentido hablar 10 minutos?`,
  },

  'Academia / Fitness': {
    PT: `{firstName}, trabalho com ginásios e estúdios em Portugal a atrair sócios novos de forma consistente — com design e campanhas que realmente convertem, não só posts no Instagram.

Equipa especializada no Brasil: entregamos qualidade de agência europeia a preços que fazem sentido para um negócio local.

Portfólio: {portfolioUrl}

Tem 15 minutos esta semana para uma conversa sobre {company}?`,

    ES: `{firstName}, trabajo con gimnasios y estudios en España para atraer socios nuevos de forma constante, con diseño y campañas que realmente convierten, no solo posts en Instagram.

Equipo especializado en Brasil: calidad de agencia europea a precios que tienen sentido para un negocio local.

Portfolio: {portfolioUrl}

¿Tienes 15 minutos esta semana para una conversación sobre {company}?`,
  },

  'Contabilidade / Finanças': {
    PT: `{firstName}, para escritórios como {company} a presença online precisa de transmitir rigor e confiança — e acredito que existe margem para melhorar isso claramente.

Trabalho com contabilistas e consultores em Portugal em identidade visual, site e posicionamento no Google. Equipa no Brasil: nível de agência europeia, investimento muito mais acessível.

Portfólio: {portfolioUrl}

Tem 10 minutos para perceber como funciona?`,

    ES: `{firstName}, para despachos como {company} la presencia online necesita transmitir rigor y confianza, y creo que hay margen para mejorar eso claramente.

Trabajo con contables y asesores en España en identidad visual, web y posicionamiento en Google. Equipo en Brasil: nivel de agencia europea, inversión mucho más accesible.

Portfolio: {portfolioUrl}

¿Tienes 10 minutos para ver cómo funciona?`,
  },

  'Turismo / Hotelaria': {
    PT: `{firstName}, no turismo a diferença entre uma página bonita e uma que converte pode valer dezenas de reservas por mês — e vi que {company} tem margem para melhorar isso.

Trabalho com alojamentos e operadores em Portugal em design, site e campanhas de reserva directa. Equipa no Brasil: qualidade premium, preços abaixo do mercado europeu.

Portfólio: {portfolioUrl}

Tem 15 minutos esta semana?`,

    ES: `{firstName}, en turismo la diferencia entre una página bonita y una que convierte puede valer decenas de reservas al mes, y vi que {company} tiene margen para mejorar eso.

Trabajo con alojamientos y operadores en España en diseño, web y campañas de reserva directa. Equipo en Brasil: calidad premium, precios por debajo del mercado europeo.

Portfolio: {portfolioUrl}

¿Tienes 15 minutos esta semana?`,
  },

  'Educação / Formação': {
    PT: `{firstName}, trabalho com centros de formação em Portugal a atrair mais alunos com páginas de inscrição que convertem e campanhas bem segmentadas.

Vi o trabalho de {company} e acredito que há uma oportunidade clara para crescer. Equipa no Brasil com qualidade de agência europeia — por muito menos do que estão habituados a pagar.

Portfólio: {portfolioUrl}

Faz sentido falarmos 10 minutos?`,

    ES: `{firstName}, trabajo con centros de formación en España para atraer más alumnos con páginas de inscripción que convierten y campañas bien segmentadas.

Vi el trabajo de {company} y creo que hay una oportunidad clara para crecer. Equipo en Brasil con calidad de agencia europea, por mucho menos de lo que están acostumbrados a pagar.

Portfolio: {portfolioUrl}

¿Tiene sentido hablar 10 minutos?`,
  },

  'Tecnologia / Software': {
    PT: `{firstName}, vi o posicionamento de {company} e acredito que existe espaço para um design e uma comunicação digital que transmita melhor o valor do que fazem.

Trabalho com empresas tech em Portugal em branding, site e geração de leads. Equipa especializada no Brasil: execução de nível europeu, custo muito mais competitivo.

Portfólio: {portfolioUrl}

Teria interesse numa conversa rápida de 15 minutos?`,

    ES: `{firstName}, vi el posicionamiento de {company} y creo que hay espacio para un diseño y una comunicación digital que transmita mejor el valor de lo que hacéis.

Trabajo con empresas tech en España en branding, web y generación de leads. Equipo especializado en Brasil: ejecución de nivel europeo, coste mucho más competitivo.

Portfolio: {portfolioUrl}

¿Le interesaría una conversación rápida de 15 minutos?`,
  },

  'Consultoria': {
    PT: `{firstName}, para consultores como {company} a credibilidade online é o principal activo de aquisição — e acredito que existe margem para a tornar muito mais forte.

Trabalho com consultores em Portugal em identidade visual, site e posicionamento digital. Equipa no Brasil: qualidade de agência europeia a preços que fazem sentido para quem está a crescer.

Portfólio: {portfolioUrl}

Tem 15 minutos esta semana?`,

    ES: `{firstName}, para consultores como {company} la credibilidad online es el principal activo de adquisición, y creo que hay margen para hacerla mucho más sólida.

Trabajo con consultores en España en identidad visual, web y posicionamiento digital. Equipo en Brasil: calidad de agencia europea a precios que tienen sentido para quien está creciendo.

Portfolio: {portfolioUrl}

¿Tienes 15 minutos esta semana?`,
  },

  'Arquitectura / Design': {
    PT: `{firstName}, o trabalho de {company} merece uma presença digital à altura — e pela qualidade do que fazem, acredito que ainda está abaixo do potencial.

Trabalho com arquitectos e designers em Portugal em portfólios digitais, site e posicionamento online. Equipa no Brasil: execução de nível europeu, por uma fracção do preço habitual.

Portfólio: {portfolioUrl}

Tem 10 minutos para perceber como seria?`,

    ES: `{firstName}, el trabajo de {company} merece una presencia digital a la altura, y por la calidad de lo que hacéis, creo que todavía está por debajo del potencial.

Trabajo con arquitectos y diseñadores en España en portfolios digitales, web y posicionamiento online. Equipo en Brasil: ejecución de nivel europeo, a una fracción del precio habitual.

Portfolio: {portfolioUrl}

¿Tienes 10 minutos para ver cómo sería?`,
  },

  'Outro': {
    PT: `{firstName}, vi o trabalho de {company} e acredito que existe uma oportunidade clara para ter uma presença digital que gere mais clientes de forma consistente.

Trabalho com PMEs em Portugal em design, site e marketing digital. Equipa especializada no Brasil: entregamos qualidade de agência europeia a preços muito mais acessíveis.

Portfólio: {portfolioUrl}

Faz sentido falarmos 10 minutos?`,

    ES: `{firstName}, vi el trabajo de {company} y creo que existe una oportunidad clara para tener una presencia digital que genere más clientes de forma constante.

Trabajo con pymes en España en diseño, web y marketing digital. Equipo especializado en Brasil: calidad de agencia europea a precios mucho más accesibles.

Portfolio: {portfolioUrl}

¿Tiene sentido hablar 10 minutos?`,
  },
}

export function generateMessage(prospect: Prospect, portfolioUrl: string): string {
  const firstName = prospect.name.split(' ')[0]
  const sectorKey = SECTOR_OPTIONS.includes(prospect.sector) ? prospect.sector : 'Outro'
  const template = TEMPLATES[sectorKey] ?? TEMPLATES['Outro']
  const text = template[prospect.country] ?? template['PT']

  return text
    .replace(/\{firstName\}/g, firstName)
    .replace(/\{company\}/g, prospect.company)
    .replace(/\{sector\}/g, prospect.sector)
    .replace(/\{portfolioUrl\}/g, portfolioUrl || 'casacriative.com.br')
}

export function generateConnectionNote(prospect: Prospect): string {
  const firstName = prospect.name.split(' ')[0]
  const isES = prospect.country === 'ES'

  if (isES) {
    return `Hola ${firstName}, vi el trabajo de ${prospect.company} y me gustaría conectar. Ayudo pymes en España con marketing digital — calidad europea, precios de Brasil. ¿Te parece bien conectar?`
  }
  return `Olá ${firstName}, vi o trabalho de ${prospect.company} e gostaria de conectar. Ajudo PMEs em Portugal com marketing digital — qualidade europeia, preços do Brasil. Podemos conectar?`
}
