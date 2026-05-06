"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import "./lp.css";

export default function LandingPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            observerRef.current?.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) =>
      observerRef.current?.observe(el)
    );
    return () => observerRef.current?.disconnect();
  }, []);

  const benefits = [
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, title: "Performance 95+", desc: "Lighthouse máximo em todas as métricas. Velocidade é credibilidade." },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, title: "Copy estratégico", desc: "Texto que vende. Cada parágrafo revisado para conversão." },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, title: "Mobile-first", desc: "Responsivo em todos os dispositivos, testado antes da entrega." },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, title: "SEO otimizado", desc: "Estrutura técnica e semântica para ranquear desde o lançamento." },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Garantia 30 dias", desc: "Ajustes pós-lançamento inclusos. Sem letra miúda." },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>, title: "Entrega em 14 dias", desc: "Sprint enxuto. Comunicação direta. Deploy no prazo." },
  ];

  const steps = [
    { n: "01", title: "Briefing", desc: "Entendemos seu negócio, público e objetivos em uma reunião focada." },
    { n: "02", title: "Design & Dev", desc: "Criamos do zero — layout, copy e código — com revisões abertas." },
    { n: "03", title: "Lançamento", desc: "Deploy, testes finais e 30 dias de suporte inclusos." },
  ];

  const cases = [
    { tag: "E-commerce", title: "Northwave Store", desc: "Conversão saltou de 1.8% para 6.4% em 3 semanas.", url: "#" },
    { tag: "SaaS", title: "Plata Dashboard", desc: "LP de captação com 38% de taxa de opt-in.", url: "#" },
    { tag: "Serviços", title: "Volt Growth", desc: "Site institucional + 2 LPs de performance.", url: "#" },
    { tag: "E-commerce", title: "DMove Agency", desc: "Identidade visual completa aplicada ao digital.", url: "#" },
    { tag: "Portfólio", title: "Studio Behance", desc: "Portfólio premium com cases interativos.", url: "#" },
    { tag: "Landing Page", title: "Captação LP", desc: "Landing page focada em geração de leads qualificados.", url: "#" },
  ];

  const testimonials = [
    { q: "Em 3 semanas o site novo já tinha pago o projeto. Conversão saltou de 1.8% para 6.4%.", n: "Marina Costa", r: "CMO, Northwave", a: "M" },
    { q: "Profissionalismo absurdo. Zero retrabalho, comunicação cirúrgica. Recomendo de olho fechado.", n: "Rafael Lima", r: "Founder, Plata", a: "R" },
    { q: "Dos 5 fornecedores que testei, foi o único que entregou no prazo — e com o melhor design.", n: "Beatriz Andrade", r: "Head Growth, Volt", a: "B" },
  ];

  const plans = [
    { name: "Essencial", price: "1.800", desc: "Landing page única, focada em conversão.", feats: ["1 página premium", "Copy estratégico", "Hospedagem 1º ano", "Entrega em 7 dias", "Garantia 30 dias"], featured: false },
    { name: "Studio", price: "4.900", desc: "Site institucional completo + landing.", feats: ["Até 6 páginas premium", "Copy estratégico + SEO", "Identidade aplicada", "Animações & microinterações", "Entrega em 14 dias", "Suporte estendido 60 dias"], featured: true },
    { name: "Performance+", price: "9.800", desc: "Pacote completo com otimização e A/B testing.", feats: ["Site + 3 landing pages", "Pesquisa & estratégia de conversão", "Integrações (CRM, analytics)", "A/B testing pós-lançamento", "Suporte 90 dias", "Sprint mensal opcional"], featured: false },
  ];

  const faqs = [
    { q: "Quanto tempo leva para meu site ficar pronto?", a: "Entre 7 e 14 dias úteis, dependendo do plano. Pacotes maiores podem chegar a 21 dias com cronograma claro desde o briefing." },
    { q: "Vocês fazem o copy ou eu preciso entregar pronto?", a: "Cuidamos do copy estratégico. Você participa do briefing e revisões — nós escrevemos com foco em conversão." },
    { q: "O site fica responsivo em celular e tablet?", a: "Sempre. Construímos mobile-first e testamos em múltiplos dispositivos antes de entregar." },
    { q: "Posso editar o site depois de pronto?", a: "Sim. Entregamos um painel simples ou treinamento gravado para você atualizar textos, imagens e blocos." },
    { q: "Quais formas de pagamento?", a: "PIX, cartão em até 12x ou boleto. 50% no início, 50% na entrega." },
    { q: "E se eu não gostar do resultado?", a: "Você tem 2 rodadas de revisão por etapa. Após o lançamento, 30 dias de ajustes inclusos. Sem letra miúda." },
  ];

  const WA_LINK = "https://wa.me/5541998687489?text=Ol%C3%A1%2C+quero+saber+mais+sobre+os+planos";

  return (
    <div className="lp-wrap">
      <div className="lp-glow-1" />
      <div className="lp-glow-2" />
      <div className="bg-noise" />

      {/* NAV */}
      <div className="nav-wrap">
        <nav className="nav">
          <a href="#" style={{ display: "flex", alignItems: "center" }}>
            <Image src="/logo.webp" alt="Casa Criative Digital" width={120} height={34} style={{ height: 34, width: "auto" }} />
          </a>
          <div className="nav-links">
            <a href="#beneficios">Benefícios</a>
            <a href="#como">Como funciona</a>
            <a href="#portfolio">Cases</a>
            <a href="#precos">Preços</a>
            <a href="#faq">FAQ</a>
          </div>
          <a href={WA_LINK} className="btn btn-primary" style={{ padding: "10px 18px", fontSize: 14 }}>
            Falar no WhatsApp
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="arrow"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
        </nav>
      </div>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <span className="eyebrow"><span className="dot" />Disponível para 3 projetos em maio</span>
              <h1 className="hero-headline">Sites que <em>vendem</em><br />como nunca antes.</h1>
              <p className="hero-sub">Criamos sites e landing pages de alta performance — com design premium, código limpo e copy estratégico que transformam visitas em clientes.</p>
              <div className="hero-cta">
                <a href={WA_LINK} className="btn btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Falar no WhatsApp
                </a>
                <a href="#portfolio" className="btn btn-ghost">Ver projetos
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="arrow"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </a>
              </div>
              <div className="hero-meta">
                <span className="check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Entrega em até 14 dias</span>
                <span className="check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Garantia de 30 dias</span>
                <span className="check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Suporte direto</span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="wf-frame">
                <div className="wf-browser">
                  <span className="wf-dot" /><span className="wf-dot" /><span className="wf-dot" />
                  <span className="wf-url">casacriativedigital.com.br</span>
                </div>
                <div className="wf-nav">
                  <span className="wf-logo" />
                  <span className="wf-link" /><span className="wf-link" /><span className="wf-link" />
                  <span className="wf-cta" />
                </div>
                <div className="wf-hero">
                  <div>
                    <span className="wf-tag" />
                    <span className="wf-h1 a" /><span className="wf-h1 b" />
                    <span className="wf-p" /><span className="wf-p short" />
                    <div className="wf-btns"><span className="wf-btn primary" /><span className="wf-btn ghost" /></div>
                  </div>
                  <div className="wf-img"><span className="wf-img-x" /></div>
                </div>
                <div className="wf-grid">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="wf-card">
                      <span className="wf-icon" /><span className="wf-line" /><span className="wf-line s" />
                    </div>
                  ))}
                </div>
              </div>
              <span className="hero-tag t-1"><span className="pulse" />conversion +312%</span>
              <span className="hero-tag t-2"><span className="pulse" />lighthouse 100/100</span>
              <span className="hero-tag t-3"><span className="pulse" />load &lt; 0.8s</span>
            </div>
          </div>

          <div className="fade-up">
            <div className="proof">
              <div className="proof-label">Confiança de marcas em crescimento</div>
              <div className="proof-row">
                {["Northwave", "Plata", "Volt Growth", "DMove", "Studio BR", "Captação"].map((b) => (
                  <span key={b} className="proof-logo">{b}</span>
                ))}
              </div>
            </div>
            <div className="metrics">
              <div className="metric"><div className="metric-val">+120</div><div className="metric-label">Projetos entregues</div></div>
              <div className="metric"><div className="metric-val">98%</div><div className="metric-label">Clientes satisfeitos</div></div>
              <div className="metric"><div className="metric-val">3.4×</div><div className="metric-label">Conversão média</div></div>
              <div className="metric"><div className="metric-val">14d</div><div className="metric-label">Tempo de entrega</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section fade-up" id="beneficios">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot" />Benefícios</span>
            <h2 className="h-section">Tudo que um site de alto valor<br /><span className="grad-text">precisa entregar</span>.</h2>
            <p className="lead">Não é só bonito. É rápido, claro, mensurável — e construído para gerar resultado.</p>
          </div>
          <div className="bene-grid">
            {benefits.map((b) => (
              <div key={b.title} className="bene">
                <div className="bene-icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section fade-up" id="como">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot" />Como funciona</span>
            <h2 className="h-section">Do briefing ao lançamento<br />em <span className="grad-text">3 etapas claras</span>.</h2>
            <p className="lead">Sem ruído, sem surpresas. Um processo enxuto que respeita seu tempo.</p>
          </div>
          <div className="steps">
            {steps.map((s) => (
              <div key={s.n} className="step">
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="section fade-up">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot" />Por que Casa Criative</span>
            <h2 className="h-section">A diferença entre um site comum<br />e um <span className="grad-text">ativo de receita</span>.</h2>
          </div>
          <div className="diff-grid">
            <div className="glass diff diff-big">
              <div className="diff-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <h3>Performance medida em milissegundos.</h3>
              <p>Cada projeto sai do nosso estúdio com Lighthouse 95+ em todas as métricas. Velocidade não é detalhe — é o primeiro filtro de credibilidade.</p>
              <div className="diff-visual">
                {[{ l: "Performance", v: 98 }, { l: "SEO", v: 100 }, { l: "A11y", v: 96 }, { l: "Best Pract.", v: 100 }].map((b) => (
                  <div key={b.l} className="bar">
                    <span className="bar-label">{b.l}</span>
                    <span className="bar-track"><span className="bar-fill" style={{ width: `${b.v}%` }} /></span>
                    <span className="bar-val">{b.v}</span>
                  </div>
                ))}
              </div>
            </div>
            {[
              { icon: "✍️", title: "Copy estratégico.", desc: "Texto que vende — não enche linguiça. Cada parágrafo passa por revisão de conversão." },
              { icon: "🚀", title: "Entrega em 14 dias.", desc: "Sem prazos elásticos. Sprint enxuto, comunicação direta, deploy no prazo combinado." },
              { icon: "🛡️", title: "Garantia real.", desc: "30 dias de ajustes pós-lançamento sem custo. Confiança não é argumento — é prática." },
              { icon: "✨", title: "Sem templates.", desc: "Cada projeto desenhado do zero, sob medida. Você não vai parecer com mais ninguém." },
            ].map((d) => (
              <div key={d.title} className="glass diff">
                <div className="diff-icon" style={{ fontSize: 18 }}>{d.icon}</div>
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="section fade-up" id="portfolio">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot" />Portfólio</span>
            <h2 className="h-section">Projetos recentes,<br /><span className="grad-text">resultados reais</span>.</h2>
            <p className="lead">Uma seleção de cases entregues nos últimos meses. Cada um com sua identidade — todos com a mesma régua de qualidade.</p>
          </div>
          <div className="portfolio-grid">
            {cases.map((c) => (
              <a key={c.title} href={c.url} className="case">
                <div className="case-thumb">🖥️</div>
                <div className="case-body">
                  <div className="case-tag">{c.tag}</div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section fade-up">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot" />Depoimentos</span>
            <h2 className="h-section">Quem trabalha com a gente,<br /><span className="grad-text">volta</span>.</h2>
          </div>
          <div className="testi-grid">
            {testimonials.map((t) => (
              <div key={t.n} className="testi">
                <div className="stars">★★★★★</div>
                <p className="testi-quote">&ldquo;{t.q}&rdquo;</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.a}</div>
                  <div className="testi-meta"><b>{t.n}</b><br /><span>{t.r}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section fade-up" id="precos">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot" />Preços</span>
            <h2 className="h-section">Investimento transparente.<br /><span className="grad-text">Resultado garantido</span>.</h2>
            <p className="lead">Sem surpresas. Escolha o plano que faz sentido para seu momento.</p>
          </div>
          <div className="pricing-grid">
            {plans.map((p) => (
              <div key={p.name} className={`plan${p.featured ? " featured" : ""}`}>
                {p.featured && <div className="plan-badge">Mais escolhido</div>}
                <div className="plan-name">{p.name}</div>
                <div className="plan-price">
                  <span className="from">a partir de R$</span>
                  <span className="amt">{p.price}</span>
                </div>
                <p className="plan-desc">{p.desc}</p>
                <ul className="plan-feats">
                  {p.feats.map((f) => (
                    <li key={f}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={WA_LINK} className={`btn ${p.featured ? "btn-primary" : "btn-ghost"}`}>Falar no WhatsApp</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section fade-up" id="faq">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot" />FAQ</span>
            <h2 className="h-section">Perguntas <span className="grad-text">frequentes</span>.</h2>
          </div>
          <div className="faq-grid">
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item${i === 0 ? " open" : ""}`} onClick={(e) => {
                const el = e.currentTarget;
                const wasOpen = el.classList.contains("open");
                document.querySelectorAll(".faq-item").forEach((x) => x.classList.remove("open"));
                if (!wasOpen) el.classList.add("open");
              }}>
                <div className="faq-q">
                  <span>{f.q}</span>
                  <span className="faq-toggle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </span>
                </div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final fade-up" id="cta">
        <div className="container">
          <div className="cta-card">
            <span className="eyebrow"><span className="dot" />Pronto para começar?</span>
            <h2 style={{ marginTop: 24 }}>Seu próximo site<br /><span className="grad-text">começa aqui</span>.</h2>
            <p className="lead" style={{ maxWidth: 560, margin: "0 auto 32px" }}>Vagas limitadas. Atendemos poucos projetos por vez para garantir qualidade máxima em cada entrega.</p>
            <a href={WA_LINK} className="btn btn-primary" style={{ fontSize: 16, padding: "16px 32px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Quero meu site agora
            </a>
            <div className="urgency"><span className="pulse" />3 vagas disponíveis em maio</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-row">
            <Image src="/logo.webp" alt="Casa Criative Digital" width={100} height={28} style={{ height: 28, width: "auto", opacity: 0.6 }} />
            <p>© {new Date().getFullYear()} Casa Criative Digital. Todos os direitos reservados.</p>
            <div className="footer-links">
              <a href="#">Privacidade</a>
              <a href="#">Termos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}