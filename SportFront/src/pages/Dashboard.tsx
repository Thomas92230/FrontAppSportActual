import { useEffect, useState } from 'react'
import { matchesApi, competitionsApi, teamsApi, newsApi, Match, Competition, Team, News } from '../services/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar, Trophy, Users, Newspaper, Clock } from 'lucide-react'
import './Dashboard.css'

export default function Dashboard() {
  const [liveMatches, setLiveMatches] = useState<Match[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesData, competitionsData, teamsData, newsData] = await Promise.all([
          matchesApi.getLive(),
          competitionsApi.getAll(),
          teamsApi.getAll(),
          newsApi.getAll(),
        ])
        setLiveMatches(matchesData)
        setCompetitions(competitionsData)
        setTeams(teamsData)
        setNews(newsData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon live">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{liveMatches.length}</span>
            <span className="stat-label">Matchs en direct</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon competition">
            <Trophy size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{competitions.length}</span>
            <span className="stat-label">Compétitions</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon team">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{teams.length}</span>
            <span className="stat-label">Équipes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon news">
            <Newspaper size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{news.length}</span>
            <span className="stat-label">Actualités</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h3 className="section-title">
            <span className="live-dot"></span>
            Matchs en direct
          </h3>
          {liveMatches.length === 0 ? (
            <p className="empty-state">Aucun match en direct</p>
          ) : (
            <div className="matches-list">
              {liveMatches.map((match) => (
                <div key={match.id} className="match-card live">
                  <div className="match-teams">
                    <div className="team">
                      <span className="team-name">{match.homeTeam.name}</span>
                    </div>
                    <div className="match-score">
                      <span className="score">{match.score?.home ?? 0} - {match.score?.away ?? 0}</span>
                      {match.minute && <span className="minute">{match.minute}'</span>}
                    </div>
                    <div className="team">
                      <span className="team-name">{match.awayTeam.name}</span>
                    </div>
                  </div>
                  <div className="match-info">
                    <span className="competition-name">{match.competition.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">
            <Clock size={18} />
            Dernières actualités
          </h3>
          {news.length === 0 ? (
            <p className="empty-state">Aucune actualité</p>
          ) : (
            <div className="news-list">
              {news.slice(0, 5).map((item) => (
                <div key={item.id} className="news-item">
                  <div className="news-content">
                    <h4>{item.title}</h4>
                    <p className="news-meta">
                      {item.sport?.name} • {format(new Date(item.publishedAt), 'dd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-section mt-4">
        <h3 className="section-title">
          <Trophy size={18} />
          Compétitions populaires
        </h3>
        <div className="competitions-grid">
          {competitions.slice(0, 6).map((competition) => (
            <div key={competition.id} className="competition-card">
              <div className="competition-logo">
                {competition.logo ? (
                  <img src={competition.logo} alt={competition.name} />
                ) : (
                  <Trophy size={24} />
                )}
              </div>
              <span className="competition-name">{competition.name}</span>
              <span className="competition-sport">{competition.sport.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}