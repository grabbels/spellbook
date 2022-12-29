// let filePath = "./spells.json";
// let arrayImport = await import(filePath, {
//   assert: { type: "json" },
// });
// const masterList = masterList.default;

// const names = [];
// fetch("../spells.json")
//   .then((res) => res.json())
//   .then((data) => {
//     let results = data.filter((x) => x.name.toLowerCase().includes("wate".toLowerCase()));
//   });

var searchBox = document.getElementById("spellsearch");
var resultsContainer = document.getElementById("results");
var loadingAnimation = document.getElementById("loading");
var spellLists = document.querySelectorAll("ul.spells");
var prefsButton = document.getElementById("visual_prefs_button");
var prefsPanel = document.getElementById("visual_prefs_panel");
var darkButton = document.getElementById("dark_mode");

if (localStorage.darkMode === "true") {
  darkButton.classList.toggle("active");
  document.documentElement.classList.toggle("dark");
  resultsContainer.classList.toggle("dark");
}

prefsButton.addEventListener("click", () => {
  prefsButton.classList.toggle("active");
  window.document.addEventListener("click", (e) => {
    if (!e.target.closest("#visual_prefs_panel")) {
      // prefsButton.classList.remove("active");
      // window.document.addEventListener('click', (), false)
    }
  });
});

darkButton.addEventListener("click", () => {
  darkButton.classList.toggle("active");
  document.documentElement.classList.toggle("dark");
  resultsContainer.classList.toggle("dark");
  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("darkMode", "true");
  } else {
    localStorage.setItem("darkMode", "false");
  }
});

var activeSpells = [];
if (localStorage.activeSpells) {
  const activeSpells = JSON.parse(localStorage.activeSpells);
  // console.log(activeSpells);
  activeSpells.forEach((e) => {
    addToSheet(e);
  });
  checkUpDownSetOrder();
}

hideShowLevels();

document.querySelector("#clear").addEventListener("click", () => {
  let text = "Are you sure you want to remove all your saved spells?";
  if (confirm(text) == true) {
    localStorage.setItem("activeSpells", "");
    location.reload();
  }
});

function debounce(callback, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      callback.apply(this, args);
    }, wait);
  };
}
var counter = -1;
function createResult(e, val) {
  counter++;
  const result = document.createElement("li");
  result.innerHTML = "<a href='#' data-index='" + val[counter] + "' data-slug='" + e.slug + "'><h3>" + e.name + "</h3><p>" + e.type + "</p></a>";
  resultsContainer.appendChild(result);
  result.addEventListener("click", () => {
    addToSheet(e);
    searchBox.value = "";
  });
}

function bindCloseResultsContainer(e) {
  document.addEventListener("click", (e) => {
    if (e.target instanceof HTMLInputElement === false) {
      resultsContainer.classList.remove("open");
    }
  });
}

function addToSheet(e) {
  // console.log(e)
  if (activeSpells.some((item) => item.name === e.name)) {
    window.alert("This spell is already in your spellbook!");
  } else {
    activeSpells.push(e);
    const spell = document.createElement("li");
    if (e.casting_time === "1 bonus action") {
      var castingTime = "1 bns";
    }
    if (e.description.includes("failed save") || e.description.includes("saving throw")) {
      var savingThrow = "yes";
    } else {
      var savingThrow = "no";
    }
    if (e.description.includes("spell attack")) {
      var spellAttack = "yes";
    } else {
      var spellAttack = "no";
    }
    if (e.higher_levels) {
      var higherLevel = '<p class="higher-level"><span><i class="ai-arrow-up-thick" title="Higher level"></i>upcast</span>' + e.higher_levels + "</p>";
    } else {
      var higherLevel = "";
    }
    if (e.components.materials_needed) {
      var materialsNeeded = '<li class="material hidden"><p><i title="material" class="ai-shipping-box-v1"></i>' + e.components.materials_needed + "</p></li>";
    } else {
      var materialsNeeded = "";
    }
    if (e.ritual === true) {
      var ritual = "yes";
    } else {
      var ritual = "no";
    }
    var components = [];
    if (e.components.verbal === true) {
      components.push("V");
    }
    if (e.components.somatic === true) {
      components.push("S");
    }
    if (e.components.materials_needed) {
      components.push("M");
    }
    if (components.length > 0) {
      var componentsString = components.join(", ");
    }

    var castingTime = e.casting_time;
    spell.classList.add("spell");
    spell.setAttribute("data-time", castingTime);
    spell.setAttribute("data-name", e.name);
    spell.setAttribute("data-range", e.range);
    spell.setAttribute("data-duration", e.duration);
    if (e.level === "cantrip") {
      spell.setAttribute("data-level", e.level);
    } else {
      spell.setAttribute("data-level", e.level.replace(/\D/g, ""));
    }

    spell.innerHTML =
      '<div class="spell_inner"><div class="controls"><a href="#" class="moveup_spell"><span>Move spell up</span><i class="ai-chevron-up"></i></a><a href="#" class="movedown_spell"><span>Move spell down</span><i class="ai-chevron-down"></i></a><a href="#" class="remove_spell"><span>Remove spell</span><i class="ai-cross"></i></a></div><h3><i class="ai-fire" title="' +
      e.school +
      '"></i>' +
      e.name +
      '</h3><ul class="terms large"><li class="casting-time"><p><i title="casting time" class="ai-thunder"></i>' +
      castingTime +
      '</p></li><li class="range"><p><i title="range" class="ai-arrow-up-right"></i>' +
      e.range +
      '</p></li><li class="duration"><p><i title="duration" class="ai-clock"></i>' +
      e.duration +
      '</p></li></ul><ul class="terms small"><li class="school"><p><i title="school" class="ai-book-close"></i>' +
      e.school +
      '</p></li><li class="save"><p><i title="save" class="ai-lifesaver"></i>' +
      savingThrow +
      '</p></li><li class="spell-attack"><p><i title="spell attack" class="ai-sword"></i>' +
      spellAttack +
      '</p></li><li class="components hidden"><p><i title="components" class="ai-language"></i>' +
      componentsString +
      "</p></li>" +
      materialsNeeded +
      '<li class="ritual"><p><i title="ritual" class="pray"></i>' +
      ritual +
      "</p></li></ul><p>" +
      e.description +
      "</p>" +
      higherLevel +
      "</div>";
    if (e.level === "cantrip") {
      var spellLevel = 0;
    } else {
      var spellLevel = e.level;
    }
    
    spellLists[spellLevel].appendChild(spell);
    console.log(activeSpells);
    localStorage.setItem("activeSpells", JSON.stringify(activeSpells));
    hideShowLevels();
    bindRemoveMoveSpell(spell);
  }
}

// function attachOrder() {

// }

function bindRemoveMoveSpell(e) {
  e.querySelector(".remove_spell").addEventListener("click", () => {
    event.preventDefault();
    var thisName = e.getAttribute("data-name");
    var result = activeSpells.filter((x) => x.name !== thisName);
    activeSpells = result;

    localStorage.setItem("activeSpells", JSON.stringify(activeSpells));
    e.remove();
    hideShowLevels();
  });
  e.querySelector(".movedown_spell").addEventListener("click", () => {
    event.preventDefault();
    e.parentNode.insertBefore(e.nextElementSibling, e);
    checkUpDownSetOrder();
  });
  e.querySelector(".moveup_spell").addEventListener("click", () => {
    event.preventDefault();
    e.parentNode.insertBefore(e, e.previousElementSibling);
    checkUpDownSetOrder();
  });
}

function checkUpDownSetOrder() {
  document.querySelectorAll(".spell").forEach((e) => {
    if (e.nextElementSibling) {
      e.querySelector(".movedown_spell").style.display = "inline-block";
    } else {
      e.querySelector(".movedown_spell").style.display = "none";
    }
    if (e.previousElementSibling) {
      e.querySelector(".moveup_spell").style.display = "inline-block";
    } else {
      e.querySelector(".moveup_spell").style.display = "none";
    }
    var index = Array.prototype.indexOf.call(e.parentNode.children, e);
    var level = e.getAttribute("data-level").replace("cantrip", "0");
    e.setAttribute("data-order", level + "-" + index);
  });
  // saveOrder();
}

// function saveOrder() {
//   const activeSpellsOrder = [];
//   document.querySelectorAll(".spell").forEach((e) => {
//     var name = e.getAttribute("data-name");
//     var index = e.getAttribute("data-order");
//     // console.log(name +' - '+ index
//     activeSpellsOrder.push({ index, name });
//   });
//   console.log(activeSpellsOrder);
//   localStorage.setItem("activeSpellsOrder", JSON.stringify(activeSpellsOrder));
// }

function hideShowLevels() {
  spellLists.forEach((e) => {
    if (e.childNodes.length > 0) {
      e.style.display = "grid";
      e.previousElementSibling.style.display = "block";
    } else {
      e.style.display = "none";
      e.previousElementSibling.style.display = "none";
    }
  });
}

searchBox.addEventListener("input", (e) => {
  if (searchBox.value.length > 0) {
    loadingAnimation.classList.add("active");
  }
  if (resultsContainer.innerHTML.length > 0) {
    resultsContainer.innerHTML = "";
  }
});
searchBox.addEventListener(
  "input",
  debounce(() => {
    var query = searchBox.value;
    if (query) {
      fetchSpells(query);
    } else {
      loadingAnimation.classList.remove("active");
    }
  }, 600)
);
// searchBox.addEventListener("click", () => {
//   if (resultsContainer.firstChild) {
//     resultsContainer.classList.add("open");
//   }
// });

function fetchSpells(query) {
  fetch("../spells.json")
    .then((res) => res.json())
    .then((data) => {
      // let results = data.filter((x, index) => x.name.toLowerCase().includes(query.toLowerCase()));
      let results = [];
      let resultsIndex = [];
      data.forEach((e, index) => {
        if (e.name.toLowerCase().includes(query.toLowerCase())) {
          results.push(e);
          resultsIndex.push(index);
        }
      });
      if (results.length > 0) {
        results.forEach((e, index) => {
          createResult(e, resultsIndex);
        });
        loadingAnimation.classList.remove("active");
        resultsContainer.classList.add("open");
        bindCloseResultsContainer();
      } else {
        resultsContainer.innerHTML = "<li><p>No results</p></li>";
        loadingAnimation.classList.remove("active");
        resultsContainer.classList.add("open");
        bindCloseResultsContainer();
      }
    })
    .catch(function (err) {
      // There was an error
      console.warn("Something went wrong.", err);
    });
  // var fetchUrl = "https://api.open5e.com/spells/?search=" + i;
  // fetch(fetchUrl)
  //   .then(function (response) {
  //     // The API call was successful!
  //     return response.json();
  //   })
  //   .then(function (data) {
  //     // This is the JSON from our response
  //     if (data["results"].length > 0) {
  //       data["results"].forEach((e, index) => {
  //         createResult(e);
  //       });
  //       loadingAnimation.classList.remove("active");
  //       resultsContainer.classList.add("open");
  //       bindCloseResultsContainer();
  //     } else {
  //       resultsContainer.innerHTML = "<li><p>No results</p></li>";
  //       loadingAnimation.classList.remove("active");
  //       resultsContainer.classList.add("open");
  //       bindCloseResultsContainer();
  //     }
  //   })
  //   .catch(function (err) {
  //     // There was an error
  //     console.warn("Something went wrong.", err);
  //   });
}

document.querySelector("button").addEventListener("click", () => {
  downloadFile();
});

function downloadFile() {
  let a = document.createElement("a");
  if (typeof a.download !== "undefined") a.download = "spellbook.json";
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(activeSpells)], {
      type: "application/octet-stream",
    })
  );
  a.dispatchEvent(new MouseEvent("click"));

  const reader = new FileReader();

  // var json = JSON.stringify(activeSpells);
  // var blob = new Blob([json], { type: "application/json" });
  // var url = URL.createObjectURL(blob);

  // var a = document.createElement("a");
  // a.download = "backup.json";
  // a.href = url;
  // a.textContent = "Download backup.json";
  // document.body.appendChild(a);
}

// const spellNames = [
//   "Acid Splash",
//   "Alarm",
//   "Animal Friendship",
//   "Bane",
//   "Blade Ward",
//   "Bless",
//   "Burning Hands",
//   "Charm Person",
//   "Chill Touch",
//   "Chromatic Orb",
//   "Color Spray",
//   "Command",
//   "Compelled Duel",
//   "Comprehend Languages",
//   "Create or Destroy Water",
//   "Cure Wounds",
//   "Dancing Lights",
//   "Detect Evil and Good",
//   "Detect Magic",
//   "Detect Poison and Disease",
//   "Disguise Self",
//   "Divine Favor",
//   "Dissonant Whispers",
//   "Druidcraft",
//   "Eldritch Blast",
//   "Ensnaring Strike",
//   "Entangle",
//   "Faerie Fire",
//   "Expeditious Retreat",
//   "False Life",
//   "Feather Fall",
//   "Find Familiar",
//   "Fire Bolt",
//   "Fog Cloud",
//   "Friends",
//   "Goodberry",
//   "Grease",
//   "Guidance",
//   "Guiding Bolt",
//   "Hail of Thorns",
//   "Healing Word",
//   "Hellish Rebuke",
//   "Hex",
//   "Heroism",
//   "Hunter's Mark",
//   "Identify",
//   "Illusory Script",
//   "Inflict Wounds",
//   "Jump",
//   "Light",
//   "Longstrider",
//   "Mage Armor",
//   "Mage Hand",
//   "Magic Missile",
//   "Mending",
//   "Message",
//   "Minor Illusion",
//   "Poison Spray",
//   "Prestidigitation",
//   "Produce Flame",
//   "Protection from Evil and Good",
//   "Purify Food and Drink",
//   "Ray of Frost",
//   "Ray of Sickness",
//   "Remove Curse",
//   "Resistance",
//   "Sacred Flame",
//   "Sanctuary",
//   "Shield of Faith",
//   "Searing Smite",
//   "Shield",
//   "Shillelagh",
//   "Shocking Grasp",
//   "Silent Image",
//   "Sleep",
//   "Spare the Dying",
//   "Speak with Animals",
//   "Thaumaturgy",
//   "Thorn Whip",
//   "Thunderous Smite",
//   "Thunderwave",
//   "True Strike",
//   "Unseen Servant",
//   "Vicious Mockery",
//   "Witch Bolt",
//   "Wrathful Smite",
//   "Aid",
//   "Animal Messenger",
//   "Blindness/Deafness",
//   "Augury",
//   "Calm Emotions",
//   "Hold Person",
//   "Lesser Restoration",
//   "Prayer of Healing",
//   "Silence",
//   "Spiritual Weapon",
//   "Warding Bond",
//   "Animate Dead",
//   "Arcane Eye",
//   "Aura of Life",
//   "Aura of Purity",
//   "Aura Of Vitality",
//   "Banishment",
//   "Beacon of Hope",
//   "Blight",
//   "Bestow Curse",
//   "Blinding Smite",
//   "Blink",
//   "Call Lightning",
//   "Clairvoyance",
//   "Cloud of Daggers",
//   "Compulsion",
//   "Conjure Animals",
//   "Conjure Barrage",
//   "Counterspell",
//   "Create Food and Water",
//   "Crusader's Mantle",
//   "Daylight",
//   "Dispel Magic",
//   "Elemental Weapon",
//   "Fear",
//   "Feign Death",
//   "Fireball",
//   "Fly",
//   "Gaseous Form",
//   "Haste",
//   "Hypnotic Pattern",
//   "Lightning Arrow",
//   "Magic Circle",
//   "Major Image",
//   "Mass Healing Word",
//   "Alter Self",
//   "Arcane Lock",
//   "Barkskin",
//   "Nondetection",
//   "Meld into Stone",
//   "Phantom Steed",
//   "Plant Growth",
//   "Protection from Energy",
//   "Revivify",
//   "Sending",
//   "Sleet Storm",
//   "Slow",
//   "Speak with Dead",
//   "Speak with Plants",
//   "Spirit Guardians",
//   "Stinking Cloud",
//   "Confusion",
//   "Conjure Minor Elementals",
//   "Control Water",
//   "Conjure Woodland Beings",
//   "Death Ward",
//   "Tongues",
//   "Beast Sense",
//   "Blur",
//   "Branding Smite",
//   "Cordon Of Arrows",
//   "Crown of Madness",
//   "Darkness",
//   "Darkvision",
//   "Detect Thoughts",
//   "Animal Shapes",
//   "Antimagic Field",
//   "Antipathy/Sympathy",
//   "Astral Projection",
//   "Clone",
//   "Control Weather",
//   "Demiplane",
//   "Dominate Monster",
//   "Earthquake",
//   "Feeblemind",
//   "Foresight",
//   "Gate",
//   "Glibness",
//   "Holy Aura",
//   "Imprisonment",
//   "Incendiary Cloud",
//   "Mass Heal",
//   "Maze",
//   "Meteor Swarm",
//   "Mind Blank",
//   "Power Word Heal",
//   "Power Word Kill",
//   "Power Word Stun",
//   "Prismatic Wall",
//   "Shapechange",
//   "Storm of Vengeance",
//   "Telepathy",
//   "Sunburst",
//   "Time Stop",
//   "True Polymorph",
//   "Tsunami",
//   "True Resurrection",
//   "Weird",
//   "Wish",
//   "Conjure Celestial",
//   "Delayed Blast Fireball",
//   "Dimension Door",
//   "Divine Word",
//   "Etherealness",
//   "Finger of Death",
//   "Fire Storm",
//   "Forcecage",
//   "Mirage Arcane",
//   "Prismatic Spray",
//   "Project Image",
//   "Plane Shift",
//   "Regenerate",
//   "Resurrection",
//   "Reverse Gravity",
//   "Sequester",
//   "Simulacrum",
//   "Symbol",
//   "Teleport",
//   "Suggestion",
//   "Invisibility",
//   "Animate Objects",
//   "Antilife Shell",
//   "Arcane Gate",
//   "Awaken",
//   "Banishing Smite",
//   "Chain Lightning",
//   "Blade Barrier",
//   "Circle of Death",
//   "Circle of Power",
//   "Cloudkill",
//   "Commune with Nature",
//   "Commune",
//   "Cone of Cold",
//   "Conjure Elemental",
//   "Conjure Fey",
//   "Conjure Volley",
//   "Contact Other Plane",
//   "Contagion",
//   "Contingency",
//   "Create Undead",
//   "Continual Flame",
//   "Creation",
//   "Destructive Wave",
//   "Disintegrate",
//   "Divination",
//   "Dispel Evil and Good",
//   "Dominate Beast",
//   "Dominate Person",
//   "Dream",
//   "Enhance Ability",
//   "Enlarge/Reduce",
//   "Enthrall",
//   "Fabricate",
//   "Eyebite",
//   "Find Steed",
//   "Find the Path",
//   "Find Traps",
//   "Fire Shield",
//   "Flame Blade",
//   "Flame Strike",
//   "Flaming Sphere",
//   "Flesh to Stone",
//   "Forbiddance",
//   "Freedom of Movement",
//   "Geas",
//   "Gentle Repose",
//   "Giant Insect",
//   "Globe of Invulnerability",
//   "Glyph of Warding",
//   "Grasping Vine",
//   "Greater Invisibility",
//   "Greater Restoration",
//   "Guardian of Faith",
//   "Guards and Wards",
//   "Gust of Wind",
//   "Hallucinatory Terrain",
//   "Hallow",
//   "Harm",
//   "Heat Metal",
//   "Heal",
//   "Heroes' Feast",
//   "Hold Monster",
//   "Ice Storm",
//   "Insect Plague",
//   "Knock",
//   "Legend Lore",
//   "Levitate",
//   "Locate Animals or Plants",
//   "Lightning Bolt",
//   "Locate Creature",
//   "Locate Object",
//   "Magic Jar",
//   "Magic Weapon",
//   "Magic Mouth",
//   "Mass Cure Wounds",
//   "Mass Suggestion",
//   "Mirror Image",
//   "Mislead",
//   "Misty Step",
//   "Modify Memory",
//   "Moonbeam",
//   "Move Earth",
//   "Pass without Trace",
//   "Passwall",
//   "Phantasmal Killer",
//   "Phantasmal Force",
//   "Planar Ally",
//   "Planar Binding",
//   "Polymorph",
//   "Programmed Illusion",
//   "Raise Dead",
//   "Protection from Poison",
//   "Ray of Enfeeblement",
//   "Reincarnate",
//   "Rope Trick",
//   "Scorching Ray",
//   "Scrying",
//   "Seeming",
//   "See Invisibility",
//   "Shatter",
//   "Spider Climb",
//   "Spike Growth",
//   "Staggering Smite",
//   "Stone Shape",
//   "Sunbeam",
//   "Stoneskin",
//   "Swift Quiver",
//   "Telekinesis",
//   "Teleportation Circle",
//   "Transport via Plants",
//   "Tree Stride",
//   "True Seeing",
//   "Vampiric Touch",
//   "Wall of Fire",
//   "Wall of Ice",
//   "Wall of Force",
//   "Wall of Stone",
//   "Wall of Thorns",
//   "Water Breathing",
//   "Water Walk",
//   "Web",
//   "Wind Walk",
//   "Wind Wall",
//   "Word of Recall",
//   "Zone of Truth",
//   "Earth Tremor",
//   "Pyrotechnics",
//   "Skywrite",
//   "Thunderclap",
//   "Warding Wind",
//   "Control Flames",
//   "Create Bonfire",
//   "Frostbite",
//   "Gust",
//   "Magic Stone",
//   "Mold Earth",
//   "Shape Water",
//   "Absorb Elements",
//   "Beast Bond",
//   "Ice Knife",
//   "Earthbind",
//   "Dust Devil",
//   "Catapult",
//   "Control Winds",
//   "Bones of the Earth",
//   "Erupting Earth",
//   "Elemental Bane",
//   "Flame Arrows",
//   "Investiture of Flame",
//   "Investiture of Ice",
//   "Investiture of Stone",
//   "Investiture of Wind",
//   "Maelstrom",
//   "Primordial Ward",
//   "Tidal Wave",
//   "Transmute Rock",
//   "Wall of Water",
//   "Watery Sphere",
//   "Whirlwind",
//   "Immolation",
//   "Storm Sphere",
//   "Vitriolic Sphere",
//   "Wall of Sand",
// ];

// let results = spellNames.filter((x) => x.toLowerCase().includes(("wate").toLowerCase()));
// console.log(results)

// searchFunction() {

// }
