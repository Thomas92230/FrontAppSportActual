import { useEffect, useState } from 'react'
import { matchesApi, Match } from '../services/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import './Matches.css'

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'live' | 'scheduled' | 'finished'>('all')

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await matchesApi.getAll()
        setMatches(data)
      } catch (error) {
        console.error('Erreur lors du chargement des matches:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  const filteredMatches = matches.filter((match) => {
    if (filter === 'all') return true
    return match.status === filter.toUpperCase()
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LIVE':
        return <span className="badge badge-live">En direct</span>
      case 'FINISHED':
        return <span className="badge badge-finished">Terminé</span>
      case 'SCHEDULED':
        return <span className="badge badge-scheduled">Programmé</span>
      default:
        return null
    }
  }

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  return (
    <div className="matches-page">
      <div className="page-header">
        <h1>Matches</h1>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
          <button
            className={`filter-btn ${filter === 'live' ? 'active' : ''}`}
            onClick={() => setFilter('live')}
          >
            En direct
          </button>
          <button
            className={`filter-btn ${filter === 'scheduled' ? 'active' : ''}`}
            onClick={() => setFilter('scheduled')}
          >
            À venir
          </button>
          <button
            className={`filter-btn ${filter === 'finished' ? 'active' : ''}`}
            onClick={() => setFilter('finished')}
          >
            Terminés
          </button>
        </div>
      </div>

      <div className="matches-list">
        {filteredMatches.length === 0 ? (
          <p className="empty-state">Aucun match trouvé</p>
        ) : (
          filteredMatches.map((match) => (
            <div key={match.id} className="match-item">
              <div className="match-header">
                <span className="competition">{match.competition.name}</span>
                {getStatusBadge(match.status)}
              </div>
              <div className="match-content">
                <div className="team home">
                  <span className="team-name">{match.homeTeam.name}</span>
                </div>
                <div className="match-result">
                  {match.status === 'SCHEDULED' ? (
                    <span className="match-time">
                      {format(new Date(match.startTime), 'HH:mm', { locale: fr })}
                    </span>
                  ) : (
                    <>
                      <span className="score">
                        {match.score?.home ?? 0} - {match.score?.away ?? 0}
                      </span>
                      {match.minute && (
                        <span className="minute">{match.minute}'</span>
                      )}
                    </>
                  )}
                </div>
                <div className="team away">
                  <span className="team-name">{match.awayTeam.name}</span>
                </div>
              </div>
              <div className="match-footer">
                <span className="date">
                  {format(new Date(match.startTime), 'EEEE dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}