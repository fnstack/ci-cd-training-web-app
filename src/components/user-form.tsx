"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { CreateUserRequest } from "@/types/user"

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (user: CreateUserRequest) => Promise<void>
  initialData?: CreateUserRequest
  title: string
  submitText: string
}

export function UserForm({ isOpen, onClose, onSubmit, initialData, title, submitText }: UserFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [email, setEmail] = useState(initialData?.email || "")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    const newErrors: { name?: string; email?: string } = {}
    
    if (!name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!email.includes("@")) {
      newErrors.email = "Email must be valid"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      await onSubmit({ name: name.trim(), email: email.trim() })
      setName("")
      setEmail("")
      onClose()
    } catch (error) {
      console.error("Failed to submit user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setName(initialData?.name || "")
    setEmail(initialData?.email || "")
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter user name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}