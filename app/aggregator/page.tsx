'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setArticles(data.articles || []));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDateTime(
        now.toLocaleString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (index: number) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🍊 Orange News</h1>
        <p>{dateTime}</p>
      </header>

      <div className="grid">
        {articles.length === 0 ? (
          <p>Loading news about oranges...</p>
        ) : (
          articles.map((article, index) => (
            <div className="card" key={index}>
              <h3>{article.title}</h3>
              <p className={expanded[index] ? '' : 'truncate'}>
                {article.contentSnippet}
              </p>
              {article.contentSnippet?.length > 300 && (
                <button onClick={() => toggleExpand(index)}>
                  {expanded[index] ? 'Collapse' : 'Expand'}
                </button>
              )}
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read More →
              </a>
            </div>
          ))
        )}
      </div>

      {}
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #fff5e6;
          color: #333;
          transition: background-color 0.3s, color 0.3s;
        }

        .container {
          max-width: 1200px;
          margin: auto;
          padding: 2rem;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 2.5rem;
          color: #ff7f00;
          margin-bottom: 0.3rem;
        }

        .header p {
          font-size: 0.95rem;
          color: #666;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .card {
          background-color: #fff;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }

        .card:hover {
          transform: translateY(-4px);
        }

        .card h3 {
          color: #ff6600;
          margin-top: 0;
        }

        .card p {
          font-size: 0.95rem;
          line-height: 1.5;
          color: #444;
        }

        .card a {
          display: inline-block;
          margin-top: 1rem;
          color: #ff5500;
          font-weight: bold;
          text-decoration: none;
        }

        .card a:hover {
          text-decoration: underline;
        }

        .truncate {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 8;
          line-clamp: 8;
          overflow: hidden;
        }

        button {
          margin-top: 0.5rem;
          background: none;
          border: none;
          color: #ff6600;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
