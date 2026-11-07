import type { MenuItem } from '@/lib/menu-data'
import type { Locale } from '@/lib/menu-i18n'
import { itemLabel } from '@/lib/menu-i18n'
import { mergeSearchKeywords } from '@/lib/menu-item-search-defaults'

/**
 * Language-level query expansions (not tied to specific menu IDs).
 * Owners can add dish-specific nicknames in Payload → Suchbegriffe.
 */
const QUERY_SYNONYMS: Record<string, string[]> = {
  halbes: ['halb', '1/2', 'halbe', 'hälfte'],
  halbe: ['halb', '1/2', 'hälfte'],
  hälfte: ['halb', '1/2', 'halbe'],
  halb: ['1/2'],
  haehnchen: ['hahnchen', 'chicken'],
  hahnchen: ['chicken'],
  chicken: ['hahnchen'],
  pommes: ['frites'],
  frites: ['pommes'],
  cola: ['coca'],
}

export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9/\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function compact(text: string): string {
  return normalizeSearchText(text).replace(/\s/g, '')
}

export function normalizeItemIdQuery(q: string): string | null {
  const stripped = q.replace(/^#/, '').trim()
  if (!/^\d+$/.test(stripped)) return null
  return String(parseInt(stripped, 10))
}

function expandToken(token: string): string[] {
  const base = normalizeSearchText(token)
  if (!base) return []
  const set = new Set<string>([base, compact(token)])
  for (const syn of QUERY_SYNONYMS[base] ?? []) {
    set.add(normalizeSearchText(syn))
    set.add(compact(syn))
  }
  // Common fast typing: „hae“ → „hah“, „grillhae“ split handled by multi-token
  if (base.length >= 3 && base.endsWith('e')) {
    set.add(base.slice(0, -1))
  }
  return [...set].filter(Boolean)
}

function isCharSubsequence(needle: string, hay: string): boolean {
  if (!needle) return true
  let j = 0
  for (let i = 0; i < hay.length && j < needle.length; i++) {
    if (hay[i] === needle[j]) j++
  }
  return j === needle.length
}

/** Short query vs long compound name (e.g. „knobi“ → „Knoblauchbrot“) — title words only. */
function abbreviationMatches(token: string, word: string): boolean {
  if (word.length < 3 || token.length < 3) return false
  if (word.startsWith(token)) return true
  if (token.length < 4) return false
  for (let cut = 3; cut <= Math.min(token.length, word.length); cut++) {
    if (!word.startsWith(token.slice(0, cut))) continue
    if (isCharSubsequence(token.slice(cut), word.slice(cut))) return true
  }
  return false
}

type Haystack = { loose: string; compact: string; words: string[] }

function buildHaystack(parts: (string | undefined)[]): Haystack {
  const loose = normalizeSearchText(parts.filter(Boolean).join(' '))
  const words = loose.split(' ').filter(Boolean)
  return { loose, compact: loose.replace(/\s/g, ''), words }
}

function buildHaystacks(item: MenuItem, locale: Locale): {
  title: Haystack
  description: Haystack
} {
  const { name, desc } = itemLabel(item, locale)
  const titleParts = [
    item.id,
    item.name,
    name,
    item.badge,
    ...(mergeSearchKeywords(item.id, item.searchKeywords) ?? []),
  ]
  return {
    title: buildHaystack(titleParts),
    description: buildHaystack([item.desc, desc]),
  }
}

/** e.g. "knoblauch" + "brot" → "knoblauchbrot" */
function tokensAppearInOrder(tokens: string[], haystack: Haystack): boolean {
  let pos = 0
  for (const token of tokens) {
    const variants = expandToken(token).map(v => v.replace(/\s/g, '')).filter(v => v.length >= 2)
    if (variants.length === 0) return false
    let found = false
    for (const v of variants) {
      const idx = haystack.compact.indexOf(v, pos)
      if (idx !== -1) {
        pos = idx + v.length
        found = true
        break
      }
    }
    if (!found) return false
  }
  return true
}

function tokenMatchesHaystack(
  token: string,
  haystack: Haystack,
  options?: { allowAbbreviation?: boolean; descMode?: boolean },
): boolean {
  const variants = expandToken(token)
  for (const v of variants) {
    if (!v) continue
    const vCompact = v.replace(/\s/g, '')
    if (!options?.descMode && vCompact.length >= 2 && haystack.compact.includes(vCompact)) {
      return true
    }
    if (!options?.descMode && haystack.loose.includes(v)) return true
    if (v.length >= 2) {
      for (const word of haystack.words) {
        if (options?.descMode) {
          if (word.startsWith(v) && word.length - v.length <= 2) return true
          continue
        }
        if (word.startsWith(v)) return true
        if (options?.allowAbbreviation && abbreviationMatches(v, word)) return true
        if (v.length >= 4 && word.includes(vCompact)) return true
      }
    }
  }
  return false
}

function haystackMatches(
  haystack: Haystack,
  tokens: string[],
  rawQuery: string,
  options?: { allowAbbreviation?: boolean; descMode?: boolean },
): boolean {
  const qCompact = compact(rawQuery)
  if (!options?.descMode && qCompact.length >= 4 && haystack.compact.includes(qCompact)) {
    return true
  }

  if (tokens.length >= 2 && tokensAppearInOrder(tokens, haystack)) return true

  return tokens.every(token => tokenMatchesHaystack(token, haystack, options))
}

/**
 * Multi-word queries match name/keywords first (avoids incidental desc hits).
 * Single-word queries also search descriptions.
 */
export function itemMatchesSearch(item: MenuItem, rawQuery: string, locale: Locale): boolean {
  const q = rawQuery.trim()
  if (!q) return false

  const idNorm = normalizeItemIdQuery(q)
  if (idNorm && item.id === idNorm) return true

  const tokens = normalizeSearchText(q).split(' ').filter(Boolean)
  if (tokens.length === 0) return false

  const { title, description } = buildHaystacks(item, locale)

  if (haystackMatches(title, tokens, q, { allowAbbreviation: true })) return true
  if (tokens.length === 1 && haystackMatches(description, tokens, q, { descMode: true })) {
    return true
  }

  return false
}
