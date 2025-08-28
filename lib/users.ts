import bcrypt from 'bcryptjs'

export interface User {
  id: string
  email: string
  password: string
  name?: string
  image?: string
}

// In-memory user store (replace with database in production)
const users: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYV/6U0wqaVcSyK', // password: demo123
    name: 'Demo User'
  }
]

export async function createUser(email: string, password: string, name?: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 12)
  const newUser: User = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    password: hashedPassword,
    name
  }
  users.push(newUser)
  return newUser
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return users.find(user => user.email === email.toLowerCase()) || null
}

export async function validatePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function getAllUsers(): Promise<Omit<User, 'password'>[]> {
  return users.map(({ password, ...user }) => user)
}
