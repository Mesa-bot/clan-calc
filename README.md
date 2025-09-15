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

Corrected immortal health calculation for level < 7. Curse you, clicker heroes wiki!

Adjusted max class level to 150 to prevent users from entering absurd numbers and crashing their browsers.

Made Class level inputs empty by default.

We have an actual webpage now and it's
**P U R P L E**

1.1.1

Upgraded reported CPS precision to 2 decimal places.

Fixed inconsistency in class order between the dropdown list and the results panels. Really just an OCD fix tbh.

Renamed 1.0.3 to 1.1.0 because getting a webpage was a pretty major update.

Minor change to the colour of the title to match the rest of the text on the page.

1.1.2

Added Dark Mode which is more easily viewable for people with colour blindness (and frankly for everyone else too)

Fixed UI on mobile devices extending past the background elements due to being too wide. The mobile UI now has everything in one column rather than two.

1.1.3

Fixed raw CPS only displaying one decimal place of precision.

1.1.4

Inverted the display order of immortal results and clarified the meaning of "raw CPS" to "raw CPS with 3 ACs"

Temporary change to purple theme because I originally designed it with anti-blue filters on. Whoops! All hex values have #000030 subtracted from them until I do a proper recolouring.

Changed the number of displayed results from 3 to 5, to account for people with less than 3 auto-clickers.

1.1.5

Fixed typos in earlier patch notes that I'm sure everyone noticed and cared deeply about.

Major optimisation to the calculator, starting immortal level iterations at 3L-10 instead of at 1, where L is the highest level clan member. This saves up to 95% of iterations in extreme cases, allowing the calculator to work even on a potato connected to the internet with tin cans and a string. (Disclaimer: potatoes cannot run computations, nor can tin cans and a string connect one to the internet)

---

## 🙏 Credits

Calculator originally created by **Nikki**  
Please report any errors or bugs to her on Discord:  
`@supermariooddity`

Webpage created by **Huang Bao**

---

## 🚀 Development

This app was rebuilt using **React + TypeScript**, with clean vanilla styling and GitHub Pages deployment.

To run locally:

```bash
npm install
npm start
