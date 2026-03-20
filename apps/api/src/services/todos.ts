interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

const todoStore: Todo[] = [
  { id: '1', text: 'Learn TanStack Router', completed: true, createdAt: new Date('2024-01-01') },
  { id: '2', text: 'Build a demo app', completed: false, createdAt: new Date('2024-01-02') },
  { id: '3', text: 'Deploy to production', completed: false, createdAt: new Date('2024-01-03') },
]

function serializeTodo(todo: Todo) {
  return { ...todo, createdAt: todo.createdAt.toISOString() }
}

export function listTodos() {
  return todoStore.map(serializeTodo)
}

export function createTodo(text: string) {
  const todo: Todo = {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    createdAt: new Date(),
  }
  todoStore.push(todo)
  return serializeTodo(todo)
}

export function toggleTodo(id: string) {
  const todo = todoStore.find((t) => t.id === id)
  if (!todo) return null

  todo.completed = !todo.completed
  return serializeTodo(todo)
}

export function deleteTodo(id: string) {
  const index = todoStore.findIndex((t) => t.id === id)
  if (index === -1) return false

  todoStore.splice(index, 1)
  return true
}
