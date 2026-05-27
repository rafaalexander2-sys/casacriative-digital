// ============================================
// PUPPIES NEST — Homepage Code (Wix Velo)
// Cola em: Editor → clica na página → "Page Code"
// ============================================

import wixWindow from 'wix-window';
import { timeline } from 'wix-animations';

$w.onReady(function () {
  initScrollAnimations();
  initAnnouncementBar();
  initDeliveryCountdown();
  initTrustBar();
});

// --- ANNOUNCEMENT BAR ---
function initAnnouncementBar() {
  const messages = [
    "🚀 Free shipping to Netherlands & UK from €35",
    "📦 Delivered in 2–5 business days",
    "⭐ Over 2,000 happy pet owners",
    "🔒 Secure payment · Free returns"
  ];

  let index = 0;
  const bar = $w('#announcementText');
  if (!bar) return;

  setInterval(() => {
    index = (index + 1) % messages.length;
    bar.text = messages[index];
  }, 3500);
}

// --- DELIVERY COUNTDOWN (urgência real) ---
function initDeliveryCountdown() {
  const countdownEl = $w('#deliveryCountdown');
  if (!countdownEl) return;

  const now = new Date();
  const hour = now.getHours();

  // Pedidos antes das 14h saem hoje
  if (hour < 14) {
    const cutoff = new Date(now);
    cutoff.setHours(14, 0, 0, 0);
    const diff = cutoff - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    countdownEl.text = `Order in the next ${h}h ${m}m for same-day dispatch ⚡`;
  } else {
    countdownEl.text = `Order today — dispatched tomorrow 📦`;
  }
}

// --- TRUST BAR ICONS (anima entrada) ---
function initTrustBar() {
  const trustItems = [
    '#trust1', '#trust2', '#trust3', '#trust4'
  ];

  trustItems.forEach((id, i) => {
    try {
      timeline({ delay: i * 100 })
        .add($w(id), { opacity: 1, y: 0, duration: 500, easing: 'easeOutCubic' });
    } catch (e) {}
  });
}

// --- SCROLL ANIMATIONS (IntersectionObserver via CSS classes) ---
function initScrollAnimations() {
  // Anima secções quando entram no viewport
  const sections = [
    '#sectionHero',
    '#sectionTrust',
    '#sectionBestSellers',
    '#sectionWhy',
    '#sectionTestimonials',
    '#sectionNewsletter'
  ];

  sections.forEach(id => {
    try {
      const el = $w(id);
      wixWindow.getViewMode().then(mode => {
        if (mode !== 'Editor') {
          // Só activa animações no site publicado
          el.onViewportEnter(() => {
            el.show('fade', { duration: 600 });
          });
        }
      });
    } catch (e) {}
  });
}

// --- NEWSLETTER SUBSCRIBE ---
// Cola este código no elemento de formulário da newsletter
export function btnSubscribe_click(event) {
  const email = $w('#inputEmail').value;

  if (!email || !email.includes('@')) {
    $w('#txtFeedback').text = 'Please enter a valid email.';
    $w('#txtFeedback').show();
    return;
  }

  // Aqui podes ligar ao Wix CRM ou a um serviço externo (Klaviyo, Mailchimp)
  $w('#txtFeedback').text = '🎉 You\'re in! Welcome to Puppies Nest.';
  $w('#txtFeedback').show();
  $w('#inputEmail').value = '';
}
