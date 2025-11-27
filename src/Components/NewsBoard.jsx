import { useEffect, useState } from "react";
import NewsItem from "./NewsItem";

const NewsBoard = ({ category }) => {
  const [articles, setArticles] = useState([]);     // always an array
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // inside fetchNews()
const url = `/api/news?category=${encodeURIComponent(category)}`;
// (no API key in client)
const res = await fetch(url);
if (!res.ok) {
  throw new Error(`NewsAPI error: HTTP ${res.status}`);
}
const data = await res.json();
setArticles(Array.isArray(data.articles) ? data.articles : []);

        // protect against undefined
        if (!data.articles) {
          setArticles([]);
          throw new Error("No articles found in response");
        }

        setArticles(data.articles);

      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
        setArticles([]);       // prevent crashes
      }
    };

    fetchNews();
  }, [category]);

  // OPTIONAL: show error message in UI
  if (error) {
    return <h2 style={{ color: "red", textAlign: "center" }}>
      Error loading news: {error}
    </h2>;
  }

  return (
    <div className="news-board">
      {articles.length === 0 ? (
        <p style={{ textAlign: "center" }}>No articles available.</p>
      ) : (
        articles.map((article, index) => (
          <NewsItem 
            key={index}
            title={article.title}
            description={article.description}
            urlToImage={article.urlToImage}
            url={article.url}
          />
        ))
      )}
    </div>
  );
};

export default NewsBoard;
