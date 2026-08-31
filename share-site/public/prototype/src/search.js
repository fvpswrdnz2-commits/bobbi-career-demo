import { profiles } from './data.js';

const dictionary = globalThis.window?.BOBBI_TAG_DICTIONARY || [];
const normalize = value => String(value || '').toLowerCase().replace(/[\s·｜|、，,。；;（）()\-_/]+/g, '');
const profileText = profile => normalize([
  profile.id, profile.nickname, profile.headline, profile.education,
  ...(profile.educationTags || []), ...(profile.internships || []),
  ...(profile.offers || []), ...(profile.consultTags || []),
  ...(profile.careerTags || []), ...(profile.rawTerms || [])
].join(' '));

function concepts(query) {
  const source = normalize(query);
  return dictionary.filter(item => item.aliases.some(alias => source.includes(normalize(alias))));
}

function careerMatches(profile, found) {
  const text = profileText(profile);
  return found.filter(item => item.dimension === 'career' && (text.includes(normalize(item.name)) || item.aliases.some(alias => text.includes(normalize(alias)))));
}

function educationMatches(profile, found) {
  const text = profileText(profile);
  return found.filter(item => item.dimension === 'education' && (text.includes(normalize(item.name)) || item.aliases.some(alias => text.includes(normalize(alias)))));
}

function directTerms(profile, query) {
  const tokens = String(query || '').toLowerCase().split(/[\s,，、/]+/).filter(token => token.length > 1);
  const text = profileText(profile);
  return tokens.filter(token => text.includes(normalize(token)));
}

export function rankProfiles(query = '') {
  const value = String(query || '').trim();
  if (!value) return profiles.map((profile, index) => ({ profile, score: 100 - index, reasons: ['资料完整', '未来 7 天有可约时间'] }));
  const idMatch = value.match(/#?(\d{3})/);
  if (idMatch) {
    const exact = profiles.find(profile => profile.id === idMatch[1]);
    if (exact) return [{ profile: exact, score: 100, reasons: [`投稿编号 #${exact.id} 精确匹配`] }];
  }

  const found = concepts(value);
  return profiles.map(profile => {
    const career = careerMatches(profile, found);
    const education = educationMatches(profile, found);
    const direct = directTerms(profile, value);
    const reasons = [];
    if (career.length) reasons.push(`方向匹配：${career.slice(0, 2).map(item => item.name).join('、')}`);
    if (education.length) reasons.push(`背景匹配：${education.slice(0, 2).map(item => item.name).join('、')}`);
    if (direct.length) reasons.push(`经历提及：${direct.slice(0, 2).join('、')}`);
    if (profile.availability?.times?.length) reasons.push('未来 7 天有可约时间');
    const score = career.length * 50 + education.length * 20 + Math.min(direct.length, 3) * 10 + (profile.availability?.times?.length ? 3 : 0);
    return { profile, score, reasons: reasons.slice(0, 3) };
  }).filter(item => item.score > 3).sort((a, b) => b.score - a.score || a.profile.id.localeCompare(b.profile.id));
}
