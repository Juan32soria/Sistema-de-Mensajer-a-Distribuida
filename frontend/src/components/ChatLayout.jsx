import Sidebar from './Sidebar'
import Chat from './Chat'

export default function ChatLayout() {
  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <Chat />
    </div>
  )
}
