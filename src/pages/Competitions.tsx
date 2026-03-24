import { useEffect, useState } from 'react'
import { competitionsApi, Competition } from '../services/api'
import { Trophy } from 'lucide-react'
import './Competitions.css'

export default function Competitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const data = await competitionsApi.getAll()
        setCompetitions(data)
      } catch (error) {
        console.error('Erreur lors du chargement des compétitions:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCompetitions()
  }, [])

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  return (
    <div className="competitions-page">
      <div className="page-header">
        <h1>Compétitions</h1>
      </div>

      <div className="competitions-grid">
        {competitions.length === 0 ? (
          <p className="empty-state">Aucune compétition trouvée</p>
        ) : (
          competitions.map((competition) => (
            <div key={competition.id} className="competition-card">
              <div className="competition-logo">
                {competition.logo ? (
                  <img src={competition.logo} alt={competition.name} />
                ) : (
                  <Trophy size={32} />
                )}
              </div>
              <div className="competition-info">
                <h3 className="competition-name">{competition.name}</h3>
                <span className="competition-sport">{competition.sport.name}</span>
                {competition.country && (
                  <span className="competition-country">{competition.country}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}