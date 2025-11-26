export type SiteParseResult = {
  title?: string | null;
  description?: string | null;
  networks: string[];
  contacts: string[];
};

export async function parseDespertar(): Promise<SiteParseResult> {
  const url = 'https://despertar.org.br';
  const result: SiteParseResult = { networks: [], contacts: [] };
  try {
    const res = await fetch(url);
    const html = await res.text();
    // title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) result.title = titleMatch[1];
    // description
    const descMatch = html.match(/<meta\s+name=("|')description\1\s+content=("|')(.*?)\2/i) || html.match(/<meta\s+content=("|')(.*?)\1\s+name=("|')description\3/i);
    if (descMatch) result.description = descMatch[3] || descMatch[2];

    const socialLinks: string[] = [];
    const linkRegex = /href=("|')((?:https?:)?\/\/(?:www\.)?(?:facebook|instagram|linkedin|twitter|youtube|tiktok|whatsapp)\.[^"']+)\1/gi;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      socialLinks.push(match[2]);
    }

    const waRegex = /href=("|')(https?:\/\/(?:wa\.me|api\.whatsapp\.com)\/[^"']+)\1/gi;
    while ((match = waRegex.exec(html)) !== null) {
      if (!socialLinks.includes(match[2])) socialLinks.push(match[2]);
    }

    const mailRegex = /href=("|')mailto:([^"']+)\1/gi;
    const telRegex = /href=("|')tel:([^"']+)\1/gi;
    while ((match = mailRegex.exec(html)) !== null) socialLinks.push(`mailto:${match[2]}`);
    while ((match = telRegex.exec(html)) !== null) socialLinks.push(`tel:${match[2]}`);

    const genericLinkRegex = /href=("|')((?:https?:)?\/\/(?:www\.)?[^"']+)\1/gi;
    while ((match = genericLinkRegex.exec(html)) !== null) {
      const url2 = match[2];
      if (/facebook|instagram|linkedin|twitter|youtube|tiktok|whatsapp/.test(url2)) {
        if (!socialLinks.includes(url2)) socialLinks.push(url2);
      }
    }

    const emailPlain = [...html.matchAll(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi)].map(m => `mailto:${m[1]}`);
    for (const e of emailPlain) if (!socialLinks.includes(e)) socialLinks.push(e);
    const phonePlain = [...html.matchAll(/\(\d{2}\)\s*\d{4,5}-\d{4}/g)].map(m => `tel:${m[0].replace(/\s+/g, '')}`);
    for (const p of phonePlain) if (!socialLinks.includes(p)) socialLinks.push(p);

    // networks: only social domains
    const networksList = socialLinks.filter(u => /instagram\.com|facebook\.com|linkedin\.com|youtube\.com/.test(u));
    const preferred = ['instagram.com','facebook.com','linkedin.com','youtube.com'];
    networksList.sort((a,b) => {
      const ai = preferred.findIndex(p => a.includes(p));
      const bi = preferred.findIndex(p => b.includes(p));
      return Math.sign((ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi));
    });
    result.networks = networksList;

    const contactList = socialLinks.filter(u => u.startsWith('mailto:') || u.startsWith('tel:') || /wa\.me|api\.whatsapp\.com|whatsapp\.com/.test(u));
    result.contacts = contactList;

    // Fall back if we couldn't find them
    if (result.networks.length === 0) result.networks = [
      'https://www.instagram.com/sou.despertar/',
      'https://www.facebook.com/sou.despertar/',
      'https://www.linkedin.com/school/66649734/',
      'https://www.youtube.com/@sou.despertar'
    ];
    if (result.contacts.length === 0) result.contacts = [
      'mailto:despertar@despertar.org.br',
      'mailto:ouvidoria@despertar.org.br',
      'tel:(11)5621-0901'
    ];

  } catch (err) {
    // fallback
    result.networks = [
      'https://www.instagram.com/sou.despertar/',
      'https://www.facebook.com/sou.despertar/',
      'https://www.linkedin.com/school/66649734/',
      'https://www.youtube.com/@sou.despertar'
    ];
    result.contacts = [
      'mailto:despertar@despertar.org.br',
      'mailto:ouvidoria@despertar.org.br',
      'tel:(11)5621-0901'
    ];
  }
  return result;
}

export default parseDespertar;
