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
var spellsLoading = document.getElementById("spells_loading");
var resultsContainer = document.getElementById("results");
var loadingAnimation = document.getElementById("loading");
var allSpellLists = document.getElementById("spellsheet_wrapper");
var spellLists = document.querySelectorAll("ul.spells");
var prefsButton = document.getElementById("visual_prefs_button");
var prefsPanel = document.getElementById("visual_prefs_panel");
var themeSelect = document.getElementById("theme_select");
var brightnessSlider = document.getElementById("brightness");
var contrastSlider = document.getElementById("contrast");
var headerLeft = document.querySelector("#header .header_left");
var tempSpellContainer = document.getElementById("temp_spell");
var nameFilter = document.getElementById("name_filter");
var noResultsFiltered = document.getElementById("no_results_filtered");
var noSpells = document.getElementById("no_spells");
var removeFilters = document.querySelectorAll(".remove-filters");
var filtersBlock = document.getElementById("filters");
var pageTitle = document.getElementById("page_title");
var disabledMessage = document.getElementById("disabled_message");
var bookmarksBar = document.getElementById("bookmarks");
var bookmarks = bookmarksBar.querySelectorAll(".bookmark_inner:not(.icon)");
const activeSpellsArray = [];
var fromstorage = false;

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
const delay = async (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));
if (localStorage.activeSpells) {
  var type = "direct";
  var array = "";
  populateSpellsFromStorage(array, type);
}

async function populateSpellsFromStorage(array, el) {
  spellsLoading.style.display = 'block';
  var type = el;
  if (!array) {
    var activeSpellsArray = localStorage.activeSpells.split(",");
  } else {
    var activeSpellsArray = array.split(",");
  }
  for (var i = 0, len = activeSpellsArray.length; i < len; i++) {
    var query = activeSpellsArray[i];
    fetchSpells(query, type, activeSpellsArray.length);
    await delay(50);
  }

  setTimeout(() => {
    spellsLoading.style.display = "none";
  }, 100);
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

function fetchSpells(query, type, length) {
  fetch("../spells.json")
    .then((res) => res.json())
    .then((data) => {
      let results = [];
      let resultsIndex = [];
      for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].name.toLowerCase().includes(query.toLowerCase())) {
          results.push(data[i]);
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
var iteration = 0;
async function addToSheet(e, type, length) {
  if (length) {
    iteration++
  }
  const spell = document.createElement("li");
  if (type !== "import" && activeSpellsArray.includes(e.name)) {
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
  var descriptionSpellLinks = description.match(/\[(.*?)\]/g);
  if (descriptionSpellLinks) {
    descriptionSpellLinks.forEach((e) => {
      var spellTitle = e.replace("[", "").replace("]", "");
      var spellLink = '<a href="#" class="spell_link">' + spellTitle + "</a>";
      description = description.replace(e, spellLink);
    });
  }
  // console.log(description)

  spell.innerHTML =
    '<div class="spell_inner"><div class="controls"></i></a><a href="#" class="moveup_spell"><span>Move spell up</span><i class="ri-arrow-up-s-line"></i></a><a href="#" class="movedown_spell"><span>Move spell down</span><i class="ri-arrow-down-s-line"></i></a><a href="#" class="remove_spell"><span>Remove spell</span><i class="ri-close-line"></i></a></div><h3><i class="' +
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
    "</p></li></ul><div class='description_wrapper'><p>" +
    description +
    "</p></div>" +
    higherLevel +
    "</div>";
  // console.log(e)
  if (e.level === "cantrip") {
    var spellLevel = 0;
  } else {
    var spellLevel = e.level;
  }
  // console.log(spellLists);
  if (type === "temp") {
    tempSpellContainer.appendChild(spell);
    tempSpellContainer.parentElement.style.display = "block";
    document.body.style.position = "fixed";
    document.body.style.overflowY = "scroll";
    spell.querySelector(".remove_spell").addEventListener("click", (e) => {
      event.preventDefault();
      spell.remove();
      tempSpellContainer.parentElement.style.display = "none";
      document.body.style.position = "static";
      document.body.style.overflowY = "auto";
    });
  } else {
    if (!activeSpellsArray.includes(e.name)) {
      activeSpellsArray.push(e.name);
    }
    spellLists[spellLevel].appendChild(spell);
    noSpells.style.display = "none";
    
    bindRemoveMoveSpell(spell);

    if (descriptionSpellLinks) {
      spell.querySelectorAll("a.spell_link").forEach((e) => {
        e.addEventListener("click", () => {
          event.preventDefault();
          var query = e.innerHTML;
          var type = "temp";
          fetchSpells(query, type);
        });
      });
    }
    if (length) {
      if (iteration >= length) {
        hideShowLevels();
        checkUpDownSetOrder();
        saveSpellSheet();
        var length = '';
        spellsLoading.style.display = 'none';
      }
    } else {
      hideShowLevels();
      checkUpDownSetOrder();
      saveSpellSheet();
    }
  }
}

function bindRemoveMoveSpell(e) {
  ///////////////REMOVE SPELL FUNCTION///////////////////
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
    }
    checkUpDownSetOrder();
    hideShowLevels();
  });
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
  spellLists.forEach((e) => {
    if (e.querySelectorAll(".shown").length > 0) {
      e.style.display = "grid";
      bookmarksBar.querySelector("[data-level='" + e.getAttribute("data-level") + "']").style.display = "block";
      noResultsFiltered.style.display = "none";
      if (e.previousElementSibling) {
        e.previousElementSibling.style.display = "block";
      }
    } else {
      e.style.display = "none";
      bookmarksBar.querySelector("[data-level='" + e.getAttribute("data-level") + "']").style.display = "none";
      if (e.previousElementSibling) {
        e.previousElementSibling.style.display = "none";
      }
    }
  });
  setTimeout(() => {
    if (allSpellLists.clientHeight < 10 && activeFilters.length > 0) {
      noResultsFiltered.style.display = "block";
    }
  }, 10);
  if (activeSpellsArray.length < 1) {
    filtersBlock.classList.add("disabled");
    bookmarksBar.style.display = "none";
  } else {
    filtersBlock.classList.remove("disabled");
    bookmarksBar.style.display = "block";
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

document.querySelector("button").addEventListener("click", () => {
  downloadFile();
});

function downloadFile() {
  saveSpellSheet();
  const activeSpellsSave = localStorage.activeSpells;
  let a = document.createElement("a");
  var name = prompt("Filename:");
  if (typeof a.download !== "undefined") a.download = name + ".json";
  a.href = URL.createObjectURL(
    new Blob([activeSpellsSave], {
      type: "application/octet-stream",
    })
  );
  a.dispatchEvent(new MouseEvent("click"));
}

////////////////////SAVE FILE UPLOAD/IMPORT/////////////////

document.getElementById("input-file").addEventListener("change", getFile);

function getFile(event) {
  let text = "Importing a spellbook will overwrite your current spells. Do you want to continue?";
  if (confirm(text) == true) {
    spellsLoading.style.display = 'block';
    const input = event.target;
    if ("files" in input && input.files.length > 0) {
      spellLists.forEach((e) => {
        e.innerHTML = "";
      });
      const activeSpellsArray = [];
      placeFileContent(activeSpellsArray, input.files[0]);
    }
  }
}

function placeFileContent(target, file) {
  readFileContent(file)
    .then((content) => {
      const activeSpellsArray = content.toString();
      saveSpellSheet();
      var type = "import";
      populateSpellsFromStorage(activeSpellsArray, type);
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

let filters = document.querySelectorAll("#filters .filter a");
for (var i = 0, len = filters.length; i < len; i++) {
  filters[i].addEventListener("click", (event) => {
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
    for (var i = 0, len = allSpellsHtml.length; i < len; i++) {
      if (!allSpellsHtml[i].getAttribute("data-name").toLowerCase().includes(nameFilter.value.toLowerCase())) {
        allSpellsHtml[i].classList.add("filter-hidden-by-name");
      } else {
        allSpellsHtml[i].classList.remove("filter-hidden-by-name");
      }
    }
    for (var i = 0, len = removeFilters.length; i < len; i++) {
      removeFilters[i].classList.add("active");
    }
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
}

function disableFeatures() {
  headerLeft.classList.add("disabled");
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
  console.log('save called')
  // console.log(activeSpellsArray);
  var activeSpellsArray = [];
  var spells = document.querySelectorAll("li.spell");
  if (spells) {
    for (let i = 0; i < spells.length; i++) {
      activeSpellsArray.push(spells[i].getAttribute("data-name"));
    }
  }
  if (activeSpellsArray.length) {
    localStorage.setItem("activeSpells", activeSpellsArray.toString());
  } else {
    localStorage.setItem("activeSpells", "");
  }
}


/////////////////////////////////////////////////////////////////
