import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import {
  calculateClanResults,
  clicksPerSecond,
  ClanMember,
  immortalHealth,
  MAX_MEMBERS,
} from "./calculator";

const clan = (...members: ClanMember[]): ClanMember[] => [
  ...members,
  ...Array.from({ length: MAX_MEMBERS - members.length }, () => ({ level: undefined, memberClass: "None" as const })),
];

test("immortal health matches the known early levels", () => {
  expect([1, 2, 3, 4, 5, 6, 7].map(immortalHealth)).toEqual([5250, 15750, 26250, 31500, 63000, 94500, 141750]);
});

test("empty slots are ignored instead of zeroing every result", () => {
  const results = calculateClanResults(
    clan({ level: 20, memberClass: "None" }, { level: 18, memberClass: "None" }, { level: 15, memberClass: "None" })
  );
  expect(results.None).toEqual([
    { immortalLevel: 56, clicksNeeded: 785 },
    { immortalLevel: 55, clicksNeeded: 471 },
    { immortalLevel: 54, clicksNeeded: 367 },
    { immortalLevel: 53, clicksNeeded: 262 },
    { immortalLevel: 52, clicksNeeded: 157 },
  ]);
});

test("a matching class only boosts its own weakness", () => {
  const results = calculateClanResults(clan({ level: 20, memberClass: "Mage" }));
  expect(results.Arcane[0].clicksNeeded).toBeLessThan(results.None[0].clicksNeeded);
  expect(results.Holy).toEqual(results.None);
  expect(results.Physical).toEqual(results.None);
});

test("an empty clan reaches nothing", () => {
  expect(calculateClanResults(clan()).None).toEqual([]);
});

test("clicks per second rounds to 2 decimal places", () => {
  expect(clicksPerSecond(785)).toBe(52.33);
});

test("the page shows results as soon as a level is entered", () => {
  render(<App />);
  expect(screen.getByText("No members yet")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("#1"), { target: { value: "20" } });
  const noneCard = screen.getByText("No weakness").closest("article") as HTMLElement;
  expect(within(noneCard).getAllByRole("row")).toHaveLength(6); // header + 5 results
  expect(screen.getByText("1/10")).toBeInTheDocument();
});

test("clear empties every member", () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText("#1"), { target: { value: "20" } });
  fireEvent.click(screen.getByText("Clear"));
  expect((screen.getByLabelText("#1") as HTMLInputElement).value).toBe("");
  expect(screen.getByText("No members yet")).toBeInTheDocument();
});

test("levels above the cap are clamped", () => {
  render(<App />);
  const input = screen.getByLabelText("#1") as HTMLInputElement;
  fireEvent.change(input, { target: { value: "9999" } });
  expect(input.value).toBe("150");
});
