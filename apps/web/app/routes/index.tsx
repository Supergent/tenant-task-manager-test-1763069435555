import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthActions } from '@convex-dev/better-auth/react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'
import { useState } from 'react'
import { Id } from '../convex/_generated/dataModel'

export const Route = createFileRoute('/')({
  component: Home,
})

type TaskPriority = 'low' | 'medium' | 'high'
type TaskStatus = 'todo' | 'in-progress' | 'done'

interface Task {
  _id: Id<'tasks'>
  title: string
  description?: string
  dueDate?: number
  priority: TaskPriority
  status: TaskStatus
  userId: string
  createdAt: number
  updatedAt: number
}

function Home() {
  const { signOut } = useAuthActions()
  const tasks = useQuery(api.endpoints.tasks.list)
  const createTask = useMutation(api.endpoints.tasks.create)
  const updateTask = useMutation(api.endpoints.tasks.update)
  const deleteTask = useMutation(api.endpoints.tasks.remove)
  const markComplete = useMutation(api.endpoints.tasks.markComplete)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all')

  const handleSignOut = async () => {
    await signOut()
  }

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const dueDate = formData.get('dueDate') as string
    const priority = formData.get('priority') as TaskPriority
    const status = formData.get('status') as TaskStatus

    await createTask({
      title,
      description: description || undefined,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      priority,
      status,
    })

    setShowCreateModal(false)
    e.currentTarget.reset()
  }

  const handleUpdateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingTask) return

    const formData = new FormData(e.currentTarget)

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const dueDate = formData.get('dueDate') as string
    const priority = formData.get('priority') as TaskPriority
    const status = formData.get('status') as TaskStatus

    await updateTask({
      taskId: editingTask._id,
      title,
      description: description || undefined,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      priority,
      status,
    })

    setEditingTask(null)
  }

  const handleDeleteTask = async (taskId: Id<'tasks'>) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask({ taskId })
    }
  }

  const handleMarkComplete = async (taskId: Id<'tasks'>) => {
    await markComplete({ taskId })
  }

  // Filter tasks
  const filteredTasks = tasks?.filter((task) => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false
    return true
  })

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toISOString().slice(0, 16)
  }

  if (tasks === undefined) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Task Manager</h1>
          <button onClick={handleSignOut} className="btn btn-secondary">
            Sign Out
          </button>
        </div>
      </header>

      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>My Tasks</h2>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              + New Task
            </button>
          </div>

          <div className="filters">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
              >
                <option value="all">All</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Create one to get started!</p>
          </div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li key={task._id} className="task-item">
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <div className="task-actions">
                    {task.status !== 'done' && (
                      <button
                        onClick={() => handleMarkComplete(task._id)}
                        className="btn btn-success"
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        ✓ Complete
                      </button>
                    )}
                    <button
                      onClick={() => setEditingTask(task)}
                      className="btn btn-primary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="btn btn-danger"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="task-meta">
                  <span className={`badge badge-${task.priority}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  <span className={`badge badge-${task.status}`}>
                    {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                  {task.dueDate && (
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      Due: {formatDate(task.dueDate)}
                      {task.dueDate < Date.now() && task.status !== 'done' && (
                        <span style={{ color: '#dc3545', marginLeft: '5px' }}>(Overdue)</span>
                      )}
                    </span>
                  )}
                </div>

                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Task</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  required
                  maxLength={200}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  maxLength={2000}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority *</label>
                <select name="priority" className="form-select" required defaultValue="medium">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status *</label>
                <select name="status" className="form-select" required defaultValue="todo">
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Task</h2>
              <button className="modal-close" onClick={() => setEditingTask(null)}>
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateTask}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  required
                  maxLength={200}
                  defaultValue={editingTask.title}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  maxLength={2000}
                  defaultValue={editingTask.description || ''}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  className="form-input"
                  defaultValue={editingTask.dueDate ? formatDateTime(editingTask.dueDate) : ''}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority *</label>
                <select
                  name="priority"
                  className="form-select"
                  required
                  defaultValue={editingTask.priority}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status *</label>
                <select
                  name="status"
                  className="form-select"
                  required
                  defaultValue={editingTask.status}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
