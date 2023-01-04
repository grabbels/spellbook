# Inky's Tantacletastic Spellbook
As I grew more and more annoyed with missing information on the classic D&D 5e spellsheet I started thinking about a possible alternative. And as things go: it got out of hand pretty quickly. Now, this turned into a fully fledged spell-manager for 5e D&D. Very much in progress, check the feature-list and to-do list for current and upcoming planned functionalities!

Play around with the live spellbook here: [spellbook.semhak.dev](https://spellbook.semhak.dev)

Enjoy using this or just appreciate what I do? [Buy me a coffee](https://paypal.me/nielshak)!

## Features
- Save your spells in a grid sorted by spell level
- Manually change the spells order within levels
- Favorite spells
- Add notes to spells
- Export to printable PDF
- Spellbook persists across browser-sessions by saving in local storage
- Filter through your spellbook using different filters and text-based search
- Export/import your spellbook to/from file to transfer it between devices or work on multiple spellbooks. 
- Spells mentioned in descriptions are clickable for a look-up
- Change the look of the spellbook using preset color themes

## To-do
- Improve/fix behaviour on touch devices and smaller screens
- Optimize JS code for better performance
- Adding missing spells to database
- Converting formatting symbols in descriptions to proper HTML
- Making longer descriptions prettier with fold-out/
- Add optional spellslot/sorcery points management functionality
- Adding complete documentation in JS code
- Display options (on/off) for extended properties like materials and components
- Add more color themes
- Order spells using drag and drop 
- Create apps for Android and iOS (with release version)

## Bugs
- many (probably)
You can help me by reporting bugs

## A big thank you to
- [Remix Icons](https://github.com/Remix-Design/remixicon)
- Vorpalhex for the [spells database](https://github.com/vorpalhex/srd_spells) 

## Changelog
*V0.0.1 "much beta"*
- Initial publish/beta version

*V0.0.2 "favorite beta"*
- Added level indicators in PDF export

*V0.0.3 "Swift Quiver"*
- Bug fixes
- Favorites functionality added
- Notes functionality added
- Improved spell search and load speed dramatically by loading the spells database into client memory instead of making calls to the server every action
- PDF export fixed (now works across screen sizes/devices)
- Bigger spell-control buttons on touch devices
- Compacter layout on small screens

## Licensing 
Open Game License v1.0a Copyright 2000, Wizards of the Coast, Inc.

spells.json contains content from the SRD and is restricted and covered by the OGL. You can find the OGL online [here](http://www.opengamingfoundation.org/ogl.html). When using said data, please make sure to conform appropriately with the proper licenses and whatnot.
