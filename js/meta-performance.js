/**
 * Meta Ads Manager – Performance table with all columns and footer sums
 */
(function() {
  'use strict';

  var campaigns = [
    { name: 'Piracii Coffee - Campaign | MK', delivery: 'Off', actions: '—', attribution: '7-day click or ...', results: '—', resultsSecondary: 'Landing Page View', reach: 1240, frequency: '—', costPerResult: '—', costPerResultSecondary: 'Per Landing Page View', budget: 'Using ad set bu...', budgetSecondary: '', amountSpent: 0, ends: 'Ongoing', impressions: '—', cpm: '—', linkClicks: 0, shopClicks: 0, cpc: '—', ctr: '—', clicksAll: 0, ctrAll: '—', cpcAll: '—', landingViews: 0, costLanding: '—' },
    { name: 'CBO_E88 Pro_AIDoers_Sales_11_9_25', delivery: 'Off', actions: '—', attribution: '7-day click, 1-...', results: '—', resultsSecondary: 'LEADS', reach: 2156, frequency: '—', costPerResult: '—', costPerResultSecondary: 'Per LEADS', budget: '$25.00', budgetSecondary: 'Daily', amountSpent: 0, ends: 'Ongoing', impressions: '—', cpm: '—', linkClicks: 0, shopClicks: 0, cpc: '—', ctr: '—', clicksAll: 0, ctrAll: '—', cpcAll: '—', landingViews: 0, costLanding: '—' },
    { name: 'CONV_ABO_AIDoers_11_06_25', delivery: 'Off', actions: '—', attribution: '1-day click', results: '—', resultsSecondary: 'LEADS', reach: 0, frequency: '—', costPerResult: '—', costPerResultSecondary: 'Per LEADS', budget: 'Using ad set bu...', budgetSecondary: '', amountSpent: 0, ends: 'Ongoing', impressions: '—', cpm: '—', linkClicks: 0, shopClicks: 0, cpc: '—', ctr: '—', clicksAll: 0, ctrAll: '—', cpcAll: '—', landingViews: 0, costLanding: '—' },
    { name: 'AWARE_CBO_AIDoers_11_06_25', delivery: 'Off', actions: '—', attribution: '7-day click or ...', results: '—', resultsSecondary: 'Reach', reach: 956, frequency: '—', costPerResult: '—', costPerResultSecondary: 'Per 1,000 People Rea...', budget: 'Using ad set bu...', budgetSecondary: '', amountSpent: 0, ends: 'Ongoing', impressions: '—', cpm: '—', linkClicks: 0, shopClicks: 0, cpc: '—', ctr: '—', clicksAll: 0, ctrAll: '—', cpcAll: '—', landingViews: 0, costLanding: '—' },
    { name: 'CONV_ABO_AIDoers_11_06_25', delivery: 'Off', actions: '—', attribution: '1-day click', results: '—', resultsSecondary: 'LEADS', reach: 3421, frequency: '—', costPerResult: '—', costPerResultSecondary: 'Per LEADS', budget: 'Using ad set bu...', budgetSecondary: '', amountSpent: 0, ends: 'Ongoing', impressions: '—', cpm: '—', linkClicks: 0, shopClicks: 0, cpc: '—', ctr: '—', clicksAll: 0, ctrAll: '—', cpcAll: '—', landingViews: 0, costLanding: '—' },
    { name: 'CONV_ABO_AIDoers_11_06_25', delivery: 'Off', actions: '—', attribution: '1-day click', results: '—', resultsSecondary: 'LEADS', reach: 1789, frequency: '—', costPerResult: '—', costPerResultSecondary: 'Per LEADS', budget: 'Using ad set bu...', budgetSecondary: '', amountSpent: 0, ends: 'Ongoing', impressions: '—', cpm: '—', linkClicks: 0, shopClicks: 0, cpc: '—', ctr: '—', clicksAll: 0, ctrAll: '—', cpcAll: '—', landingViews: 0, costLanding: '—' },
    { name: 'TOF_CBO_Pro_10_01_25', delivery: 'Off', actions: '—', attribution: '7-day click or ...', results: '—', resultsSecondary: 'Landing Page View', reach: 2543, frequency: '—', costPerResult: '—', costPerResultSecondary: 'Per LEADS', budget: 'Using ad set bu...', budgetSecondary: '', amountSpent: 12.45, ends: 'Ongoing', impressions: 3821, cpm: '—', linkClicks: 42, shopClicks: 8, cpc: '—', ctr: '—', clicksAll: 50, ctrAll: '—', cpcAll: '—', landingViews: 38, costLanding: '—' },
    { name: 'LEAD_CBO_AIDoers_10_28_25', delivery: 'Off', actions: '—', attribution: '7-day click, 1-...', results: '—', resultsSecondary: 'LEADS', reach: 4567, frequency: '—', costPerResult: '—', costPerResultSecondary: 'Per LEADS', budget: '$25.00', budgetSecondary: 'Daily', amountSpent: 34.20, ends: 'Ongoing', impressions: 5432, cpm: '—', linkClicks: 67, shopClicks: 12, cpc: '—', ctr: '—', clicksAll: 79, ctrAll: '—', cpcAll: '—', landingViews: 61, costLanding: '—' },
    { name: 'Brand_ABO_AIDoers_09_20_25', delivery: 'Off', actions: '—', attribution: '7-day click, 1-...', results: '—', resultsSecondary: 'LEADS', reach: 5123, frequency: '—', costPerResult: '—', costPerResultSecondary: 'Per LEADS', budget: 'Using ad set bu...', budgetSecondary: '', amountSpent: 56.80, ends: 'Ongoing', impressions: 12345, cpm: '—', linkClicks: 98, shopClicks: 15, cpc: '—', ctr: '—', clicksAll: 113, ctrAll: '—', cpcAll: '—', landingViews: 89, costLanding: '—' }
  ];

  var fixedBody = document.getElementById('campaignTableBodyFixed');
  var scrollableBody = document.getElementById('campaignTableBodyScrollable');
  var tableFooter = document.getElementById('tableFooter');
  var tableFooterSums = document.getElementById('tableFooterSums');
  var tableScrollable = document.querySelector('.table-scrollable');
  var tableFixedInner = document.querySelector('.table-fixed-inner');
  var fixedTable = document.querySelector('.table-fixed table');
  var scrollableTable = document.querySelector('.table-scrollable table');

  function formatCurrency(n) {
    return typeof n === 'number' ? '$' + n.toFixed(2) : '—';
  }

  function formatNumber(n) {
    if (typeof n !== 'number' || isNaN(n)) return '—';
    if (n >= 1000) return n.toLocaleString();
    return String(n);
  }

  function renderTables() {
    if (!fixedBody || !scrollableBody) return;
    fixedBody.innerHTML = '';
    scrollableBody.innerHTML = '';

    campaigns.forEach(function(campaign) {
      var fixedRow = document.createElement('tr');
      fixedRow.setAttribute('data-campaign', campaign.name);
      fixedRow.innerHTML =
        '<td class="col-toggle">' +
          '<input type="checkbox" aria-label="Select campaign ' + campaign.name + '">' +
          '<div class="toggle" role="switch" aria-checked="false" aria-label="Toggle ' + campaign.name + '" tabindex="0">' +
            '<span class="toggle-knob"></span>' +
          '</div>' +
        '</td>' +
        '<td class="col-campaign">' +
          '<a href="#" class="campaign-link">' + campaign.name + '</a>' +
        '</td>';
      fixedBody.appendChild(fixedRow);

      var deliveryHtml = campaign.delivery === 'Off'
        ? '<span class="delivery-off"><span class="delivery-dot"></span> Off</span>'
        : campaign.delivery;

      var budgetHtml = campaign.budget;
      if (campaign.budgetSecondary) {
        budgetHtml += '<span class="budget-secondary">' + campaign.budgetSecondary + '</span>';
      }

      var resultsHtml = '—';
      if (campaign.resultsSecondary) {
        resultsHtml = '—<span class="results-secondary">' + campaign.resultsSecondary + '</span>';
      }

      var costPerResultHtml = (campaign.costPerResult === '—' || campaign.costPerResult === undefined) ? '—' : campaign.costPerResult;
      if (campaign.costPerResultSecondary) {
        costPerResultHtml += '<span class="results-secondary">' + campaign.costPerResultSecondary + '</span>';
      }
      if (costPerResultHtml === '—' && campaign.costPerResultSecondary) {
        costPerResultHtml = '—<span class="results-secondary">' + campaign.costPerResultSecondary + '</span>';
      }

      var reachHtml = typeof campaign.reach === 'number' && campaign.reach > 0 ? formatNumber(campaign.reach) : '—';
      var amountSpentHtml = typeof campaign.amountSpent === 'number' ? formatCurrency(campaign.amountSpent) : '—';
      var impressionsHtml = typeof campaign.impressions === 'number' ? formatNumber(campaign.impressions) : (campaign.impressions || '—');
      var linkClicksHtml = typeof campaign.linkClicks === 'number' && campaign.linkClicks > 0 ? formatNumber(campaign.linkClicks) : '—';
      var shopClicksHtml = typeof campaign.shopClicks === 'number' && campaign.shopClicks > 0 ? formatNumber(campaign.shopClicks) : '—';
      var clicksAllHtml = typeof campaign.clicksAll === 'number' && campaign.clicksAll > 0 ? formatNumber(campaign.clicksAll) : '—';
      var landingViewsHtml = typeof campaign.landingViews === 'number' && campaign.landingViews > 0 ? formatNumber(campaign.landingViews) : '—';

      var scrollableRow = document.createElement('tr');
      scrollableRow.setAttribute('data-campaign', campaign.name);
      scrollableRow.innerHTML =
        '<td class="col-delivery">' + deliveryHtml + '</td>' +
        '<td class="col-actions">' + campaign.actions + '</td>' +
        '<td class="col-attribution">' + campaign.attribution + '</td>' +
        '<td class="col-results">' + resultsHtml + '</td>' +
        '<td class="col-reach">' + reachHtml + '</td>' +
        '<td class="col-frequency">' + (campaign.frequency || '—') + '</td>' +
        '<td class="col-cost-per-result">' + costPerResultHtml + '</td>' +
        '<td class="col-budget">' + budgetHtml + '</td>' +
        '<td class="col-amount-spent">' + amountSpentHtml + '</td>' +
        '<td class="col-ends">' + campaign.ends + '</td>' +
        '<td class="col-impressions">' + impressionsHtml + '</td>' +
        '<td class="col-cpm">' + (campaign.cpm || '—') + '</td>' +
        '<td class="col-link-clicks">' + linkClicksHtml + '</td>' +
        '<td class="col-shop-clicks">' + shopClicksHtml + '</td>' +
        '<td class="col-cpc">' + (campaign.cpc || '—') + '</td>' +
        '<td class="col-ctr">' + (campaign.ctr || '—') + '</td>' +
        '<td class="col-clicks-all">' + clicksAllHtml + '</td>' +
        '<td class="col-ctr-all">' + (campaign.ctrAll || '—') + '</td>' +
        '<td class="col-cpc-all">' + (campaign.cpcAll || '—') + '</td>' +
        '<td class="col-landing-views">' + landingViewsHtml + '</td>' +
        '<td class="col-cost-landing">' + (campaign.costLanding || '—') + '</td>';
      scrollableBody.appendChild(scrollableRow);
    });

    updateFooter();
    updateFooterSums();
    initToggles();
    initCheckboxes();
    syncRowHeights();
  }

  function updateFooter() {
    if (!tableFooter) return;
    var n = campaigns.length;
    tableFooter.textContent = n === 1 ? 'Results from 1 campaign' : 'Results from ' + n + ' campaigns';
  }

  function updateFooterSums() {
    if (!tableFooterSums) return;
    var sumAmountSpent = 0;
    var sumImpressions = 0;
    var sumReach = 0;
    var sumLinkClicks = 0;
    var sumShopClicks = 0;
    var sumClicksAll = 0;
    var sumLandingViews = 0;

    campaigns.forEach(function(c) {
      if (typeof c.amountSpent === 'number') sumAmountSpent += c.amountSpent;
      if (typeof c.impressions === 'number') sumImpressions += c.impressions;
      if (typeof c.reach === 'number') sumReach += c.reach;
      if (typeof c.linkClicks === 'number') sumLinkClicks += c.linkClicks;
      if (typeof c.shopClicks === 'number') sumShopClicks += c.shopClicks;
      if (typeof c.clicksAll === 'number') sumClicksAll += c.clicksAll;
      if (typeof c.landingViews === 'number') sumLandingViews += c.landingViews;
    });

    var parts = [];
    parts.push('<span class="table-footer-sum-item"><strong>Amount spent:</strong> ' + formatCurrency(sumAmountSpent) + '</span>');
    parts.push('<span class="table-footer-sum-item"><strong>Impressions:</strong> ' + (sumImpressions > 0 ? formatNumber(sumImpressions) : '0') + '</span>');
    parts.push('<span class="table-footer-sum-item"><strong>Reach:</strong> ' + (sumReach > 0 ? formatNumber(sumReach) : '0') + '</span>');
    parts.push('<span class="table-footer-sum-item"><strong>Link clicks:</strong> ' + (sumLinkClicks > 0 ? formatNumber(sumLinkClicks) : '0') + '</span>');
    parts.push('<span class="table-footer-sum-item"><strong>Shop clicks:</strong> ' + (sumShopClicks > 0 ? formatNumber(sumShopClicks) : '0') + '</span>');
    parts.push('<span class="table-footer-sum-item"><strong>Clicks (all):</strong> ' + (sumClicksAll > 0 ? formatNumber(sumClicksAll) : '0') + '</span>');
    parts.push('<span class="table-footer-sum-item"><strong>Landing page views:</strong> ' + (sumLandingViews > 0 ? formatNumber(sumLandingViews) : '0') + '</span>');

    tableFooterSums.innerHTML = parts.join('');
  }

  function syncRowHeights() {
    if (!fixedTable || !scrollableTable) return;
    var fixedRows = fixedTable.querySelectorAll('tbody tr');
    var scrollableRows = scrollableTable.querySelectorAll('tbody tr');
    fixedRows.forEach(function(fixedRow, i) {
      if (scrollableRows[i]) {
        var h = Math.max(fixedRow.offsetHeight, scrollableRows[i].offsetHeight);
        if (h > 0) {
          fixedRow.style.height = h + 'px';
          scrollableRows[i].style.height = h + 'px';
        }
      }
    });
  }

  function initScrollSync() {
    if (!tableScrollable || !tableFixedInner) return;
    tableScrollable.addEventListener('scroll', function() {
      tableFixedInner.scrollTop = tableScrollable.scrollTop;
    });
  }

  function initToggles() {
    document.querySelectorAll('.toggle').forEach(function(toggle) {
      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('on');
        this.setAttribute('aria-checked', this.classList.contains('on'));
      });
      toggle.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          this.classList.toggle('on');
          this.setAttribute('aria-checked', this.classList.contains('on'));
        }
      });
    });
  }

  function initCheckboxes() {
    var headerCheckbox = document.querySelector('.table-wrap thead input[type="checkbox"]');
    if (headerCheckbox) {
      headerCheckbox.addEventListener('change', function() {
        var checked = this.checked;
        fixedBody.querySelectorAll('tr').forEach(function(row) {
          var cb = row.querySelector('input[type="checkbox"]');
          if (cb) cb.checked = checked;
        });
      });
    }
    fixedBody.querySelectorAll('tr').forEach(function(row) {
      var cb = row.querySelector('input[type="checkbox"]');
      if (cb) {
        cb.addEventListener('change', function() {});
      }
    });
  }

  if (fixedBody && scrollableBody) {
    renderTables();
    initScrollSync();
    window.addEventListener('resize', function() {
      setTimeout(syncRowHeights, 50);
    });
    setTimeout(syncRowHeights, 100);
  }
})();
