import { profiles } from './data.js';

const dictionary = globalThis.window?.BOBBI_TAG_DICTIONARY || [];
const normalize = value => String(value || '').toLowerCase().replace(/[\s·｜|、，,。；;（）()\-_/]+/g, '');

const fieldsFor = (profile, dimension) => {
  if (dimension === 'education') return [profile.education, ...(profile.educationTags || [])];
  if (dimension === 'consult') return [...(profile.consultTags || [])];
  return [
    profile.headline,
    profile.summary,
    profile.sourceTitle,
    ...(profile.careerTags || []),
    ...(profile.offers || []),
    ...(profile.internships || []),
    ...(profile.rawTerms || []),
    ...(profile.recruitment || []).flatMap(item => [item.title, item.text]),
  ];
};

const textIncludesConcept = (values, concept) => {
  const text = normalize(values.join(' '));
  return concept.aliases.some(alias => text.includes(normalize(alias)));
};

function concepts(query) {
  const source = normalize(query);
  const matches = dictionary.map(item => {
    const alias = item.aliases
      .map(normalize)
      .filter(Boolean)
      .filter(value => source.includes(value))
      .sort((a, b) => b.length - a.length)[0];
    return alias ? { item, alias } : null;
  }).filter(Boolean).sort((a, b) => b.alias.length - a.alias.length);

  const chosen = [];
  for (const match of matches) {
    const covered = chosen.some(kept => (
      kept.item.dimension === match.item.dimension
      && kept.item.group === match.item.group
      && kept.alias.includes(match.alias)
    ));
    if (!covered && !chosen.some(kept => kept.item.name === match.item.name)) chosen.push(match);
  }
  return chosen.map(match => match.item);
}

function profileConcepts(profile, dimension) {
  const values = fieldsFor(profile, dimension);
  return dictionary.filter(item => item.dimension === dimension && textIncludesConcept(values, item));
}

const relatedGroups = new Map([
  ['bank', new Set(['asset-management', 'securities', 'insurance', 'public-sector'])],
  ['asset-management', new Set(['bank', 'securities', 'primary-market', 'insurance'])],
  ['securities', new Set(['bank', 'asset-management', 'primary-market'])],
  ['primary-market', new Set(['asset-management', 'securities', 'business-strategy'])],
  ['insurance', new Set(['bank', 'asset-management'])],
  ['public-sector', new Set(['bank', 'asset-management'])],
  ['internet-product', new Set(['project-management', 'business-strategy'])],
  ['project-management', new Set(['internet-product', 'business-strategy', 'management-trainee'])],
  ['business-strategy', new Set(['internet-product', 'project-management', 'primary-market'])],
  ['management-trainee', new Set(['project-management', 'pharma'])],
  ['pharma', new Set(['management-trainee'])],
]);

// 仅在产品明确确认某组弱关联后写入；空表意味着不臆测弱关系。
const weakGroups = new Map();

function relation(wanted, candidateConcepts) {
  if (candidateConcepts.some(item => item.name === wanted.name)) return 1;
  if (candidateConcepts.some(item => item.group === wanted.group)) return 0.7;
  if (candidateConcepts.some(item => relatedGroups.get(wanted.group)?.has(item.group))) return 0.4;
  if (candidateConcepts.some(item => weakGroups.get(wanted.group)?.has(item.group))) return 0.2;
  return 0;
}

function dimensionMatch(requested, profile, dimension) {
  if (!requested.length) return { ratio: 0, exact: 0, related: 0 };
  const candidateConcepts = profileConcepts(profile, dimension);
  const ratios = requested.map(wanted => relation(wanted, candidateConcepts));
  return {
    ratio: ratios.reduce((sum, value) => sum + value, 0) / ratios.length,
    exact: ratios.filter(value => value === 1).length,
    related: ratios.filter(value => value > 0 && value < 1).length,
  };
}

function strongestEvidence(profile, wanted) {
  const finalDestination = (profile.recruitment || [])
    .filter(item => /最终去向|最终选择|最终结果/.test(item.title))
    .map(item => item.text);
  const recruitment = (profile.recruitment || []).map(item => `${item.title} ${item.text}`);
  const matchingRecruitment = recruitment.filter(text => textIncludesConcept([text], wanted));

  const explicitDestination = /上岸|入职|最终|落地/.test(profile.sourceTitle || '') ? [profile.sourceTitle] : [];
  if (textIncludesConcept([...finalDestination, ...explicitDestination], wanted)) return { ratio: 1, label: '最终去向' };
  if (matchingRecruitment.some(text => /留用/.test(text))) return { ratio: 0.85, label: '暑期留用 Offer' };
  if (textIncludesConcept(profile.offers || [], wanted)) return { ratio: 0.9, label: '获得 Offer' };
  if (matchingRecruitment.some(text => /终面/.test(text))) return { ratio: 0.7, label: '进入终面' };
  if (matchingRecruitment.some(text => /面试|流程/.test(text))) return { ratio: 0.5, label: '具有面试经历' };
  if (matchingRecruitment.some(text => /简历/.test(text))) return { ratio: 0.25, label: '通过简历' };
  if (textIncludesConcept(profile.internships || [], wanted)) return { ratio: 0.2, label: '具有相关实习' };
  if (textIncludesConcept(profile.careerTags || [], wanted)) return { ratio: 0.2, label: '具有相关经历' };
  return { ratio: 0, label: '' };
}

function evidenceMatch(requested, profile) {
  if (!requested.length) return { ratio: 0, label: '', concept: null };
  const candidateConcepts = profileConcepts(profile, 'career');
  const values = requested.map(wanted => {
    const evidence = strongestEvidence(profile, wanted);
    return { wanted, label: evidence.label, ratio: evidence.ratio * relation(wanted, candidateConcepts) };
  });
  const strongest = [...values].sort((a, b) => b.ratio - a.ratio)[0];
  return {
    ratio: values.reduce((sum, item) => sum + item.ratio, 0) / values.length,
    label: strongest?.label || '',
    concept: strongest?.wanted || null,
  };
}

function directTerms(profile, query) {
  const tokens = String(query || '').toLowerCase().split(/[\s,，、/]+/)
    .filter(token => normalize(token).length > 1);
  const text = normalize([
    ...fieldsFor(profile, 'career'),
    ...fieldsFor(profile, 'education'),
    ...fieldsFor(profile, 'consult'),
  ].join(' '));
  return tokens.filter(token => text.includes(normalize(token)));
}

function completeness(profile) {
  return [
    profile.headline,
    profile.education,
    profile.summary,
    profile.insights?.length,
    profile.consultTags?.length,
  ].filter(Boolean).length;
}

function primaryGroup(profile) {
  return profileConcepts(profile, 'career')[0]?.group || 'other';
}

function homeProfiles() {
  const queues = new Map();
  for (const profile of profiles) {
    const group = primaryGroup(profile);
    if (!queues.has(group)) queues.set(group, []);
    queues.get(group).push(profile);
  }

  const result = [];
  while ([...queues.values()].some(queue => queue.length)) {
    for (const queue of queues.values()) {
      const profile = queue.shift();
      if (profile) result.push({ profile, score: 0, reasons: [] });
    }
  }
  return result;
}

export function rankProfiles(query = '') {
  const value = String(query || '').trim();
  if (!value) return homeProfiles();

  const idMatch = value.match(/#?(\d{3})/);
  if (idMatch) {
    const exact = profiles.find(profile => profile.id === idMatch[1]);
    if (exact) return [{ profile: exact, score: 100, reasons: [`投稿编号 #${exact.id} 精确匹配`] }];
  }

  const found = concepts(value);
  const careerRequested = found.filter(item => item.dimension === 'career');
  const educationRequested = found.filter(item => item.dimension === 'education');
  const consultRequested = found.filter(item => item.dimension === 'consult');

  return profiles.map(profile => {
    const direction = dimensionMatch(careerRequested, profile, 'career');
    const evidence = evidenceMatch(careerRequested, profile);
    const education = dimensionMatch(educationRequested, profile, 'education');
    const consult = dimensionMatch(consultRequested, profile, 'consult');
    const direct = directTerms(profile, value);
    const activeDimensions = [];
    if (careerRequested.length) activeDimensions.push([direction.ratio, 40], [evidence.ratio, 30]);
    if (educationRequested.length) activeDimensions.push([education.ratio, 15]);
    if (consultRequested.length) activeDimensions.push([consult.ratio, 15]);

    const possible = activeDimensions.reduce((sum, [, weight]) => sum + weight, 0);
    const earned = activeDimensions.reduce((sum, [ratio, weight]) => sum + ratio * weight, 0);
    const score = possible ? Math.round((earned / possible) * 1000) / 10 : (direct.length ? 100 : 0);
    const reasons = [];
    if (direction.ratio > 0) reasons.push(`方向匹配：${careerRequested.slice(0, 2).map(item => item.name).join('、')}`);
    if (evidence.ratio > 0 && evidence.label) reasons.push(`${evidence.label}：${evidence.concept?.name || '相关方向'}`);
    if (education.ratio > 0) reasons.push(`背景匹配：${educationRequested.slice(0, 2).map(item => item.name).join('、')}`);
    if (consult.ratio > 0) reasons.push(`可以聊：${consultRequested.slice(0, 2).map(item => item.name).join('、')}`);
    if (!reasons.length && direct.length) reasons.push(`经历提及：${direct.slice(0, 2).join('、')}`);

    return {
      profile,
      score,
      reasons: reasons.slice(0, 3),
      exactCount: direction.exact + education.exact + consult.exact,
      evidenceRatio: evidence.ratio,
      consultRatio: consult.ratio,
      completeness: completeness(profile),
    };
  }).filter(item => item.score > 0).sort((a, b) => (
    b.score - a.score
    || b.exactCount - a.exactCount
    || b.evidenceRatio - a.evidenceRatio
    || b.consultRatio - a.consultRatio
    || b.completeness - a.completeness
    || Number(a.profile.id) - Number(b.profile.id)
  ));
}
