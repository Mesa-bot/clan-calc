import { useEffect, useMemo, useState } from "react";
import {
  BONUS_CLASS,
  BONUS_PERCENT,
  calculateClanResults,
  clicksPerSecond,
  ClanMember,
  FIGHT_SECONDS,
  highestMemberLevel,
  ImmortalResult,
  MAX_CLASS_LEVEL,
  MAX_CLICKS,
  MAX_MEMBERS,
  MEMBER_CLASSES,
  MemberClass,
  Weakness,
  WEAKNESSES,
} from "./calculator";
import "./App.css";

type Theme = "light" | "dark";
const THEME_STORAGE_KEY = "theme";

/** The saved theme, or null to follow the system setting. Older "gray" saves map to dark. */
function loadSavedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light") return "light";
    if (saved === "dark" || saved === "gray") return "dark";
  } catch {
    // Storage can be blocked (e.g. private browsing).
  }
  return null;
}

function systemTheme(): Theme {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The theme just won't be remembered.
  }
}

/** Turns the level box's text into a level, capped so huge numbers can't freeze the page. */
function parseLevel(text: string): number | undefined {
  const level = parseInt(text, 10);
  return Number.isNaN(level) ? undefined : Math.min(level, MAX_CLASS_LEVEL);
}

const emptyClan = (): ClanMember[] =>
  Array.from({ length: MAX_MEMBERS }, () => ({ level: undefined, memberClass: "None" }));

const formatClicks = (clicks: number) => clicks.toLocaleString();
const formatCps = (cps: number) => cps.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ClanCalculator() {
  const [members, setMembers] = useState<ClanMember[]>(emptyClan);
  const [savedTheme, setSavedTheme] = useState<Theme | null>(loadSavedTheme);
  const theme = savedTheme ?? systemTheme();

  useEffect(() => {
    if (savedTheme) document.documentElement.dataset.theme = savedTheme;
    else delete document.documentElement.dataset.theme;
  }, [savedTheme]);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setSavedTheme(next);
    saveTheme(next);
  };

  const updateMember = (index: number, changes: Partial<ClanMember>) => {
    setMembers((current) => current.map((member, i) => (i === index ? { ...member, ...changes } : member)));
  };

  const filledCount = members.filter((member) => member.level !== undefined && member.level >= 1).length;
  const hasMembers = highestMemberLevel(members) > 0;
  const results = useMemo(() => calculateClanResults(members), [members]);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Clan Immortal Calculator</h1>
          <p>The highest Immortals your Clicker Heroes clan can beat, for each weakness.</p>
        </div>
        <button
          className="icon-button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      <main className="layout">
        <section className="panel" aria-labelledby="members-heading">
          <div className="panel-header">
            <h2 id="members-heading">
              Clan members <span className="count">{filledCount}/{MAX_MEMBERS}</span>
            </h2>
            <button className="text-button" onClick={() => setMembers(emptyClan())} disabled={filledCount === 0}>
              Clear
            </button>
          </div>
          <ol className="member-list">
            {members.map((member, index) => (
              <li key={index} className="member">
                <label className="member-number" htmlFor={`member-level-${index}`}>
                  #{index + 1}
                </label>
                <input
                  id={`member-level-${index}`}
                  className="member-level"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max={MAX_CLASS_LEVEL}
                  placeholder="Level"
                  value={member.level ?? ""}
                  onChange={(e) => updateMember(index, { level: parseLevel(e.target.value) })}
                />
                <select
                  className="member-class"
                  aria-label={`Member ${index + 1} class`}
                  value={member.memberClass}
                  onChange={(e) => updateMember(index, { memberClass: e.target.value as MemberClass })}
                >
                  {MEMBER_CLASSES.map((memberClass) => (
                    <option key={memberClass} value={memberClass}>
                      {memberClass === "None" ? "No class" : memberClass}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ol>
          <p className="member-help">Enter each member's class level (max {MAX_CLASS_LEVEL}). Empty rows are skipped.</p>
        </section>

        <section aria-label="Results">
          {hasMembers ? (
            <>
              <div className="results-grid">
                {WEAKNESSES.map((weakness) => (
                  <ResultCard key={weakness} weakness={weakness} immortals={results[weakness]} />
                ))}
              </div>
              <p className="results-note">
                Clicks needed to kill the Immortal (out of {MAX_CLICKS}), and the clicks per second that takes over the{" "}
                {FIGHT_SECONDS}-second fight. The top row is the highest you can reach.
              </p>
            </>
          ) : (
            <div className="panel empty-state">
              <div>
                <strong>No members yet</strong>
                Enter at least one member's level to see which Immortals your clan can beat.
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Calculator by Nikki · Webpage by Huang Bao</p>
        <p>
          Found a bug? Message <code>@supermariooddity</code> on Discord.
        </p>
      </footer>
    </div>
  );
}

function ResultCard({ weakness, immortals }: { weakness: Weakness; immortals: ImmortalResult[] }) {
  const bonusClass = BONUS_CLASS[weakness];
  return (
    <article className="panel result-card">
      <div className="panel-header">
        <span className="weakness-dot" data-weakness={weakness} aria-hidden="true" />
        <h2>{weakness === "None" ? "No weakness" : `Weak to ${weakness}`}</h2>
        {bonusClass && (
          <span className="bonus-tag">
            {bonusClass} +{BONUS_PERCENT}%
          </span>
        )}
      </div>
      {immortals.length === 0 ? (
        <p className="no-results">No reachable Immortals.</p>
      ) : (
        <table className="result-table">
          <thead>
            <tr>
              <th scope="col">Immortal</th>
              <th scope="col">Clicks</th>
              <th scope="col">CPS</th>
            </tr>
          </thead>
          <tbody>
            {immortals.map(({ immortalLevel, clicksNeeded }) => (
              <tr key={immortalLevel}>
                <td>{immortalLevel}</td>
                <td className="muted">{formatClicks(clicksNeeded)}</td>
                <td>{formatCps(clicksPerSecond(clicksNeeded))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
