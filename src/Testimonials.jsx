// Shared customer quotes, shown on the home and services pages.

const styles = `
  .tm-track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(300px, 380px);
    gap: 20px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 4px 4px 20px;
    margin: 0 -4px;
    scrollbar-width: thin;
  }
  .tm-card {
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 28px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
  }
  .tm-mark {
    font-family: Georgia, serif;
    font-size: 3.2rem;
    line-height: 0.6;
    color: var(--accent);
    height: 18px;
  }
  .tm-quote { flex: 1; font-size: 1.02rem; line-height: 1.75; color: var(--text); }
  .tm-person { display: flex; align-items: center; gap: 12px; padding-top: 20px; border-top: 1px solid var(--border); }
  .tm-person img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
  .tm-name { font-weight: 700; color: var(--text); }
  .tm-role { font-size: 0.85rem; color: var(--accent-text); font-weight: 600; }
  @media (max-width: 600px) { .tm-track { grid-auto-columns: 85%; } }
`;

export const testimonials = [
  {
    quote: "AUTOMATION LOGISTICS has been a game changer for our business. Always on time and extremely reliable!",
    author: "Michael R.",
    role: "Supply Chain Manager",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "Their global network and real-time tracking give us peace of mind for every shipment.",
    author: "Sarah J.",
    role: "Logistics Director",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "Exceptional service and competitive rates. They handled our complex international moves with ease.",
    author: "David K.",
    role: "CEO of GlobalTrade",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "The team is incredibly responsive. Our urgent medical supplies always arrive exactly when needed.",
    author: "Amina W.",
    role: "Operations Chief",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "I've worked with many logistics firms, but AUTOMATION LOGISTICS' transparency is truly unmatched.",
    author: "Marcus T.",
    role: "Distribution Lead",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
  },
  {
    quote: "Highly recommend for any business looking to scale. Their rail freight options saved us 30% on costs.",
    author: "Elena G.",
    role: "Sustainability Manager",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
];

export default function Testimonials() {
  return (
    <>
      <style>{styles}</style>
      <div className="tm-track" role="list">
        {testimonials.map((t) => (
          <figure className="tm-card" key={t.author} role="listitem">
            <div className="tm-mark" aria-hidden="true">“</div>
            <blockquote className="tm-quote">{t.quote}</blockquote>
            <figcaption className="tm-person">
              <img src={t.img} alt={t.author} />
              <div>
                <div className="tm-name">{t.author}</div>
                <div className="tm-role">{t.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
