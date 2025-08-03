import { useState } from "react";

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
}

function maxImmo(dpc: number): ImmoData {
  let a = 0, b = 0, c = 0, d = 0, e = 0, f = 0;
  let x = 1;
  while (calculateHealth(x) <= 900 * dpc) {
    for (let n = 0; n <= 900; n++) {
      const health = calculateHealth(x);
      if (health <= n * dpc && health > (n - 1) * dpc) {
        c = b;
        b = a;
        a = x;
        f = e;
        e = d;
        d = n;
      }
    }
    x++;
  }
  return { a, b, c, d, e, f };
}

function toCps(clicks: number) {
  return Math.round((clicks / 15) * 10) / 10;
}

function pve(x: number) {
  return Math.max(0, Math.round((-30 + x / 15) * 10) / 10);
}

export default function ClanCalculator() {
  const [players, setPlayers] = useState<{ level: number | undefined; cls: string }[]>(
    Array.from({ length: 10 }, () => ({ level: undefined, cls: "N" }))
  );
  const [results, setResults] = useState<{
    dpcs: Record<string, number>;
    immo: Record<string, ImmoData>;
  } | null>(null);

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

  const handleCalculate = () => {
    let dpcs = { None: 0, Arcane: 0, Holy: 0, Physical: 0 };
    for (let i = 0; i < players.length; i++) {
      const level = players[i].level;
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
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#1e007e', borderRadius: '10px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#ff9bc9' }}>Clan Immortal Level Calculator</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {players.map((player, index) => (
          <div
            key={index}
            style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#310182', padding: '10px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(54,1,143,0.1)' }}
          >
            <label style={{ fontWeight: 'bold', color: '#ffb4ff' }}>#{index + 1}</label>
            <input
              type="number"
              min="1"
              max="150"
              value={player.level ?? ""}

              onChange={(e) => handleChange(index, "level", e.target.value ? e.target.value : "")}
              placeholder="Class Level"
              style={{ width: '60px', padding: '4px', backgroundColor: '#5800a8', color: '#ffcefd', border: 'none' }}
            />
            <select
              value={player.cls}
              onChange={(e) => handleChange(index, "cls", e.target.value)}
              style={{ padding: '4px', backgroundColor: '#5800a8', color: '#ffcefd', borderColor: '#7795ff' }}
            >
              <option value="N">None</option>
              <option value="P">Priest</option>
              <option value="M">Arcane</option>
              <option value="R">Rogue</option>
            </select>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', color: '#ffcefd', borderColor: '7795ff' }}>
        <button
          onClick={handleCalculate}
          style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#5800a8', color: '#fef', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Calculate
        </button>
      </div>

      {results && (
        <div style={{ marginTop: '30px' }}>
          {Object.entries(results.immo).map(([type, data]: [string, ImmoData]) => (
            <div key={type} style={{ marginBottom: '20px', backgroundColor: '#310182', padding: '10px 20px', borderRadius: '6px' }}>
              <h2 style={{ borderBottom: '1px solid #7795ff', paddingBottom: '6px', color: '#ffcefd'}}>Weak to {type}</h2>
              <ul style={{ color: '#ffcefd' }}>
                <li>{data.c} @ {toCps(data.f)} CPS (raw: {pve(data.f)} CPS)</li>
                <li>{data.b} @ {toCps(data.e)} CPS (raw: {pve(data.e)} CPS)</li>
                <li>{data.a} @ {toCps(data.d)} CPS (raw: {pve(data.d)} CPS)</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
