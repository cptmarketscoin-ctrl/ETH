const express = require('express');
const cors = require('cors');
const fse = require('fs-extra');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const mockDir = path.join(__dirname, 'mock-data');

// Read mock file by request path
function getMockFile(reqPath) {
  const file = path.join(mockDir, reqPath.replace(/\//g, '_') + '.json');
  if (fse.existsSync(file)) {
    try {
      return fse.readJsonSync(file);
    } catch (e) {
      return { code: -1, message: 'JSON parse error' };
    }
  }
  return null;
}

// Express 5 compatible: use middleware instead of wildcard route
app.use('/api', (req, res) => {
  // Use req.path (no query string) for file lookup
  let reqPath = req.path.replace(/^\/api\/?/, '').replace(/^\//, '');

  let data = getMockFile(reqPath);

  // If no exact match, try without trailing segments (sub-path matching)
  if (!data) {
    const parts = reqPath.split('_');
    for (let i = parts.length - 1; i > 0; i--) {
      const partial = parts.slice(0, i).join('_');
      data = getMockFile(partial);
      if (data) break;
    }
  }

  // If still no match, return fallback
  if (!data) {
    console.log(`[Mock] No file for: ${reqPath}`);
return res.json({ code: 0, data: [] });
  }

  // Support pagination query params
  if (req.query.page && data.data && Array.isArray(data.data)) {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const total = data.data.length;
    data.data = data.data.slice((page - 1) * size, page * size);
    data._pagination = { page, size, total };
  }

  // Simulate auth user if Bearer token provided
  if (req.headers.authorization === 'Bearer demo-token') {
    data._user = { id: 1, name: 'Demo User', role: 'admin' };
  }

  res.json(data);
});

// Fallback for non-/api paths
app.use((req, res) => {
  res.json({ code: 0, data: [] });
});

const PORT = 3001;
app.listen(PORT, () => {
  const files = fse.existsSync(mockDir)
    ? fse.readdirSync(mockDir).filter((f) => f.endsWith('.json'))
    : [];
  console.log(`Mock API running at http://127.0.0.1:${PORT}`);
  console.log(`Mock files: ${files.length}`);
  files.forEach((f) => console.log(`  - ${f}`));
});
