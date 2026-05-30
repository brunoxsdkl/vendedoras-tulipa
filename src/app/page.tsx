import Link from "next/link";

const menuItems = [
  {
    href: "/etiqueta",
    icon: "🏷️",
    title: "Etiqueta para Caixa",
    desc: "Imprima etiquetas A4 com NF e cliente para organizar pedidos com rapidez.",
    badge: "Operação",
  },
  {
    href: "/medidas",
    icon: "📦",
    title: "Medidas das Caixas",
    desc: "Consulte dimensões e visualize as caixas para escolher o melhor envio.",
    badge: "Logística",
  },
  {
    href: "/receitas",
    icon: "🧪",
    title: "Receitas",
    desc: "Acesse receitas de produtos de limpeza, compartilhe no WhatsApp ou imprima.",
    badge: "Produção",
  },
  {
    href: "/calculadora",
    icon: "🧮",
    title: "Calculadora de Diluição",
    desc: "Ajuste receitas proporcionalmente para o volume exato que você precisa.",
    badge: "Cálculo",
  },
  {
    href: "/catalogos",
    icon: "📖",
    title: "Catálogos",
    desc: "Navegue pelos catálogos digitais dos produtos Tulipa em formato de slides.",
    badge: "Vendas",
  },
  {
    href: "/transportadoras",
    icon: "🚚",
    title: "Transportadoras",
    desc: "Veja transportadoras próximas a Curitiba que atendem todo o Brasil.",
    badge: "Entregas",
  },
];

const highlights = ["6 ferramentas", "Acesso rápido", "Layout responsivo"];

export default function Home() {
  return (
    <>
      <Header />
      <main className="home-shell">
        <section className="hero-section container">
          <div className="hero-copy">
            <span className="eyebrow">Painel Tulipa</span>
            <h2>Organize vendas, etiquetas e rotinas em poucos cliques.</h2>
            <p>
              Uma central moderna para acelerar o dia a dia das vendedoras, com
              atalhos claros para as tarefas mais importantes.
            </p>
            <div className="hero-actions">
              <a href="#ferramentas" className="btn btn-primary">
                Ver ferramentas
              </a>
              <span className="hero-note">
                Feito para uso rápido no celular e no computador.
              </span>
            </div>
          </div>

          <div className="hero-card" aria-label="Resumo do painel">
            <div className="hero-card-top">
              <img src="/logo.jpg" alt="Tulipa" />
              <div>
                <strong>VENDEDORAS</strong>
                <span>Tulipa</span>
              </div>
            </div>
            <div className="hero-metric">
              <span>Central de apoio</span>
              <strong>Online</strong>
            </div>
            <div className="hero-tags">
              {highlights.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="ferramentas" className="container tools-section">
          <div className="section-heading">
            <span className="eyebrow">Ferramentas</span>
            <h2>Escolha o que precisa fazer agora</h2>
            <p>Cards reorganizados com visual mais limpo, moderno e fácil de tocar.</p>
          </div>

          <div className="menu-grid">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} className="menu-card">
                <div className="card-head">
                  <div className="icon">{item.icon}</div>
                  <span>{item.badge}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <strong className="card-link">Abrir ferramenta →</strong>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Header() {
  return (
    <div className="header">
      <div className="header-inner">
        <img src="/logo.jpg" alt="Tulipa" className="header-logo" />
        <div className="header-text">
          <span>Sistema interno</span>
          <h1>VENDEDORAS - TULIPA</h1>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} VENDEDORAS - TULIPA · Feito para facilitar
        seu dia a dia 🌷
      </p>
    </footer>
  );
}
