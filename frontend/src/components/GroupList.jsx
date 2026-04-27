import Sidebar from './Sidebar'

export default function GroupList() {
  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h2 className="text-xl font-medium mb-2">Bienvenido a GroupsApp</h2>
          <p>Selecciona un chat de la izquierda para empezar</p>
        </div>
      </div>
    </div>
  )
}
