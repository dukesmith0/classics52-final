// ── Category Config ──
const CATEGORIES = {
  road:          { color: '#8B4513', label: 'Roads' },
  bridge:        { color: '#FF8C00', label: 'Bridges' },
  tunnel:        { color: '#008080', label: 'Tunnels & Canals' },
  aqueduct:      { color: '#1E90FF', label: 'Aqueducts & Water' },
  bath:          { color: '#9370DB', label: 'Baths' },
  temple:        { color: '#DAA520', label: 'Temples' },
  harbor:        { color: '#003366', label: 'Harbors' },
  public:        { color: '#C0C0C0', label: 'Public & Civic' },
  fortification: { color: '#DC143C', label: 'Fortifications' },
  battle:        { color: '#FF4500', label: 'Battles & Sieges' },
};

// ── Case Studies ──
const CASE_STUDIES = new Set(['via-appia', 'caesarea-maritima']);
var caseStudyAnalysis = {};
var siteContent = null;

// ── State ──
let monuments = [];
let layers = [];       // { monument, layer, isLine }
let activeMonument = null;
let currentSort = 'date';
let clusterGroup = null;
let clusteringEnabled = true;
let hiddenCategories = new Set();

// ── Splash Page ──
var splashEl = document.getElementById('splash');
var splashEnter = document.getElementById('splash-enter');
var appEl = document.getElementById('app');

var howtoModal = document.getElementById('howto-modal');
var howtoClose = document.getElementById('howto-close');
var infoBtn = document.getElementById('info-btn');

splashEnter.addEventListener('click', function () {
  splashEl.classList.add('hidden');
  appEl.classList.remove('hidden');
  howtoModal.classList.remove('hidden');
  setTimeout(function () { map.invalidateSize(); }, 100);
});

howtoClose.addEventListener('click', function () {
  howtoModal.classList.add('hidden');
});

infoBtn.addEventListener('click', function () {
  howtoModal.classList.remove('hidden');
});

document.getElementById('back-btn').addEventListener('click', function () {
  appEl.classList.add('hidden');
  howtoModal.classList.add('hidden');
  splashEl.classList.remove('hidden');
  splashEl.style.opacity = '';
  splashEl.style.visibility = '';
});

// ── Map Initialization ──
var mapBounds = L.latLngBounds(
  L.latLng(10, -25),    // SW: Sahara, Atlantic
  L.latLng(62, 75)      // NE: Scandinavia, Central Asia
);

const map = L.map('map', {
  center: [39, 18],
  zoom: 5,
  minZoom: 4,
  maxZoom: 19,
  zoomControl: false,
  maxBounds: mapBounds,
  maxBoundsViscosity: 1.0,
  worldCopyJump: false,
});

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  maxZoom: 20,
  subdomains: 'abcd',
  noWrap: true,
}).addTo(map);

L.control.zoom({ position: 'bottomright' }).addTo(map);

// ── Sidebar ──
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarClose = document.getElementById('sidebar-close');
const sidebarContent = document.getElementById('sidebar-content');

function openSidebar() {
  sidebar.classList.add('open');
  sidebarToggle.classList.add('hidden');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarToggle.classList.remove('hidden');
  activeMonument = null;
}

sidebarToggle.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);

// ── Sidebar Content ──
function showMonumentDetail(m) {
  activeMonument = m.id;
  const cat = CATEGORIES[m.category] || { color: '#888', label: m.category };

  sidebarContent.innerHTML = '';

  var header = document.createElement('div');
  header.className = 'detail-header';

  var badge = document.createElement('span');
  badge.className = 'detail-category';
  badge.style.background = cat.color;
  badge.textContent = cat.label;

  var title = document.createElement('h2');
  title.className = 'detail-name';
  title.textContent = m.name;

  var meta = document.createElement('p');
  meta.className = 'detail-meta';
  meta.textContent = m.location;

  header.appendChild(badge);
  if (CASE_STUDIES.has(m.id)) {
    var csBadge = document.createElement('span');
    csBadge.className = 'detail-case-study';
    csBadge.textContent = 'Case Study';
    header.appendChild(csBadge);
  }
  header.appendChild(title);
  header.appendChild(meta);

  // Date details
  var dates = document.createElement('div');
  dates.className = 'detail-dates';

  var builtRow = document.createElement('div');
  builtRow.className = 'detail-date-row';
  var builtLabel = document.createElement('span');
  builtLabel.className = 'detail-date-label';
  builtLabel.textContent = 'Built:';
  var builtValue = document.createElement('span');
  builtValue.textContent = m.dateDisplay;
  builtRow.appendChild(builtLabel);
  builtRow.appendChild(builtValue);
  dates.appendChild(builtRow);

  if (m.dateDestroyed != null || m.destroyedNote) {
    var destroyedRow = document.createElement('div');
    destroyedRow.className = 'detail-date-row destroyed';
    var destroyedLabel = document.createElement('span');
    destroyedLabel.className = 'detail-date-label';
    destroyedLabel.textContent = 'Fate:';
    var destroyedValue = document.createElement('span');
    if (m.destroyedNote) {
      destroyedValue.textContent = m.destroyedNote;
    } else {
      destroyedValue.textContent = 'Destroyed ' + formatYear(m.dateDestroyed);
    }
    destroyedRow.appendChild(destroyedLabel);
    destroyedRow.appendChild(destroyedValue);
    dates.appendChild(destroyedRow);
  }

  var body = document.createElement('div');
  body.className = 'detail-body';
  var p = document.createElement('p');
  p.textContent = m.significance;
  body.appendChild(p);

  // Case study extended analysis
  if (CASE_STUDIES.has(m.id) && caseStudyAnalysis[m.id]) {
    // Scroll hint
    var scrollHint = document.createElement('div');
    scrollHint.className = 'detail-scroll-hint';
    scrollHint.textContent = 'Scroll down for case study analysis';
    body.appendChild(scrollHint);

    var analysis = document.createElement('div');
    analysis.className = 'detail-analysis';

    var analysisTitle = document.createElement('h3');
    analysisTitle.textContent = 'Case Study Analysis';
    analysis.appendChild(analysisTitle);

    caseStudyAnalysis[m.id].forEach(function (text) {
      var ap = document.createElement('p');
      var html = text.replace(/\[(\d+)\]/g, '<sup class="endnote-ref">$1</sup>');
      ap.innerHTML = html;
      analysis.appendChild(ap);
    });

    if (siteContent && siteContent.caseStudies && siteContent.caseStudies.caseStudy_endnotes) {
      var notes = document.createElement('div');
      notes.className = 'endnotes';
      var notesTitle = document.createElement('h4');
      notesTitle.textContent = 'Notes';
      notes.appendChild(notesTitle);
      siteContent.caseStudies.caseStudy_endnotes.forEach(function (note) {
        var np = document.createElement('p');
        np.innerHTML = note;
        notes.appendChild(np);
      });
      analysis.appendChild(notes);
    }

    body.appendChild(analysis);
  }

  sidebarContent.appendChild(header);

  // Image (if available)
  if (m.image) {
    var imgWrap = document.createElement('div');
    imgWrap.className = 'detail-image-wrap';
    var img = document.createElement('img');
    img.src = m.image;
    img.alt = m.name;
    img.className = 'detail-image';
    img.loading = 'lazy';
    img.addEventListener('click', function () {
      openLightbox(m.image, m.name, m.imageAttribution || '');
    });
    imgWrap.appendChild(img);
    if (m.imageAttribution) {
      var attr = document.createElement('p');
      attr.className = 'detail-image-attr';
      attr.textContent = m.imageAttribution;
      imgWrap.appendChild(attr);
    }
    sidebarContent.appendChild(imgWrap);
  }

  sidebarContent.appendChild(dates);
  sidebarContent.appendChild(body);
  openSidebar();

  // Scroll sidebar to top so user sees everything
  sidebar.scrollTop = 0;
}

// ── Lightbox ──
var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightbox-img');
var lightboxCaption = document.getElementById('lightbox-caption');
var lightboxAttr = document.getElementById('lightbox-attr');

function openLightbox(src, caption, attribution) {
  lightboxImg.src = src;
  lightboxCaption.textContent = caption;
  lightboxAttr.textContent = attribution || '';
  lightbox.classList.remove('hidden');
}

lightbox.addEventListener('click', function (e) {
  // Close only when clicking backdrop or close button
  if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
  }
});

// ── Timeline Slider ──
const yearSlider = document.getElementById('year-slider');
const yearDisplay = document.getElementById('year-display');
const countDisplay = document.getElementById('monument-count');

function formatYear(year) {
  const num = parseInt(year, 10);
  if (num < 0) return Math.abs(num) + ' BCE';
  if (num === 0) return '1 BCE';
  return num + ' CE';
}

yearSlider.addEventListener('input', function () {
  const text = formatYear(this.value);
  yearDisplay.textContent = text;
  this.setAttribute('aria-valuetext', text);
  filterByYear(parseInt(this.value, 10));
});

// ── Monument Rendering ──
function createMarker(m) {
  const cat = CATEGORIES[m.category] || { color: '#888' };

  var isCaseStudy = CASE_STUDIES.has(m.id);

  if (m.type === 'line' && m.coordinates) {
    var group = L.layerGroup();
    if (isCaseStudy) {
      // Glow layer behind the road
      var glow = L.polyline(m.coordinates, {
        color: '#DAA520',
        weight: 10,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'case-study-glow',
      });
      group.addLayer(glow);
    }
    var polyline = L.polyline(m.coordinates, {
      color: cat.color,
      weight: isCaseStudy ? 4 : 3,
      opacity: 0.8,
    });
    polyline.bindTooltip(m.name + ' (' + m.dateDisplay + ')', { sticky: true });
    polyline.on('click', function () {
      showMonumentDetail(m);
      highlightInList(m.id);
    });
    group.addLayer(polyline);
    return group;
  }

  if (m.lat != null && m.lng != null) {
    var isBattle = m.category === 'battle';

    if (isCaseStudy) {
      var group = L.layerGroup();
      // Pulsing ring
      var pulse = L.circleMarker([m.lat, m.lng], {
        radius: 14,
        fillColor: '#DAA520',
        color: '#DAA520',
        weight: 2,
        fillOpacity: 0.15,
        opacity: 0.6,
        className: 'case-study-pulse',
      });
      group.addLayer(pulse);
      // Main marker
      var marker = L.circleMarker([m.lat, m.lng], {
        radius: 8,
        fillColor: cat.color,
        color: '#DAA520',
        weight: 2.5,
        fillOpacity: 0.9,
      });
      marker.bindTooltip(m.name + ' (' + m.dateDisplay + ')');
      marker.on('click', function () {
        showMonumentDetail(m);
        highlightInList(m.id);
      });
      group.addLayer(marker);
      return group;
    }

    var marker = L.circleMarker([m.lat, m.lng], {
      radius: isBattle ? 7 : 6,
      fillColor: cat.color,
      color: '#fff',
      weight: isBattle ? 2 : 1.5,
      fillOpacity: 0.85,
    });
    marker.bindTooltip(m.name + ' (' + m.dateDisplay + ')');
    marker.on('click', function () {
      showMonumentDetail(m);
      highlightInList(m.id);
    });
    return marker;
  }

  return null;
}

function renderMonuments() {
  layers.forEach(function (item) {
    if (map.hasLayer(item.layer)) {
      map.removeLayer(item.layer);
    }
  });
  if (clusterGroup) {
    map.removeLayer(clusterGroup);
  }
  layers = [];

  clusterGroup = L.markerClusterGroup({
    maxClusterRadius: 35,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    animate: false,
    animateAddingMarkers: false,
    iconCreateFunction: function (cluster) {
      var count = cluster.getChildCount();
      var size = count < 10 ? 'small' : count < 30 ? 'medium' : 'large';
      return L.divIcon({
        html: '<div><span>' + count + '</span></div>',
        className: 'marker-cluster marker-cluster-' + size,
        iconSize: L.point(40, 40),
      });
    },
  });

  monuments.forEach(function (m) {
    const layer = createMarker(m);
    if (layer) {
      var isLine = m.type === 'line';
      var isCaseStudy = CASE_STUDIES.has(m.id);
      layers.push({ monument: m, layer: layer, isLine: isLine, directAdd: isLine || isCaseStudy });
    } else {
      console.warn('Monument missing coordinates:', m.id, m.name);
    }
  });

  map.addLayer(clusterGroup);
  filterByYear(parseInt(yearSlider.value, 10));
}

function filterByYear(year) {
  let visible = 0;
  var categoryCounts = {};

  // Clear cluster group
  if (clusterGroup) clusterGroup.clearLayers();

  // Remove all direct-add layers and unclustered points
  layers.forEach(function (item) {
    if (map.hasLayer(item.layer) && (item.directAdd || !item.isLine)) {
      map.removeLayer(item.layer);
    }
  });

  var pointsToAdd = [];

  layers.forEach(function (item) {
    var m = item.monument;
    var inTimeRange = m.date <= year;
    var categoryVisible = !hiddenCategories.has(m.category);
    var show = inTimeRange && categoryVisible;

    // Count for legend (regardless of category filter)
    if (inTimeRange) {
      categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
    }

    if (show) {
      if (item.directAdd) {
        if (!map.hasLayer(item.layer)) {
          item.layer.addTo(map);
        }
      } else {
        pointsToAdd.push(item.layer);
      }
      visible++;
    } else {
      if (item.directAdd && map.hasLayer(item.layer)) {
        map.removeLayer(item.layer);
      }
    }
  });

  if (clusteringEnabled && clusterGroup) {
    clusterGroup.addLayers(pointsToAdd);
  } else {
    pointsToAdd.forEach(function (l) {
      l.addTo(map);
    });
  }

  if (countDisplay) {
    countDisplay.textContent = visible + ' of ' + layers.length;
  }
  updateLegendCounts(categoryCounts);
  updateListVisibility(year);
}

// ── Monument List ──
const listPanel = document.getElementById('list-panel');
const listToggle = document.getElementById('list-toggle');
const listClose = document.getElementById('list-close');
const listSearch = document.getElementById('list-search');
const listContainer = document.getElementById('list-items');

if (listToggle) {
  listToggle.addEventListener('click', function () {
    listPanel.classList.toggle('open');
  });
}
if (listClose) {
  listClose.addEventListener('click', function () {
    listPanel.classList.remove('open');
  });
}
if (listSearch) {
  listSearch.addEventListener('input', function () {
    filterList(this.value);
  });
}

// Sort buttons
document.querySelectorAll('.list-sort-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.list-sort-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    currentSort = btn.dataset.sort;
    buildList();
    // Re-apply search filter
    if (listSearch && listSearch.value) {
      filterList(listSearch.value);
    }
    updateListVisibility(parseInt(yearSlider.value, 10));
    if (activeMonument) {
      highlightInList(activeMonument);
    }
  });
});

function buildList() {
  if (!listContainer) return;

  var sorted = monuments.slice();
  if (currentSort === 'name') {
    sorted.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  } else if (currentSort === 'image') {
    sorted.sort(function (a, b) {
      var ai = a.image ? 0 : 1;
      var bi = b.image ? 0 : 1;
      if (ai !== bi) return ai - bi;
      return a.date - b.date;
    });
  } else if (currentSort === 'type') {
    var catOrder = Object.keys(CATEGORIES);
    sorted.sort(function (a, b) {
      var ai = catOrder.indexOf(a.category);
      var bi = catOrder.indexOf(b.category);
      if (ai !== bi) return ai - bi;
      return a.date - b.date;
    });
  } else {
    sorted.sort(function (a, b) {
      return a.date - b.date;
    });
  }

  listContainer.innerHTML = '';
  sorted.forEach(function (m) {
    const cat = CATEGORIES[m.category] || { color: '#888', label: m.category };
    const item = document.createElement('div');
    item.className = 'list-item';
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.dataset.id = m.id;
    item.dataset.name = m.name.toLowerCase();
    item.dataset.date = m.date;

    var dot = document.createElement('span');
    dot.className = 'list-dot';
    dot.style.background = cat.color;

    var textWrap = document.createElement('div');
    textWrap.className = 'list-item-text';

    var nameEl = document.createElement('span');
    nameEl.className = 'list-item-name';
    nameEl.textContent = m.name;

    var dateEl = document.createElement('span');
    dateEl.className = 'list-item-date';
    dateEl.textContent = m.dateDisplay;

    textWrap.appendChild(nameEl);
    textWrap.appendChild(dateEl);
    item.appendChild(dot);
    item.appendChild(textWrap);

    item.addEventListener('click', function () {
      selectMonument(m);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectMonument(m);
      }
    });
    listContainer.appendChild(item);
  });
}

function selectMonument(m) {
  showMonumentDetail(m);
  highlightInList(m.id);

  if (m.type === 'line' && m.coordinates) {
    const bounds = L.latLngBounds(m.coordinates);
    map.fitBounds(bounds, { padding: [50, 50] });
  } else if (m.lat != null && m.lng != null) {
    map.setView([m.lat, m.lng], 8);
  }

  if (m.date > parseInt(yearSlider.value, 10)) {
    yearSlider.value = m.date;
    const text = formatYear(m.date);
    yearDisplay.textContent = text;
    yearSlider.setAttribute('aria-valuetext', text);
    filterByYear(m.date);
  }
}

function highlightInList(id) {
  if (!listContainer) return;
  var items = listContainer.querySelectorAll('.list-item');
  items.forEach(function (el) {
    el.classList.toggle('active', el.dataset.id === id);
  });
}

function filterList(query) {
  if (!listContainer) return;
  const q = query.toLowerCase();
  var items = listContainer.querySelectorAll('.list-item');
  items.forEach(function (el) {
    var match = el.dataset.name.indexOf(q) !== -1;
    el.style.display = match ? '' : 'none';
  });
}

function updateListVisibility(year) {
  if (!listContainer) return;
  var items = listContainer.querySelectorAll('.list-item');
  items.forEach(function (el) {
    var date = parseInt(el.dataset.date, 10);
    el.classList.toggle('future', date > year);
  });
}

// ── Legend (collapsible, filterable, with counts) ──
function buildLegend() {
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'legend');

    var toggle = document.createElement('div');
    toggle.className = 'legend-toggle';

    var label = document.createElement('strong');
    label.textContent = 'Legend';

    var arrow = document.createElement('span');
    arrow.className = 'legend-arrow';
    arrow.textContent = '\u25BC';

    toggle.appendChild(label);
    toggle.appendChild(arrow);

    var body = document.createElement('div');
    body.className = 'legend-body';

    // Clustering toggle
    var clusterRow = document.createElement('div');
    clusterRow.className = 'legend-cluster-toggle';
    var clusterCheckbox = document.createElement('input');
    clusterCheckbox.type = 'checkbox';
    clusterCheckbox.checked = true;
    clusterCheckbox.id = 'cluster-toggle';
    var clusterLabel = document.createElement('label');
    clusterLabel.htmlFor = 'cluster-toggle';
    clusterLabel.textContent = 'Clustering';
    clusterRow.appendChild(clusterCheckbox);
    clusterRow.appendChild(clusterLabel);
    body.appendChild(clusterRow);

    clusterCheckbox.addEventListener('change', function () {
      clusteringEnabled = this.checked;
      if (clusteringEnabled) {
        map.addLayer(clusterGroup);
      } else {
        map.removeLayer(clusterGroup);
      }
      filterByYear(parseInt(yearSlider.value, 10));
    });

    // Category items
    Object.keys(CATEGORIES).forEach(function (key) {
      var cat = CATEGORIES[key];
      var item = document.createElement('div');
      item.className = 'legend-item legend-filter';
      item.dataset.category = key;

      var dot = document.createElement('span');
      dot.className = 'legend-dot';
      dot.style.background = cat.color;

      var text = document.createElement('span');
      text.className = 'legend-label';
      text.textContent = cat.label;

      var count = document.createElement('span');
      count.className = 'legend-count';
      count.dataset.category = key;
      count.textContent = '0';

      item.appendChild(dot);
      item.appendChild(text);
      item.appendChild(count);
      body.appendChild(item);

      item.addEventListener('click', function () {
        item.classList.toggle('disabled');
        if (hiddenCategories.has(key)) {
          hiddenCategories.delete(key);
        } else {
          hiddenCategories.add(key);
        }
        filterByYear(parseInt(yearSlider.value, 10));
      });
    });

    div.appendChild(toggle);
    div.appendChild(body);

    toggle.addEventListener('click', function () {
      div.classList.toggle('collapsed');
    });

    L.DomEvent.disableClickPropagation(div);
    return div;
  };
  legend.addTo(map);
}

function updateLegendCounts(counts) {
  document.querySelectorAll('.legend-count').forEach(function (el) {
    var cat = el.dataset.category;
    el.textContent = counts[cat] || 0;
  });
}

// ── Populate Splash & How to Use from content.json ──
function populateContent(content) {
  siteContent = content;
  caseStudyAnalysis = content.caseStudies || {};

  // Splash title & subtitle
  var titleEl = document.getElementById('splash-title');
  var subtitleEl = document.getElementById('splash-subtitle');
  if (titleEl) titleEl.textContent = content.splash.title;
  if (subtitleEl) subtitleEl.textContent = content.splash.subtitle;

  // Curatorial statement
  var curatorialEl = document.getElementById('curatorial-text');
  if (curatorialEl) {
    content.splash.curatorial.forEach(function (text) {
      var p = document.createElement('p');
      var html = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\[(\d+)\]/g, '<sup class="endnote-ref">$1</sup>');
      p.innerHTML = html;
      curatorialEl.appendChild(p);
    });
    // Endnotes
    if (content.splash.curatorial_endnotes) {
      var notes = document.createElement('div');
      notes.className = 'endnotes';
      var notesTitle = document.createElement('h4');
      notesTitle.textContent = 'Notes';
      notes.appendChild(notesTitle);
      content.splash.curatorial_endnotes.forEach(function (note) {
        var p = document.createElement('p');
        p.innerHTML = note;
        notes.appendChild(p);
      });
      curatorialEl.appendChild(notes);
    }
  }

  // Contributions
  var contribEl = document.getElementById('contributions-text');
  if (contribEl) {
    ['duke', 'jeremy'].forEach(function (key) {
      var c = content.contributions[key];
      var div = document.createElement('div');
      div.className = 'contribution';
      var h4 = document.createElement('h4');
      h4.textContent = c.name;
      var p = document.createElement('p');
      p.textContent = c.text;
      div.appendChild(h4);
      div.appendChild(p);
      contribEl.appendChild(div);
    });
  }

  // Bibliography
  var bibEl = document.getElementById('bibliography-list');
  if (bibEl) {
    content.bibliography.forEach(function (entry) {
      var li = document.createElement('li');
      li.innerHTML = entry;
      bibEl.appendChild(li);
    });
  }

  // Authors & course
  var authorsEl = document.getElementById('splash-authors');
  var courseEl = document.getElementById('splash-course');
  if (authorsEl) authorsEl.textContent = content.splash.authors;
  if (courseEl) courseEl.textContent = content.splash.course;

  // How to Use
  var howtoGrid = document.getElementById('howto-grid');
  if (howtoGrid) {
    content.howto.forEach(function (item) {
      var div = document.createElement('div');
      div.className = 'howto-item';

      var icon = document.createElement('span');
      icon.className = 'howto-icon';
      icon.textContent = item.icon;

      var h4 = document.createElement('h4');
      h4.textContent = item.title;

      var p = document.createElement('p');
      p.textContent = item.text;

      div.appendChild(icon);
      div.appendChild(h4);
      div.appendChild(p);
      howtoGrid.appendChild(div);
    });
  }

  // Animate splash elements with stagger
  var splashContent = document.querySelector('.splash-content');
  var splashItems = splashContent.children;
  // Force a reflow so the initial opacity:0 is applied before transitioning
  splashContent.offsetHeight;
  splashContent.classList.add('animated');
  var delay = 100;
  for (var i = 0; i < splashItems.length; i++) {
    (function(el, d) {
      setTimeout(function () {
        el.classList.add('splash-visible');
      }, d);
    })(splashItems[i], delay);
    delay += 150;
  }
}

// ── Load Data ──
Promise.all([
  fetch('monuments.json').then(function (r) { return r.json(); }),
  fetch('content.json').then(function (r) { return r.json(); }),
])
  .then(function (results) {
    monuments = results[0];
    populateContent(results[1]);
    renderMonuments();
    buildList();
    buildLegend();
  })
  .catch(function (err) {
    console.error('Failed to load data:', err);
    var errorEl = document.createElement('div');
    errorEl.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(20,20,30,0.9);color:#f0e6d3;padding:24px;border-radius:8px;z-index:9999;text-align:center;';
    errorEl.textContent = 'Failed to load data. Please serve this page via a local HTTP server.';
    document.body.appendChild(errorEl);
  });
