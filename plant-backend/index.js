import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Database API running on http://localhost:${PORT}`);
  console.log(`🌿 Plant routes: http://localhost:${PORT}/api/plants`);
  
  // 🚫 Deleted the old console.log line for auth routes
});
