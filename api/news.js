// api/news.js  (Vercel Serverless - use global fetch)
export default async function handler(req, res) {
  try {
    const category = req.query.category || "general";
    const key = process.env.NEWSAPI_KEY;

    if (!key) {
      console.error("Missing NEWSAPI_KEY env var");
      return res.status(500).json({ status: "error", message: "Server missing NEWSAPI_KEY" });
    }

    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${encodeURIComponent(category)}&apiKey=${key}`;
    console.log("Fetching NewsAPI:", url);

    const r = await fetch(url); // Vercel Node 18 supports global fetch
    // forward status and body
    const json = await r.json().catch(err => {
      console.error("Failed to parse JSON from NewsAPI:", err);
      return null;
    });

    console.log("NewsAPI status:", r.status, "body sample:", json && (json.status || json.code || "has-body"));

    // If upstream returned an error status, forward it (so client sees 4xx/5xx)
    if (!r.ok) {
      const message = json?.message || `NewsAPI returned ${r.status}`;
      return res.status(r.status).json({ status: "error", message, details: json });
    }

    return res.status(200).json(json);
  } catch (err) {
    console.error("Server error in /api/news:", err);
    return res.status(500).json({ status: "error", message: err.message || "Server error" });
  }
}
