# 🧮 Clan Immortal Level Calculator

This is a web-based calculator to determine the maximum **Immortal levels** your clan can reach in *Clicker Heroes*, based on each member’s level and class (Physical, Arcane, Holy, or None).

You can try the app here:  
🔗 [https://mesa-bot.github.io/clan-calc/](https://mesa-bot.github.io/clan-calc/)

---

## 📦 Features

- Input up to 10 clan members' **level** and **class**
- Calculates **DPC (damage per click)** values by class type
- Outputs the 3 most powerful **Immortal levels** your clan can reach per weakness type
- Shows **CPS** (clicks per second) and raw clicking equivalents
- Responsive, clean interface – no external styling frameworks required

---

## 🧪 Usage

1. Enter each player's **level** (1+)
2. Select their class:
   - `P` for Holy
   - `M` for Arcane
   - `R` for Physical
   - `N` for None
3. Press **"Calculate"** to view results

---

## 🧾 Patch Notes

1.0.0 - Release

1.0.1

Fixed typo in instructions, changed "may" to "must"
regarding entering member classes, as a lazy fix for
an error when entering a clan member without a class.

Fixed formatting inconsistency in output

1.0.2

Reverted lazy fix from 1.0.1, and
Properly fixed issue allowing members to be entered without classes.

Remembered patch notes are a thing and filled in 1.0.1's notes
because i forgot to do that earlier

1.0.3

Corrected immortal health calculation for level < 7
(curse you, clicker heroes wiki)

**P U R P L E**

---

## 🙏 Credits

Calculator originally created by **Nikki**  
Please report any errors or bugs to them on Discord:  
`@supermariooddity`

---

## 🚀 Development

This app was rebuilt using **React + TypeScript**, with clean vanilla styling and GitHub Pages deployment.

To run locally:

```bash
npm install
npm start
