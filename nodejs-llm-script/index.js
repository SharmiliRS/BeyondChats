require('dotenv').config();
const axios = require('axios');
const OpenAI = require('openai');
const cheerio = require('cheerio');
const googlethis = require('googlethis');

const LARAVEL_API = process.env.LARAVEL_API_URL;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- 1. Fetch latest Phase 1 article ---
async function fetchLatestArticle() {
  const res = await axios.get(`${LARAVEL_API}/phase2/articles`);
  if (!res.data || res.data.length === 0) throw new Error('No scraped articles found');
  return res.data[0]; // get the latest article
}

// --- 2. Google search for related articles ---
async function searchGoogle(title) {
  const options = { page: 0, safe: false };
  const results = await googlethis.search(title, options);
  const articles = results.results
    .filter(r => r.url.includes('https://') && (r.url.includes('blog') || r.url.includes('article')))
    .slice(0, 2);
  return articles.map(a => a.url);
}

// --- 3. Scrape content from given URLs ---
async function scrapeContent(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let content = '';
    $('article p, .post-content p, p').each((i, el) => {
      content += $(el).text() + '\n';
    });
    return content.trim();
  } catch (err) {
    console.warn(`⚠️ Failed to scrape ${url}: ${err.message}`);
    return '';
  }
}

// --- 4. Rewrite using OpenAI ---
async function rewriteArticle(original, references) {
  const prompt = `
You are an expert content writer. 
Update the following article to match the style, clarity, and structure of these reference articles:

References:
${references.join('\n\n')}

Original Article:
${original}

Return clean, well-formatted HTML, and include reference links at the bottom.
`;
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2000,
  });

  return response.choices[0].message.content;
}

// --- 5. Publish rewritten article to Laravel ---
async function publishArticle(article, rewrittenContent) {
  await axios.post(`${LARAVEL_API}/phase2/articles`, {
    title: article.title,
    slug: article.slug + '-ai',
    description: rewrittenContent,
    parent_id: article.id,
  });
}

// --- 6. Main workflow ---
(async () => {
  try {
    console.log('🚀 Phase 2 started');

    const article = await fetchLatestArticle();
    console.log(`✍️ Processing article: ${article.title}`);

    const urls = await searchGoogle(article.title);
    console.log(`🔗 Found reference URLs: ${urls.join(', ')}`);

    const referenceContents = [];
    for (const url of urls) {
      const content = await scrapeContent(url);
      referenceContents.push(`${content}\nSource: ${url}`);
    }

    const rewritten = await rewriteArticle(article.description, referenceContents);
    await publishArticle(article, rewritten);

    console.log(`✅ Rewritten article saved: ${article.title}`);
    console.log('🎉 Phase 2 completed');

  } catch (err) {
    console.error('❌ Phase 2 failed:', err.message);
  }
})();
