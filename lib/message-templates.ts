import { Prospect, SECTOR_OPTIONS } from './prospecting-types'

type Templates = Record<string, { PT: string; ES: string }>

const TEMPLATES: Templates = {
  'Restaurante / Alimentação': {
    PT: `{firstName}, reparei que {company} tem uma presença online que ainda não reflecte bem a qualidade do que fazem.

Trabalho com restaurantes em Portugal a melhorar a visibilidade no Google Maps e a trazer mais reservas sem depender só do passa-a-palavra.

Posso mostrar-lhe em 10 minutos o que está a perder em pesquisas locais todos os dias.

Tem disponibilidade esta semana para uma chamada rápida?`,

    ES: `{firstName}, he visto que {company} tiene potencial en redes y buscadores que aún no está aprovechando del todo.

Trabajo con restaurantes en España para mejorar su visibilidad en Google Maps y conseguir más reservas sin depender solo del boca a boca.

Puedo mostrarte en 10 minutos lo que estás dejando de ganar cada día en búsquedas locales.

¿Tienes disponibilidad esta semana para una llamada rápida?`,
  },

  'Clínica / Saúde': {
    PT: `{firstName}, tenho acompanhado o trabalho de {company} e vi que existe margem para atrair muito mais pacientes através da pesquisa local no Google.

Ajudo clínicas em Portugal a aparecer no topo quando alguém procura os vossos serviços na zona — sem pagar publicidade.

Em média, os meus clientes passam a receber entre 15 a 30 contactos novos por mês só com essa mudança.

Faz sentido conversar 15 minutos para perceber se se aplica ao vosso caso?`,

    ES: `{firstName}, he visto el trabajo de {company} y creo que hay margen para atraer muchos más pacientes a través de la búsqueda local en Google.

Ayudo a clínicas en España a aparecer en los primeros resultados cuando alguien busca sus servicios en la zona, sin pagar publicidad.

De media, mis clientes empiezan a recibir entre 15 y 30 contactos nuevos al mes solo con ese cambio.

¿Tiene sentido hablar 15 minutos para ver si aplica a vuestro caso?`,
  },

  'Advocacia / Jurídico': {
    PT: `{firstName}, vi o perfil de {company} e percebo que têm uma área de actuação muito definida — exactamente o tipo de escritório que beneficia mais de uma estratégia digital bem feita.

Trabalho com advogados em Portugal a construir autoridade online e a atrair clientes qualificados que já chegam prontos a contratar.

Seria muito breve — tem 10 minutos esta semana para perceber como funciona?`,

    ES: `{firstName}, vi el perfil de {company} y entiendo que tienen un área de actuación muy definida — exactamente el tipo de despacho que más se beneficia de una estrategia digital bien hecha.

Trabajo con abogados en España para construir autoridad online y atraer clientes cualificados que ya llegan listos para contratar.

Sería muy breve — ¿tiene 10 minutos esta semana para ver cómo funciona?`,
  },

  'Imobiliária / Construção': {
    PT: `{firstName}, trabalho com agências imobiliárias e empresas de construção em Portugal a gerar contactos qualificados através de páginas de captação e anúncios bem segmentados.

Vi que {company} tem um portfólio interessante mas acredito que podemos trazer mais visibilidade para os vossos imóveis/projectos sem aumentar muito o custo de aquisição.

Tem 15 minutos para uma chamada esta semana?`,

    ES: `{firstName}, trabajo con agencias inmobiliarias y empresas de construcción en España para generar contactos cualificados a través de páginas de captación y anuncios bien segmentados.

Vi que {company} tiene un portfolio interesante y creo que podemos dar mucha más visibilidad a vuestros inmuebles/proyectos sin aumentar demasiado el coste de captación.

¿Tienes 15 minutos para una llamada esta semana?`,
  },

  'Estética / Beleza': {
    PT: `{firstName}, muitos salões e clínicas de estética com quem trabalho tinham o mesmo problema: clientes fiéis, mas dificuldade em atrair novos de forma consistente.

Ajudo negócios como {company} a crescer com uma presença no Instagram e Google que traz marcações todos os meses de forma previsível.

Posso mostrar-lhe exemplos concretos em menos de 10 minutos. Tem disponibilidade?`,

    ES: `{firstName}, muchos salones y clínicas de estética con los que trabajo tenían el mismo problema: clientes fieles, pero dificultad para atraer nuevos de forma constante.

Ayudo a negocios como {company} a crecer con una presencia en Instagram y Google que trae reservas todos los meses de forma predecible.

Puedo mostrarte ejemplos concretos en menos de 10 minutos. ¿Tienes disponibilidad?`,
  },

  'Comércio / Loja': {
    PT: `{firstName}, vi que {company} tem um negócio com potencial de crescimento claro, e acredito que a presença digital ainda não está a trabalhar a favor de vocês tanto quanto podia.

Trabalho com comércio local em Portugal a aumentar o tráfego na loja e as vendas — tanto presencialmente como online — com estratégias simples e mensuráveis.

Faz sentido conversar 10 minutos para perceber o que se encaixa melhor no vosso caso?`,

    ES: `{firstName}, vi que {company} tiene un negocio con potencial de crecimiento claro, y creo que la presencia digital todavía no está trabajando a vuestro favor tanto como podría.

Trabajo con comercio local en España para aumentar el tráfico en tienda y las ventas, tanto presencialmente como online, con estrategias simples y medibles.

¿Tiene sentido hablar 10 minutos para ver qué encaja mejor en vuestro caso?`,
  },

  'Academia / Fitness': {
    PT: `{firstName}, trabalho com ginásios e estúdios de fitness em Portugal a atrair novos sócios de forma consistente — sem depender só de promoções ou do passa-a-palavra.

A maioria dos meus clientes consegue preencher turmas e aumentar a base de sócios em 2 a 3 meses com uma estratégia simples de conteúdo e anúncios locais.

Tem 15 minutos esta semana para uma conversa rápida sobre {company}?`,

    ES: `{firstName}, trabajo con gimnasios y estudios de fitness en España para atraer nuevos socios de forma constante, sin depender solo de promociones o del boca a boca.

La mayoría de mis clientes consigue llenar clases y aumentar la base de socios en 2 o 3 meses con una estrategia sencilla de contenido y anuncios locales.

¿Tienes 15 minutos esta semana para una conversación rápida sobre {company}?`,
  },

  'Contabilidade / Finanças': {
    PT: `{firstName}, sei que para contabilistas e consultores financeiros a reputação é tudo — e é exactamente por isso que a presença digital precisa de reflectir a seriedade do vosso trabalho.

Ajudo escritórios como {company} a aparecer no topo do Google quando potenciais clientes procuram os vossos serviços na vossa zona, e a construir credibilidade online que converte.

Tem 10 minutos para perceber como isso funciona na prática?`,

    ES: `{firstName}, sé que para contables y asesores financieros la reputación lo es todo, y es exactamente por eso que la presencia digital necesita reflejar la seriedad de vuestro trabajo.

Ayudo a despachos como {company} a aparecer en los primeros resultados de Google cuando potenciales clientes buscan vuestros servicios en vuestra zona, y a construir credibilidad online que convierte.

¿Tienes 10 minutos para ver cómo funciona en la práctica?`,
  },

  'Turismo / Hotelaria': {
    PT: `{firstName}, no sector do turismo a visibilidade online decide quem reserva e quem não reserva — e vi que {company} tem margem para captar muito mais visitantes directamente, sem depender de comissões de plataformas.

Trabalho com alojamentos e operadores turísticos em Portugal a aumentar as reservas directas com estratégia digital focada em resultados.

Tem disponibilidade para uma chamada de 15 minutos esta semana?`,

    ES: `{firstName}, en el sector del turismo la visibilidad online decide quién reserva y quién no, y vi que {company} tiene margen para captar muchos más visitantes directamente, sin depender de comisiones de plataformas.

Trabajo con alojamientos y operadores turísticos en España para aumentar las reservas directas con estrategia digital enfocada en resultados.

¿Tienes disponibilidad para una llamada de 15 minutos esta semana?`,
  },

  'Educação / Formação': {
    PT: `{firstName}, trabalho com centros de formação e escolas em Portugal a atrair mais alunos de forma previsível — com páginas de inscrição que convertem e campanhas bem segmentadas.

Vi o trabalho de {company} e acredito que há uma oportunidade clara para crescer a base de alunos sem aumentar muito o investimento em marketing.

Faz sentido falarmos 10 minutos?`,

    ES: `{firstName}, trabajo con centros de formación y academias en España para atraer más alumnos de forma predecible, con páginas de inscripción que convierten y campañas bien segmentadas.

Vi el trabajo de {company} y creo que hay una oportunidad clara para hacer crecer la base de alumnos sin aumentar demasiado la inversión en marketing.

¿Tiene sentido hablar 10 minutos?`,
  },

  'Tecnologia / Software': {
    PT: `{firstName}, vi o posicionamento de {company} e acredito que existe espaço para aumentar a geração de leads qualificados de forma mais consistente.

Trabalho com empresas tech em Portugal a optimizar a presença digital e a criar funis de aquisição que trazem decisores certos — não apenas tráfego.

Teria interesse numa conversa rápida de 15 minutos sobre o que está a funcionar no mercado agora?`,

    ES: `{firstName}, vi el posicionamiento de {company} y creo que hay espacio para aumentar la generación de leads cualificados de forma más consistente.

Trabajo con empresas tech en España para optimizar la presencia digital y crear embudos de adquisición que traen a los decisores correctos, no solo tráfico.

¿Le interesaría una conversación rápida de 15 minutos sobre lo que está funcionando en el mercado ahora?`,
  },

  'Consultoria': {
    PT: `{firstName}, para consultores o maior desafio costuma ser transformar credibilidade em contactos qualificados de forma consistente.

Ajudo consultores e empresas como {company} a posicionar-se online de forma a atrair os clientes certos — não qualquer cliente — e a reduzir o tempo gasto em prospeção.

Tem 15 minutos esta semana para uma conversa sem compromisso?`,

    ES: `{firstName}, para consultores el mayor reto suele ser convertir credibilidad en contactos cualificados de forma constante.

Ayudo a consultores y empresas como {company} a posicionarse online de forma que atraigan a los clientes correctos, no a cualquier cliente, y a reducir el tiempo dedicado a la prospección.

¿Tienes 15 minutos esta semana para una conversación sin compromiso?`,
  },

  'Arquitectura / Design': {
    PT: `{firstName}, o trabalho de {company} merece uma presença digital que transmita a mesma qualidade do que fazem — e acredito que há espaço para melhorar isso.

Trabalho com arquitectos e designers em Portugal a construir portfólios digitais que geram contactos qualificados e diferenciam claramente da concorrência.

Tem 10 minutos para perceber como isso se aplicaria ao vosso caso?`,

    ES: `{firstName}, el trabajo de {company} merece una presencia digital que transmita la misma calidad de lo que hacéis, y creo que hay margen para mejorar eso.

Trabajo con arquitectos y diseñadores en España para construir portfolios digitales que generan contactos cualificados y diferencian claramente de la competencia.

¿Tienes 10 minutos para ver cómo aplicaría esto a vuestro caso?`,
  },

  'Outro': {
    PT: `{firstName}, vi o trabalho de {company} e acredito que existe uma oportunidade real para aumentar a visibilidade online e atrair mais clientes de forma consistente.

Trabalho com pequenas e médias empresas em Portugal a criar estratégias digitais simples que geram resultados mensuráveis — sem complexidade desnecessária.

Faz sentido falarmos 10 minutos para perceber se consigo acrescentar valor?`,

    ES: `{firstName}, vi el trabajo de {company} y creo que existe una oportunidad real para aumentar la visibilidad online y atraer más clientes de forma constante.

Trabajo con pequeñas y medianas empresas en España para crear estrategias digitales sencillas que generan resultados medibles, sin complejidad innecesaria.

¿Tiene sentido hablar 10 minutos para ver si puedo aportar valor?`,
  },
}

export function generateMessage(prospect: Prospect): string {
  const firstName = prospect.name.split(' ')[0]
  const sectorKey = SECTOR_OPTIONS.includes(prospect.sector) ? prospect.sector : 'Outro'
  const template = TEMPLATES[sectorKey] ?? TEMPLATES['Outro']
  const text = template[prospect.country] ?? template['PT']

  return text
    .replace(/\{firstName\}/g, firstName)
    .replace(/\{company\}/g, prospect.company)
    .replace(/\{sector\}/g, prospect.sector)
}
