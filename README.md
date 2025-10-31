# HorizontalReading
Collection of one click scripts (bookmarklets) to make reading experience 10x better.



## Supported Websites
- [**Asuracomic Bookmark**](asura_horizontal_bookmark.js)
- [**MangaKatana Bookmark**](mangakatana_horizontal_bookmark_v2.js) 

---
# How to Use

[Tutorial GIF](HowToDo.gif)

 1. Copy the entire **code** from the chosen website's bookmarklet file (e.g., `asura_horizontal_bookmark.js` , `mangakatana_horizontal_bookmark_v2.js`).
 2. Create a new **Browser Bookmark**: - Right-click your toolbar → Add Bookmark → Paste the code into the URL field.
 3. Open a **manhwa chapter** on the supported site.
 4. Click your newly created bookmark to run the script.
 5. Click twice on the panels to mark the start and end (the images you want to rotate horizontally).
  
  If it breaks, refresh the page and run the bookmarklet again.

## Using Presets (New Feature)

You can now **save** your custom panel rotations as presets, which include selected images and rotation directions. These presets can be shared and loaded, making it easier to revisit or share your preferred layouts.

### How to Save Presets

- After selecting and rotating panels, click the **Save** button.
- The current preset data is **copied** to your clipboard.
- You can paste this text anywhere, e.g., comment sections, chat, or notes, to share with others.

### How to Load Presets

- Click the **Load** button.
- Paste the copied preset.


- (Planned) Site, manga, and chapter IDs for future automation. possibly an api to autoload presets

Share your specific layouts with friends or reuse them later without manual re-selection.



## Features

- Rotate reading panels horizontally.
- Change rotation direction.
- Undo rotations to restore original layout.
- One-click setup for each page load or new chapter.
- Save and load **presets** (new feature).
- Start script on each refresh or next chapter

---



# To Do 
 - examples
 - different websites ( apart from Asura, MangaKatana ) 
 - zoom for super long panels
 - Make it persistent accross chapters



# Extra
If you have problems or want help, join the Discord
[https://discord.gg/FdN9NsSZ](https://discord.gg/FdN9NsSZ)
 

### More info
 - https://gist.github.com/caseywatts/c0cec1f89ccdb8b469b1    ( read up on bookmarklets ) 
 - https://caiorss.github.io/bookmarklet-maker/   (just paste js code, generate and drag to bookmarks bar)

The raw bookmarks look like that because they are URL-encode to be usable as a bookmarklet. You can test it yourself by copying the code from asuracomic_horizontal_v3.js and put in encodeURIComponent 
