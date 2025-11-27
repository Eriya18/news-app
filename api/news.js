// api/news.js  (Vercel Serverless)
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const category = req.query.category || "general";
    const key = process.env.NEWSAPI_KEY;
    if (!key) return res.status(500).json({ message: "Server missing API key" });

    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${encodeURIComponent(category)}&apiKey=${key}`;
    const r = await fetch(url);
    const json = await r.json();

    res.status(r.status).json(json);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
}
