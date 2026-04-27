import { authApi, groupsApi, messagesApi } from './api'

// === GRUPOS ===

export const getGroups = async () => {
  const res = await groupsApi.get('/groups/mine/')
  return { data: { groups: res.data } }
}

export const createGroup = async (name) => {
  return groupsApi.post('/groups/', { nombre: name })
}

export const createChannel = async (groupId, name) => {
  return groupsApi.post('/channels/', { nombre: name, grupo: groupId })
}

export const getGroupChannels = async (groupId) => {
  const res = await groupsApi.get(`/groups/${groupId}/channels/`)
  return { data: { channels: res.data.canales || [] } }
}

// === CONTACTOS ===

export const getContacts = async () => {
  const res = await authApi.get('/users/')
  const contacts = res.data.map(u => ({ ...u, online: false }))
  return { data: { contacts } }
}

export const searchUsers = async (query) => {
  const res = await authApi.get(`/users/?q=${encodeURIComponent(query)}`)
  return { data: { users: res.data } }
}

// === ARCHIVOS ===

export const getPresignedUrl = async (filename, tipo) => {
  const res = await messagesApi.get(`/chat_archivos/presigned/?filename=${encodeURIComponent(filename)}&tipo=${encodeURIComponent(tipo)}`)
  return res.data
}

export const uploadToS3 = async (uploadUrl, file) => {
  await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
}

export const saveArchivo = async (mensajeId, url, tipo, tamaño) => {
  return messagesApi.post('/chat_archivos/', { mensaje_id: mensajeId, url, tipo, tamaño })
}

// === MIEMBROS ===

export const getGroupMembers = async (groupId) => {
  const res = await groupsApi.get(`/groups/${groupId}/members/`)
  return res.data
}

export const addGroupMember = async (groupId, userId) => {
  return groupsApi.post(`/groups/${groupId}/members/add/`, { usuario_id: userId })
}

// === MENSAJES ===

export const getMessages = async (type, id) => {
  if (type === 'group') {
    const res = await messagesApi.get(`/chat_messages/grupo/${id}/`)
    return { data: { messages: res.data } }
  }
  if (type === 'channel') {
    const res = await messagesApi.get(`/chat_messages/canal/${id}/`)
    return { data: { messages: res.data } }
  }
  if (type === 'user') {
    const res = await messagesApi.get(`/chat_messages/privados/${id}/`)
    return { data: { messages: res.data } }
  }
  return { data: { messages: [] } }
}

export const sendMessage = async (type, id, content) => {
  const payload = { texto: content }
  if (type === 'group') {
    Object.assign(payload, { tipo_destino: 'grupo', grupo_id: parseInt(id) })
  } else if (type === 'channel') {
    Object.assign(payload, { tipo_destino: 'canal', canal_id: parseInt(id) })
  } else {
    Object.assign(payload, { tipo_destino: 'privado', usuario_receptor_id: parseInt(id) })
  }
  return messagesApi.post('/chat_messages/', payload)
}
