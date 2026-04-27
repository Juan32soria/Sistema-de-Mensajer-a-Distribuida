export const MOCK_MODE = false

export const mockUsers = {
  'test@test.com': {
    id: 1,
    username: 'Juan Villa',
    email: 'test@test.com',
    password: 'password123',
    token: 'mock_jwt_token_12345'
  }
}

export const mockContacts = [
  {id: 2, username: 'Maria Lopez', email: 'maria@test.com', online: true},
  {id: 3, username: 'Carlos Perez', email: 'carlos@test.com', online: false},
  {id: 4, username: 'Ana Garcia', email: 'ana@test.com', online: true},
  {id: 5, username: 'Luis Martinez', email: 'luis@test.com', online: false}
]

export const mockGroups = [
  {
    id: 1,
    name: 'Equipo Proyecto',
    icon: '👥',
    member_count: 5,
    created_at: new Date().toISOString(),
    last_message: {content: 'Nos vemos mañana!', created_at: new Date(Date.now() - 3600000).toISOString()},
    channels: [
      {id: 101, name: 'general', group_id: 1},
      {id: 102, name: 'desarrollo', group_id: 1},
      {id: 103, name: 'diseño', group_id: 1}
    ]
  },
  {
    id: 2,
    name: 'Gaming',
    icon: '🎮',
    member_count: 12,
    created_at: new Date().toISOString(),
    last_message: {content: 'Alguien para jugar?', created_at: new Date(Date.now() - 7200000).toISOString()},
    channels: [
      {id: 201, name: 'general', group_id: 2},
      {id: 202, name: 'estrategias', group_id: 2}
    ]
  },
  {
    id: 3,
    name: 'Estudio',
    icon: '📚',
    member_count: 8,
    created_at: new Date().toISOString(),
    last_message: null,
    channels: [
      {id: 301, name: 'general', group_id: 3}
    ]
  }
]

export const mockMessages = {
  'group_1': [
    {id: 1, user: {id: 2, username: 'Maria Lopez'}, content: 'Hola equipo!', created_at: new Date(Date.now() - 3600000).toISOString()},
    {id: 2, user: {id: 1, username: 'Juan Villa'}, content: 'Hola Maria, como vas?', created_at: new Date(Date.now() - 3000000).toISOString()},
    {id: 3, user: {id: 3, username: 'Carlos Perez'}, content: 'Yo voy bien!', created_at: new Date(Date.now() - 2400000).toISOString()}
  ],
  'channel_101': [
    {id: 10, user: {id: 2, username: 'Maria Lopez'}, content: 'Bienvenidos al canal general!', created_at: new Date(Date.now() - 86400000).toISOString()}
  ],
  'channel_102': [
    {id: 20, user: {id: 3, username: 'Carlos Perez'}, content: 'PR listo para review', created_at: new Date(Date.now() - 3600000).toISOString()}
  ],
  'user_2': [
    {id: 100, user: {id: 2, username: 'Maria Lopez'}, content: 'Hola Juan!', created_at: new Date(Date.now() - 1800000).toISOString()},
    {id: 101, user: {id: 1, username: 'Juan Villa'}, content: 'Hola Maria!', created_at: new Date(Date.now() - 1500000).toISOString()}
  ],
  'user_3': [
    {id: 200, user: {id: 3, username: 'Carlos Perez'}, content: 'Necesito ayuda con algo', created_at: new Date(Date.now() - 7200000).toISOString()}
  ]
}
