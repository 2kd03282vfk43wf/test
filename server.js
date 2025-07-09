const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 17001;
const DATA_FILE = __dirname + '/savedItems.json';

app.use(cors());
app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));

app.get('/api/get', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.json([]);
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  res.json(JSON.parse(data || '[]'));
});

app.post('/api/set', (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
  res.json({ status: 'ok' });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`nordjsサーバー起動: http://127.0.0.1:${PORT}/`);
});