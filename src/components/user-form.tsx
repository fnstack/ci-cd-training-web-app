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
      <DialogContent className="sm:max-w-md glass-card border-border/50 professional-shadow">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {title}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter the user's full name"
                disabled={isLoading}
                className={`h-11 transition-all duration-200 ${
                  errors.name 
                    ? 'border-destructive/50 focus:border-destructive focus:ring-destructive/20' 
                    : 'focus:border-primary focus:ring-primary/20'
                }`}
              />
              {errors.name && (
                <div className="flex items-center space-x-2 text-destructive">
                  <div className="w-1 h-1 rounded-full bg-destructive"></div>
                  <p className="text-sm font-medium">{errors.name}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                disabled={isLoading}
                className={`h-11 transition-all duration-200 ${
                  errors.email 
                    ? 'border-destructive/50 focus:border-destructive focus:ring-destructive/20' 
                    : 'focus:border-primary focus:ring-primary/20'
                }`}
              />
              {errors.email && (
                <div className="flex items-center space-x-2 text-destructive">
                  <div className="w-1 h-1 rounded-full bg-destructive"></div>
                  <p className="text-sm font-medium">{errors.email}</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:w-auto h-11 transition-all duration-200 hover:scale-105"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full sm:w-auto h-11 gradient-bg transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                submitText
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}