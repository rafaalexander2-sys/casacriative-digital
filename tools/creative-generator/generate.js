import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const produtoPath = process.argv[2] || path.join(__dirname, 'produto-exemplo.json');
const produto = JSON.parse(fs.readFileSync(produtoPath, 'utf8'));

const COR = produto.cor_destaque || '#FF4444';
const { nome, preco, preco_original: precoOriginal, cta = 'Compra Agora' } = produto;
const desconto = precoOriginal
  ? `-${Math.round((1 - parseFloat(preco) / parseFloat(precoOriginal)) * 100)}%`
  : null;
const slug = nome.replace(/\s+/g, '-').toLowerCase();

async function fetchImagem() {
  if (!produto.imagem) return null;
  try {
    if (produto.imagem.startsWith('http')) {
      const res = await fetch(produto.imagem);
      const buf = Buffer.from(await res.arrayBuffer());
      return await loadImage(buf);
    }
    return await loadImage(produto.imagem);
  } catch {
    console.warn('Imagem não carregada, usando placeholder.');
    return null;
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawStrikethrough(ctx, text, x, y) {
  const w = ctx.measureText(text).width;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y - 14);
  ctx.lineTo(x + w / 2, y - 14);
  ctx.stroke();
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ── FEED 1:1 (1080×1080) ──────────────────────────────────────────────────────
async function gerarFeed(img) {
  const W = 1080, H = 1080;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Fundo
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#1a0000');
  bg.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Imagem do produto (esquerda)
  const IS = 520, IX = 60, IY = 180;
  if (img) {
    ctx.save();
    roundRect(ctx, IX, IY, IS, IS, 24);
    ctx.clip();
    ctx.drawImage(img, IX, IY, IS, IS);
    ctx.restore();
  } else {
    ctx.fillStyle = '#2a2a2a';
    roundRect(ctx, IX, IY, IS, IS, 24);
    ctx.fill();
    ctx.fillStyle = '#555';
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📦', IX + IS / 2, IY + IS / 2 + 28);
  }

  // Badge desconto
  if (desconto) {
    ctx.fillStyle = COR;
    roundRect(ctx, IX + IS - 150, IY - 22, 150, 60, 30);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${desconto} OFF`, IX + IS - 75, IY + 18);
  }

  // Conteúdo direita
  const RX = 660;
  ctx.textAlign = 'left';

  // Nome do produto
  ctx.fillStyle = 'white';
  ctx.font = 'bold 52px sans-serif';
  const linhas = wrapText(ctx, nome, 360);
  linhas.forEach((l, i) => ctx.fillText(l, RX, 240 + i * 66));
  const afterNome = 240 + linhas.length * 66 + 30;

  // Preço original
  if (precoOriginal) {
    ctx.fillStyle = '#666';
    ctx.font = '38px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`€${precoOriginal}`, RX, afterNome);
    const pw = ctx.measureText(`€${precoOriginal}`).width;
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(RX, afterNome - 13);
    ctx.lineTo(RX + pw, afterNome - 13);
    ctx.stroke();
  }

  // Preço novo
  ctx.fillStyle = COR;
  ctx.font = 'bold 110px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`€${preco}`, RX - 4, afterNome + 120);

  // Info
  ctx.fillStyle = '#888';
  ctx.font = '28px sans-serif';
  ctx.fillText('Envio grátis · Stock limitado', RX, afterNome + 168);

  // Botão CTA (fundo inteiro)
  const btnY = H - 160;
  ctx.fillStyle = COR;
  roundRect(ctx, 60, btnY, W - 120, 100, 16);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(cta.toUpperCase(), W / 2, btnY + 66);

  return canvas.toBuffer('image/png');
}

// ── STORY 9:16 (1080×1920) ───────────────────────────────────────────────────
async function gerarStory(img) {
  const W = 1080, H = 1920;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Fundo
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0d0d2b');
  bg.addColorStop(1, '#1a1a3e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Top urgência
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 40px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚡  OFERTA TERMINA HOJE  ⚡', W / 2, 110);

  // Linha separadora
  ctx.strokeStyle = 'rgba(255,215,0,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 130);
  ctx.lineTo(W - 80, 130);
  ctx.stroke();

  // Imagem do produto (centro)
  const IS = 720, IX = (W - IS) / 2, IY = 200;
  if (img) {
    ctx.save();
    roundRect(ctx, IX, IY, IS, IS, 32);
    ctx.clip();
    ctx.drawImage(img, IX, IY, IS, IS);
    ctx.restore();
  } else {
    ctx.fillStyle = '#1a1a3a';
    roundRect(ctx, IX, IY, IS, IS, 32);
    ctx.fill();
  }

  // Badge desconto
  if (desconto) {
    ctx.fillStyle = COR;
    roundRect(ctx, IX + IS - 170, IY - 24, 170, 72, 36);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${desconto} OFF`, IX + IS - 85, IY + 24);
  }

  // Nome
  ctx.fillStyle = 'white';
  ctx.font = 'bold 72px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(nome, W / 2, IY + IS + 100);

  // Preços
  const PY = IY + IS + 230;
  if (precoOriginal) {
    ctx.fillStyle = '#666';
    ctx.font = '52px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`€${precoOriginal}`, W / 2, PY);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 3;
    drawStrikethrough(ctx, `€${precoOriginal}`, W / 2, PY);
  }

  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 180px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`€${preco}`, W / 2, PY + 210);

  // Botão CTA
  const btnY = H - 200;
  ctx.fillStyle = '#FFD700';
  roundRect(ctx, 80, btnY, W - 160, 130, 20);
  ctx.fill();
  ctx.fillStyle = '#0d0d2b';
  ctx.font = 'bold 58px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(cta.toUpperCase(), W / 2, btnY + 86);

  return canvas.toBuffer('image/png');
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🎨 A gerar criativos para: ${nome}`);

  const img = await fetchImagem();

  const feedBuf = await gerarFeed(img);
  const feedPath = path.join(outDir, `${slug}-feed.png`);
  fs.writeFileSync(feedPath, feedBuf);
  console.log(`✅ Feed 1:1     → ${feedPath}`);

  const storyBuf = await gerarStory(img);
  const storyPath = path.join(outDir, `${slug}-story.png`);
  fs.writeFileSync(storyPath, storyBuf);
  console.log(`✅ Story 9:16   → ${storyPath}`);

  console.log(`\n📁 Prontos em: tools/creative-generator/out/\n`);
}

main().catch(console.error);
