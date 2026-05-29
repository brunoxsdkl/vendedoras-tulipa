import Link from "next/link";

const menuItems = [
  {
    href: "/etiqueta",
    icon: "🏷️",
    title: "Etiqueta para Caixa",
    desc: "Imprimir etiqueta A4 retrato com NF e nome do cliente para colar em caixas de pedido",
  },
  {
    href: "/medidas",
    icon: "📦",
    title: "Medidas das Caixas",
    desc: "Dimensões e visualização 3D de todas as caixas que trabalhamos",
  },
  {
    href: "/receitas",
    icon: "🧪",
    title: "Receitas",
    desc: "Receitas de produtos de limpeza · Compartilhe via WhatsApp ou imprima",
  },
  {
    href: "/calculadora",
    icon: "🧮",
    title: "Calculadora de Diluição",
    desc: "Dimensione as receitas proporcionalmente para o volume que você precisa",
  },
  {
    href: "/catalogos",
    icon: "📖",
    title: "Catálogos",
    desc: "Catálogos digitais dos produtos Tulipa — navegue como slides",
  },
  {
    href: "/transportadoras",
    icon: "🚚",
    title: "Transportadoras",
    desc: "Transportadoras com sede/filiais próximas a Curitiba que atendem todo o Brasil",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 60px)" }}>
        <div className="container">
          <div className="menu-grid">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} className="menu-card">
                <div className="icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
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
          <h1>VENDEDORAS - TULIPA</h1>
          <p>Ferramenta multiuso para facilitar seu dia a dia</p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "20px",
        fontSize: "0.8rem",
        color: "#94a3b8",
        borderTop: "1px solid #e2e8f0",
        background: "white",
      }}
    >
      <p>
        © {new Date().getFullYear()} VENDEDORAS - TULIPA · Feito para facilitar
        seu dia a dia 🌷
      </p>
    </footer>
  );
}
