# 🧮 Clan Immortal Level Calculator

This is a web-based calculator to determine the maximum **Immortal levels** your clan can reach in *Clicker Heroes*, based on each member’s level and class.

You can try the app here:  
🔗 [https://mesa-bot.github.io/clan-calc/](https://mesa-bot.github.io/clan-calc/)

---

## 📦 Features

- Input up to 10 clan members' **level** and **class**
- Outputs the 3 most powerful **Immortal levels** your clan can reach per weakness type
- Shows **CPS** (clicks per second) and raw clicking equivalents

---

## 🧪 Usage

1. Enter each player's **level** in the empty box
2. Select their **class** from the dropdown list
3. Press **"Calculate"** to view results

---

## 🧾 Patch Notes

1.0.0 

Release


1.0.1

Fixed typo in instructions, changed "may" to "must"
regarding entering member classes, as a lazy fix for
an error when entering a clan member without a class.

Fixed formatting inconsistency in output.


1.0.2

Reverted lazy fix from 1.0.1, and properly fixed the issue,
allowing members to be entered without classes.

Remembered patch notes are a thing and filled in 1.0.1's notes
because I forgot to do that earlier


1.1.0

Corrected immortal health calculation for level < 7 (curse you, clicker heroes wiki)

Adjusted MAX class level to 150 to prevent users from entering absurd numbers and crashing their browsers.

Made Class level inputs empty by default.

We have an actual webpage now and it's
### **P U R P L E**


1.1.1

Upgraded reported CPS precision to 2 decimal places.

Fixed inconsistency in class order between the dropdown list and the results panels. Really just an OCD fix tbh.

Renamed 1.0.3 to 1.1.0 because getting a webpage was a pretty major update

Minor change to the colour of the title to match the rest of the text on the page

Added Darkmode
---

## 🙏 Credits

Calculator originally created by **Nikki**  
Please report any errors or bugs to them on Discord:  
`@supermariooddity`

Webpage created by **Huang Bao**

---

## 🚀 Development

This app was rebuilt using **React + TypeScript**, with clean vanilla styling and GitHub Pages deployment.

To run locally:

```bash
npm install
npm start
