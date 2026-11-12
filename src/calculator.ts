// Clan Immortal calculation logic for Clicker Heroes.
// Kept separate from the UI so it can be tested on its own.

export type MemberClass = "None" | "Mage" | "Priest" | "Rogue";
export type Weakness = "None" | "Arcane" | "Holy" | "Physical";

export const MEMBER_CLASSES: readonly MemberClass[] = ["None", "Mage", "Priest", "Rogue"];
export const WEAKNESSES: readonly Weakness[] = ["None", "Arcane", "Holy", "Physical"];

export const MAX_MEMBERS = 10;
export const MAX_CLASS_LEVEL = 150;
/** Most clicks the clan can land on one Immortal (60 CPS for 15 seconds). */
export const MAX_CLICKS = 900;
export const FIGHT_SECONDS = 15;
/** How many of the highest reachable Immortal levels to report. */
export const RESULTS_TO_SHOW = 5;

/** The class that does bonus damage against each weakness. */
export const BONUS_CLASS: Record<Weakness, MemberClass | null> = {
  None: null,
  Arcane: "Mage",
  Holy: "Priest",
  Physical: "Rogue",
};

const BASE_DAMAGE = 10;
const BONUS_DAMAGE = 12.5;
/** Extra damage the bonus class does against its weakness, as a percentage (25). */
export const BONUS_PERCENT = (BONUS_DAMAGE / BASE_DAMAGE - 1) * 100;
const HEALTH_BASE = 1750;

export interface ClanMember {
  level: number | undefined;
  memberClass: MemberClass;
}

export interface ImmortalResult {
  immortalLevel: number;
  clicksNeeded: number;
}

/** Immortal health at a given level (levels below 7 follow their own pattern). */
export function immortalHealth(immortalLevel: number): number {
  const multiplier =
    immortalLevel < 7
      ? immortalLevel + (immortalLevel % 4) - Math.ceil(immortalLevel / 3)
      : 2 * ((immortalLevel - 1) % 3) + 3;
  return HEALTH_BASE * multiplier * Math.pow(3, Math.ceil(immortalLevel / 3));
}

/** One member's damage per click against an Immortal with the given weakness. */
export function memberDamagePerClick(level: number, memberClass: MemberClass, weakness: Weakness): number {
  const damage = BONUS_CLASS[weakness] === memberClass ? BONUS_DAMAGE : BASE_DAMAGE;
  return damage * Math.pow(3, level - 1);
}

function isValidLevel(level: number | undefined): level is number {
  return level !== undefined && Number.isFinite(level) && level >= 1;
}

/** Total clan damage per click against the given weakness; empty slots are ignored. */
export function clanDamagePerClick(members: readonly ClanMember[], weakness: Weakness): number {
  return members.reduce(
    (total, member) =>
      isValidLevel(member.level) ? total + memberDamagePerClick(member.level, member.memberClass, weakness) : total,
    0
  );
}

/** Highest class level in the clan, or 0 if no levels are entered. */
export function highestMemberLevel(members: readonly ClanMember[]): number {
  return members.reduce((highest, member) => (isValidLevel(member.level) ? Math.max(highest, member.level) : highest), 0);
}

/**
 * Fewest clicks whose total damage reaches the health. The division can land a hair
 * off a whole number (e.g. 140.0000000001), so the result is checked by multiplying back.
 */
function clicksToKill(health: number, damagePerClick: number): number {
  let clicks = Math.ceil(health / damagePerClick);
  if ((clicks - 1) * damagePerClick >= health) clicks--;
  else if (clicks * damagePerClick < health) clicks++;
  return clicks;
}

/**
 * The highest Immortal levels the clan can kill within MAX_CLICKS, highest first.
 * Searching starts at 3L - 10 (L = highest member level): every level below that
 * is easily reachable, so starting there skips work without changing the top results.
 */
export function topReachableImmortals(damagePerClick: number, highestLevel: number): ImmortalResult[] {
  const results: ImmortalResult[] = [];
  if (damagePerClick <= 0) return results;

  const maxDamage = MAX_CLICKS * damagePerClick;
  for (let immortalLevel = Math.max(1, 3 * highestLevel - 10); ; immortalLevel++) {
    const health = immortalHealth(immortalLevel);
    if (health > maxDamage) break;
    results.unshift({ immortalLevel, clicksNeeded: clicksToKill(health, damagePerClick) });
    if (results.length > RESULTS_TO_SHOW) results.pop();
  }
  return results;
}

/** Clicks per second needed to land the given number of clicks during the fight. */
export function clicksPerSecond(clicks: number): number {
  return Math.round((clicks / FIGHT_SECONDS) * 100) / 100;
}

export function calculateClanResults(members: readonly ClanMember[]): Record<Weakness, ImmortalResult[]> {
  const highestLevel = highestMemberLevel(members);
  const results = {} as Record<Weakness, ImmortalResult[]>;
  for (const weakness of WEAKNESSES) {
    results[weakness] = topReachableImmortals(clanDamagePerClick(members, weakness), highestLevel);
  }
  return results;
}
