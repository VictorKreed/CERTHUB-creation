"use client"

export default function BackgroundOrbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
        <span className="orb orb-4" />
        <span className="orb orb-5" />
      </div>

      <style jsx>{`
        .orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(24px);
          opacity: 0.45;
          mix-blend-mode: screen;
          will-change: transform, opacity;
          transition: transform 0.6s ease, opacity 0.6s ease, filter 0.6s ease;
          box-shadow: 0 0 120px rgba(255, 255, 255, 0.15), inset 0 0 60px rgba(255, 255, 255, 0.12);
        }
        .orb:hover {
          opacity: 0.6;
          filter: blur(18px);
          transform: scale(1.04);
        }
        .orb-1 {
          width: 28rem;
          height: 28rem;
          top: -6rem;
          left: -6rem;
          background: radial-gradient(closest-side, rgba(255, 255, 255, 0.45), rgba(65, 105, 225, 0.35), rgba(0, 0, 139, 0.2));
          animation: float-a 18s ease-in-out infinite;
        }
        .orb-2 {
          width: 22rem;
          height: 22rem;
          bottom: -4rem;
          right: -4rem;
          background: radial-gradient(closest-side, rgba(255, 255, 255, 0.35), rgba(65, 105, 225, 0.35), rgba(0, 0, 139, 0.15));
          animation: float-b 20s ease-in-out infinite;
        }
        .orb-3 {
          width: 18rem;
          height: 18rem;
          top: 30%;
          right: 10%;
          background: radial-gradient(closest-side, rgba(255, 255, 255, 0.35), rgba(65, 105, 225, 0.3), rgba(0, 0, 139, 0.15));
          animation: float-c 16s ease-in-out infinite;
        }
        .orb-4 {
          width: 14rem;
          height: 14rem;
          bottom: 15%;
          left: 12%;
          background: radial-gradient(closest-side, rgba(255, 255, 255, 0.3), rgba(65, 105, 225, 0.25), rgba(0, 0, 139, 0.1));
          animation: float-d 22s ease-in-out infinite;
        }
        .orb-5 {
          width: 10rem;
          height: 10rem;
          top: 10%;
          left: 45%;
          background: radial-gradient(closest-side, rgba(255, 255, 255, 0.28), rgba(65, 105, 225, 0.22), rgba(0, 0, 139, 0.08));
          animation: float-e 26s ease-in-out infinite;
        }

        @keyframes float-a {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 30px); }
        }
        @keyframes float-b {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-24px, -18px); }
        }
        @keyframes float-c {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(16px, -14px); }
        }
        @keyframes float-d {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-18px, 16px); }
        }
        @keyframes float-e {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
        }
      `}</style>
    </div>
  )
}
