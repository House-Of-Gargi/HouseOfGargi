const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'graphify-out');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Traverse all relevant files
const includeExts = ['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.css', '.sql', '.json'];
const ignoreDirs = ['node_modules', '.next', '.git', 'dist', 'legacy_pages', 'legacy_vite_backup', 'graphify-out'];

function getAllFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (!ignoreDirs.includes(entry.name)) {
        getAllFiles(fullPath, fileList);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (includeExts.includes(ext)) {
        fileList.push({ fullPath, relPath, name: entry.name, ext });
      }
    }
  }
  return fileList;
}

const files = getAllFiles(rootDir);

// 2. Classify nodes and communities
function getCommunity(relPath) {
  if (relPath.startsWith('src/app/(storefront)')) return 'Storefront Pages';
  if (relPath.startsWith('src/app/seller')) return 'Seller Portal';
  if (relPath.startsWith('src/app/api')) return 'API Handlers';
  if (relPath.startsWith('src/context')) return 'State & Context Providers';
  if (relPath.startsWith('src/components/seller')) return 'Seller Components';
  if (relPath.startsWith('src/components')) return 'Storefront UI Components';
  if (relPath.startsWith('src/data')) return 'Data Models & Catalog';
  if (relPath.startsWith('src/lib')) return 'Infrastructure & Realtime Mesh';
  if (relPath.startsWith('src/types')) return 'Type Definitions';
  if (relPath.endsWith('.css')) return 'Design System & Styles';
  if (relPath.startsWith('scripts/')) return 'Automation Scripts';
  if (relPath.endsWith('.sql')) return 'Database Migrations';
  return 'Configuration & Manifests';
}

function getNodeType(relPath) {
  if (relPath.includes('page.tsx')) return 'page';
  if (relPath.includes('layout.tsx')) return 'layout';
  if (relPath.includes('Context.tsx')) return 'context';
  if (relPath.startsWith('src/components')) return 'component';
  if (relPath.startsWith('src/data')) return 'data';
  if (relPath.startsWith('src/lib')) return 'lib';
  if (relPath.startsWith('src/app/api')) return 'api';
  if (relPath.endsWith('.css')) return 'style';
  if (relPath.endsWith('.sql')) return 'schema';
  return 'module';
}

const nodes = [];
const nodeMap = new Map();

for (const file of files) {
  const content = fs.readFileSync(file.fullPath, 'utf8');
  const lines = content.split('\n').length;
  const community = getCommunity(file.relPath);
  const type = getNodeType(file.relPath);

  // Extract export names
  const exportMatches = content.matchAll(/export\s+(?:default\s+)?(?:function|const|class|interface|type|enum)\s+([a-zA-Z0-9_]+)/g);
  const exports = [];
  for (const m of exportMatches) {
    exports.push(m[1]);
  }

  // Generate a concise description
  let description = `Module ${file.name} in ${community}`;
  if (file.relPath.includes('page.tsx')) description = `Storefront page route for ${path.dirname(file.relPath).split('/').pop()}`;
  if (file.relPath.includes('CustomerAuthContext')) description = 'Strict Email OTP customer authentication and multi-tab session state';
  if (file.relPath.includes('realtimeSync')) description = 'Cross-tab WebSocket and BroadcastChannel synchronization mesh';
  if (file.relPath.includes('HeroBanner')) description = 'Interactive 3-concept hero carousel with responsive WebP picture sources';
  if (file.relPath.includes('WishlistContext')) description = 'Email-keyed wishlist state with real-time cross-tab sync';
  if (file.relPath.includes('CartContext')) description = 'Email-keyed shopping bag with real-time cross-tab sync';
  if (file.relPath.includes('artisans.ts')) description = '10 generational master artisan guild records and provenance helpers';
  if (file.relPath.includes('products.ts')) description = '18 catalog luxury products with price, images, and artisan mappings';
  if (file.relPath.includes('resend.ts')) description = 'Resend email client integration for noreply@gargisaha.com';
  if (file.relPath.includes('supabaseClient.ts')) description = 'Supabase client instance for database and auth';

  const node = {
    id: file.relPath,
    label: file.name,
    path: file.relPath,
    type,
    community,
    lines,
    size: Math.max(12, Math.min(48, Math.round(Math.sqrt(lines) * 2.2))),
    exports,
    imports: [],
    inDegree: 0,
    outDegree: 0,
    description
  };

  nodes.push(node);
  nodeMap.set(file.relPath, node);
}

// 3. Resolve edges (Imports and References)
const edges = [];
const edgeSet = new Set();

for (const file of files) {
  const content = fs.readFileSync(file.fullPath, 'utf8');
  const sourceNode = nodeMap.get(file.relPath);

  // Match import statements
  const importMatches = content.matchAll(/from\s+['"]([^'"]+)['"]/g);
  for (const m of importMatches) {
    const importPath = m[1];
    let targetRel = null;

    if (importPath.startsWith('@/')) {
      const sub = importPath.replace('@/', 'src/');
      // Resolve extension
      for (const ext of ['', '.ts', '.tsx', '.js', '.jsx', '/page.tsx', '/index.ts', '/index.tsx']) {
        const candidate = sub + ext;
        if (nodeMap.has(candidate)) {
          targetRel = candidate;
          break;
        }
      }
    } else if (importPath.startsWith('.')) {
      const resolved = path.normalize(path.join(path.dirname(file.relPath), importPath)).replace(/\\/g, '/');
      for (const ext of ['', '.ts', '.tsx', '.js', '.jsx', '/page.tsx', '/index.ts', '/index.tsx']) {
        const candidate = resolved + ext;
        if (nodeMap.has(candidate)) {
          targetRel = candidate;
          break;
        }
      }
    }

    if (targetRel && targetRel !== file.relPath) {
      const edgeKey = `${file.relPath}->${targetRel}`;
      if (!edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey);
        edges.push({
          source: file.relPath,
          target: targetRel,
          type: 'imports'
        });

        sourceNode.imports.push(targetRel);
        sourceNode.outDegree++;
        const targetNode = nodeMap.get(targetRel);
        if (targetNode) targetNode.inDegree++;
      }
    }
  }
}

// Calculate total degree centrality
nodes.forEach(n => {
  n.degree = n.inDegree + n.outDegree;
  n.size = Math.max(14, Math.min(52, 14 + n.inDegree * 3.5));
});

// Identify God Nodes (top connected)
const godNodes = [...nodes].sort((a, b) => (b.inDegree + b.outDegree) - (a.inDegree + a.outDegree)).slice(0, 10);

// Group by community
const communities = {};
nodes.forEach(n => {
  if (!communities[n.community]) communities[n.community] = [];
  communities[n.community].push(n);
});

// 4. Output graph.json
const graphData = {
  meta: {
    project: 'House of Gargi',
    generatedAt: new Date().toISOString(),
    totalNodes: nodes.length,
    totalEdges: edges.length,
    communityCount: Object.keys(communities).length,
  },
  metrics: {
    godNodes: godNodes.map(n => ({ id: n.id, label: n.label, community: n.community, inDegree: n.inDegree, outDegree: n.outDegree, totalDegree: n.degree })),
    communitiesSummary: Object.entries(communities).map(([k, v]) => ({ name: k, count: v.length }))
  },
  nodes,
  edges
};

fs.writeFileSync(path.join(outDir, 'graph.json'), JSON.stringify(graphData, null, 2), 'utf8');

// 5. Output GRAPH_REPORT.md
const reportContent = `# House of Gargi — Knowledge Graph Architecture Report

**Generated on:** ${new Date().toUTCString()}  
**Repository:** \`House-Of-Gargi/HouseOfGargi\`  
**Total Entities (Nodes):** ${nodes.length}  
**Total Relationships (Edges):** ${edges.length}  
**Detected Communities:** ${Object.keys(communities).length}

---

## 1. Executive Summary & Graph Metrics

House of Gargi is a Next.js 16 (React 19) digital atelier for luxury handcrafted Indian fashion. The knowledge graph reveals a clean, decoupled modular architecture separating **Storefront Pages**, **State Contexts**, **Real-time Synchronization Mesh**, and **Seller Administration Suite**.

| Metric | Count | Description |
| :--- | :--- | :--- |
| **Total Nodes** | **${nodes.length}** | Source files, components, contexts, routes, and configs |
| **Total Directed Edges** | **${edges.length}** | Import, composition, and event dependencies |
| **Architectural Communities** | **${Object.keys(communities).length}** | Functional subsystems |
| **Average Degree** | **${(edges.length / nodes.length * 2).toFixed(2)}** | Inter-module connectivity density |

---

## 2. "God Nodes" (Core Hubs & Highly Connected Modules)

God nodes represent the foundational modules of the application that the majority of pages, components, and services depend upon:

| Rank | Module / File | In-Degree (Depended Upon By) | Out-Degree | Total Connections | Primary Function |
| :---: | :--- | :---: | :---: | :---: | :--- |
${godNodes.map((n, idx) => `| **#${idx + 1}** | \`${n.id}\` | **${n.inDegree}** | ${n.outDegree} | **${n.degree}** | ${n.description} |`).join('\n')}

---

## 3. Community Subsystem Breakdown

${Object.entries(communities).map(([comm, list]) => `
### ${comm} (${list.length} files)
${list.map(f => `- **\`${f.id}\`** (${f.lines} lines) — *${f.description}* [In: ${f.inDegree}, Out: ${f.outDegree}]`).join('\n')}
`).join('\n')}

---

## 4. Key Architectural Flows

### A. Strict Email OTP Authentication Flow
\`CustomerLoginModal.tsx\` &rarr; \`supabase.auth.signInWithOtp()\` &rarr; Resend SMTP (\`noreply@gargisaha.com\`) &rarr; \`supabase.auth.verifyOtp()\` &rarr; \`CustomerAuthContext.tsx\` &rarr; \`realtimeSync.ts\` Broadcast.

### B. Zero-Latency Multi-Tab WebSocket Mesh
Tab Action (Add to Wishlist/Bag) &rarr; Context Provider &rarr; \`realtimeSync.ts\` (\`supabase.channel('house_of_gargi_patron_sync')\` + \`BroadcastChannel('gargi_realtime_portal_sync')\`) &rarr; All other open browser tabs update state instantly without page reload.

### C. Master Artisan Lineage Graph
\`product/[id]/page.tsx\` &rarr; Reads \`artisanId\` from \`products.ts\` &rarr; Links directly to \`artisan/[id]/page.tsx\` &rarr; Displays verified GI badge, provenance ledger, and masterworks catalog.

---

## 5. Suggested Graph Queries for AI Assistants & Developers

- **Query 1:** *"Show all pages depending on \`WishlistContext.tsx\` and how real-time updates propagate."*
- **Query 2:** *"Trace the authentication state lifecycle from \`CustomerLoginModal\` to \`CustomerAuthContext\` and Supabase Auth."*
- **Query 3:** *"List all components importing \`src/data/products.ts\` and \`src/data/artisans.ts\`."*
- **Query 4:** *"Analyze the Seller Suite routing guard in \`src/app/seller/layout.tsx\` and its API dependencies."*
`;

fs.writeFileSync(path.join(outDir, 'GRAPH_REPORT.md'), reportContent, 'utf8');

// 6. Output interactive graph.html
const communityColors = {
  'Storefront Pages': '#7D1A27',
  'State & Context Providers': '#C9A227',
  'Storefront UI Components': '#2E5A44',
  'Data Models & Catalog': '#85581A',
  'Infrastructure & Realtime Mesh': '#1E3A8A',
  'Seller Portal': '#581C87',
  'Seller Components': '#7C2D12',
  'API Handlers': '#0D9488',
  'Type Definitions': '#475569',
  'Design System & Styles': '#B91C1C',
  'Configuration & Manifests': '#4B5563',
  'Automation Scripts': '#65A30D',
  'Database Migrations': '#9333EA',
};

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>House of Gargi — Interactive Codebase Knowledge Graph</title>
  <script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #12100E;
      color: #FBF6EE;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    header {
      background: #1E1A16;
      border-bottom: 1px solid #382E25;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 10;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand h1 {
      font-size: 18px;
      font-weight: 700;
      color: #E4D3AE;
      letter-spacing: 0.04em;
    }
    .brand span {
      font-size: 11px;
      background: rgba(201, 162, 39, 0.2);
      color: #D4AF37;
      border: 1px solid rgba(201, 162, 39, 0.4);
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .search-input {
      background: #28221D;
      border: 1px solid #4A3E33;
      border-radius: 6px;
      padding: 6px 14px;
      color: #FFF;
      font-size: 13px;
      outline: none;
      width: 240px;
    }
    .search-input:focus {
      border-color: #D4AF37;
    }
    .filter-select {
      background: #28221D;
      border: 1px solid #4A3E33;
      border-radius: 6px;
      padding: 6px 10px;
      color: #FFF;
      font-size: 13px;
      outline: none;
    }
    .btn {
      background: #7D1A27;
      color: #FFF;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn:hover { background: #9B2233; }
    
    #main-container {
      flex: 1;
      display: flex;
      position: relative;
    }
    #network-canvas {
      flex: 1;
      height: 100%;
      background: radial-gradient(circle at 50% 50%, #1A1613 0%, #0E0C0A 100%);
    }
    #sidebar {
      width: 380px;
      background: #181512;
      border-left: 1px solid #2E261E;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding: 24px;
      z-index: 5;
    }
    .sidebar-title {
      font-size: 18px;
      color: #E4D3AE;
      margin-bottom: 8px;
      word-break: break-all;
    }
    .sidebar-badge {
      display: inline-block;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 14px;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #28221D;
      font-size: 13px;
    }
    .stat-label { color: #A39486; }
    .stat-val { font-weight: 600; color: #FFF; }
    
    .section-head {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #D4AF37;
      margin: 18px 0 8px;
      font-weight: 700;
    }
    .link-pill {
      display: block;
      background: #241E19;
      border: 1px solid #382F26;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 12px;
      color: #E4D3AE;
      margin-bottom: 6px;
      text-decoration: none;
      cursor: pointer;
      word-break: break-all;
    }
    .link-pill:hover {
      border-color: #D4AF37;
      background: #2E2721;
    }
    .legend {
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: rgba(24, 21, 18, 0.9);
      border: 1px solid #382E25;
      border-radius: 8px;
      padding: 14px 18px;
      font-size: 12px;
      max-height: 220px;
      overflow-y: auto;
      pointer-events: auto;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <h1>House of Gargi</h1>
      <span>Interactive Graphify Map</span>
    </div>
    <div class="controls">
      <input type="text" id="search" class="search-input" placeholder="Search node or file...">
      <select id="community-filter" class="filter-select">
        <option value="all">All Communities (${nodes.length} nodes)</option>
        ${Object.keys(communities).map(c => `<option value="${c}">${c} (${communities[c].length})</option>`).join('')}
      </select>
      <button id="reset-zoom" class="btn">Reset View</button>
    </div>
  </header>

  <div id="main-container">
    <div id="network-canvas"></div>

    <div class="legend">
      <div style="font-weight: 700; margin-bottom: 8px; color: #D4AF37; text-transform: uppercase; font-size: 11px;">Communities</div>
      ${Object.entries(communityColors).map(([c, color]) => `
        <div class="legend-item">
          <div class="legend-color" style="background: ${color};"></div>
          <span>${c}</span>
        </div>
      `).join('')}
    </div>

    <aside id="sidebar">
      <div id="sidebar-content">
        <h2 class="sidebar-title">Select a Node</h2>
        <p style="color: #A39486; font-size: 13.5px; line-height: 1.6;">
          Click on any node in the graph to inspect its imports, dependencies, line count, degree centrality, and role in the House of Gargi codebase.
        </p>
      </div>
    </aside>
  </div>

  <script>
    const graphData = ${JSON.stringify(graphData)};
    const communityColors = ${JSON.stringify(communityColors)};

    const visNodes = new vis.DataSet(
      graphData.nodes.map(n => ({
        id: n.id,
        label: n.label,
        title: n.path + ' (' + n.community + ')',
        value: n.size,
        color: {
          background: communityColors[n.community] || '#64748B',
          border: '#FBF6EE',
          highlight: { background: '#D4AF37', border: '#FFF' }
        },
        font: { color: '#FBF6EE', size: 12, face: '-apple-system, sans-serif' },
        raw: n
      }))
    );

    const visEdges = new vis.DataSet(
      graphData.edges.map((e, idx) => ({
        id: 'e_' + idx,
        from: e.source,
        to: e.target,
        arrows: 'to',
        color: { color: 'rgba(212, 175, 55, 0.25)', highlight: '#D4AF37' },
        smooth: { type: 'continuous' }
      }))
    );

    const container = document.getElementById('network-canvas');
    const data = { nodes: visNodes, edges: visEdges };
    const options = {
      nodes: {
        shape: 'dot',
        scaling: { min: 10, max: 48 },
        borderWidth: 1.5,
        shadow: true
      },
      edges: {
        width: 1.2,
        selectionWidth: 2.5
      },
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -70,
          centralGravity: 0.015,
          springLength: 90,
          springConstant: 0.08,
          damping: 0.85
        },
        stabilization: { iterations: 180 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        navigationButtons: true,
        keyboard: true
      }
    };

    const network = new vis.Network(container, data, options);

    function showNodeDetails(nodeId) {
      const node = graphData.nodes.find(n => n.id === nodeId);
      if (!node) return;

      const incoming = graphData.edges.filter(e => e.target === nodeId).map(e => e.source);
      const outgoing = graphData.edges.filter(e => e.source === nodeId).map(e => e.target);
      const color = communityColors[node.community] || '#64748B';

      const html = \`
        <span class="sidebar-badge" style="background: \${color}33; color: \${color}; border: 1px solid \${color}66;">
          \${node.community}
        </span>
        <h2 class="sidebar-title">\${node.label}</h2>
        <p style="color: #A39486; font-size: 13px; margin-bottom: 16px; word-break: break-all;">
          \${node.path}
        </p>

        <p style="font-size: 13.5px; color: #FBF6EE; line-height: 1.5; margin-bottom: 16px; background: #221D18; padding: 10px; border-radius: 4px;">
          \${node.description}
        </p>

        <div class="stat-row"><span class="stat-label">Lines of Code</span><span class="stat-val">\${node.lines}</span></div>
        <div class="stat-row"><span class="stat-label">In-Degree (Used by)</span><span class="stat-val">\${node.inDegree} modules</span></div>
        <div class="stat-row"><span class="stat-label">Out-Degree (Imports)</span><span class="stat-val">\${node.outDegree} modules</span></div>
        <div class="stat-row"><span class="stat-label">Total Connectivity</span><span class="stat-val">\${node.degree}</span></div>

        \${node.exports && node.exports.length ? \`
          <div class="section-head">Key Exports (\${node.exports.length})</div>
          <div style="font-family: monospace; font-size: 12px; color: #D4AF37;">
            \${node.exports.map(exp => 'export ' + exp).join('<br>')}
          </div>
        \` : ''}

        <div class="section-head">Used By (\${incoming.length})</div>
        \${incoming.length ? incoming.map(src => \`<a class="link-pill" onclick="selectNode('\${src}')">\${src}</a>\`).join('') : '<p style="color:#64748B; font-size:12px;">None (Leaf / Entrypoint)</p>'}

        <div class="section-head">Dependencies (\${outgoing.length})</div>
        \${outgoing.length ? outgoing.map(tgt => \`<a class="link-pill" onclick="selectNode('\${tgt}')">\${tgt}</a>\`).join('') : '<p style="color:#64748B; font-size:12px;">None (Independent)</p>'}
      \`;

      document.getElementById('sidebar-content').innerHTML = html;
    }

    window.selectNode = function(id) {
      network.selectNodes([id]);
      network.focus(id, { scale: 1.2, animation: true });
      showNodeDetails(id);
    };

    network.on('click', function(params) {
      if (params.nodes.length > 0) {
        showNodeDetails(params.nodes[0]);
      }
    });

    document.getElementById('search').addEventListener('input', function(e) {
      const q = e.target.value.toLowerCase().trim();
      if (!q) return;
      const match = graphData.nodes.find(n => n.id.toLowerCase().includes(q) || n.label.toLowerCase().includes(q));
      if (match) {
        selectNode(match.id);
      }
    });

    document.getElementById('community-filter').addEventListener('change', function(e) {
      const comm = e.target.value;
      if (comm === 'all') {
        visNodes.update(graphData.nodes.map(n => ({ id: n.id, hidden: false })));
      } else {
        visNodes.update(graphData.nodes.map(n => ({ id: n.id, hidden: n.community !== comm })));
      }
      network.fit({ animation: true });
    });

    document.getElementById('reset-zoom').addEventListener('click', function() {
      network.fit({ animation: true });
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'graph.html'), htmlContent, 'utf8');

console.log('Graphify output generated successfully:');
console.log('  -> ' + path.join(outDir, 'graph.json'));
console.log('  -> ' + path.join(outDir, 'GRAPH_REPORT.md'));
console.log('  -> ' + path.join(outDir, 'graph.html'));
console.log(`Total nodes: ${nodes.length}, Total edges: ${edges.length}, Communities: ${Object.keys(communities).length}`);
