const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const OKTETO_VARS = [
  'OKTETO_IS_PREVIEW_ENVIRONMENT',
  'OKTETO_NAMESPACE',
  'OKTETO_DOMAIN',
  'OKTETO_REGISTRY',
  'OKTETO_GIT_BRANCH',
  'OKTETO_GIT_COMMIT',
];

app.get('/', (req, res) => {
  const isPreview = process.env.OKTETO_IS_PREVIEW_ENVIRONMENT === 'true';

  const rows = OKTETO_VARS.map(v => {
    const val = process.env[v] || '(not set)';
    const highlight = v === 'OKTETO_IS_PREVIEW_ENVIRONMENT';
    return `
      <tr ${highlight ? 'style="background:#fffde7"' : ''}>
        <td><code>${v}</code></td>
        <td class="${val === 'true' ? 'val-true' : val === 'false' ? 'val-false' : ''}">${val}</td>
      </tr>`;
  }).join('');

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Okteto Env Test</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 760px; margin: 2rem auto; padding: 0 1rem; color: #222; }
    h1 { margin-bottom: 0.25rem; }
    .badge {
      display: inline-block; padding: .4rem 1rem; border-radius: 6px;
      font-size: 1.1rem; font-weight: 700; margin: 1rem 0 1.5rem;
    }
    .preview { background: #e6f4ea; color: #1b5e20; border: 2px solid #2e7d32; }
    .regular { background: #e3f2fd; color: #0d47a1; border: 2px solid #1565c0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: .6rem .8rem; text-align: left; border-bottom: 1px solid #e0e0e0; }
    th { background: #f5f5f5; font-size: .85rem; text-transform: uppercase; letter-spacing: .04em; }
    code { font-size: .9rem; }
    .val-true  { color: #2e7d32; font-weight: 700; }
    .val-false { color: #757575; }
    pre { background: #f5f5f5; padding: 1rem; border-radius: 6px; overflow-x: auto; font-size: .85rem; }
    .endpoint { font-size: .85rem; color: #555; margin-top: 2rem; }
  </style>
</head>
<body>
  <h1>Okteto Environment Variable Test</h1>
  <div class="badge ${isPreview ? 'preview' : 'regular'}">
    ${isPreview ? '✅ PREVIEW ENVIRONMENT' : '🔵 REGULAR ENVIRONMENT'}
  </div>

  <table>
    <thead><tr><th>Variable</th><th>Value</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <p class="endpoint">JSON endpoint: <a href="/json">/json</a></p>
</body>
</html>`);
});

app.get('/json', (req, res) => {
  const vars = {};
  OKTETO_VARS.forEach(v => { vars[v] = process.env[v] ?? null; });
  res.json({
    isPreviewEnvironment: process.env.OKTETO_IS_PREVIEW_ENVIRONMENT === 'true',
    variables: vars,
    timestamp: new Date().toISOString(),
  });
});

app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`Listening on :${port}`);
  console.log(`OKTETO_IS_PREVIEW_ENVIRONMENT=${process.env.OKTETO_IS_PREVIEW_ENVIRONMENT ?? '(not set)'}`);
});