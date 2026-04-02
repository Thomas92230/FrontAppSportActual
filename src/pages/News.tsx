import { useEffect, useState } from 'react'
import { newsApi, type News } from '../services/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Newspaper } from 'lucide-react'
import './News.css'

export default function News() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsApi.getAll()
        setNews(data)
      } catch (error) {
        console.error('Erreur lors du chargement des actualités:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  return (
    <div className="news-page">
      <div className="page-header">
        <h1>Actualités</h1>
      </div>

      <div className="news-grid">
        {news.length === 0 ? (
          <p className="empty-state">Aucune actualité trouvée</p>
        ) : (
          news.map((item) => (
            <div key={item.id} className="news-card">
              {item.image && (
                <div className="news-image">
                  <img src={item.image} alt={item.title} />
                </div>
              )}
              <div className="news-content">
                <div className="news-meta">
                  {item.sport && <span className="news-sport">{item.sport.name}</span>}
                  {item.competition && (
                    <span className="news-competition"> • {item.competition.name}</span>
                  )}
                </div>
                <h3 className="news-title">{item.title}</h3>
                <p className="news-excerpt">{item.content.substring(0, 150)}...</p>
                <div className="news-footer">
                  <span className="news-date">
                    {format(new Date(item.publishedAt), 'dd MMMM yyyy', { locale: fr })}
                  </span>
                  {item.source && <span className="news-source">• {item.source}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}