# Casa Criative — Site Novo

## Como rodar

```bash
# 1. Entrar na pasta
cd casacriative

# 2. Instalar dependências
npm install

# 3. Rodar em desenvolvimento
npm run dev
```

Abra http://localhost:3000 no navegador.

## Estrutura

```
casacriative/
├── app/
│   ├── layout.tsx       → SEO, fontes, metadados
│   ├── page.tsx         → Home (monta todos os componentes)
│   └── globals.css      → Variáveis CSS, bronze, tipografia
├── components/
│   ├── Navbar.tsx       → Nav fixo com blur no scroll
│   ├── HeroCity.tsx     → Cidade animada por scroll (Canvas + Framer Motion)
│   ├── Stats.tsx        → +700k · +50 · 5 anos
│   ├── Services.tsx     → Grid 2x2 de serviços com scroll animation
│   ├── About.tsx        → Nossa história + timeline
│   ├── Reviews.tsx      → Depoimentos Google
│   ├── Contact.tsx      → Formulário + contatos
│   └── Footer.tsx       → Links + redes sociais
├── tailwind.config.js   → Paleta bronze + fontes
├── next.config.js
├── tsconfig.json
└── package.json
```

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (scroll animations)

## Paleta
- Preto: #000000 / #1d1d1f
- Cinzas: #3a3a3c → #f5f5f7
- Bronze perolizado: #8b4513 → #c47a4a → #f0d5b0

## Próximos passos
- [ ] Adicionar páginas internas (Quem Somos, Serviços, Blog)
- [ ] Integrar formulário com EmailJS ou Resend
- [ ] Adicionar logo PNG real nos assets
- [ ] Deploy na Vercel
