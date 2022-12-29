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
var allSpellLists = document.getElementById("spellsheet_wrapper");
var spellLists = document.querySelectorAll("ul.spells");
var prefsButton = document.getElementById("visual_prefs_button");
var prefsPanel = document.getElementById("visual_prefs_panel");
var darkButton = document.getElementById("dark_mode");
var brightnessSlider = document.getElementById("brightness");
var contrastSlider = document.getElementById("contrast");
var headerLeft = document.querySelector("#header .header_left");

//////////CHECK FOR VISUAL SETTINGS IN LOCALSTORAGE AND SET THEM///////
if (localStorage.darkMode === "true") {
  darkButton.classList.toggle("active");
  darkButton.querySelector("i").classList.add("ri-moon-fill");
  darkButton.querySelector("i").classList.remove("ri-moon-line");
  document.documentElement.classList.toggle("dark");
  resultsContainer.classList.toggle("dark");
}
///////////////////////////////////////////////////////////////////////

///////////////////////PREFERENCES PANE////////////////////////////////

prefsButton.addEventListener("click", () => {
  prefsButton.classList.toggle("active");
});

darkButton.addEventListener("click", () => {
  darkButton.classList.toggle("active");
  darkButton.querySelector("i").classList.toggle("ri-moon-fill");
  darkButton.querySelector("i").classList.toggle("ri-moon-line");
  document.documentElement.classList.toggle("dark");
  resultsContainer.classList.toggle("dark");
  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("darkMode", "true");
  } else {
    localStorage.setItem("darkMode", "false");
  }
});

// brightnessSlider.addEventListener('input', () => {
//   document.documentElement.style.filter = 'brightness(' + (brightnessSlider.value * 0.01) + ') contrast(' + (contrastSlider.value * 0.01) + ')';
// })
// contrastSlider.addEventListener('input', () => {
//   document.documentElement.style.filter = 'brightness(' + (brightnessSlider.value * 0.01) + ') contrast(' + (contrastSlider.value * 0.01) + ')';
// })

///////////////////////////////////////////////////////////////////////////

///////////////////////CHECK FOR LOCAL STORAGE SPELLSHEET//////////////////
if (localStorage.activeSpells) {
  const activeSpellsHtml = localStorage.activeSpells;
  allSpellLists.innerHTML = activeSpellsHtml;
  var allSpellLists = document.getElementById("spellsheet_wrapper");
  var spellLists = document.querySelectorAll("ul.spells");
  var addedSpells = document.querySelectorAll("li.spell");
  addedSpells.forEach((e) => {
    bindRemoveMoveSpell(e);
  });
}
////////////////////////////////////////////////////////////////////////////

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
  // if (activeSpells.some((item) => item.name === e.name)) {
  //   window.alert("This spell is already in your spellbook!");
  // } else {
  // activeSpells.push(e);
  const spell = document.createElement("li");
  if (e.casting_time === "1 bonus action") {
    var castingTime = "1 bns";
  }
  if (e.description.includes("Strength saving throw")) {
    var savingThrow = "Str";
  } else if (e.description.includes("Dexterity saving throw")) {
    var savingThrow = "Dex";
  } else if (e.description.includes("Constitution saving throw")) {
    var savingThrow = "Con";
  } else if (e.description.includes("Intelligence saving throw")) {
    var savingThrow = "Int";
  } else if (e.description.includes("Wisdom saving throw")) {
    var savingThrow = "Wis";
  } else if (e.description.includes("Charisma saving throw")) {
    var savingThrow = "Cha";
  } else {
    var savingThrow = "no";
  }
  if (e.description.includes("spell attack")) {
    var spellAttack = "yes";
  } else {
    var spellAttack = "no";
  }
  if (e.higher_levels) {
    var higherLevel = '<p class="higher-level"><span><i class="ri-arrow-up-circle-line" title="Higher level"></i>upcast</span>' + e.higher_levels + "</p>";
  } else {
    var higherLevel = "";
  }
  if (e.components.materials_needed) {
    var materialsNeeded = '<li class="material hidden"><p><i title="material" class="ri-ink-bottle-line"></i>' + e.components.materials_needed + "</p></li>";
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
  switch (e.school.toLowerCase()) {
    case "evocation":
      var icon = "ri-fire-line";
      break;
    case "conjuration":
      var icon = "ri-loader-line";
      break;
    case "abjuration":
      var icon = "ri-shield-line";
      break;
    case "divination":
      var icon = "ri-open-arm-line";
      break;
    case "enchantment":
      var icon = "ri-magic-line";
      break;
    case "illusion":
      var icon = "ri-spy-line";
      break;
    case "necromancy":
      var icon = "ri-skull-line";
      break;
    case "transmutation":
      var icon = "ri-contrast-fill";
      break;
    default:
      var icon = "";
  }

  var description = e.description.replace("/n/n", "</p><p>");
  // console.log(description)

  spell.innerHTML =
    '<div class="spell_inner"><div class="controls"><a href="#" class="color_picker"><span>Change colors</span><i class="ri-paint-brush-line"></i></a><a href="#" class="moveup_spell"><span>Move spell up</span><i class="ri-arrow-up-s-line"></i></a><a href="#" class="movedown_spell"><span>Move spell down</span><i class="ri-arrow-down-s-line"></i></a><a href="#" class="remove_spell"><span>Remove spell</span><i class="ri-close-line"></i></a></div><h3><i class="' +
    icon +
    '" title="' +
    e.school +
    '"></i>' +
    e.name +
    '</h3><ul class="terms large"><li class="casting-time"><p><i title="casting time" class="ri-flashlight-line"></i>' +
    castingTime +
    '</p></li><li class="range"><p><i title="range" class="ri-arrow-right-up-line"></i>' +
    e.range +
    '</p></li><li class="duration"><p><i title="duration" class="ri-time-line"></i>' +
    e.duration +
    '</p></li></ul><ul class="terms small"><li class="school"><p><i title="school" class="ri-book-2-line"></i>' +
    e.school +
    '</p></li><li class="save"><p><i title="save" class="ri-lifebuoy-line"></i>' +
    savingThrow +
    '</p></li><li class="spell-attack"><p><i title="spell attack" class="ri-sword-line"></i>' +
    spellAttack +
    '</p></li><li class="components hidden"><p><i title="components" class="ri-voiceprint-line"></i>' +
    componentsString +
    "</p></li>" +
    materialsNeeded +
    '<li class="ritual"><p><i title="ritual" class="ri-open-arm-line"></i>' +
    ritual +
    "</p></li></ul><p class='description'>" +
    description +
    "</p>" +
    higherLevel +
    "</div>";
  // console.log(e)
  if (e.level === "cantrip") {
    var spellLevel = 0;
  } else {
    var spellLevel = e.level;
  }
  // console.log(spellLists);
  spellLists[spellLevel].appendChild(spell);
  hideShowLevels();
  bindRemoveMoveSpell(spell);
  checkUpDownSetOrder();
}

function bindRemoveMoveSpell(e) {
  e.querySelector(".remove_spell").addEventListener("click", () => {
    event.preventDefault();
    e.remove();
    checkUpDownSetOrder();
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
    // var index = Array.prototype.indexOf.call(e.parentNode.children, e);
    // var level = e.getAttribute("data-level").replace("cantrip", "0");
  });
  saveSpellSheet();
}
hideShowLevels();
function hideShowLevels() {
  spellLists.forEach((e) => {
    // console.log(e + e.childNodes.length);
    // console.log(e.previousElementSibling);
    // console.log(e);
    if (e.childNodes.length > 0) {
      e.style.display = "grid";
      if (e.previousElementSibling) {
        e.previousElementSibling.style.display = "block";
      }
    } else {
      e.style.display = "none";
      if (e.previousElementSibling) {
        e.previousElementSibling.style.display = "none";
      }
    }
  });
  saveSpellSheet();
}

function saveSpellSheet() {
  var spellSheet = allSpellLists.innerHTML;
  localStorage.setItem("activeSpells", spellSheet);
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
  saveSpellSheet();
  const activeSpellsHtml = localStorage.activeSpells;
  let a = document.createElement("a");
  var name = prompt("Filename:");
  if (typeof a.download !== "undefined") a.download = name + ".ink";
  a.href = URL.createObjectURL(
    new Blob([activeSpellsHtml], {
      type: "application/octet-stream",
    })
  );
  a.dispatchEvent(new MouseEvent("click"));
}

////////////////////SAVE FILE UPLOAD/////////////////

document.getElementById("input-file").addEventListener("change", getFile);

function getFile(event) {
  const input = event.target;
  if ("files" in input && input.files.length > 0) {
    allSpellLists.innerHTML = "";
    placeFileContent(allSpellLists, input.files[0]);
  }
}

function placeFileContent(target, file) {
  readFileContent(file)
    .then((content) => {
      target.innerHTML = content;
      var addedSpells = document.querySelectorAll("li.spell");
      addedSpells.forEach((e) => {
        bindRemoveMoveSpell(e);
        checkUpDownSetOrder();
      });
      saveSpellSheet();
    })
    .catch((error) => console.log(error));
}

function readFileContent(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

////////////////FILTERS////////////////////////////////////////
const activeFilters = [];
let filters = document.querySelectorAll("#filters .filter a");
filters.forEach((e) => {
  e.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.target.classList.contains("active")) {
      event.target.classList.remove("active");
      deactivateFilter(event.target);
    } else {
      event.target.classList.add("active");
      if (event.target.parentNode.children.length > 2) {
        Array.prototype.forEach.call(event.target.parentNode.children, (i) => {
          if (i !== event.target) {
            i.classList.remove("active");
            var filterCategory = i.parentNode.getAttribute("data-filter");
            var activeFilter = i.getAttribute("data-" + filterCategory);
            var index = activeFilters.indexOf(activeFilter);
            if (index > -1) {
              activeFilters.splice(index, 1);
            }
            console.log(activeFilters);
            filterSpells();
          }
        });
      }
      activateFilter(event.target);
      disableFeatures();
      document.getElementById("remove-filters").classList.add("active");
    }
  });
});

function activateFilter() {
  var filterCategory = event.target.parentNode.getAttribute("data-filter");
  var activeFilter = event.target.getAttribute("data-" + filterCategory);
  activeFilters.push(activeFilter);
  filterSpells();
}

function deactivateFilter() {
  var filterCategory = event.target.parentNode.getAttribute("data-filter");
  var activeFilter = event.target.getAttribute("data-" + filterCategory);
  var index = activeFilters.indexOf(activeFilter);
  if (index > -1) {
    activeFilters.splice(index, 1);
  }
  console.log(activeFilters);
  filterSpells();
  if (activeFilters.length < 1) {
    enableFeatures();
    document.getElementById("remove-filters").classList.remove("active");
  }
}

function filterSpells() {
  document.querySelectorAll(".spell").forEach((e) => {
    if (activeFilters.length < 1) {
      e.classList.remove("filter-hidden");
    } else {
      var elementData = JSON.stringify(e.dataset);
      if (!activeFilters.every((i) => elementData.includes(i))) {
        e.classList.add("filter-hidden");
      } else {
        e.classList.remove("filter-hidden");
      }
    }
  });
}

function disableFeatures() {
  headerLeft.classList.add("disabled");
  searchBox.classList.add("disabled");
}
function enableFeatures() {
  headerLeft.classList.remove("disabled");
  searchBox.classList.remove("disabled");
}

///////////////////////////////////////////////////////////////

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
