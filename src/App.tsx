import { useEffect, useState } from "react";
import './index.css';

function calculateHealth(level: number): number {
  let p = level < 7 ? level + (level % 4) - Math.ceil(level / 3) : 2 * ((level - 1) % 3) + 3;
  return 1750 * p * Math.pow(3, Math.ceil(level / 3));
}

function calculateDpc(level: number, cls: string, type: "Holy" | "Arcane" | "Physical" | "None") {
  const base = 10 * Math.pow(3, level - 1);
  const bonus = 12.5 * Math.pow(3, level - 1);
  if (type === "Holy" && cls === "P") return bonus;
  if (type === "Arcane" && cls === "M") return bonus;
  if (type === "Physical" && cls === "R") return bonus;
  return base;
}

interface ImmoData {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  g: number;
  h: number;
  i: number;
  j: number;
}

function maxImmo(dpc: number): ImmoData {
  let a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
  let x = Math.max(1,3 * maxLevel - 10);
  while (calculateHealth(x) <= 900 * dpc) {
    for (let n = 0; n <= 900; n++) {
      const health = calculateHealth(x);
      if (health <= n * dpc && health > (n - 1) * dpc) {
        h = g;
        g = c;
        c = b;
        b = a;
        a = x;
        
        j = i;
        i = f;
        f = e;
        e = d;
        d = n;
      }
    }
    x++;
  }
  return { a, b, c, g, h, d, e, f, i, j };
}

function toCps(clicks: number) {
  return Math.round((clicks / 15) * 100) / 100;
}

function pve(x: number) {
  return Math.max(0, Math.round((-30 + x / 15) * 100) / 100);
}

export default function ClanCalculator() {
  const [players, setPlayers] = useState<{ level: number | undefined; cls: string }[]>(
    Array.from({ length: 10 }, () => ({ level: undefined, cls: "N" }))
  );
  const [results, setResults] = useState<{
    dpcs: Record<string, number>;
    immo: Record<string, ImmoData>;
  } | null>(null);

 //handle color switch
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "purple";
  });
  useEffect(() => {
    document.body.style.backgroundColor = theme === "purple" ? "#16004a" : "#3c3c3c";
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "purple" ? "gray" : "purple";
    setTheme(newTheme);
  localStorage.setItem("theme", newTheme);
};

  const handleChange = (index: number, field: "level" | "cls", value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = {
      ...newPlayers[index],
      [field]: field === "level"
        ? value === "" ? undefined : Math.min(parseInt(value), 150)
        : value,
    };
    setPlayers(newPlayers);
  };

  const styles = {
    bg: theme === "purple" ? "#1e004e" : "#1e1e1e",
    card: theme === "purple" ? "#310142" : "#252526",     
    input: theme === "purple" ? "#580078" : "#1e1e1e",  
    text: theme === "purple" ? "#ffcecd" : "#d4d4d4",     
    border: theme === "purple" ? "#7795cf" : "#3c3c3c",
  };

  const handleCalculate = () => {
    let dpcs = { None: 0, Arcane: 0, Holy: 0, Physical: 0 };
    let maxLevel = 0
    for (let i = 0; i < players.length; i++) {
      const level = players[i].level;
      maxLevel = Math.max(level, maxLevel)
      const cls = players[i].cls.toUpperCase();
      for (const type of ["None", "Arcane", "Holy", "Physical"] as const) {
        if (!level || isNaN(level)) continue;
        dpcs[type] += calculateDpc(level, cls, type);
      }
    }

    const immo = {
      None: maxImmo(dpcs.None),
      Arcane: maxImmo(dpcs.Arcane),
      Holy: maxImmo(dpcs.Holy),
      Physical: maxImmo(dpcs.Physical),
    };

    setResults({ dpcs, immo });
  };

  return (
    
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: styles.bg, borderRadius: '10px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={toggleTheme}
          style={{
          padding: '6px 12px',
          backgroundColor: styles.card,
          color: "white",
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
          }}
        >
          Switch to {theme === "purple" ? "Dark" : "Purple"} Theme
        </button>
</div>

      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: styles.text }}>Clan Immortal Level Calculator</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px', maxWidth: '640px', margin: '0 auto' }}>
        {players.map((player, index) => (
          <div
            key={index}
            style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: styles.card, padding: '10px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(54,1,125,0.1)' }}
          >
            <label style={{ fontWeight: 'bold', color: styles.text}}>#{index + 1}</label>
            <input
              type="number"
              min="1"
              max="150"
              value={player.level ?? ""}
              
              onChange={(e) => handleChange(index, "level", e.target.value ? e.target.value : "")}
              placeholder="Class Level"
              className="no-arrows"
              style={{ width: '60px', padding: '4px', backgroundColor: styles.input, color: styles.text, border: 'none' }}
            />
            <select
              value={player.cls}
              onChange={(e) => handleChange(index, "cls", e.target.value)}
              style={{ padding: '4px', backgroundColor: styles.input, color: styles.text, borderColor: styles.border }}
            >
              <option value="N">None</option>
              <option value="M">Mage</option>
              <option value="P">Priest</option>
              <option value="R">Rogue</option>
            </select>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', color: styles.text, borderColor: styles.border }}>
        <button
          onClick={handleCalculate}
          style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: styles.card, color: styles.text , border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Calculate
        </button>
      </div>

      {results && (
        <div style={{ marginTop: '30px' }}>
          {Object.entries(results.immo).map(([type, data]: [string, ImmoData]) => (
            <div key={type} style={{ marginBottom: '20px', backgroundColor: styles.card, padding: '10px 20px', borderRadius: '6px' }}>
              <h2 style={{ borderBottom: '1px solid', paddingBottom: '6px', color: styles.text, borderColor: styles.border}}>Weak to {type}</h2>
              <ul style={{ color: styles.text }}>
                <li>{data.a} @ {toCps(data.d)} CPS (raw with 3 ACs: {pve(data.d)} CPS)</li>
                <li>{data.b} @ {toCps(data.e)} CPS (raw with 3 ACs: {pve(data.e)} CPS)</li>
                <li>{data.c} @ {toCps(data.f)} CPS (raw with 3 ACs: {pve(data.f)} CPS)</li>
                <li>{data.g} @ {toCps(data.i)} CPS (raw with 3 ACs: {pve(data.i)} CPS)</li>
                <li>{data.h} @ {toCps(data.j)} CPS (raw with 3 ACs: {pve(data.j)} CPS)</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
