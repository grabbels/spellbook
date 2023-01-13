let searchBox = document.getElementById("spellsearch");
let spellsLoading = document.getElementById("spells_loading");
let resultsContainer = document.getElementById("results");
let loadingAnimation = document.getElementById("loading");
let allSpellLists = document.getElementById("spellsheet_wrapper");
let spellLists = document.querySelectorAll("ul.spells:not(.favorites)");
let spellListTitles = document.querySelectorAll(".spellsheet_wrapper h2");
let prefsButton = document.getElementById("visual_prefs_button");
let prefsPanel = document.getElementById("visual_prefs_panel");
let themeSelect = document.getElementById("theme_select");
let headerLeft = document.querySelector("#header .header_left");
let headerLeftButton = document.getElementById("header_left_button");
let exportPdfButton = document.getElementById("export_pdf");
let clearAllButton = document.getElementById("clear");
let downloadButton = document.getElementById("download_button");
let tempSpellContainer = document.getElementById("temp_spell");
let filters = document.querySelectorAll("#filters .filter button");
let filtersButton = document.getElementById("filters_button");
let filtersButtonIcon = filtersButton.querySelector("i");
let nameFilter = document.getElementById("name_filter");
let noResultsFiltered = document.getElementById("no_results_filtered");
let noSpells = document.getElementById("no_spells");
let removeFilters = document.querySelectorAll(".remove-filters");
let filtersBlock = document.getElementById("filters");
let pageTitle = document.getElementById("title");
let disabledMessage = document.getElementById("disabled_message");
let bookmarksBar = document.getElementById("bookmarks");
let bookmarks = bookmarksBar.querySelectorAll(".bookmark_inner:not(.icon)");
let allBookmarks = bookmarksBar.querySelectorAll(".bookmark_inner");
let bookmarksIcon = bookmarksBar.querySelector("#bookmarks .bookmark.icon");
let actualBookmarks = bookmarksBar.querySelectorAll(".actual_bookmarks .bookmark");
let favoriteSpells = document.querySelector("ul.favorites");
const activeSpellsArray = [];
const favoriteSpellsArray = [];
const notesArray = [];
const list = "";
let fromstorage = false;
// const masterList = ''

// const db = Dexie.import("spells.json");

function throttle(fn, wait) {
  var time = Date.now();
  return function () {
    if (time + wait - Date.now() < 0) {
      fn();
      time = Date.now();
    }
  };
}

pageTitle.querySelector("a").addEventListener("click", (e) => {
  event.preventDefault();
  document.documentElement.setAttribute("data-scroll", window.scrollY);
  var query = e.target.innerHTML;
  var type = "temp";
  fetchSpells(query, type);
});

/////////bind relevant buttons and links/////////////

document.addEventListener("touchstart", function () {
  for (let i = 0; i < bookmarks.length; i++) {
    bookmarks[i].addEventListener("click", () => {
      bookmarksBar.classList.remove("hover");
    });
  }
  bookmarksIcon.addEventListener("click", () => {
    bookmarksBar.classList.toggle("hover");
  });
});

headerLeftButton.addEventListener("click", () => {
  headerLeft.classList.toggle("open");
});

filtersButton.addEventListener("click", () => {
  filtersBlock.classList.toggle("open");
  filtersButtonIcon.classList.toggle("ri-filter-line");
  filtersButtonIcon.classList.toggle("ri-close-line");
});

headerLeft.addEventListener("click", () => {
  headerLeft.classList.remove("open");
});

///////////////////////////////////////////////////////

//////////CHECK FOR VISUAL SETTINGS IN LOCALSTORAGE AND SET THEM///////
if (localStorage.theme) {
  let savedTheme = localStorage.theme;
  themeSelect.value = savedTheme;
  document.documentElement.classList = savedTheme;
  resultsContainer.classList.toggle("dark");
}
///////////////////////////////////////////////////////////////////////

///////////////////////PREFERENCES PANE////////////////////////////////

prefsButton.addEventListener("click", () => {
  prefsButton.classList.toggle("active");
});

themeSelect.addEventListener("change", () => {
  let selectedTheme = themeSelect.value;
  document.documentElement.classList = selectedTheme;
  localStorage.setItem("theme", selectedTheme);
});
//////////////////////////////////////////////////////////////////////////

///////////////////////CHECK FOR LOCAL STORAGE SPELLSHEET//////////////////
// const delay = async (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));
if (localStorage.activeSpells) {
  var type = "direct";
  var array = "";
  populateSpellsFromStorage(array, type);
}

// async function populateSpellsFromStorage(array, el) {
function populateSpellsFromStorage(array, el) {
  spellsLoading.style.display = "block";
  var type = el;
  var activeSpellsArray = localStorage.activeSpells.split(",");
  for (var i = 0, len = activeSpellsArray.length; i < len; i++) {
    var query = activeSpellsArray[i];
    fetchSpells(query, type, activeSpellsArray.length);
    // await delay(50);
  }
}

function populateFavorites() {
  // favoriteSpellsArray = [];
  if (localStorage.favoriteSpells) {
    const favoriteSpellsArray = new Promise((resolve) => {
      var favoriteSpellsArray = localStorage.favoriteSpells.split(",");
      resolve(favoriteSpellsArray);
    });
    favoriteSpellsArray.then((favoriteSpellsArray) => {
      for (let i = 0; i < favoriteSpellsArray.length; i++) {
        var favedSpell = document.querySelector('.spell[data-name="' + favoriteSpellsArray[i] + '"');
        addRemoveFavorite(favedSpell);
        bindRemoveMoveSpell(favedSpell);
        if (i === favoriteSpellsArray.length - 1) {
          spellsLoading.style.display = "none";
        }
      }
    });
  }
}

function populateNotes() {
  if (localStorage.notes) {
    var notesArray = JSON.parse(localStorage.notes);
    for (let i = 0; i < notesArray.length; i++) {
      var notesContainer = document.querySelector(".spell[data-name='" + notesArray[i][0] + "']:not(.favorite) .notes p.notes_inner");
      notesContainer.innerHTML = notesArray[i][1];
      notesContainer.parentElement.style.display = "block";
    }
  }
}

////////////////////////////////////////////////////////////////////////////

clearAllButton.addEventListener("click", () => {
  let text = "Are you sure you want to remove all your saved spells?";
  if (confirm(text) == true) {
    localStorage.setItem("activeSpells", "");
    localStorage.setItem("favoriteSpells", "");
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

function fetchSpells(query, type, length) {
  const list = new Promise((resolve) => {
    if (!list) {
      if (!localStorage.master) {
        fetch("../spells.json")
          .then((res) => res.json())
          .then((data) => {
            const masterSpellsList = JSON.stringify(data);
            localStorage.setItem("master", masterSpellsList);
            var list = data;
            resolve(list);
          });
      } else {
        var list = JSON.parse(localStorage.master);
        resolve(list);
      }
    } else {
      resolve(list);
    }
  });
  list.then((list) => {
    let results = [];
    let resultsIndex = [];
    for (var i = 0, len = list.length; i < len; i++) {
      if (list[i].name.toLowerCase().includes(query.toLowerCase())) {
        results.push(list[i]);
      }
    }
    if (type === "temp") {
      addToSheet(results[0], type, length);
    } else if (type === "direct" || type === "import") {
      addToSheet(results[0], type, length);
    } else {
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
    }
  });
}
window.iterationCount = 0;
function addToSheet(e, type, length) {
  if (length) {
    window.iterationCount++;
  }
  const spell = document.createElement("li");
  if (type !== "temp" && type !== "import" && activeSpellsArray.includes(e.name)) {
    alert("This spell is already in your spellbook!");
    return;
  }
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
  spell.classList = "spell shown";
  spell.setAttribute("data-time", castingTime);
  spell.setAttribute("data-name", e.name);
  spell.setAttribute("data-range", e.range);
  spell.setAttribute("data-duration", e.duration);
  spell.setAttribute("data-save", savingThrow.toLowerCase());
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

  // if (e.duration.toLowerCase().includes('up to')) {
  //   var duration = e.duration.replace("up to", '<i class="ri-timer-fill"></i>');
  //   var duration = e.duration.replace("Up to", '<i class="ri-timer-fill"></i>');
  // } else {
  //   var duration = e.duration
  // }

  var description = e.description.replace("/n/n", "</p><p>");
  var descriptionSpellLinks = description.match(/\[(.*?)\]/g);
  if (descriptionSpellLinks) {
    for (let i = 0; i < descriptionSpellLinks.length; i++) {
      var spellTitle = descriptionSpellLinks[i].replace("[", "").replace("]", "");
      var spellLink = '<a href="#" class="spell_link">' + spellTitle + "</a>";
      description = description.replace(descriptionSpellLinks[i], spellLink);
    }
  }
  //
  spell.innerHTML =
    '<div class="spell_inner"><div class="controls"><button type="button" class="note_spell"><span>Edit notes</span><i class="ri-draft-line"></i> </i></button><button type="button" class="favorite_spell"><span>Add to favorites</span><i class="ri-star-s-line"></i></button><button type="button" class="moveup_spell"><span>Move spell up</span><i class="ri-arrow-up-s-line"></i></button><button type="button" class="movedown_spell"><span>Move spell down</span><i class="ri-arrow-down-s-line"></i></button><button type="button" class="remove_spell"><span>Remove spell</span><i class="ri-close-line"></i></button></div><h3><i class="' +
    icon +
    '" title="' +
    e.school +
    '"></i>' +
    e.name +
    '</h3><ul class="terms large"><li class="casting-time" title="Casting time"><div class="popup"><p>Casting time</p></div><p><i title="casting time" class="ri-flashlight-line"></i>' +
    castingTime +
    '</p></li><li class="range" title="Range or target"><div class="popup"><p>Spell range</p></div><p><i title="range" class="ri-arrow-right-up-line"></i>' +
    e.range +
    '</p></li><li class="duration" title="Duration"><div class="popup"><p>Spell duration</p></div><p><i title="duration" class="ri-time-line"></i>' +
    e.duration +
    '</p></li></ul><ul class="terms small"><li class="school" title="School of magic"><div class="popup"><p>School of magic</p></div><p><i title="school" class="ri-book-2-line"></i>' +
    e.school +
    '</p></li><li class="save" title="Saving throw"><div class="popup"><p>Saving throw</p></div><p><i title="save" class="ri-lifebuoy-line"></i>' +
    savingThrow +
    '</p></li><li class="spell-attack" title="Spell attack"><div class="popup"><p>(Spell) attack roll</p></div><p><i title="spell attack" class="ri-sword-line"></i>' +
    spellAttack +
    '</p></li><li class="components hidden"><div class="popup"><p>Components</p></div><p><i title="components" class="ri-voiceprint-line"></i>' +
    componentsString +
    "</p></li>" +
    materialsNeeded +
    '<li class="ritual"><div class="popup"><p>Ritual</p></div><p><i title="ritual" class="ri-open-arm-line"></i>' +
    ritual +
    "</p></li></ul><div class='description_wrapper'><p>" +
    description +
    "</p></div>" +
    higherLevel +
    "<div class='notes' style='display: none;'><p><strong>Notes</strong></p><p class='notes_inner'></p></div></div>";
  //
  if (e.level === "cantrip") {
    var spellLevel = 0;
  } else {
    var spellLevel = e.level;
  }
  //
  if (type === "temp") {
    tempSpellContainer.appendChild(spell);
    tempSpellContainer.parentElement.style.display = "block";
    document.body.style.position = "fixed";
    document.body.style.overflowY = "scroll";
    var closeButton = spell.querySelector(".remove_spell");
    closeButton.addEventListener("click", (e) => {
      closeTempSpell();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeTempSpell();
      }
    });
    function closeTempSpell() {
      event.preventDefault();
      spell.remove();
      tempSpellContainer.parentElement.style.display = "none";
      document.body.style.position = "static";
      document.body.style.overflowY = "auto";

      let savedScrollPosition = document.documentElement.getAttribute("data-scroll");
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, savedScrollPosition);
      document.documentElement.style.scrollBehavior = "smooth";
    }
  } else {
    if (!activeSpellsArray.includes(e.name)) {
      activeSpellsArray.push(e.name);
    }
    spellLists[spellLevel].appendChild(spell);
    noSpells.style.display = "none";
    downloadButton.classList.remove("disabled");
    exportPdfButton.classList.remove("disabled");
    clearAllButton.classList.remove("disabled");
    bindRemoveMoveSpell(spell);
    if (descriptionSpellLinks) {
      var descriptionLinks = spell.querySelectorAll("a.spell_link");
      for (let i = 0; i < descriptionLinks.length; i++) {
        descriptionLinks[i].addEventListener("click", () => {
          event.preventDefault();
          document.documentElement.setAttribute("data-scroll", window.scrollY);
          var query = descriptionLinks[i].innerHTML;
          var type = "temp";
          fetchSpells(query, type);
        });
      }
    }
    if (length) {
      if (window.iterationCount === length) {
        window.iterationCount = 0;
        hideShowLevels();
        checkUpDownSetOrder();
        if (localStorage.favoriteSpells) {
          setTimeout(() => {
            populateFavorites();
            populateNotes();
            length = "";
          }, 0);
        } else {
          setTimeout(() => {
            populateNotes();
            length = "";
          }, 0);
          hideShowLevels();
          checkUpDownSetOrder();
          saveSpellSheet();
          spellsLoading.style.display = "none";
          var length = "";
        }
        var length = "";
      }
    } else {
      hideShowLevels();
      checkUpDownSetOrder();
      saveSpellSheet();
    }
  }
}
function addRemoveFavorite(e) {
  if (e.classList.contains("favorite") || e.classList.contains("in_favorites")) {
    if (e.classList.contains("favorite")) {
      e.querySelector(".favorite_spell").lastChild.classList.remove("ri-star-s-fill");
      e.querySelector(".favorite_spell").lastChild.classList.add("ri-star-s-line");
      e.querySelector(".favorite_spell").firstChild.innerHTML = "Add to favorites";
      let unfavSpellName = e.getAttribute("data-name");
      e.remove();
      document.querySelector('.spell[data-name="' + unfavSpellName + '"] .favorite_spell i').classList.remove("ri-star-s-fill");
      document.querySelector('.spell[data-name="' + unfavSpellName + '"] .favorite_spell i').classList.add("ri-star-s-line");
      document.querySelector('.spell[data-name="' + unfavSpellName + '"]').classList.remove("in_favorites");
    } else if (e.classList.contains("in_favorites")) {
      e.querySelector(".favorite_spell").lastChild.classList.remove("ri-star-s-fill");
      e.querySelector(".favorite_spell").lastChild.classList.add("ri-star-s-line");
      e.querySelector(".favorite_spell").firstChild.innerHTML = "Add to favorites";
      let unfavSpellName = e.getAttribute("data-name");
      document.querySelector('.spell.favorite[data-name="' + unfavSpellName + '"] .favorite_spell i').classList.remove("ri-star-s-fill");
      document.querySelector('.spell.favorite[data-name="' + unfavSpellName + '"] .favorite_spell i').classList.add("ri-star-s-line");
      document.querySelector('.spell.favorite[data-name="' + unfavSpellName + '"]').remove();
      e.classList.remove("in_favorites");
    }
  } else {
    if (event) {
      var element = event.target;
    } else {
      var element = e.querySelector(".favorite_spell");
    }
    element.lastChild.classList.add("ri-star-s-fill");
    element.lastChild.classList.remove("ri-star-s-line");
    element.firstChild.innerHTML = "Remove from favorites";
    var fav = e.cloneNode(true);
    favoriteSpellsArray.push(fav.getAttribute("data-name"));
    var cloneName = fav.querySelector("h3").innerHTML;
    var cloneLevel = "Level " + fav.getAttribute("data-level");
    if (cloneLevel === "Level cantrip") {
      var cloneLevel = "Cantrip";
    }
    fav.classList.add("favorite");
    fav.querySelector("h3").innerHTML = cloneName + " <span>" + cloneLevel + "</span>";
    var spellLink = document.createElement("a");
    spellLink.href = "#";
    spellLink.classList.add("spell_link", "cover");
    spellLink.addEventListener("click", () => {
      event.preventDefault();
      document.documentElement.setAttribute("data-scroll", window.scrollY);
      var query = fav.getAttribute("data-name");

      var type = "temp";
      fetchSpells(query, type);
    });
    fav.appendChild(spellLink);
    favoriteSpells.appendChild(fav);
    bindRemoveMoveSpell(fav);
    e.classList.add("in_favorites");
  }
  saveSpellSheet();
  checkUpDownSetOrder();
  hideShowLevels();
}

function bindRemoveMoveSpell(e) {
  //bind favorite spell button and function
  e.querySelector(".favorite_spell").addEventListener("click", () => {
    event.preventDefault();
    addRemoveFavorite(e);
  });
  //bind notes button for (non-cloned) spells
  if (!e.classList.contains("in_favorites")) {
    e.querySelector(".note_spell").addEventListener("click", () => {
      event.preventDefault();
      if (!e.querySelector("textarea")) {
        e.querySelector(".notes").style.display = "block";
        var oldNotes = e.querySelector(".notes p.notes_inner").innerHTML;
        e.querySelector(".notes p.notes_inner").innerHTML = "";
        var textBox = document.createElement("textarea");
        e.querySelector(".notes").appendChild(textBox);
        var textBoxButton = document.createElement("button");
        e.querySelector(".notes").appendChild(textBoxButton);
        textBoxButton.innerHTML = "Save";
        textBox.value = oldNotes;
        textBoxButton.addEventListener("click", () => {
          var newNotes = textBox.value;
          textBox.remove();
          textBoxButton.remove();
          e.querySelector(".notes p.notes_inner").innerHTML = newNotes;
          if (newNotes) {
            e.querySelector(".notes").style.display = "block";
            notesArray.push([e.getAttribute("data-name"), newNotes]);
            saveSpellSheet();
          } else {
            e.querySelector(".notes").style.display = "none";
            saveSpellSheet();
          }
        });
      }
    });
  }

  //bind remove spell button and function
  e.querySelector(".remove_spell").addEventListener("click", () => {
    event.preventDefault();
    for (var i = 0, len = activeSpellsArray.length; i < len; i++) {
      if (activeSpellsArray[i] === e.getAttribute("data-name")) {
        activeSpellsArray.splice(i, 1);
        break;
      }
    }
    e.remove();
    saveSpellSheet();
    if (activeSpellsArray.length < 1) {
      noSpells.style.display = "block";
      downloadButton.classList.add("disabled");
      exportPdfButton.classList.add("disabled");
      clearAllButton.classList.add("disabled");
    }
    checkUpDownSetOrder();
    hideShowLevels();
  });
  //bind move spell down button and function
  e.querySelector(".movedown_spell").addEventListener("click", () => {
    event.preventDefault();
    for (var i = 0, len = activeSpellsArray.length; i < len; i++) {
      if (activeSpellsArray[i] === e.getAttribute("data-name")) {
        var movedSpell = activeSpellsArray.splice(i, 1);
        activeSpellsArray.splice(i + 1, 0, movedSpell.toString());
        break;
      }
    }
    e.parentNode.insertBefore(e.nextElementSibling, e);
    saveSpellSheet();
    checkUpDownSetOrder();
  });
  //bind move spell up button and function
  e.querySelector(".moveup_spell").addEventListener("click", () => {
    event.preventDefault();
    for (var i = 0, len = activeSpellsArray.length; i < len; i++) {
      if (activeSpellsArray[i] === e.getAttribute("data-name")) {
        var movedSpell = activeSpellsArray.splice(i, 1);
        activeSpellsArray.splice(i - 1, 0, movedSpell.toString());
        break;
      }
    }
    e.parentNode.insertBefore(e, e.previousElementSibling);
    saveSpellSheet();
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
}
hideShowLevels();

///////////////////////HIDE AND SHOW SPELL LISTS/LEVELS///////////////
function hideShowLevels() {
  for (let i = 0; i < spellLists.length; i++) {
    if (spellLists[i].querySelectorAll(".shown").length > 0) {
      spellLists[i].style.display = "grid";
      bookmarksBar.querySelector("[data-level='" + spellLists[i].getAttribute("data-level") + "']").style.display = "block";
      noResultsFiltered.style.display = "none";
      if (spellLists[i].previousElementSibling) {
        spellLists[i].previousElementSibling.style.display = "block";
      }
    } else {
      spellLists[i].style.display = "none";
      bookmarksBar.querySelector("[data-level='" + spellLists[i].getAttribute("data-level") + "']").style.display = "none";
      if (spellLists[i].previousElementSibling) {
        spellLists[i].previousElementSibling.style.display = "none";
      }
    }
  }
  if (favoriteSpells.childElementCount < 1 || favoriteSpells.querySelectorAll(".shown").length < 1) {
    favoriteSpells.style.display = "none";
    favoriteSpells.previousElementSibling.style.display = "none";
    bookmarksBar.querySelector("[data-level='favorites']").style.display = "none";
  } else {
    favoriteSpells.style.display = "grid";
    favoriteSpells.previousElementSibling.style.display = "block";
    bookmarksBar.querySelector("[data-level='favorites']").style.display = "block";
  }
  setTimeout(() => {
    if (allSpellLists.clientHeight < 10 && activeFilters.length > 0) {
      noResultsFiltered.style.display = "block";
    }
  }, 10);
  if (activeSpellsArray.length < 1) {
    filtersBlock.classList.add("disabled");
    filtersButton.classList.add("disabled");
    bookmarksBar.style.display = "none";
  } else {
    filtersBlock.classList.remove("disabled");
    filtersButton.classList.remove("disabled");
    bookmarksBar.style.display = "block";
  }
  bookmarksIcon.style.display = "none";
  for (let i = 0; i < actualBookmarks.length; i++) {
    if (actualBookmarks[i].style.display === "block") {
      bookmarksIcon.style.display = "block";
    }
  }
  window.allVisibleLevels = Array.from(document.querySelectorAll(".spellsheet_wrapper h2")).filter((s) => window.getComputedStyle(s).getPropertyValue("display") != "none");
}

window.addEventListener("scroll", throttle(bookmarkInViewCheck, 10));
var titleInView = "";
function bookmarkInViewCheck() {
  let thirdDocHeight = document.documentElement.clientHeight * 0.3;
  let twoThirdDocHeight = document.documentElement.clientHeight * 0.6;
  for (let i = 0; i < window.allVisibleLevels.length; i++) {
    var titleTop = window.allVisibleLevels[i].getBoundingClientRect().top;
    if (window.allVisibleLevels[i + 1]) {
      var nextTitleTop = window.allVisibleLevels[i + 1].getBoundingClientRect().top;
    }
    if (window.scrollY === 0) {
      //check if page is unscrolled to unset active bookmark
      for (let i = 0; i < actualBookmarks.length; i++) {
        actualBookmarks[i].classList.remove("active");
      }
    } else if (titleTop < twoThirdDocHeight && window.allVisibleLevels.slice(-1)[0] === window.allVisibleLevels[i]) {
      //check if the target/visible level-section is the last visible one
      setActiveBookmark();
    } else if (titleTop < thirdDocHeight && !(titleTop < 0) && thirdDocHeight < nextTitleTop) {
      setActiveBookmark();
    }
    function setActiveBookmark() {
      var titleInView = window.allVisibleLevels[i];
      if (registeredTitleInView !== titleInView) {
        var registeredTitleInView = window.allVisibleLevels[i];
        for (let i = 0; i < actualBookmarks.length; i++) {
          actualBookmarks[i].classList.remove("active");
        }
        bookmarksBar.querySelector('div.bookmark[data-level="' + window.allVisibleLevels[i].getAttribute("data-level") + '"').classList.add("active");
      }
    }
  }
}

searchBox.addEventListener("input", (e) => {
  if (searchBox.value.length > 0) {
    loadingAnimation.classList.add("active");
  }
  if (resultsContainer.innerHTML.length > 0) {
    resultsContainer.innerHTML = "";
  }
});
searchBox.addEventListener("input", () => {
  var query = searchBox.value;
  if (query) {
    fetchSpells(query);
  } else {
    loadingAnimation.classList.remove("active");
  }
});

downloadButton.addEventListener("click", () => {
  downloadFile();
});

function downloadFile() {
  saveSpellSheet();
  var activeSpellsSave = localStorage.activeSpells.split(",");
  // activeSpellsSave.splice(0, 0, "spells");
  var activeSpellsSave = activeSpellsSave.toString();
  var favoriteSpellsSave = localStorage.favoriteSpells.split(",");
  favoriteSpellsSave.splice(0, 0, "favorites");
  var favoriteSpellsSave = favoriteSpellsSave.toString();
  var saveFileString = activeSpellsSave + "," + favoriteSpellsSave;
  let a = document.createElement("a");
  var name = prompt("Filename:");
  if (name !== null) {
    if (typeof a.download !== "undefined") a.download = name + ".json";
    a.href = URL.createObjectURL(
      new Blob([saveFileString], {
        type: "application/octet-stream",
      })
    );
    a.dispatchEvent(new MouseEvent("click"));
  }
}

////////////////////SAVE FILE UPLOAD/IMPORT/////////////////

document.getElementById("input-file").addEventListener("change", getFile);

function getFile(event) {
  let text = "Importing a spellbook will overwrite your current spells. Do you want to continue?";
  if (confirm(text) == true) {
    spellsLoading.style.display = "block";
    localStorage.setItem("activeSpells", "");
    localStorage.setItem("favoriteSpells", "");
    const input = event.target;
    if ("files" in input && input.files.length > 0) {
      favoriteSpells.innerHTML = "";
      for (let i = 0; i < spellLists.length; i++) {
        spellLists[i].innerHTML = "";
      }
      placeFileContent(input.files[0]);
    }
  }
}

function placeFileContent(file) {
  readFileContent(file)
    .then((content) => {
      const splitContentArray = content.split(",favorites,");
      const activeSpellsArray = splitContentArray[0];
      const favoriteSpellsArray = splitContentArray[1];
      localStorage.setItem("activeSpells", activeSpellsArray);
      localStorage.setItem("favoriteSpells", favoriteSpellsArray);
      // saveSpellSheet();
      var type = "import";
      populateSpellsFromStorage(array, type);
    })
    .catch((error) => alert(error));
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

//BIND REMOVE FILTERS
for (var i = 0, len = removeFilters.length; i < len; i++) {
  removeFilters[i].addEventListener("click", removeAllFilters);
}

//Cycle through all filters to bind activateFilter function to each
for (var i = 0, len = filters.length; i < len; i++) {
  filters[i].addEventListener("click", (event) => {
    event.preventDefault();
    //If filter is already active, deactivate. Else, activate
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
            filterSpells();
          }
        });
      }
      activateFilter(event.target);
      disableFeatures();
      for (var i = 0, len = removeFilters.length; i < len; i++) {
        removeFilters[i].classList.add("active");
      }
    }
  });
}
nameFilter.addEventListener(
  "input",
  debounce(() => {
    var allSpellsHtml = document.querySelectorAll("li.spell");
    if (nameFilter.value.length) {
      for (var i = 0, len = allSpellsHtml.length; i < len; i++) {
        if (!allSpellsHtml[i].getAttribute("data-name").toLowerCase().includes(nameFilter.value.toLowerCase())) {
          allSpellsHtml[i].classList.add("filter-hidden-by-name");
          allSpellsHtml[i].classList.remove("shown");
        } else {
          allSpellsHtml[i].classList.remove("filter-hidden-by-name");
          allSpellsHtml[i].classList.add("shown");
        }
      }
      for (var i = 0, len = removeFilters.length; i < len; i++) {
        removeFilters[i].classList.add("active");
      }
    } else {
      for (var i = 0, len = removeFilters.length; i < len; i++) {
        removeFilters[i].classList.remove("active");
      }
      for (var i = 0, len = allSpellsHtml.length; i < len; i++) {
        allSpellsHtml[i].classList.remove("filter-hidden-by-name");
        allSpellsHtml[i].classList.add("shown");
      }
    }
    hideShowLevels();
  }, 200)
);

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
  filterSpells();
  if (activeFilters.length < 1) {
    enableFeatures();
    for (var i = 0, len = removeFilters.length; i < len; i++) {
      removeFilters[i].classList.remove("active");
    }
  }
}

function filterSpells() {
  document.querySelectorAll(".spell").forEach((e) => {
    if (activeFilters.length < 1) {
      e.classList.remove("filter-hidden");
      e.classList.add("shown");
    } else {
      var elementData = JSON.stringify(e.dataset);
      if (!activeFilters.every((i) => elementData.includes(i))) {
        e.classList.add("filter-hidden");
        e.classList.remove("shown");
      } else {
        e.classList.remove("filter-hidden");
        e.classList.add("shown");
      }
    }
  });
  hideShowLevels();
}

function removeAllFilters() {
  for (var i = 0, len = filters.length; i < len; i++) {
    filters[i].classList.remove("active");
  }
  var allSpellsHtml = document.querySelectorAll("li.spell");
  for (var i = 0, len = allSpellsHtml.length; i < len; i++) {
    allSpellsHtml[i].classList.remove("filter-hidden-by-name");
  }

  nameFilter.value = "";
  activeFilters.length = 0;

  filterSpells();
  enableFeatures();
  for (var i = 0, len = removeFilters.length; i < len; i++) {
    removeFilters[i].classList.remove("active");
  }
  filtersBlock.classList.remove("open");
}

function disableFeatures() {
  headerLeft.classList.add("disabled");
  headerLeftButton.classList.add("disabled");
  searchBox.classList.add("disabled");
  pageTitle.classList.add("disabled");
  disabledMessage.style.display = "block";
  var controls = document.querySelectorAll(".controls");
  for (let i = 0; i < controls.length; i++) {
    controls[i].classList.add("disabled");
  }
}
function enableFeatures() {
  headerLeft.classList.remove("disabled");
  headerLeftButton.classList.remove("disabled");
  searchBox.classList.remove("disabled");
  pageTitle.classList.remove("disabled");
  disabledMessage.style.display = "none";
  var controls = document.querySelectorAll(".controls");
  for (let i = 0; i < controls.length; i++) {
    controls[i].classList.remove("disabled");
  }
}

///////////////////////////////////////////////////////////////

/////////////////////DESCRIPTION SPELL LINKS///////////////////
// var id = Math.floor(Math.random() * 1000000) + 1;
// var type = "temp";
// fetchSpells(query, type, id);

///////////////////////////////////////////////////////////////

///////////////////SAVE TO LOCALSTORAGE FUNCTION///////////////

function saveSpellSheet() {
  console.log("save action was called");
  var activeSpellsArray = [];
  var spells = document.querySelectorAll("li.spell:not(.favorite)");
  if (spells) {
    for (let i = 0; i < spells.length; i++) {
      activeSpellsArray.push(spells[i].getAttribute("data-name"));
    }
  }
  var favoriteSpellsArray = [];
  var favSpells = document.querySelectorAll("li.spell.favorite");
  if (spells) {
    for (let i = 0; i < favSpells.length; i++) {
      favoriteSpellsArray.push(favSpells[i].getAttribute("data-name"));
    }
  }
  var notesArray = [];
  for (let i = 0; i < spells.length; i++) {
    var note = spells[i].querySelector(".notes p.notes_inner").innerHTML;
    if (note) {
      notesArray.push([spells[i].getAttribute("data-name"), note]);
    }
  }
  if (activeSpellsArray.length) {
    localStorage.setItem("activeSpells", activeSpellsArray.toString());
  } else {
    localStorage.setItem("activeSpells", "");
  }
  if (favoriteSpellsArray.length) {
    localStorage.setItem("favoriteSpells", favoriteSpellsArray.toString());
  } else {
    localStorage.setItem("favoriteSpells", "");
  }
  if (notesArray.length) {
    localStorage.setItem("notes", JSON.stringify(notesArray));
  } else {
    localStorage.setItem("notes", "");
  }
}

/////////////////////////////////////////////////////////////////

///////////////////////PDF FUNCTIONALITY//////////////////////////
exportPdfButton.addEventListener("click", () => {
  exportAsPDF();
});
console.log(window.getComputedStyle(document.body).backgroundColor);
function exportAsPDF() {
  var blocker = document.createElement("div");
  blocker.className = "blocker";
  blocker.innerHTML = '<i class="ri-loader-4-line"></i>';

  blocker.style.backgroundColor = window.getComputedStyle(document.documentElement).backgroundColor;
  blocker.querySelector("i").style.color = window.getComputedStyle(downloadButton).color;
  // blocker.style.backgroundColor = window.getComputedStyle(document.body).backgroundColor;
  window.blocker = blocker;
  document.documentElement.style.fontSize = "10px";

  document.body.appendChild(blocker);
  window.pageNumber = 0;
  window.iterationCount = 0;
  var printLayoutWindow = document.createElement("div");
  printLayoutWindow.id = "print_layout_window";
  window.printLayoutWindow = printLayoutWindow;
  window.printLayoutInner = document.createElement("div");
  window.printLayoutInner.classList.add("layout_inner");
  printLayoutWindow.appendChild(window.printLayoutInner);
  document.body.appendChild(printLayoutWindow);
  window.printLayoutInner = document.querySelectorAll("#print_layout_window .layout_inner");
  window.currentSpells = document.querySelectorAll(".spell.favorite");
  if (window.currentSpells) {
    window.currentType = "favorite";
  } else {
    window.currentType = "normal";
  }
  renderSpells();
  function renderSpells() {
    //
    for (let i = 0; i < window.currentSpells.length; i++) {
      let clone = window.currentSpells[i].cloneNode(true);
      //
      if (window.iterationCount === 8) {
        var newPageLayout = document.createElement("div");
        newPageLayout.classList.add("layout_inner");
        window.printLayoutWindow.appendChild(newPageLayout);
        window.printLayoutInner = document.querySelectorAll("#print_layout_window .layout_inner");
        pageNumber++;
        window.iterationCount = 0;
      }
      window.iterationCount++;
      printLayoutInner[pageNumber].appendChild(clone);
      if (i === window.currentSpells.length - 1 && window.currentType === "favorite") {
        // clone.style.gridColumnStart = '0'
        // clone.style.gridColumnEnd = '2'
        clone.classList.add("last-favorite");
        // clone.style.border = '3px solid black';
      }
      var cloneName = clone.querySelector("h3").innerHTML;
      var cloneLevel = "Level " + clone.getAttribute("data-level");
      if (cloneLevel === "Level cantrip") {
        var cloneLevel = "Cantrip";
      }
      if (window.currentType === "favorite") {
        var innerHTML = cloneName + " <i class='ri-star-fill'></i>";
      } else {
        var innerHTML = cloneName + " <span>" + cloneLevel + "</span>";
      }
      clone.querySelector("h3").innerHTML = innerHTML;
      if (i === window.currentSpells.length - 1 && window.currentType === "normal") {
        window.currentSpells = "";
        //
        setTimeout(() => {
          window.setStyle = document.documentElement.classList;
          document.documentElement.classList = "default print";
          html2pdffunction();
        }, 100);
      } else if (i === window.currentSpells.length - 1 && window.currentType === "favorite") {
        //
        window.currentType = "normal";
        // window.iterationCount = 8;
        window.currentSpells = document.querySelectorAll(".spell:not(.favorite)");
        //
        renderSpells();
      }
    }
  }
}

function html2pdffunction() {
  //
  resizeAllGridItems();
  var opt = {
    margin: 0,
    filename: "spellbook.pdf",
    image: { type: "jpeg", quality: 98 },
    html2canvas: { scale: 2.5, y: 30, x: 449, windowWidth: 1700, windowHeight: 950 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: "legacy" },
  };
  html2pdf()
    .set(opt)
    .from(window.printLayoutWindow)
    .save()
    .then(() => {
      //
      window.printLayoutWindow.remove();
      window.blocker.remove();
      document.documentElement.style.fontSize = "16px";
      document.documentElement.classList = themeSelect.value;
    });
}

function resizeGridItem(item) {
  let grid = item.parentElement;
  let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"));
  let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-row-gap"));
  let rowSpan = Math.ceil((item.querySelector(".spell_inner").getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
  item.style.gridRowEnd = "span " + rowSpan;
  if (item.classList.contains("last-favorite")) {
    // item.style.gridColumnStart = "1";
    // item.style.gridColumnEnd = "3";
  }
}

function resizeAllGridItems() {
  let allItems = document.querySelectorAll("#print_layout_window .spell");
  for (i = 0; i < allItems.length; i++) {
    resizeGridItem(allItems[i]);
  }
}
