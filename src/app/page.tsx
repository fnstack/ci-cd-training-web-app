"use client"

import { useEffect, useState } from "react"
import { Plus, RefreshCw, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserForm } from "@/components/user-form"
import { UsersTable } from "@/components/users-table"
import { usersApi } from "@/lib/api"
import { User, CreateUserRequest } from "@/types/user"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await usersApi.getAll()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
      console.error("Failed to load users:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (userData: CreateUserRequest) => {
    try {
      const newUser = await usersApi.create(userData)
      setUsers([...users, newUser])
    } catch (err) {
      console.error("Failed to create user:", err)
      throw err
    }
  }

  const handleUpdate = async (id: number, userData: CreateUserRequest) => {
    try {
      const updatedUser = await usersApi.update(id, userData)
      setUsers(users.map(user => user.id === id ? updatedUser : user))
    } catch (err) {
      console.error("Failed to update user:", err)
      throw err
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await usersApi.delete(id)
      setUsers(users.filter(user => user.id !== id))
    } catch (err) {
      console.error("Failed to delete user:", err)
      throw err
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
              <p className="text-muted-foreground">
                Manage users in your application
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={loadUsers}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              <strong>Error:</strong> {error}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Make sure the API is running and accessible.
            </p>
          </div>
        )}

        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Users</h2>
                <p className="text-sm text-muted-foreground">
                  {users.length} user{users.length !== 1 ? 's' : ''} total
                </p>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            ) : (
              <UsersTable 
                users={users} 
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>

        <UserForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreate}
          title="Create New User"
          submitText="Create User"
        />
      </div>
    </div>
  )
}