import { Prospect, SECTOR_OPTIONS } from './prospecting-types'

type Templates = Record<string, { PT: string; ES: string }>

const TEMPLATES: Templates = {
  'Restaurante / Alimentação': {
    PT: `{firstName}, mesa vazia a meio da semana é dinheiro perdido todo o dia.

Feed bonito que atrai + tráfego pago que converte — é isso que fazemos para restaurantes em Portugal. Equipa brasileira: metade do preço das agências locais, mesmo resultado.

Tens 10 minutos esta semana?`,

    ES: `{firstName}, mesa vacía a mitad de semana es dinero perdido cada día.

Feed bonito que atrae + tráfico pagado que convierte — eso es lo que hacemos para restaurantes en España. Equipo brasileño: la mitad del precio de las agencias locales, mismo resultado.

¿Tienes 10 minutos esta semana?`,
  },

  'Clínica / Saúde': {
    PT: `{firstName}, clínica sem tráfego pago hoje depende só da sorte do passa-a-palavra.

Fazemos design e campanhas que trazem pacientes novos todos os meses — sem depender de plataformas caras. Equipa brasileira: preços que fazem sentido para uma PME, resultado de agência europeia.

Faz sentido conversar 15 minutos?`,

    ES: `{firstName}, una clínica sin tráfico pagado hoy depende solo del boca a boca.

Hacemos diseño y campañas que traen pacientes nuevos cada mes, sin depender de plataformas caras. Equipo brasileño: precios que tienen sentido para una pyme, resultado de agencia europea.

¿Tiene sentido hablar 15 minutos?`,
  },

  'Estética / Beleza': {
    PT: `{firstName}, agenda vazia a meio da semana é o sinal mais claro de que o digital ainda não está a trabalhar por ti.

Feed que vende + tráfego pago que enche a agenda — fazemos isso para salões em Portugal. Equipa no Brasil: metade do preço, mesmo nível das melhores agências europeias.

Tens 10 minutos?`,

    ES: `{firstName}, agenda vacía a mitad de semana es la señal más clara de que el digital todavía no está trabajando por ti.

Feed que vende + tráfico pagado que llena la agenda — hacemos eso para salones en España. Equipo en Brasil: la mitad del precio, mismo nivel que las mejores agencias europeas.

¿Tienes 10 minutos?`,
  },

  'Academia / Fitness': {
    PT: `{firstName}, ginásio que não aparece no Instagram e no Google hoje perde sócios para quem aparece — todos os dias.

Fazemos design, feed e tráfego pago para estúdios em Portugal. Equipa brasileira: preço de PME, resultado de agência de topo.

Tens 10 minutos esta semana?`,

    ES: `{firstName}, un gimnasio que no aparece en Instagram y en Google hoy pierde socios ante quien sí aparece — cada día.

Hacemos diseño, feed y tráfico pagado para estudios en España. Equipo brasileño: precio de pyme, resultado de agencia de primer nivel.

¿Tienes 10 minutos esta semana?`,
  },

  'Turismo / Hotelaria': {
    PT: `{firstName}, reserva directa perdida para o Booking é margem que vai embora todo o mês.

Feed que converte + tráfego pago que traz reservas directas — é o que fazemos para alojamentos em Portugal. Equipa no Brasil: qualidade europeia a preços muito abaixo do mercado local.

Tens 15 minutos esta semana?`,

    ES: `{firstName}, reserva directa perdida al Booking es margen que se va cada mes.

Feed que convierte + tráfico pagado que trae reservas directas — eso hacemos para alojamientos en España. Equipo en Brasil: calidad europea a precios muy por debajo del mercado local.

¿Tienes 15 minutos esta semana?`,
  },

  'Comércio / Loja': {
    PT: `{firstName}, loja sem tráfego pago hoje vende só para quem já a conhece.

Design de feed que para o scroll + campanhas que trazem clientes novos — fazemos isso para comércio local em Portugal. Equipa brasileira: metade do custo das agências locais, mesmo resultado.

Faz sentido falarmos 10 minutos?`,

    ES: `{firstName}, una tienda sin tráfico pagado hoy vende solo a quien ya la conoce.

Diseño de feed que para el scroll + campañas que traen clientes nuevos — hacemos eso para comercio local en España. Equipo brasileño: la mitad del coste de las agencias locales, mismo resultado.

¿Tiene sentido hablar 10 minutos?`,
  },

  'Advocacia / Jurídico': {
    PT: `{firstName}, escritório sem presença digital consistente perde mandatos para quem aparece primeiro no Google.

Design de autoridade + tráfego pago segmentado — fazemos isso para advogados em Portugal. Equipa no Brasil com nível de agência europeia, a uma fracção do preço habitual.

Tens 10 minutos esta semana?`,

    ES: `{firstName}, un despacho sin presencia digital consistente pierde clientes ante quien aparece primero en Google.

Diseño de autoridad + tráfico pagado segmentado — hacemos eso para abogados en España. Equipo en Brasil con nivel de agencia europea, a una fracción del precio habitual.

¿Tienes 10 minutos esta semana?`,
  },

  'Imobiliária / Construção': {
    PT: `{firstName}, imóvel sem feed profissional e sem tráfego pago demora o dobro a vender.

Design visual que valoriza + campanhas que chegam ao comprador certo — é o que fazemos para o sector imobiliário em Portugal. Equipa brasileira: preços europeus acessíveis, resultado premium.

Tens 15 minutos esta semana?`,

    ES: `{firstName}, un inmueble sin feed profesional y sin tráfico pagado tarda el doble en venderse.

Diseño visual que valoriza + campañas que llegan al comprador adecuado — eso hacemos para el sector inmobiliario en España. Equipo brasileño: precios europeos accesibles, resultado premium.

¿Tienes 15 minutos esta semana?`,
  },

  'Educação / Formação': {
    PT: `{firstName}, curso sem tráfego pago hoje enche só com sorte.

Design que posiciona + campanhas que trazem inscrições — fazemos isso para centros de formação em Portugal. Equipa no Brasil: qualidade de agência europeia por muito menos.

Faz sentido falarmos 10 minutos?`,

    ES: `{firstName}, un curso sin tráfico pagado hoy se llena solo con suerte.

Diseño que posiciona + campañas que traen inscripciones — hacemos eso para centros de formación en España. Equipo en Brasil: calidad de agencia europea por mucho menos.

¿Tiene sentido hablar 10 minutos?`,
  },

  'Tecnologia / Software': {
    PT: `{firstName}, produto de software sem posicionamento visual e sem tráfego pago perde leads para quem investe nisso.

Branding que convence + campanhas que geram demos — fazemos isso para empresas tech em Portugal. Equipa brasileira: execução de nível europeu, custo muito mais competitivo.

Tens 15 minutos?`,

    ES: `{firstName}, un producto de software sin posicionamiento visual y sin tráfico pagado pierde leads ante quien sí invierte en eso.

Branding que convence + campañas que generan demos — hacemos eso para empresas tech en España. Equipo brasileño: ejecución de nivel europeo, coste mucho más competitivo.

¿Tienes 15 minutos?`,
  },

  'Consultoria': {
    PT: `{firstName}, consultor sem presença digital forte perde autoridade para quem tem — mesmo sendo melhor.

Design que transmite credibilidade + tráfego que traz os clientes certos — é o que fazemos em Portugal. Equipa no Brasil: qualidade europeia a preços que fazem sentido para quem está a crescer.

Tens 15 minutos esta semana?`,

    ES: `{firstName}, un consultor sin presencia digital fuerte pierde autoridad ante quien la tiene — aunque sea mejor.

Diseño que transmite credibilidad + tráfico que trae a los clientes correctos — eso hacemos en España. Equipo en Brasil: calidad europea a precios que tienen sentido para quien está creciendo.

¿Tienes 15 minutos esta semana?`,
  },

  'Arquitectura / Design': {
    PT: `{firstName}, projecto bom que não aparece online não existe para o cliente que está agora a pesquisar.

Feed que mostra o trabalho a valer + tráfego pago que traz contactos — fazemos isso para arquitectos em Portugal. Equipa brasileira: execução premium, metade do preço local.

Tens 10 minutos?`,

    ES: `{firstName}, un proyecto bueno que no aparece online no existe para el cliente que está buscando ahora.

Feed que muestra el trabajo como merece + tráfico pagado que trae contactos — hacemos eso para arquitectos en España. Equipo brasileño: ejecución premium, la mitad del precio local.

¿Tienes 10 minutos?`,
  },

  'Outro': {
    PT: `{firstName}, negócio sem feed profissional e sem tráfego pago hoje perde clientes todos os dias para quem investe nisso.

Design que para o scroll + campanhas que convertem — fazemos isso para PMEs em Portugal. Equipa no Brasil: qualidade de agência europeia a preços muito mais acessíveis.

Faz sentido falarmos 10 minutos?`,

    ES: `{firstName}, un negocio sin feed profesional y sin tráfico pagado hoy pierde clientes cada día ante quien sí invierte en eso.

Diseño que para el scroll + campañas que convierten — hacemos eso para pymes en España. Equipo en Brasil: calidad de agencia europea a precios mucho más accesibles.

¿Tiene sentido hablar 10 minutos?`,
  },
}

export function generateConnectionNote(prospect: Prospect): string {
  const firstName = prospect.name.split(' ')[0]
  if (prospect.country === 'ES') {
    return `Hola ${firstName}, vi el trabajo de ${prospect.company} y me gustaría conectar. Ayudo pymes en España con diseño y tráfico pagado — equipo brasileño, precios accesibles. ¿Conectamos?`
  }
  return `Olá ${firstName}, vi o trabalho de ${prospect.company} e gostaria de conectar. Ajudo PMEs em Portugal com design e tráfego pago — equipa brasileira, preços acessíveis. Podemos conectar?`
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
