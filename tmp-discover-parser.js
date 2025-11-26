const fetch = global.fetch || (require('node-fetch'));
(async () => {
  const res = await fetch('https://despertar.org.br');
  const html = await res.text();
  const socialLinks = [];
  const linkRegex = /href=("|')((?:https?:)?\/:\/\/(?:www\.)?(?:facebook|instagram|linkedin|twitter|youtube|tiktok|whatsapp)\.[^"']+)\1/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) { socialLinks.push(match[2]); }
  const waRegex = /href=("|')(https?:\/\/(?:wa\.me|api\.whatsapp\.com)\/[^"']+)\1/gi;
  while ((match = waRegex.exec(html)) !== null) { if (!socialLinks.includes(match[2])) socialLinks.push(match[2]); }
  const mailRegex = /href=("|')mailto:([^"']+)\1/gi;
  const telRegex = /href=("|')tel:([^"']+)\1/gi;
  while ((match = mailRegex.exec(html)) !== null) { socialLinks.push(`mailto:${match[2]}`); }
  while ((match = telRegex.exec(html)) !== null) { socialLinks.push(`tel:${match[2]}`); }
  const genericLinkRegex = /href=("|')((?:https?:)?\/:\/\/(?:www\.)?[^"']+)\1/gi;
  while ((match = genericLinkRegex.exec(html)) !== null) {
    const url = match[2];
    if (/facebook|instagram|linkedin|twitter|youtube|tiktok|whatsapp/.test(url)) { if (!socialLinks.includes(url)) socialLinks.push(url); }
  }
  const emailPlain = [...html.matchAll(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi)].map(m => `mailto:${m[1]}`);
  for (const e of emailPlain) if (!socialLinks.includes(e)) socialLinks.push(e);
  const phonePlain = [...html.matchAll(/\(\d{2}\)\s*\d{4,5}-\d{4}/g)].map(m => `tel:${m[0].replace(/\s+/g, '')}`);
  for (const p of phonePlain) if (!socialLinks.includes(p)) socialLinks.push(p);
  console.log('Found social/contact links:');
  console.log(socialLinks);
})();
