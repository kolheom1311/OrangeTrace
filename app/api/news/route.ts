import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

type Article = {
  title: string;
  link: string;
  contentSnippet?: string;
  pubDate?: string;
};

export async function GET() {
  const parser: Parser = new Parser();
  const feedUrl = 'https://news.google.com/rss/search?q=fruit+orange';

  try {
    const feed = await parser.parseURL(feedUrl);

    const articles: Article[] = (feed.items || []).map(item => ({
      title: item.title || '',
      link: item.link || '',
      contentSnippet: item.contentSnippet || '',
      pubDate: item.pubDate || '',
    }));

    return NextResponse.json({ articles }, { status: 200 });
  } catch (error) {
    console.error('RSS Feed Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orange news.' },
      { status: 500 }
    );
  }
}
