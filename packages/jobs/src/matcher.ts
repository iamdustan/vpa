export interface JobCriteria {
  include: string[];
  exclude: string[];
  entryLevel: string[];
}

export const GLOBAL_CRITERIA: JobCriteria = {
  include: [
    'clinical specialist',
    'clinical spec',
    'clinical support',
    'procedural specialist',
    'field inventory analyst',
    'mapping specialist',
    'mapping spec',
    'clinical representative',
  ],
  exclude: [
    'research',
    'marketing',
    'software',
    'senior',
    'sr ',
    'sr.',
    'principal',
    'prin ',
    'manager',
    'accounting',
    'treasury',
    'receivable',
    'thailand',
    'neuro',
    'leadless',
    'affera', // We filter out Affera as it's a specific sub-brand handled differently
  ],
  entryLevel: [
    'associate',
    'in training',
    'trainee',
    'assoc',
  ],
};

export const CATEGORY_KEYWORDS = {
  crm: ['crm', 'cardiac rhythm', 'pacemaker', 'defibrillator'],
  cas: ['cas', 'cardiac ablation', 'electrophysiology', 'ep '],
};

export function isRelevantJob(title: string): boolean {
  const t = title.toLowerCase();

  // 1. Check for explicit exclusions
  if (GLOBAL_CRITERIA.exclude.some(word => t.includes(word))) {
    return false;
  }

  // 2. Check for entry-level "In Training" roles (high priority)
  const isInTraining = GLOBAL_CRITERIA.entryLevel.some(word => t.includes(word));
  
  // 3. Check for core roles
  const isCoreRole = GLOBAL_CRITERIA.include.some(word => t.includes(word));
  
  // 4. Check for category relevance
  const isCRM = CATEGORY_KEYWORDS.crm.some(word => t.includes(word));
  const isCAS = CATEGORY_KEYWORDS.cas.some(word => t.includes(word));
  const isFieldInventory = t.includes('field inventory analyst');

  // Logic: 
  // - Entry level roles must still be relevant to CRM/CAS/Mapping
  // - Core roles (Clinical Specialist, Mapping, etc) should be highly relevant.
  // - We'll be slightly more permissive for "Field Clinical Specialist"
  if (isFieldInventory) return true;

  if (isInTraining || isCoreRole) {
    // If it's a generic "Field Clinical Specialist" or similar, we want it
    if (t.includes('field clinical specialist') || t.includes('field procedural specialist')) {
      return true;
    }
    return isCRM || isCAS || t.includes('mapping');
  }

  return false;
}
