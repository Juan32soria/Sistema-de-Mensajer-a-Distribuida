import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGroups, getContacts, createGroup, getGroupMembers, addGroupMember, createChannel } from '../services/messageService'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('groups')
  const [groups, setGroups] = useState([])
  const [contacts, setContacts] = useState([])
  const [expandedGroup, setExpandedGroup] = useState(null)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [membersGroup, setMembersGroup] = useState(null)
  const [createChannelGroup, setCreateChannelGroup] = useState(null)
  const navigate = useNavigate()
  const { user, doLogout } = useAuth()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [groupsRes, contactsRes] = await Promise.all([
        getGroups(),
        getContacts()
      ])
      setGroups(groupsRes.data.groups)
      setContacts(contactsRes.data.contacts)
    } catch (_err) {
      // silently fail — data loads on next mount
    }
  }

  const handleLogout = () => {
    doLogout()
    navigate('/login')
  }

  const handleSelectChat = (type, id, name) => {
    navigate(`/chat/${type}/${id}`, { state: { name } })
  }

  const toggleGroupChannels = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId)
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-blue-500 flex items-center justify-center font-bold text-lg">
              {user.username?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-white font-semibold">{user.username}</p>
              <p className="text-blue-100 text-xs">En línea</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === 'groups'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          👥 Grupos
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === 'contacts'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          💬 Chats
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'groups' && (
          <div>
            <div className="p-3 sticky top-0 bg-white border-b border-gray-100 z-10">
              <button
                onClick={() => setShowCreateGroup(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
              >
                + Crear Grupo
              </button>
            </div>
            {groups.map(group => (
              <div key={group.id} className="border-b border-gray-100">
                <div
                  onClick={() => toggleGroupChannels(group.id)}
                  className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl flex-shrink-0">
                    👥
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800 truncate">{group.nombre}</h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={e => { e.stopPropagation(); setMembersGroup(group) }}
                          className="text-gray-400 hover:text-blue-500 p-1 rounded transition"
                          title="Ver miembros"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        <svg
                          className={`w-4 h-4 text-gray-400 transform transition ${expandedGroup === group.id ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{group.rol}</p>
                  </div>
                </div>

                {expandedGroup === group.id && (
                  <div className="bg-gray-50">
                    <div
                      onClick={() => handleSelectChat('group', group.id, group.nombre)}
                      className="px-4 py-2 pl-16 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 transition"
                    >
                      💬 Chat general
                    </div>
                    {group.canales?.map(channel => (
                      <div
                        key={channel.id}
                        onClick={() => handleSelectChat('channel', channel.id, `${group.nombre} · #${channel.nombre}`)}
                        className="px-4 py-2 pl-16 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 flex items-center gap-2 transition"
                      >
                        <span className="text-gray-400 font-mono">#</span>
                        {channel.nombre}
                      </div>
                    ))}
                    {group.rol === 'admin' && (
                      <div
                        onClick={() => setCreateChannelGroup(group)}
                        className="px-4 py-2 pl-16 hover:bg-gray-100 cursor-pointer text-sm text-blue-500 flex items-center gap-2 transition"
                      >
                        <span className="font-bold">+</span> Crear canal
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            {contacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => handleSelectChat('user', contact.id, contact.username)}
                className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 transition"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {contact.username.charAt(0)}
                  </div>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">{contact.username}</h3>
                  <p className="text-xs text-gray-500">
                    {contact.online ? '🟢 En línea' : '⚪ Desconectado'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {createChannelGroup && (
        <CreateChannelModal
          group={createChannelGroup}
          onClose={() => setCreateChannelGroup(null)}
          onCreated={() => { setCreateChannelGroup(null); loadData() }}
        />
      )}

      {membersGroup && (
        <MembersModal
          group={membersGroup}
          contacts={contacts}
          onClose={() => setMembersGroup(null)}
          onReload={loadData}
        />
      )}

      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreated={() => {
            setShowCreateGroup(false)
            loadData()
          }}
        />
      )}
    </div>
  )
}

function MembersModal({ group, contacts, onClose, onReload }) {
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [channelName, setChannelName] = useState('')
  const [channelLoading, setChannelLoading] = useState(false)
  const [channelSuccess, setChannelSuccess] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    getGroupMembers(group.id).then(setMembers).catch(() => {})
  }, [group.id])

  const isAdmin = group.rol === 'admin'

  const getUsername = (userId) => {
    if (userId == user.id) return `${user.username} (tú)`
    const c = contacts.find(c => c.id === userId)
    return c ? c.username : `Usuario ${userId}`
  }

  const memberIds = members.map(m => m.usuario_id)
  const available = contacts.filter(c =>
    !memberIds.includes(c.id) &&
    c.username.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async (userId) => {
    try {
      await addGroupMember(group.id, userId)
      const updated = await getGroupMembers(group.id)
      setMembers(updated)
      setSearch('')
    } catch (e) {
      setError(e.response?.data?.error || 'Error al agregar')
    }
  }

  const handleCreateChannel = async (e) => {
    e.preventDefault()
    if (!channelName.trim()) return
    setChannelLoading(true)
    setError('')
    try {
      await createChannel(group.id, channelName.trim())
      setChannelName('')
      setChannelSuccess(`Canal #${channelName.trim()} creado`)
      onReload()
      setTimeout(() => setChannelSuccess(''), 3000)
    } catch {
      setError('No se pudo crear el canal.')
    } finally {
      setChannelLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Miembros — {group.nombre}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="overflow-y-auto flex-1">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Miembros actuales</p>
          {members.map(m => (
            <div key={m.usuario_id} className="flex items-center gap-3 py-2 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                {getUsername(m.usuario_id).charAt(0).toUpperCase()}
              </div>
              <span className="flex-1 text-sm text-gray-800">{getUsername(m.usuario_id)}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{m.rol}</span>
            </div>
          ))}

          {isAdmin && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Agregar miembro</p>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar usuario..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {search && available.map(c => (
                <div key={c.id} className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 rounded">
                  <span className="text-sm text-gray-800">{c.username}</span>
                  <button
                    onClick={() => handleAdd(c.id)}
                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition"
                  >
                    Agregar
                  </button>
                </div>
              ))}
              {search && available.length === 0 && (
                <p className="text-sm text-gray-400">No hay usuarios para agregar</p>
              )}
            </div>
          )}

          {isAdmin && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Crear canal</p>
              {channelSuccess && <p className="text-green-600 text-sm mb-2">{channelSuccess}</p>}
              <form onSubmit={handleCreateChannel} className="flex gap-2">
                <input
                  type="text"
                  value={channelName}
                  onChange={e => setChannelName(e.target.value)}
                  placeholder="nombre-del-canal"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={channelLoading || !channelName.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  {channelLoading ? '...' : '+ Canal'}
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-1">Todos los miembros del grupo tendrán acceso al canal.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CreateChannelModal({ group, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await createChannel(group.id, name.trim())
      onCreated()
    } catch {
      setError('No se pudo crear el canal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Crear canal en {group.nombre}</h2>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="nombre-del-canal"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 rounded-lg transition">
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CreateGroupModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setError('')
    setLoading(true)
    try {
      await createGroup(name.trim())
      onCreated()
    } catch {
      setError('No se pudo crear el grupo. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Grupo</h2>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nombre del grupo"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 rounded-lg transition"
            >
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
