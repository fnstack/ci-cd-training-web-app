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
    <div className="min-h-screen">
      <div className="container mx-auto py-12 px-4 max-w-7xl">
        {/* Header Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 gradient-bg rounded-3xl opacity-10"></div>
          <div className="relative glass-card p-8 rounded-3xl professional-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="flex items-center justify-center w-16 h-16 gradient-bg text-primary-foreground rounded-2xl professional-shadow">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    User Management
                  </h1>
                  <p className="text-lg text-muted-foreground mt-1">
                    Streamline your user management workflow
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={loadUsers}
                  disabled={loading}
                  className="h-11 px-6 hover:scale-105 transition-transform duration-200"
                >
                  <RefreshCw className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="h-11 px-6 gradient-bg hover:scale-105 transition-transform duration-200 professional-shadow"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 relative">
            <div className="glass-card p-6 rounded-2xl border-l-4 border-destructive professional-shadow">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-destructive mb-1">Connection Error</h3>
                  <p className="text-sm text-destructive/80 mb-2">{error}</p>
                  <p className="text-xs text-muted-foreground">
                    Make sure the API service is running and accessible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Card */}
        <div className="glass-card rounded-3xl professional-shadow overflow-hidden">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 border-b border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Active Users</h2>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {users.length} user{users.length !== 1 ? 's' : ''}
                  </div>
                  {!loading && users.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
              {!loading && users.length > 0 && (
                <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
                  Click on any row to edit user details
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="relative mx-auto w-12 h-12 mb-4">
                  <RefreshCw className="w-12 h-12 animate-spin text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Loading Users</h3>
                <p className="text-muted-foreground">Please wait while we fetch the latest data...</p>
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