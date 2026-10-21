(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var C = { blue: '#4aa3ff', teal: '#2dd4bf', gold: '#f5b83d', purple: '#a78bfa', red: '#ff5a5f', green: '#4ade80', ink: '#e8efff', dim: '#9fb0d6' };

  // ---- Step data: edit the text here ----
  var STEPS = [
    { t: 'Customer opens a browser', s: 'Placing an order',
      plain: "Ravi runs a restaurant. A customer sits down, opens a browser and types the restaurant's website address, like writing an order on a slip.",
      tech: 'Client (web browser) and URL',
      watch: 'The Customer box on the left shows the address being typed.' },
    { t: 'Request reaches the server', s: 'The order slip travels',
      plain: 'The customer is the client: the one who asks. The restaurant is the server: the one who answers. The order slip (HTTP request) goes to the reception desk (web server) first.',
      tech: 'HTTP request, client versus server, web server',
      watch: 'An envelope leaves the customer, passes the reception desk and enters the restaurant.' },
    { t: 'Apache Tomcat starts', s: 'The kitchen manager arrives',
      plain: 'Tomcat is the kitchen manager who knows how to run Java programs. Orders are taken at service counter number 8080. The JVM is the engine that makes Java programs run.',
      tech: 'Apache Tomcat (Java servlet container) listening on port 8080, running on the JVM',
      watch: 'The teal Tomcat box appears with the Port 8080 counter on its left edge and the JVM engine inside.' },
    { t: 'Deploy a Java application', s: 'Opening a new menu',
      plain: 'Ravi packs a new service into one box, the WAR file. Putting it in the webapps folder is like opening a new menu: Tomcat unpacks it and starts serving it.',
      tech: 'WAR file deployed to the webapps directory (deployment)',
      watch: 'A package moves from the WAR box into the webapps folder.' },
    { t: 'Process the request', s: 'The chef cooks the order',
      plain: 'Tomcat reads the order slip and hands it to the right chef, the Java Servlet. The chef follows the recipe from the installed app and prepares the result.',
      tech: 'Tomcat passes the HTTP request to a Java Servlet',
      watch: 'The envelope reaches the servlet and a gear shows the chef working.' },
    { t: 'Generate the response', s: 'The dish is served',
      plain: 'The chef can fill in a menu template (JSP) that changes with each order. The finished page (HTML) goes back to the customer. A check mark means the order succeeded.',
      tech: 'JSP, HTML response, HTTP status 200 OK',
      watch: 'A document travels back along the green path to the customer and a check mark appears.' },
    { t: 'Handle multiple users', s: 'Many orders at once',
      plain: 'Many customers order at the same time. Tomcat keeps a pool of kitchen staff. Each order gets a free cook, and the cook returns to the pool when done.',
      tech: 'Thread pool, concurrent requests',
      watch: 'Three customers send envelopes together while the Thread pool shows the cooks.' },
    { t: 'Monitor and troubleshoot', s: 'Read the daily register',
      plain: "Tomcat writes everything into the daily activity register (logs folder). If something breaks, the admin reads it. Two programs fighting for counter 8080 is a port conflict.",
      tech: 'logs/catalina.out and localhost logs, port conflict, service status, HTTP 404 and 500',
      watch: 'A warning travels into the Logs folder, a clipboard shows normal activity, and the status turns to running.' },
    { t: 'Deploy and manage in the real world', s: 'Run it for real',
      plain: 'The whole cycle repeats for every order. Ravi can redeploy a new WAR or restart the kitchen. Real restaurants use HTTPS to seal order slips, apply security updates and keep settings in order.',
      tech: 'Redeploy, restart, HTTPS (TLS), security patches, configuration (server.xml)',
      watch: 'Everything is visible now: HTTPS seal, redeploy and restart notes, and a second package arriving.' }
  ];
  var LEGEND = [['✉️', 'Customer request (order slip)'], ['📦', 'WAR deployment'], ['⚙️', 'Java processing'], ['📄', 'HTML response'], ['✅', 'Successful response'], ['⚠️', 'Error'], ['📋', 'Log entry']];

  // ---- SVG helpers ----
  var layers = { wire: [], box: [], pkt: [] };
  function mk(tag, a, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in a) e.setAttribute(k, a[k]);
    if (text != null) e.textContent = text;
    return e;
  }
  function grp(layer, step) {
    var g = mk('g', { 'class': 'el', 'data-step': step });
    layers[layer].push(g);
    return g;
  }
  function txt(g, x, y, s, size, fill, weight) {
    g.appendChild(mk('text', { x: x, y: y, 'font-size': size, fill: fill, 'font-weight': weight || 600, 'text-anchor': 'middle' }, s));
  }
  function label(step, x, y, s, size, col, anchor) {
    var g = grp('box', step);
    g.appendChild(mk('text', { x: x, y: y, 'font-size': size, fill: col, 'font-weight': 800, 'text-anchor': anchor || 'start' }, s));
  }
  function zone(step, x, y, w, h, col) {
    var g = grp('box', step);
    g.appendChild(mk('rect', { x: x, y: y, width: w, height: h, rx: 14, fill: col, 'fill-opacity': 0.07, stroke: col, 'stroke-width': 1.6 }));
  }
  function node(step, x, y, w, h, col, t1, t2) {
    var g = grp('box', step);
    g.appendChild(mk('rect', { x: x, y: y, width: w, height: h, rx: 8, fill: '#0b1630' }));
    g.appendChild(mk('rect', { x: x, y: y, width: w, height: h, rx: 8, fill: col, 'fill-opacity': 0.18, stroke: col, 'stroke-width': 1.6 }));
    txt(g, x + w / 2, t2 ? y + 22 : y + h / 2 + 4, t1, 11, C.ink, 800);
    if (t2) txt(g, x + w / 2, y + 38, t2, 9, C.dim, 400);
    return g;
  }
  function wire(step, id, d, col) {
    grp('wire', step).appendChild(mk('path', { id: id, d: d, 'class': 'wire', stroke: col, fill: 'none' }));
  }
  function pk(step, emoji, id, dur, begin) {
    var g = grp('pkt', step);
    var t = mk('text', { 'class': 'pk', 'font-size': 17, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, emoji);
    var am = mk('animateMotion', { dur: dur + 's', begin: (begin || 0) + 's', repeatCount: 'indefinite' });
    var mp = mk('mpath', {});
    mp.setAttribute('href', '#' + id);
    am.appendChild(mp); t.appendChild(am); g.appendChild(t);
  }

  // ---- Diagram: wires first, boxes second, packets last ----
  // wires
  wire(2, 'wR', 'M120,295 L350,295', C.blue);
  wire(5, 'wP2', 'M460,295 L520,295', C.purple);
  wire(5, 'wWA', 'M595,410 L595,325', C.gold);
  wire(6, 'wSJ', 'M670,295 L720,295', C.purple);
  wire(6, 'wD', 'M795,325 L795,365 L65,365 L65,342', C.green);
  wire(4, 'wW', 'M120,550 L620,550 L620,480', C.gold);
  wire(7, 'wC2', 'M120,130 L138,130 L138,295 L350,295', C.blue);
  wire(7, 'wC3', 'M120,440 L138,440 L138,295 L350,295', C.blue);
  wire(8, 'wE', 'M860,325 L860,385 L960,385 L960,410', C.red);
  wire(8, 'wL', 'M720,445 L880,445', C.dim);
  // boxes
  node(1, 10, 240, 110, 100, C.blue, 'Customer', 'types the address:').appendChild(mk('text', { x: 65, y: 292, 'font-size': 9, fill: C.blue, 'font-weight': 600, 'text-anchor': 'middle' }, 'www.ravi-food.com'));
  zone(2, 155, 30, 925, 565, C.blue);
  label(2, 168, 52, "Ravi's restaurant (the server)", 12, C.blue);
  node(2, 170, 225, 100, 90, C.blue, 'Reception', 'web server');
  zone(3, 330, 70, 730, 505, C.teal);
  label(3, 342, 92, 'Apache Tomcat: kitchen manager', 12, C.teal);
  node(3, 350, 265, 110, 60, C.teal, 'Port 8080', 'service counter');
  node(3, 760, 125, 280, 60, C.purple, 'JVM: the engine', 'runs all Java programs');
  node(4, 520, 410, 200, 70, C.gold, 'webapps folder', "Ravi's app installed");
  node(4, 10, 520, 110, 60, C.gold, 'WAR file', 'packed application');
  node(5, 520, 265, 150, 60, C.purple, 'Java Servlet', 'the chef');
  node(6, 720, 265, 150, 60, C.purple, 'JSP page', 'menu template');
  node(7, 10, 90, 110, 80, C.blue, 'Customer 2', 'orders too');
  node(7, 10, 400, 110, 80, C.blue, 'Customer 3', 'orders too');
  node(7, 490, 125, 240, 90, C.teal, 'Thread pool: kitchen staff');
  for (var i = 0; i < 4; i++) node(7, 505 + i * 55, 165, 45, 32, C.teal, 'Cook ' + (i + 1));
  node(8, 880, 410, 160, 70, C.blue, 'Logs folder', 'daily register');
  node(8, 880, 495, 160, 40, C.green, 'Status: running');
  node(8, 350, 215, 130, 40, C.red, 'Port conflict!', 'two apps, one counter');
  node(9, 10, 185, 110, 40, C.green, 'HTTPS', 'sealed order slip');
  node(9, 540, 495, 160, 40, C.gold, 'Redeploy new WAR');
  node(9, 710, 495, 160, 40, C.teal, 'Restart Tomcat');
  // red "blocked" style marks are not needed here; packets last
  pk(2, '✉️', 'wR', 3.5, 0);
  pk(4, '📦', 'wW', 5, 0);
  pk(5, '✉️', 'wP2', 2, 0);
  pk(5, '⚙️', 'wSJ', 2, 1);
  pk(6, '📄', 'wD', 4, 0);
  pk(6, '✅', 'wD', 4, 2.9);
  pk(7, '✉️', 'wC2', 4, 0.5);
  pk(7, '✉️', 'wC3', 4, 1.5);
  pk(8, '⚠️', 'wE', 3, 0);
  pk(8, '📋', 'wL', 3, 1);
  pk(9, '📦', 'wW', 5, 2.5);

  // ---- Build the SVG ----
  var svg = document.getElementById('stage');
  var defs = mk('defs', {});
  var lg = mk('linearGradient', { id: 'sky', x1: 0, y1: 0, x2: 0, y2: 1 });
  lg.appendChild(mk('stop', { offset: '0', 'stop-color': '#0b1a44' }));
  lg.appendChild(mk('stop', { offset: '1', 'stop-color': '#070c20' }));
  var pat = mk('pattern', { id: 'dots', width: 24, height: 24, patternUnits: 'userSpaceOnUse' });
  pat.appendChild(mk('circle', { cx: 2, cy: 2, r: 1, fill: '#fff', 'fill-opacity': 0.08 }));
  defs.appendChild(lg); defs.appendChild(pat); svg.appendChild(defs);
  svg.appendChild(mk('rect', { width: 1100, height: 620, fill: 'url(#sky)' }));
  svg.appendChild(mk('rect', { width: 1100, height: 620, fill: 'url(#dots)' }));
  ['wire', 'box', 'pkt'].forEach(function (k) {
    var g = mk('g', { 'class': 'layer-' + k });
    layers[k].forEach(function (n) { g.appendChild(n); });
    svg.appendChild(g);
  });

  // ---- Sidebar, legend, navigation ----
  var cur = 1, timer = null;
  var list = document.getElementById('steps'), buttons = [];
  STEPS.forEach(function (st, i) {
    var li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.className = 'sb';
    b.innerHTML = '<span class="n">' + (i + 1) + '</span><span><b></b><span class="s"></span></span>';
    b.querySelector('b').textContent = st.t;
    b.querySelector('.s').textContent = st.s;
    b.addEventListener('click', function () { stop(); show(i + 1); });
    li.appendChild(b); list.appendChild(li); buttons.push(b);
  });
  var lg2 = document.getElementById('legend');
  LEGEND.forEach(function (l) {
    var li = document.createElement('li');
    li.innerHTML = '<span aria-hidden="true">' + l[0] + '</span>';
    li.appendChild(document.createTextNode(l[1]));
    lg2.appendChild(li);
  });

  function show(n) {
    cur = n;
    var els = svg.querySelectorAll('.el');
    for (var i = 0; i < els.length; i++) {
      var s = +els[i].getAttribute('data-step');
      els[i].classList.remove('new');
      els[i].classList.toggle('on', s <= n);
      if (s === n) { void els[i].getBoundingClientRect(); els[i].classList.add('new'); }
    }
    buttons.forEach(function (b, i) {
      if (i + 1 === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    var d = STEPS[n - 1];
    document.getElementById('c-title').textContent = 'Step ' + n + ': ' + d.t;
    document.getElementById('c-plain').textContent = d.plain;
    document.getElementById('c-tech').textContent = d.tech;
    document.getElementById('c-watch').textContent = d.watch;
  }
  var auto = document.getElementById('auto');
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    auto.setAttribute('aria-pressed', 'false'); auto.textContent = 'Auto-play';
  }
  auto.addEventListener('click', function () {
    if (timer) { stop(); return; }
    auto.setAttribute('aria-pressed', 'true'); auto.textContent = 'Pause';
    timer = setInterval(function () { if (cur < STEPS.length) show(cur + 1); else stop(); }, 5000);
  });
  document.getElementById('reset').addEventListener('click', function () { stop(); show(1); });
  show(1);
})();
