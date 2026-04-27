import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { getMessages, sendMessage, getPresignedUrl, uploadToS3, saveArchivo } from '../services/messageService'
import { useAuth } from '../context/AuthContext'

export default function Chat() {
  const { type, id } = useParams()
  const location = useLocation()
  const chatName = location.state?.name || 'Chat'
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendError, setSendError] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    loadMessages()
  }, [type, id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const res = await getMessages(type, id)
      setMessages(res.data.messages)
    } catch (_err) {
      // silently fail — user sees empty state
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    const text = content
    const file = selectedFile
    setContent('')
    setSelectedFile(null)
    setSendError('')
    setUploading(!!file)

    try {
      const res = await sendMessage(type, id, text || (file ? '📎 Archivo adjunto' : ''))
      if (file) {
        const { upload_url, file_url } = await getPresignedUrl(file.name, file.type)
        await uploadToS3(upload_url, file)
        await saveArchivo(res.data.id, file_url, file.type, file.size)
      }
      await loadMessages()
    } catch {
      setSendError('No se pudo enviar el mensaje.')
    } finally {
      setUploading(false)
    }
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  const getChatIcon = () => {
    if (type === 'group') return '👥'
    if (type === 'channel') return '#'
    return '💬'
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100 h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
          {getChatIcon()}
        </div>
        <div>
          <h1 className="font-semibold text-gray-800">{chatName}</h1>
          <p className="text-xs text-gray-500">
            {type === 'user' && '🟢 En línea'}
            {type === 'group' && `${messages.length} mensajes`}
            {type === 'channel' && 'Canal del grupo'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-lg">No hay mensajes aún</p>
            <p className="text-sm">Sé el primero en escribir</p>
          </div>
        ) : (
          messages.map(msg => {
            const isOwn = msg.usuario_emisor_id === user.id
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-md">
                  {!isOwn && type !== 'user' && (
                    <p className="text-xs text-gray-500 mb-1 ml-2">Usuario {msg.usuario_emisor_id}</p>
                  )}
                  <div className={`px-4 py-2 rounded-2xl ${
                    isOwn
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                  }`}>
                    <p className="break-words">{msg.texto}</p>
                    {msg.archivos?.map(a => (
                      a.tipo?.startsWith('image/')
                        ? <img key={a.id} src={a.url} alt="adjunto" className="mt-2 max-w-xs rounded-lg cursor-pointer" onClick={() => window.open(a.url, '_blank')} />
                        : <a key={a.id} href={a.url} target="_blank" rel="noreferrer"
                            className={`mt-2 flex items-center gap-2 text-xs underline ${isOwn ? 'text-blue-100' : 'text-blue-500'}`}>
                            <span>📎</span> {a.url.split('/').pop()}
                          </a>
                    ))}
                    <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                      {msg.created_at ? formatTime(msg.created_at) : ''}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        {sendError && <p className="text-red-500 text-xs mb-2">{sendError}</p>}
        {selectedFile && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-2 text-sm text-blue-700">
            <span className="truncate flex-1">📎 {selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)} className="text-blue-400 hover:text-blue-600 font-bold">✕</button>
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-3">
          <input type="file" ref={fileInputRef} className="hidden" onChange={e => setSelectedFile(e.target.files[0] || null)} />
          <button type="button" onClick={() => fileInputRef.current.click()} className="text-gray-400 hover:text-blue-500 transition flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={uploading || (!content.trim() && !selectedFile)}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white w-12 h-12 rounded-full flex items-center justify-center transition flex-shrink-0"
          >
            {uploading
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            }
          </button>
        </form>
      </div>
    </div>
  )
}
