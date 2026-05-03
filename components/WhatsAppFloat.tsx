'use client'

export default function WhatsAppFloat() {
  return (
    <>
      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1); opacity: 0.5; }
          70%  { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        .wa-btn {
          position: fixed;
          bottom: 28px;
          right: 24px;
          z-index: 998;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          cursor: pointer;

          /* Liquid glass base */
          background: linear-gradient(
            145deg,
            rgba(232,196,154,0.22) 0%,
            rgba(196,122,74,0.38) 35%,
            rgba(80,36,10,0.65) 75%,
            rgba(0,0,0,0.75) 100%
          );
          backdrop-filter: blur(22px) saturate(180%);
          -webkit-backdrop-filter: blur(22px) saturate(180%);

          border: 1px solid rgba(255,210,160,0.3);

          box-shadow:
            0 8px 32px rgba(0,0,0,0.55),
            0 2px 8px rgba(196,122,74,0.25),
            inset 0 1px 1px rgba(255,255,255,0.12);

          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .wa-btn:hover {
          transform: scale(1.08);
          box-shadow:
            0 12px 40px rgba(0,0,0,0.65),
            0 4px 16px rgba(196,122,74,0.4),
            inset 0 1px 1px rgba(255,255,255,0.15);
        }

        /* Light shimmer */
        .wa-btn::before {
          content: "";
          position: absolute;
          top: -40%;
          left: -30%;
          width: 70%;
          height: 70%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,230,190,0.55) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Noise grain */
        .wa-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 180px;
          opacity: 0.055;
          mix-blend-mode: overlay;
          pointer-events: none;
        }

        /* Pulse ring */
        .wa-pulse {
          position: fixed;
          bottom: 28px;
          right: 24px;
          z-index: 997;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e8c49a, #c47a4a);
          animation: wa-pulse 2.4s ease-out infinite;
          pointer-events: none;
        }
      `}</style>

      <div className="wa-pulse" />

      <a
        className="wa-btn"
        href="https://wa.me/5541998687489"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ position: 'relative', zIndex: 1 }}>
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
            fill="url(#wa-grad)"
          />
          <path
            d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.985-1.306A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182a8.182 8.182 0 01-4.174-1.144l-.3-.178-3.1.813.827-3.02-.196-.31A8.182 8.182 0 1112 20.182z"
            fill="url(#wa-grad)"
          />
          <defs>
            <linearGradient id="wa-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0d5b0" />
              <stop offset="100%" stopColor="#c47a4a" />
            </linearGradient>
          </defs>
        </svg>
      </a>
    </>
  )
}
