"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "./lp.css";

const WORKER_URL = "https://casacriative-form.rafaalexander2.workers.dev";

export default function LandingPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [form, setForm] = useState({ nome: "", email: "", whatsapp: "", instagram: "", projeto: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || !form.email || !form.projeto) return;
    setStatus("loading");
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, servico: form.projeto }),
      });
      const data = await res.json();
      setStatus(data.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  const benefits = [
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, title: "Performance 95+", desc: "Lighthouse máximo em todas as métricas. Velocidade é credibilidade." },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, title: "Copy estratégico", desc: "Texto que vende. Cada parágrafo revisado para conversão." },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, title: "Mobile-first", desc: "Responsivo em todos os dispositivos, testado antes da entrega." },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, title: "SEO otimizado", desc: "Estrutura técnica e semântica para ranquear desde o lançamento." },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: "Garantia 30 dias", desc: "Ajustes pós-lançamento inclusos. Sem letra miúda." },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>, title: "Entrega em 5 dias", desc: "Sprint enxuto. Comunicação direta. Deploy no prazo." },
  ];

  const steps = [
    { n: "01", title: "Briefing", desc: "Entendemos seu negócio, público e objetivos em uma reunião focada." },
    { n: "02", title: "Design & Dev", desc: "Criamos do zero, layout, copy e código, com revisões abertas." },
    { n: "03", title: "Lançamento", desc: "Deploy, testes finais e 30 dias de suporte inclusos." },
  ];

  const cases = [
    { tag: "Site Institucional", title: "Site – Sistema de Segurança", img: "https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/8bde88245921369.69b85f6d447f4.png", href: "https://www.behance.net/gallery/245921369/Site-Sistema-de-Seguranca" },
    { tag: "Landing Page", title: "Landing Page – Odontologia", img: "/portfolio-odontologia.png", href: "https://www.behance.net/gallery/245921131/Landing-Page-Odontologia" },
    { tag: "Landing Page", title: "Landing Page – Estética", img: "/portfolio-estetica.png", href: "https://www.behance.net/gallery/245920979/Landing-Page-Esttica" },
    { tag: "Landing Page", title: "Landing Page – Odontológico", img: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/c59561242480249.696e3e2bd04f8.png", href: "https://www.behance.net/gallery/242480249/Landing-Page-Odontologico" },
    { tag: "Landing Page", title: "Landing Page – Odontologia 2", img: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/bf3fc0244029633.698dea0a7b92a.png", href: "https://www.behance.net/gallery/244029633/LandingPage-Odontologia" },
    { tag: "Site Institucional", title: "Assessoria de Marketing – DMove", img: "/portfolio-dmove.png", href: "https://www.behance.net/gallery/163229265/ASSESSORIA-DE-MARKETING-DMOVE" },
  ];

  const testimonials = [
    { q: "Criativos incríveis, atendimento excelente e resultado acima das expectativas. Recomendo muito!", n: "Hugo Klem", r: "Cliente Casa Criative", a: "H" },
    { q: "Todas as vezes que precisei falar com eles, Rafael sempre me atendeu prontamente, coisa difícil de se ver hoje em dia. Conversar e ter acesso direto ao desenvolvedor foi fundamental para mim e pro meu site.", n: "Juliana Silva", r: "Cliente Casa Criative", a: "J" },
    { q: "Minha parceria com a Casa Criative Digital já é bem longa. O trabalho deles é sempre entregue no prazo e com excelência. Super impecáveis em tudo que fazem.", n: "Alessandra Wendy", r: "Cliente Casa Criative", a: "A" },
    { q: "Contamos com os serviços da Casa Criative por mais de uma vez e o trabalho sempre foi de excelência. Entrega no prazo, qualidade impecável. Super indico!", n: "Cássio Miranda", r: "Cliente Casa Criative", a: "C" },
  ];

  const plans = [
    {
      name: "Essencial",
      price: "749",
      desc: "Landing page de alta conversão.",
      feats: ["1 landing page premium", "Copy estratégico", "Entrega em 7 dias", "Garantia 30 dias"],
      featured: false,
    },
    {
      name: "Studio",
      price: "1.479",
      desc: "Site institucional premium com animações.",
      feats: ["Até 6 páginas premium", "Copy estratégico + SEO", "Identidade visual aplicada", "Animações & microinterações", "Entrega em 5 dias", "Suporte 60 dias"],
      featured: true,
    },
    {
      name: "Performance+",
      price: "1.987",
      desc: "Site completo com blog integrado, mais de 10 páginas.",
      feats: ["Site + blog com 10+ páginas", "SEO técnico avançado", "Estratégia de conversão", "Integrações (CRM, analytics)", "Suporte 90 dias", "Sprint mensal opcional"],
      featured: false,
    },
  ];

  const faqs = [
    { q: "Quanto tempo leva para meu site ficar pronto?", a: "Entre 3 e 5 dias úteis, dependendo do plano. Projetos maiores podem chegar a 14 dias com cronograma claro desde o briefing." },
    { q: "Vocês fazem o copy ou eu preciso entregar pronto?", a: "Cuidamos do copy estratégico. Você participa do briefing e revisões, nós escrevemos com foco em conversão." },
    { q: "O site fica responsivo em celular e tablet?", a: "Sempre. Construímos mobile-first e testamos em múltiplos dispositivos antes de entregar." },
    { q: "Posso editar o site depois de pronto?", a: "Sim. Entregamos um painel simples ou treinamento gravado para você atualizar textos, imagens e blocos." },
    { q: "Quais formas de pagamento?", a: "PIX, cartão em até 12x ou boleto. 50% no início, 50% na entrega." },
    { q: "E se eu não gostar do resultado?", a: "Você tem 2 rodadas de revisão por etapa. Após o lançamento, 30 dias de ajustes inclusos. Sem letra miúda." },
  ];

  const diffCards = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="diff-icon-svg">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      ),
      title: "Copy estratégico.",
      desc: "Texto que vende, não enche linguiça. Cada parágrafo revisado para conversão.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="diff-icon-svg">
          <path d="M5 12h14M13 5l7 7-7 7"/>
        </svg>
      ),
      title: "Entrega em 5 dias.",
      desc: "Sem prazos elásticos. Sprint enxuto, comunicação direta, deploy no prazo combinado.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="diff-icon-svg">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: "Garantia real.",
      desc: "30 dias de ajustes pós-lançamento sem custo. Confiança não é argumento, é prática.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="diff-icon-svg">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
      title: "Sem templates.",
      desc: "Cada projeto desenhado do zero, sob medida. Você não vai parecer com mais ninguém.",
    },
  ];

  return (
    <div className="lp-wrap">
      <div className="lp-glow-1" />
      <div className="lp-glow-2" />
      <div className="bg-noise" />

      {/* NAV */}
      <div className="nav-wrap">
        <nav className="nav">
          <a href="#" style={{ display: "flex", alignItems: "center" }}>
            <Image src="/logo.webp" alt="Casa Criative Digital" width={108} height={31} style={{ height: 31, width: "auto" }} />
          </a>
          <div className="nav-links">
            <a href="#beneficios">Benefícios</a>
            <a href="#como">Como funciona</a>
            <a href="#portfolio">Cases</a>
            <a href="#precos">Preços</a>
            <a href="#faq">FAQ</a>
          </div>
          <a href="#cta" className="btn btn-primary nav-cta" style={{ padding: "10px 18px", fontSize: 14 }}>
            Solicitar orçamento
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
              <p className="hero-sub">Criamos sites e landing pages de alta performance, com design premium, código limpo e copy estratégico que transforma visitas em clientes.</p>
              <div className="hero-cta">
                <a href="#cta" className="btn btn-primary">
                  Solicitar orçamento
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="arrow"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </a>
                <a href="#portfolio" className="btn btn-ghost">Ver projetos
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="arrow"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </a>
              </div>
              <div className="hero-meta">
                <span className="check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg> Entrega em até 5 dias</span>
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
              <span className="hero-tag t-1"><span className="pulse" />conversão +312%</span>
              <span className="hero-tag t-2"><span className="pulse" />lighthouse 100/100</span>
              <span className="hero-tag t-3"><span className="pulse" />carregamento &lt; 0.8s</span>
            </div>
          </div>

          <div className="fade-up">
            <div className="proof">
              <div className="proof-label">Confiança de marcas em crescimento</div>
              <div className="proof-row">
                {["DMove", "Nutriblu", "Lenon", "JS Trade Tech", "UPLAY", "4A Studio"].map((b) => (
                  <span key={b} className="proof-logo">{b}</span>
                ))}
              </div>
            </div>
            <div className="metrics">
              <div className="metric"><div className="metric-val">+120</div><div className="metric-label">Projetos entregues</div></div>
              <div className="metric"><div className="metric-val">98%</div><div className="metric-label">Clientes satisfeitos</div></div>
              <div className="metric"><div className="metric-val">3.4×</div><div className="metric-label">Conversão média</div></div>
              <div className="metric"><div className="metric-val">5d</div><div className="metric-label">Tempo de entrega</div></div>
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
            <p className="lead">Não é só bonito. É rápido, claro, mensurável e construído para gerar resultado.</p>
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
              <div className="diff-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="diff-icon-svg"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <h3>Performance medida em milissegundos.</h3>
              <p>Cada projeto sai do nosso estúdio com Lighthouse 95+ em todas as métricas. Velocidade não é detalhe, é o primeiro filtro de credibilidade.</p>
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
            {diffCards.map((d) => (
              <div key={d.title} className="glass diff">
                <div className="diff-icon-wrap">{d.icon}</div>
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
            <p className="lead">Uma seleção de cases entregues nos últimos meses. Cada um com sua identidade, todos com a mesma régua de qualidade.</p>
          </div>
          <div className="portfolio-grid">
            {cases.map((c) => (
              <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer" className="case">
                <div className="case-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div className="case-body">
                  <div className="case-tag">{c.tag}</div>
                  <h3>{c.title}</h3>
                  <span className="case-link">Ver no Behance →</span>
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
          <div className="testi-grid testi-grid-4">
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
                <a href="#cta" className={`btn ${p.featured ? "btn-primary" : "btn-ghost"}`}>Solicitar orçamento</a>
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

      {/* FORM FINAL */}
      <section className="cta-final fade-up" id="cta">
        <div className="container">
          <div className="cta-card">
            <span className="eyebrow"><span className="dot" />Pronto para começar?</span>
            <h2 style={{ marginTop: 24 }}>Seu próximo site<br /><span className="grad-text">começa aqui</span>.</h2>
            <p className="lead" style={{ maxWidth: 560, margin: "12px auto 40px" }}>Vagas limitadas. Atendemos poucos projetos por vez para garantir qualidade máxima em cada entrega.</p>

            <div className="lp-form-wrap">
              {status === "success" ? (
                <div className="lp-form-success">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgb(var(--accent))" }}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                  <p style={{ fontSize: 18, fontWeight: 500, color: "var(--text)", marginTop: 16 }}>Mensagem enviada!</p>
                  <p style={{ fontSize: 14, color: "var(--text-soft)", marginTop: 8 }}>Entraremos em contato em breve.</p>
                  <button
                    onClick={() => { setStatus("idle"); setForm({ nome: "", email: "", whatsapp: "", instagram: "", projeto: "" }); }}
                    className="btn btn-ghost"
                    style={{ marginTop: 24, fontSize: 13 }}
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="lp-form">
                  <div className="lp-form-row">
                    <input className="lp-input" type="text" placeholder="Nome completo *" value={form.nome} onChange={set("nome")} required />
                    <input className="lp-input" type="email" placeholder="E-mail *" value={form.email} onChange={set("email")} required />
                  </div>
                  <div className="lp-form-row">
                    <input className="lp-input" type="tel" placeholder="WhatsApp" value={form.whatsapp} onChange={set("whatsapp")} />
                    <input className="lp-input" type="text" placeholder="Instagram (@suamarca)" value={form.instagram} onChange={set("instagram")} />
                  </div>
                  <select className="lp-select" value={form.projeto} onChange={set("projeto")} required>
                    <option value="" disabled>Tipo de projeto *</option>
                    <option value="Landing Page Premium">Landing Page Premium</option>
                    <option value="Site Institucional">Site Institucional</option>
                    <option value="Site com Blog">Site com Blog</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Outro">Outro</option>
                  </select>
                  {status === "error" && (
                    <p style={{ fontSize: 13, color: "#e05555", textAlign: "center" }}>Erro ao enviar. Tente novamente.</p>
                  )}
                  <button type="submit" disabled={status === "loading"} className="btn btn-primary lp-submit">
                    {status === "loading" ? "Enviando…" : "Solicitar orçamento"}
                    {status !== "loading" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="arrow"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="urgency" style={{ marginTop: 28 }}><span className="pulse" />3 vagas disponíveis em maio</div>
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
