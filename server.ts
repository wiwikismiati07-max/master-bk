import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Supabase Client (Secret keys only used here)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  let supabase: any = null;
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Students (Master)
  app.get("/api/students", async (req, res) => {
    if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
    const { data, error } = await supabase.from("students").select("*").order("name");
    if (error) return res.status(400).json(error);
    res.json(data);
  });

  app.post("/api/students", async (req, res) => {
    if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
    const { data, error } = await supabase.from("students").insert(req.body).select();
    if (error) return res.status(400).json(error);
    res.json(data);
  });

  // Transactions
  app.get("/api/transactions", async (req, res) => {
    if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
    const { data, error } = await supabase.from("transactions").select("*, students(name, gender)").order("date", { ascending: false });
    if (error) return res.status(400).json(error);
    res.json(data);
  });

  app.post("/api/transactions", async (req, res) => {
    if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
    const { data, error } = await supabase.from("transactions").insert(req.body).select();
    if (error) return res.status(400).json(error);
    res.json(data);
  });

  // Dashboard Stats
  app.get("/api/stats", async (req, res) => {
    if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
    
    const { count: studentCount } = await supabase.from("students").select("*", { count: "exact", head: true });
    const { count: transactionCount } = await supabase.from("transactions").select("*", { count: "exact", head: true });
    
    res.json({
      students: studentCount || 0,
      transactions: transactionCount || 0,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
