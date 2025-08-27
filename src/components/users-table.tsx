"use client"

import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
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
      <div className="text-center py-8 text-muted-foreground">
        No users found. Create your first user to get started.
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-sm">{user.id}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingUserId === user.id}
                    >
                      <Trash2 className="h-4 w-4" />
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