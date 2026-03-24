import { useEffect, useState } from 'react'
import { teamsApi, Team } from '../services/api'
import { Users } from 'lucide-react'
import './Teams.css'

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await teamsApi.getAll()
        setTeams(data)
      } catch (error) {
        console.error('Erreur lors du chargement des équipes:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  return (
    <div className="teams-page">
      <div className="page-header">
        <h1>Équipes</h1>
        <input
          type="text"
          placeholder="Rechercher une équipe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input search-input"
        />
      </div>

      <div className="teams-grid">
        {filteredTeams.length === 0 ? (
          <p className="empty-state">Aucune équipe trouvée</p>
        ) : (
          filteredTeams.map((team) => (
            <div key={team.id} className="team-card">
              <div className="team-logo">
                {team.logo ? (
                  <img src={team.logo} alt={team.name} />
                ) : (
                  <Users size={32} />
                )}
              </div>
              <div className="team-info">
                <h3 className="team-name">{team.name}</h3>
                <span className="team-sport">{team.sport.name}</span>
                {team.competition && (
                  <span className="team-competition">{team.competition.name}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}