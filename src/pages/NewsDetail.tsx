import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { newsApi, type News } from '../services/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import './NewsDetail.css'

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>()
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return
      try {
        const data = await newsApi.getById(parseInt(id, 10))
        setNews(data)
      } catch (err) {
        console.error('Erreur lors du chargement de l\'article:', err)
        setError('Article introuvable')
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [id])

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  if (error || !news) {
    return <div className="error">{error || 'Article introuvable'}</div>
  }

  return (
    <div className="news-detail-page">
      {news.image && (
        <div className="news-detail-image">
          <img src={news.image} alt={news.title} />
        </div>
      )}
      
      <div className="news-detail-content">
        <div className="news-meta">
          {news.sport && <span className="news-sport">{news.sport.name}</span>}
          {news.competition && (
            <span className="news-competition"> • {news.competition.name}</span>
          )}
        </div>
        
        <h1 className="news-title">{news.title}</h1>
        
        <div className="news-info">
          <span className="news-date">
            {format(new Date(news.publishedAt), 'dd MMMM yyyy', { locale: fr })}
          </span>
          {news.source && <span className="news-source"> • {news.source}</span>}
        </div>
        
        <div className="news-body">
          {news.content}
        </div>
      </div>
    </div>
  )
}