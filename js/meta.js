/**
 * Meta Ads Manager Campaigns Dashboard
 * Production-ready implementation with synchronized table scrolling
 */
(function() {
  'use strict';

  // ============================================================================
  // STATIC DATA
  // ============================================================================
  
  var campaigns = [
    {
      name: 'Piracii Coffee - Campaign | MK',
      delivery: 'Off',
      actions: '—',
      bidStrategy: 'Using ad set bid strategy',
      budget: 'Using ad set budget',
      attribution: '7-day click or 1-day view',
      results: 'Landing Page View',
      reach: '1,240',
      impressions: '3,821',
      costPerResult: 'Per Landing Page View',
      amountSpent: '$12.45',
      ends: 'Ongoing'
    },
    {
      name: 'CBO_E88 Pro_AIDoers_Sales_11_9_25',
      delivery: 'Off',
      actions: '—',
      bidStrategy: 'Highest volume',
      budget: '$25.00 Daily',
      attribution: '7-day click, 1-day view',
      results: 'LEADS',
      reach: '2,156',
      impressions: '5,432',
      costPerResult: 'Per LEADS',
      amountSpent: '$34.20',
      ends: 'Ongoing'
    },
    {
      name: 'CONV_ABO_AIDoers_11_06_25',
      delivery: 'Off',
      actions: '—',
      bidStrategy: 'Using ad set bid strategy',
      budget: 'Using ad set budget',
      attribution: '1-day click',
      results: '—',
      reach: '',
      impressions: '8,921',
      costPerResult: '—',
      amountSpent: '$18.75',
      ends: 'Ongoing'
    },
    {
      name: 'AWARE_CBO_AIDoers_11_06_25',
      delivery: 'Off',
      actions: '—',
      bidStrategy: 'Using ad set bid strategy',
      budget: 'Using ad set budget',
      attribution: '7-day click or 1-day view',
      results: 'Landing Page View',
      reach: '956',
      impressions: '2,134',
      costPerResult: 'Per Landing Page View',
      amountSpent: '$8.90',
      ends: 'Ongoing'
    },
    {
      name: 'LEAD_CBO_AIDoers_10_28_25',
      delivery: 'Off',
      actions: '—',
      bidStrategy: 'Using ad set bid strategy',
      budget: 'Using ad set budget',
      attribution: '7-day click, 1-day view',
      results: 'LEADS',
      reach: '3,421',
      impressions: '7,856',
      costPerResult: 'Per LEADS',
      amountSpent: '$42.15',
      ends: 'Ongoing'
    },
    {
      name: 'Retarget_ABO_AIDoers_10_15_25',
      delivery: 'Off',
      actions: '—',
      bidStrategy: 'Using ad set bid strategy',
      budget: 'Using ad set budget',
      attribution: '1-day click',
      results: '—',
      reach: '1,789',
      impressions: '4,523',
      costPerResult: '—',
      amountSpent: '$15.60',
      ends: 'Ongoing'
    },
    {
      name: 'TOF_CBO_Pro_10_01_25',
      delivery: 'Off',
      actions: '—',
      bidStrategy: 'Using ad set bid strategy',
      budget: 'Using ad set budget',
      attribution: '7-day click or 1-day view',
      results: 'Landing Page View',
      reach: '2,543',
      impressions: '6,789',
      costPerResult: 'Per Landing Page View',
      amountSpent: '$28.40',
      ends: 'Ongoing'
    },
    {
      name: 'Brand_ABO_AIDoers_09_20_25',
      delivery: 'Off',
      actions: '—',
      bidStrategy: 'Using ad set bid strategy',
      budget: 'Using ad set budget',
      attribution: '7-day click, 1-day view',
      results: 'Video views',
      reach: '4,567',
      impressions: '12,345',
      costPerResult: 'Per Video View',
      amountSpent: '$56.80',
      ends: 'Ongoing'
    }
  ];

  // ============================================================================
  // DOM ELEMENTS
  // ============================================================================
  
  var fixedBody = document.getElementById('campaignTableBodyFixed');
  var scrollableBody = document.getElementById('campaignTableBodyScrollable');
  var fixedTable = document.querySelector('.table-fixed table');
  var scrollableTable = document.querySelector('.table-scrollable table');
  var tableScrollable = document.querySelector('.table-scrollable');
  var tableFixedInner = document.querySelector('.table-fixed-inner');
  var tableFooter = document.getElementById('tableFooter');
  var selectedPill = document.getElementById('selectedPill');
  var selectedCount = document.getElementById('selectedCount');
  var actionTabs = document.getElementById('actionTabs');
  var deselectAllBtn = document.getElementById('deselectAll');
  
  // Track selected campaigns
  var selectedCampaigns = new Set();

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Throttle function execution to limit how often it runs
   * @param {Function} func - Function to throttle
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Throttled function
   */
  function throttle(func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      if (!timeout) {
        timeout = setTimeout(function() {
          timeout = null;
          func.apply(context, args);
        }, wait);
      }
    };
  }

  /**
   * Update footer text with current visible campaign count
   */
  function updateFooter() {
    var visibleCount = fixedBody.querySelectorAll('tr:not(.row-hidden)').length;
    var text = visibleCount === 1 
      ? 'Results from 1 campaign' 
      : 'Results from ' + visibleCount + ' campaigns';
    tableFooter.textContent = text;
  }

  /**
   * Update selected pill and tabs visibility based on selection count
   */
  function updateSelectionUI() {
    var count = selectedCampaigns.size;
    if (count > 0) {
      selectedPill.style.display = 'flex';
      actionTabs.style.display = 'flex';
      selectedCount.textContent = count.toString();
      // Update action tab text with count
      var actionTabButtons = actionTabs.querySelectorAll('.action-tab');
      if (actionTabButtons.length >= 2) {
        actionTabButtons[0].querySelector('span').textContent = 'Ad sets for ' + count + ' Campaign' + (count > 1 ? 's' : '');
        actionTabButtons[1].querySelector('span').textContent = 'Ads for ' + count + ' Campaign' + (count > 1 ? 's' : '');
      }
    } else {
      selectedPill.style.display = 'none';
      actionTabs.style.display = 'none';
    }
  }

  /**
   * Toggle row selection state
   */
  function toggleRowSelection(campaignName, isSelected) {
    var fixedRow = fixedBody.querySelector('tr[data-campaign="' + campaignName + '"]');
    var scrollableRow = scrollableBody.querySelector('tr[data-campaign="' + campaignName + '"]');
    var checkbox = fixedRow ? fixedRow.querySelector('input[type="checkbox"]') : null;
    
    if (isSelected) {
      selectedCampaigns.add(campaignName);
      if (fixedRow) fixedRow.classList.add('selected');
      if (scrollableRow) scrollableRow.classList.add('selected');
      if (checkbox) checkbox.checked = true;
    } else {
      selectedCampaigns.delete(campaignName);
      if (fixedRow) fixedRow.classList.remove('selected');
      if (scrollableRow) scrollableRow.classList.remove('selected');
      if (checkbox) checkbox.checked = false;
    }
    updateSelectionUI();
  }

  // ============================================================================
  // TABLE RENDERING
  // ============================================================================

  /**
   * Render both fixed-left and scrollable-right tables from campaign data
   * Ensures both tables always have the same number of rows
   */
  function renderTables() {
    fixedBody.innerHTML = '';
    scrollableBody.innerHTML = '';

    campaigns.forEach(function(campaign, index) {
      var isSelected = false; // No default selection
      
      // Create fixed-left row (Off/On toggle + Campaign name)
      var fixedRow = document.createElement('tr');
      fixedRow.setAttribute('data-campaign', campaign.name);
      if (isSelected) {
        fixedRow.classList.add('selected');
        selectedCampaigns.add(campaign.name);
      }
      fixedRow.innerHTML = 
        '<td class="col-toggle">' +
          '<input type="checkbox" aria-label="Select campaign ' + campaign.name + '"' + (isSelected ? ' checked' : '') + '>' +
          '<div class="toggle" role="switch" aria-checked="false" aria-label="Toggle campaign ' + campaign.name + '" tabindex="0">' +
            '<span class="toggle-knob"></span>' +
          '</div>' +
        '</td>' +
        '<td class="col-campaign">' +
          '<a href="#" class="campaign-link">' + campaign.name + '</a>' +
        '</td>';
      fixedBody.appendChild(fixedRow);

      // Create scrollable-right row (all other columns)
      var scrollableRow = document.createElement('tr');
      scrollableRow.setAttribute('data-campaign', campaign.name);
      if (isSelected) {
        scrollableRow.classList.add('selected');
      }
      
      // Format delivery column with dot indicator if "Off"
      var deliveryHtml = campaign.delivery === 'Off' 
        ? '<span class="delivery-off"><span class="delivery-dot"></span> Off</span>' 
        : campaign.delivery;
      
      // Format budget column (split "Daily" or other suffixes)
      var budgetHtml = campaign.budget;
      if (campaign.budget.indexOf('Daily') !== -1) {
        var parts = campaign.budget.split(' Daily');
        budgetHtml = parts[0] + '<span class="budget-secondary">Daily</span>';
      }
      
      // Format results column (show "—" with secondary text below)
      var resultsHtml = '—';
      if (campaign.results && campaign.results !== '—') {
        resultsHtml = '—<span class="results-secondary">' + campaign.results + '</span>';
      }
      
      // Format reach column (show "—" when empty or text, numbers when present)
      var reachHtml = campaign.reach;
      if (campaign.reach === 'Reach' || campaign.reach === '' || !campaign.reach.match(/^\d/)) {
        reachHtml = '—';
      }
      
      scrollableRow.innerHTML = 
        '<td class="col-delivery">' + deliveryHtml + '</td>' +
        '<td class="col-actions">' + campaign.actions + '</td>' +
        '<td class="col-bid">' + campaign.bidStrategy + '</td>' +
        '<td class="col-budget">' + budgetHtml + '</td>' +
        '<td class="col-attribution">' + campaign.attribution + '</td>' +
        '<td class="col-results">' + resultsHtml + '</td>' +
        '<td class="col-reach">' + reachHtml + '</td>' +
        '<td class="col-impressions">' + campaign.impressions + '</td>' +
        '<td class="col-cost-per-result">' + campaign.costPerResult + '</td>' +
        '<td class="col-amount-spent">' + campaign.amountSpent + '</td>' +
        '<td class="col-ends">' + campaign.ends + '</td>';
      scrollableBody.appendChild(scrollableRow);
    });

    // Initialize interactive elements after rendering
    initToggles();
    initCheckboxes();
    updateSelectionUI();
    syncRowHeights();
    updateFooter();
  }

  // ============================================================================
  // TABLE SYNCHRONIZATION
  // ============================================================================

  /**
   * Synchronize row heights between fixed-left and scrollable-right tables
   * Ensures visual alignment when content wraps or varies in height
   */
  function syncRowHeights() {
    if (!fixedTable || !scrollableTable) return;
    
    var fixedRows = fixedTable.querySelectorAll('tbody tr:not(.row-hidden)');
    var scrollableRows = scrollableTable.querySelectorAll('tbody tr:not(.row-hidden)');
    
    fixedRows.forEach(function(fixedRow, index) {
      if (scrollableRows[index]) {
        var fixedHeight = fixedRow.offsetHeight;
        var scrollableHeight = scrollableRows[index].offsetHeight;
        var maxHeight = Math.max(fixedHeight, scrollableHeight);
        
        if (maxHeight > 0) {
          fixedRow.style.height = maxHeight + 'px';
          scrollableRows[index].style.height = maxHeight + 'px';
        }
      }
    });
  }

  // Throttled version for performance (runs max once per 16ms ~ 60fps)
  var throttledSyncRowHeights = throttle(syncRowHeights, 16);

  /**
   * Synchronize vertical scroll position between tables
   * When right table scrolls vertically, left table scrolls to match
   */
  function syncVerticalScroll() {
    if (tableFixedInner && tableScrollable) {
      tableFixedInner.scrollTop = tableScrollable.scrollTop;
    }
  }

  /**
   * Initialize scroll synchronization between fixed and scrollable tables
   * Uses requestAnimationFrame to prevent scroll jank
   */
  function initScrollSync() {
    if (!tableScrollable || !tableFixedInner) return;
    
    var isScrolling = false;
    tableScrollable.addEventListener('scroll', function() {
      if (!isScrolling) {
        isScrolling = true;
        syncVerticalScroll();
        requestAnimationFrame(function() {
          isScrolling = false;
        });
      }
    });
  }

  // ============================================================================
  // INTERACTIVE ELEMENTS
  // ============================================================================

  /**
   * Initialize toggle switches with click and keyboard support
   * Toggles are used to turn campaigns on/off
   */
  function initToggles() {
  document.querySelectorAll('.toggle').forEach(function(toggle) {
      var isOn = toggle.classList.contains('on');
      toggle.setAttribute('aria-checked', isOn);
      
      // Click handler
      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('on');
        this.setAttribute('aria-checked', this.classList.contains('on'));
      });
      
      // Keyboard handler (Space or Enter)
    toggle.addEventListener('keydown', function(e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.classList.toggle('on');
        this.setAttribute('aria-checked', this.classList.contains('on'));
      }
    });
    });
  }

  /**
   * Initialize checkbox selection functionality
   */
  function initCheckboxes() {
    // Header checkbox (select all)
    var headerCheckbox = document.querySelector('thead input[type="checkbox"]');
    if (headerCheckbox) {
      headerCheckbox.addEventListener('change', function() {
        var isChecked = this.checked;
        fixedBody.querySelectorAll('tr:not(.row-hidden)').forEach(function(row) {
          var checkbox = row.querySelector('input[type="checkbox"]');
          var campaignName = row.getAttribute('data-campaign');
          if (checkbox && campaignName) {
            checkbox.checked = isChecked;
            toggleRowSelection(campaignName, isChecked);
          }
        });
      });
    }

    // Row checkboxes
    fixedBody.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
      checkbox.addEventListener('change', function(e) {
        e.stopPropagation();
        var row = this.closest('tr');
        var campaignName = row ? row.getAttribute('data-campaign') : null;
        if (campaignName) {
          toggleRowSelection(campaignName, this.checked);
        }
      });
    });

    // Row click to select (optional, for better UX)
    fixedBody.querySelectorAll('tr').forEach(function(row) {
      row.addEventListener('click', function(e) {
        // Don't trigger on checkbox or toggle clicks
        if (e.target.type === 'checkbox' || e.target.closest('.toggle')) {
          return;
        }
        var checkbox = this.querySelector('input[type="checkbox"]');
        var campaignName = this.getAttribute('data-campaign');
        if (checkbox && campaignName) {
          checkbox.checked = !checkbox.checked;
          toggleRowSelection(campaignName, checkbox.checked);
        }
      });
    });

    // Also make scrollable rows clickable
    scrollableBody.querySelectorAll('tr').forEach(function(row) {
      row.addEventListener('click', function(e) {
        var campaignName = this.getAttribute('data-campaign');
        if (campaignName) {
          var fixedRow = fixedBody.querySelector('tr[data-campaign="' + campaignName + '"]');
          var checkbox = fixedRow ? fixedRow.querySelector('input[type="checkbox"]') : null;
          if (checkbox) {
            checkbox.checked = !checkbox.checked;
            toggleRowSelection(campaignName, checkbox.checked);
          }
        }
      });
    });
  }

  /**
   * Initialize search functionality
   * Filters campaigns by name in both fixed and scrollable tables
   */
  function initSearch() {
  var searchInput = document.getElementById('searchCampaigns');
    if (!searchInput) return;
    
  searchInput.addEventListener('input', function() {
      var query = this.value.trim().toLowerCase();
      var fixedRows = fixedBody.querySelectorAll('tr');
      var scrollableRows = scrollableBody.querySelectorAll('tr');
      
      // Show/hide rows based on search query
      fixedRows.forEach(function(tr, index) {
        var campaignName = (tr.getAttribute('data-campaign') || '').toLowerCase();
        var shouldShow = !query || campaignName.indexOf(query) !== -1;
        
        tr.classList.toggle('row-hidden', !shouldShow);
        if (scrollableRows[index]) {
          scrollableRows[index].classList.toggle('row-hidden', !shouldShow);
        }
      });
      
      // Re-sync heights and update footer after filtering
      throttledSyncRowHeights();
      updateFooter();
    });
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize the dashboard
   */
  function init() {
    // Render tables from static data
    renderTables();
    
    // Initialize scroll synchronization
    initScrollSync();
    
    // Initialize search functionality
    initSearch();
    
    // Deselect all handler
    if (deselectAllBtn) {
      deselectAllBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        selectedCampaigns.clear();
        fixedBody.querySelectorAll('tr').forEach(function(row) {
          row.classList.remove('selected');
          var checkbox = row.querySelector('input[type="checkbox"]');
          if (checkbox) checkbox.checked = false;
        });
        scrollableBody.querySelectorAll('tr').forEach(function(row) {
          row.classList.remove('selected');
        });
        updateSelectionUI();
      });
    }
    
    // Handle window resize (re-sync row heights)
    window.addEventListener('resize', throttledSyncRowHeights);
    
    // Initial sync after render (small delay to ensure DOM is ready)
    setTimeout(function() {
      syncRowHeights();
      syncVerticalScroll();
    }, 100);

    // Initialize tab switching
    document.querySelectorAll('.tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(function(t) { 
          t.classList.remove('active'); 
        });
        this.classList.add('active');
      });
    });

    // Initialize action tabs
    if (actionTabs) {
      actionTabs.querySelectorAll('.action-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
          actionTabs.querySelectorAll('.action-tab').forEach(function(t) {
            t.classList.remove('active');
          });
          this.classList.add('active');
        });
      });
    }

    // Initialize opportunity score tooltip
    var opportunityBadge = document.getElementById('opportunityBadge');
    var opportunityTooltip = document.getElementById('opportunityTooltip');
    var opportunityTooltipClose = document.getElementById('opportunityTooltipClose');

    // Show tooltip on hover
    if (opportunityBadge && opportunityTooltip) {
      opportunityBadge.addEventListener('mouseenter', function() {
        opportunityTooltip.classList.add('visible');
      });
    }

    // Hide tooltip only when close button is clicked
    if (opportunityTooltipClose) {
      opportunityTooltipClose.addEventListener('click', function(e) {
        e.stopPropagation();
        if (opportunityTooltip) {
          opportunityTooltip.classList.remove('visible');
        }
      });
    }
  }

  // Start the application
  init();
})();