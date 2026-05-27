import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const API_BASE_URL =
  process.env.VITE_API_URL || 'https://jan-justice-bancked.onrender.com/api';

const DEFAULT_IMAGE_PATH = '/images/JanJustice.png';
const SITE_NAME = 'Jan Justice';

type Blog = {
  _id: string;
  title: string;
  excerpt?: string;
  image?: { url?: string };
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function absoluteUrl(req: VercelRequest, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  return `${proto}://${host}${path.startsWith('/') ? '' : '/'}${path}`;
}

function buildMetaTags(opts: {
  title: string;
  description: string;
  image: string;
  url: string;
}): string {
  const { title, description, image, url } = opts;
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
  ].join('\n    ');
}

function injectMetaTags(html: string, metaTags: string): string {
  const stripped = html.replace(
    /<title>[\s\S]*?<\/title>|<meta\s+(?:name|property)=["'](?:description|og:[^"']+|twitter:[^"']+)["'][^>]*\/?>(?:\s*)/gi,
    ''
  );
  return stripped.replace(/<\/head>/i, `    ${metaTags}\n  </head>`);
}

async function loadIndexHtml(): Promise<string | null> {
  const candidates = [
    join(process.cwd(), 'dist', 'index.html'),
    join(process.cwd(), 'index.html'),
    join(process.cwd(), 'public', 'index.html'),
    '/var/task/dist/index.html',
    '/var/task/index.html',
  ];
  for (const path of candidates) {
    try {
      if (existsSync(path)) {
        return await readFile(path, 'utf8');
      }
    } catch {
      // try next
    }
  }
  return null;
}

function fallbackHtml(metaTags: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/images/JanJustice.png" />
    ${metaTags}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { id } = req.query;
    const blogId = Array.isArray(id) ? id[0] : id;

    if (!blogId) {
      res.status(400).send('Missing blog id');
      return;
    }

    let title = `${SITE_NAME} - Find Your Path in Law`;
    let description =
      'Navigate your legal career with Jan Justice. Find legal job vacancies, certified courses, and book expert consultations.';
    let image = absoluteUrl(req, DEFAULT_IMAGE_PATH);

    try {
      const apiRes = await fetch(`${API_BASE_URL}/blogs/${blogId}`);
      if (apiRes.ok) {
        const json = (await apiRes.json()) as { data?: Blog };
        const blog = json?.data;
        if (blog) {
          title = `${blog.title} | ${SITE_NAME}`;
          if (blog.excerpt) description = blog.excerpt;
          if (blog.image?.url) image = blog.image.url;
        }
      }
    } catch {
      // fall through with defaults if the backend is unreachable
    }

    const url = absoluteUrl(req, `/blogs/${blogId}`);
    const metaTags = buildMetaTags({ title, description, image, url });

    const indexHtml = await loadIndexHtml();
    const finalHtml = indexHtml
      ? injectMetaTags(indexHtml, metaTags)
      : fallbackHtml(metaTags);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader(
      'Cache-Control',
      'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
    );
    res.status(200).send(finalHtml);
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
}
