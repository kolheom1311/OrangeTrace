export default function Head() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="robots" content="index, follow" />

      <title>Portfolio | Om Kolhe</title>
      <meta
        name="description"
        content="Official portfolio of Om Kolhe – a passionate web developer based in Mumbai/Pune, India. Explore projects, skills, and ways to connect."
      />
      <meta
        name="keywords"
        content="Om Kolhe, Om Kolhe web developer, web developer Mumbai, full stack developer India, react developer, frontend engineer, portfolio website, developer portfolio, modern web development"
      />
      <meta name="author" content="Om Kolhe" />
      <link rel="canonical" href="https://omkolhe.vercel.app" />

      {/* Open Graph Meta */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://omkolhe.vercel.app" />
      <meta property="og:title" content="Portfolio | Om Kolhe" />
      <meta
        property="og:description"
        content="I'm Om Kolhe, a web developer based in Mumbai/Pune. View my latest work, projects, and contact details."
      />
      <meta property="og:image" content="https://omkolhe.vercel.app/portfolio-light.png" />
      <meta property="og:site_name" content="Portfolio | Om Kolhe" />

      <meta name="language" content="English" />

      {/* Twitter Meta */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://omkolhe.vercel.app" />
      <meta name="twitter:title" content="Portfolio | Om Kolhe" />
      <meta
        name="twitter:description"
        content="Explore Om Kolhe's work and journey as a professional developer from Mumbai/Pune."
      />
      <meta name="twitter:image" content="https://omkolhe.vercel.app/portfolio-dark.png" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
