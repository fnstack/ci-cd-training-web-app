"use client"

import { useState } from "react"
import { Edit, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserForm } from "@/components/user-form"
import { User, CreateUserRequest } from "@/types/user"

interface UsersTableProps {
  users: User[]
  onUpdate: (id: number, user: CreateUserRequest) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function UsersTable({ users, onUpdate, onDelete }: UsersTableProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)

  const handleEdit = (user: User) => {
    setEditingUser(user)
  }

  const handleUpdate = async (userData: CreateUserRequest) => {
    if (editingUser) {
      await onUpdate(editingUser.id, userData)
      setEditingUser(null)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingUserId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingUserId(null)
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No users yet</h3>
        <p className="text-muted-foreground mb-4">Get started by creating your first user account.</p>
        <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg inline-block">
          Click the &ldquo;Add User&rdquo; button above to begin
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/50 border-border/50">
              <TableHead className="font-semibold text-foreground">ID</TableHead>
              <TableHead className="font-semibold text-foreground">Name</TableHead>
              <TableHead className="font-semibold text-foreground">Email</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow 
                key={user.id} 
                className="hover:bg-muted/20 transition-colors duration-200 group border-border/30"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="font-mono text-sm text-muted-foreground">
                  <span className="bg-muted/50 px-2 py-1 rounded-md text-xs">
                    #{user.id}
                  </span>
                </TableCell>
                <TableCell className="font-semibold text-foreground">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingUserId === user.id}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                    >
                      <Trash2 className={`h-3.5 w-3.5 ${deletingUserId === user.id ? 'animate-pulse' : ''}`} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingUser && (
        <UserForm
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleUpdate}
          initialData={{ name: editingUser.name, email: editingUser.email }}
          title="Edit User"
          submitText="Update User"
        />
      )}
    </>
  )
}