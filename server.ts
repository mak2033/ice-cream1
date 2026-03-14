import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Admin Auth Endpoint
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "alkh2044" && password === "Jtc@123456") {
      res.json({ success: true, token: "fake-jwt-token-for-demo" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Proxy for Chat Webhook
  app.post("/api/chat", async (req, res) => {
    try {
      const response = await fetch("https://home.tiffany-major.ts.net/webhook/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to connect to chat service" });
    }
  });

  // Proxy for Booking Webhook
  app.post("/api/booking", async (req, res) => {
    try {
      const response = await fetch("https://home.tiffany-major.ts.net/webhook/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to save booking" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
