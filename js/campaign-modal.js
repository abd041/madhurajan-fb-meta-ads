/**
 * Campaign Objective Modal – Meta Ads Manager
 * Handles open/close, objective selection, and preview panel updates.
 */

(function () {
  "use strict";

  // ----- Data: campaign objectives -----
  // listIconPosition: mask-position Y for modal-list-icons.png (px)
  // previewIconPosition: background-position Y for modal-right-images.png (px)
  var OBJECTIVES = {
    awareness: {
      id: "awareness",
      title: "Awareness",
      description: "Reach people who are more likely to remember your ads.",
      aboutLink: "About awareness",
      goodFor: ["Reach", "Brand awareness", "Video views"],
      listIconPosition: "-399px",
      previewIconPosition: "-171px"
    },
    traffic: {
      id: "traffic",
      title: "Traffic",
      description: "Send people to a destination, like your website, app, Instagram profile or Facebook event.",
      aboutLink: "About traffic",
      goodFor: ["Link clicks", "Landing page views"],
      listIconPosition: "-231px",
      previewIconPosition: "-855px"
    },
    engagement: {
      id: "engagement",
      title: "Engagement",
      description: "Get more messages, video views, post engagement or leads.",
      aboutLink: "About engagement",
      goodFor: ["Messages", "Video views", "Post engagement", "Lead generation"],
      listIconPosition: "-420px",
      previewIconPosition: "-1026px"
    },
    leads: {
      id: "leads",
      title: "Leads",
      description: "Collect leads for your business or brand.",
      aboutLink: "About leads",
      goodFor: ["Website and instant forms", "Instant forms", "Messenger, Instagram and WhatsApp"],
      listIconPosition: "-294px",
      previewIconPosition: "-513px"
    },
    "app-promotion": {
      id: "app-promotion",
      title: "App promotion",
      description: "Find new people to install your app and continue using it.",
      aboutLink: "About app promotion",
      goodFor: ["App installs", "App events"],
      listIconPosition: "-589px",
      previewIconPosition: "0"
    },
    sales: {
      id: "sales",
      title: "Sales",
      description: "Find people likely to purchase your product or service.",
      aboutLink: "About sales",
      goodFor: ["Conversions", "Catalog sales", "Messenger, Instagram and WhatsApp"],
      listIconPosition: "-819px",
      previewIconPosition: "-684px"
    }
  };

  var OBJECTIVE_ORDER = ["awareness", "traffic", "engagement", "leads", "app-promotion", "sales"];

  // ----- DOM refs -----
  var overlay = document.getElementById("modalOverlay");
  var modal = document.getElementById("campaignModal");
  var btnCreate = document.getElementById("btnCreateCampaign");
  var btnClose = document.getElementById("modalClose");
  var btnCancel = document.getElementById("btnCancel");
  var btnContinue = document.getElementById("btnContinue");
  var previewPanel = document.getElementById("previewPanel");
  var previewPlaceholder = document.getElementById("previewPlaceholder");
  var previewContent = document.getElementById("previewContent");
  var previewIllustration = document.getElementById("previewIllustration");
  var objectivesListEl = document.getElementById("objectivesList");
  var objectivesLayout = document.getElementById("objectivesLayout");
  var previewTitle = document.getElementById("previewTitle");
  var previewDescription = document.getElementById("previewDescription");
  var previewLink = document.getElementById("previewLink");
  var previewLinkText = document.getElementById("previewLinkText");
  var previewGoodFor = document.getElementById("previewGoodFor");
  var previewChips = document.getElementById("previewChips");
  var buyingTypeDropdown = document.getElementById("buyingTypeDropdown");
  var buyingTypeTrigger = document.getElementById("buyingTypeTrigger");
  var buyingTypeTriggerText = document.getElementById("buyingTypeTriggerText");
  var buyingTypePanel = document.getElementById("buyingTypePanel");

  // ----- State -----
  var selectedObjectiveId = null;
  var hoveredObjectiveId = null;
  var selectedBuyingType = "auction";
  var buyingTypeOptions = {
    auction: { title: "Auction", subtitle: "Buy in real-time with cost effective bidding." },
    reservation: { title: "Reservation", subtitle: "Buy in advance for more predictable outcomes." }
  };

  // ----- Helpers -----
  function getObjectiveIdFromItem(item) {
    return item && item.getAttribute && item.getAttribute("data-objective");
  }

  function getObjective(id) {
    return id ? OBJECTIVES[id] : null;
  }

  function getActiveObjectiveId() {
    return selectedObjectiveId || hoveredObjectiveId;
  }

  function renderPreview(objectiveId) {
    var objective = getObjective(objectiveId);
    if (!objective) {
      if (previewPlaceholder) {
        previewPlaceholder.classList.remove("hidden");
        previewPlaceholder.hidden = false;
      }
      if (previewContent) previewContent.hidden = true;
      if (previewGoodFor) previewGoodFor.hidden = true;
      clearIllustration();
      return;
    }
    if (previewPlaceholder) {
      previewPlaceholder.classList.add("hidden");
      previewPlaceholder.hidden = true;
    }
    if (previewContent) previewContent.hidden = false;
    if (previewGoodFor) previewGoodFor.hidden = false;
    previewTitle.textContent = objective.title;
    previewDescription.textContent = objective.description;
    previewLinkText.textContent = objective.title.toLowerCase();
    previewLink.setAttribute("href", "#about-" + objective.id);
    previewLink.textContent = "About " + objective.title.toLowerCase();
    setIllustration(objective);
    renderChips(objective.goodFor);
  }

  function setIllustration(objective) {
    clearIllustration();
    if (!objective || !previewIllustration) return;
    var icon = document.createElement("i");
    icon.className = "preview-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.style.backgroundImage = "url(icons/modal-right-images.png)";
    icon.style.backgroundPosition = "0px " + (objective.previewIconPosition || "0px");
    icon.style.backgroundSize = "auto";
    icon.style.backgroundRepeat = "no-repeat";
    previewIllustration.appendChild(icon);
  }

  function clearIllustration() {
    if (previewIllustration) {
      previewIllustration.innerHTML = "";
      previewIllustration.style.background = "";
    }
  }

  function renderObjectivesList() {
    if (!objectivesListEl) return;
    objectivesListEl.innerHTML = "";
    OBJECTIVE_ORDER.forEach(function (id) {
      var obj = OBJECTIVES[id];
      if (!obj) return;
      var li = document.createElement("li");
      li.className = "objective-item";
      li.setAttribute("data-objective", obj.id);
      var radioId = "obj-" + obj.id;
      li.innerHTML =
        '<input type="radio" name="objective" id="' + radioId + '" value="' + obj.id + '" class="objective-radio">' +
        '<label for="' + radioId + '" class="objective-label">' +
        '<span class="objective-icon-wrap">' +
        '<i class="objective-list-icon" aria-hidden="true" style="' +
        '-webkit-mask-image: url(icons/modal-list-icons.png); -webkit-mask-position: 0px ' + obj.listIconPosition + '; -webkit-mask-repeat: no-repeat; ' +
        'mask-image: url(icons/modal-list-icons.png); mask-position: 0px ' + obj.listIconPosition + '; mask-repeat: no-repeat;' +
        '"></i>' +
        '</span>' +
        '<span class="objective-name">' + obj.title + '</span>' +
        '</label>';
      objectivesListEl.appendChild(li);
    });
  }

  function renderChips(labels) {
    previewChips.innerHTML = "";
    if (!labels || !labels.length) return;
    labels.forEach(function (label) {
      var chip = document.createElement("div");
      chip.className = "preview-chip";
      chip.textContent = label;
      previewChips.appendChild(chip);
    });
  }

  function syncListStates() {
    var activeId = getActiveObjectiveId();
    var items = document.querySelectorAll(".objective-item");
    items.forEach(function (item) {
      var id = getObjectiveIdFromItem(item);
      item.classList.toggle("is-selected", id === selectedObjectiveId);
      item.classList.toggle("is-hovered", id === hoveredObjectiveId && id !== selectedObjectiveId);
    });
    var selectedRadio = document.querySelector(".objective-radio[value='" + selectedObjectiveId + "']");
    if (selectedRadio) selectedRadio.checked = true;
  }

  function updateContinueButton() {
    var hasSelection = !!selectedObjectiveId;
    btnContinue.disabled = !hasSelection;
    btnContinue.classList.toggle("btn--disabled", !hasSelection);
  }

  function openModal() {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    if (modal) modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    bindObjectiveHover();
  }

  function closeModal() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    if (modal) modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    unbindObjectiveHover();
  }

  function selectObjective(id) {
    selectedObjectiveId = id || null;
    syncListStates();
    updateContinueButton();
    renderPreview(getActiveObjectiveId());
  }

  function setHovered(id) {
    hoveredObjectiveId = id || null;
    syncListStates();
    renderPreview(getActiveObjectiveId());
  }

  // ----- Event: open modal -----
  function onOpenClick(e) {
    e.preventDefault();
    openModal();
  }

  // ----- Event: close modal -----
  function onCloseClick(e) {
    e.preventDefault();
    closeModal();
  }

  function onOverlayClick(e) {
    if (e.target === overlay) closeModal();
  }

  function onKeydown(e) {
    if (e.key !== "Escape") return;
    if (buyingTypeDropdown && buyingTypeDropdown.classList.contains("is-open")) {
      closeBuyingTypeDropdown();
      e.stopPropagation();
      return;
    }
    if (overlay.classList.contains("is-open")) closeModal();
  }

  // ----- Buying type dropdown -----
  function openBuyingTypeDropdown() {
    if (!buyingTypeDropdown || !buyingTypeTrigger || !buyingTypePanel) return;
    buyingTypeDropdown.classList.add("is-open");
    buyingTypeTrigger.setAttribute("aria-expanded", "true");
    buyingTypePanel.setAttribute("aria-hidden", "false");
  }

  function closeBuyingTypeDropdown() {
    if (!buyingTypeDropdown || !buyingTypeTrigger || !buyingTypePanel) return;
    buyingTypeDropdown.classList.remove("is-open");
    buyingTypeTrigger.setAttribute("aria-expanded", "false");
    buyingTypePanel.setAttribute("aria-hidden", "true");
  }

  function setBuyingType(value) {
    var opt = buyingTypeOptions[value];
    if (!opt) return;
    selectedBuyingType = value;
    if (buyingTypeTriggerText) buyingTypeTriggerText.textContent = opt.title;
    var options = buyingTypePanel ? buyingTypePanel.querySelectorAll(".buying-type-option") : [];
    options.forEach(function (el) {
      var isSelected = el.getAttribute("data-value") === value;
      el.classList.toggle("buying-type-option--selected", isSelected);
      el.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
    closeBuyingTypeDropdown();
  }

  function onBuyingTypeTriggerClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (buyingTypeDropdown.classList.contains("is-open")) {
      closeBuyingTypeDropdown();
    } else {
      openBuyingTypeDropdown();
    }
  }

  function onBuyingTypeOptionClick(e) {
    var option = e.currentTarget;
    var value = option.getAttribute("data-value");
    if (value) setBuyingType(value);
  }

  function onDocumentClick(e) {
    if (!buyingTypeDropdown || !buyingTypeDropdown.classList.contains("is-open")) return;
    if (buyingTypeDropdown.contains(e.target)) return;
    closeBuyingTypeDropdown();
  }

  // ----- Event: objective hover (delegated for reliable hover) -----
  function findObjectiveItem(el) {
    while (el && el !== document.body) {
      if (el.classList && el.classList.contains("objective-item")) return el;
      el = el.parentNode;
    }
    return null;
  }

  function onObjectivesLayoutMouseOver(e) {
    var item = findObjectiveItem(e.target);
    if (item) {
      var id = getObjectiveIdFromItem(item);
      setHovered(id);
    }
  }

  function onObjectivesLayoutMouseLeave(e) {
    setHovered(null);
  }

  function bindObjectiveHover() {
    if (objectivesLayout) {
      objectivesLayout.addEventListener("mouseover", onObjectivesLayoutMouseOver);
      objectivesLayout.addEventListener("mouseleave", onObjectivesLayoutMouseLeave);
    }
  }

  function unbindObjectiveHover() {
    if (objectivesLayout) {
      objectivesLayout.removeEventListener("mouseover", onObjectivesLayoutMouseOver);
      objectivesLayout.removeEventListener("mouseleave", onObjectivesLayoutMouseLeave);
    }
  }

  // ----- Event: objective select (click) -----
  function onObjectiveClick(e) {
    var item = e.currentTarget;
    var id = getObjectiveIdFromItem(item);
    if (id) selectObjective(id);
  }

  // ----- Event: radio change (optional, for keyboard) -----
  function onRadioChange(e) {
    var value = e.target.value;
    if (OBJECTIVES[value]) selectObjective(value);
  }

  // ----- Attach listeners -----
  function bindEvents() {
    if (btnCreate) btnCreate.addEventListener("click", onOpenClick);
    if (btnClose) btnClose.addEventListener("click", onCloseClick);
    if (btnCancel) btnCancel.addEventListener("click", onCloseClick);
    if (overlay) overlay.addEventListener("click", onOverlayClick);
    document.addEventListener("keydown", onKeydown);

    if (buyingTypeTrigger) buyingTypeTrigger.addEventListener("click", onBuyingTypeTriggerClick);
    if (buyingTypePanel) {
      var options = buyingTypePanel.querySelectorAll(".buying-type-option");
      options.forEach(function (opt) {
        opt.addEventListener("click", onBuyingTypeOptionClick);
      });
    }
    document.addEventListener("click", onDocumentClick);

    if (objectivesListEl) {
      objectivesListEl.querySelectorAll(".objective-item").forEach(function (item) {
        item.addEventListener("click", onObjectiveClick);
      });
    }

    var radios = document.querySelectorAll(".objective-radio");
    radios.forEach(function (radio) {
      radio.addEventListener("change", onRadioChange);
    });
  }

  // ----- Init -----
  function init() {
    renderObjectivesList();
    bindEvents();
    selectObjective("awareness");
    if (overlay && overlay.classList.contains("is-open")) {
      bindObjectiveHover();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
