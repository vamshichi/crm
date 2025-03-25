"use client"

import type React from "react"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Search,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Building,
  Calendar,
  User,
  DollarSign,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent,  } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Lead Type Definition
type Lead = {
  id: string
  name: string
  email: string
  company: string
  phone: string
  city: string
  designaction?: string | null
  message: string
  status: string
  soldAmount?: number | null
  callBackTime?: Date | null
  employeeId: string
  createdAt: Date
  employee: {
    id: string
    name: string
    department: {
      id: string
      name: string
    }
  }
}

export default function LeadSearch() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<Lead[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [companyExists, setCompanyExists] = useState<boolean | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setHasSearched(false)
    setCompanyExists(null)

    try {
      const response = await fetch(`/api/action/leads?company=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch leads")
      }

      const data = await response.json()

      if (data.success) {
        setSearchResults(data.leads)
        setCompanyExists(data.leads.length > 0)
      } else {
        setCompanyExists(false)
      }

      setHasSearched(true)
    } catch (error) {
      console.error("Error searching leads:", error)
      setCompanyExists(false)
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setHasSearched(false)
    setCompanyExists(null)
  }

  const filteredResults = searchResults.filter((lead) => {
    if (activeFilter === "all") return true
    return lead.status.toLowerCase() === activeFilter.toLowerCase()
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
        return "#22c55e" // green
      case "pending":
        return "#f59e0b" // amber
      case "closed":
        return "#6366f1" // indigo
      case "lost":
        return "#ef4444" // red
      default:
        return "#64748b" // slate
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Lead Search</h2>
        <p className="text-muted-foreground">
          Search for leads by company name to check if they exist in the database.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>Search</>
            )}
          </Button>
        </form>
      </div>

      {/* Search Result Alert */}
      <AnimatePresence>
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              className={`${
                companyExists
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300"
                  : "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {companyExists ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
                <AlertTitle className="text-base font-medium">
                  {companyExists
                    ? `Company "${searchQuery}" exists in the database`
                    : `Company "${searchQuery}" does not exist in the database`}
                </AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {companyExists
                  ? `We found ${searchResults.length} lead(s) associated with this company.`
                  : "No leads found for this company. You may want to add this as a new lead."}
              </AlertDescription>
              {!companyExists && (
                <div className="mt-4">

                </div>
              )}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-semibold">
              Search Results <span className="text-muted-foreground">({searchResults.length})</span>
            </h3>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveFilter}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <LeadResults leads={filteredResults} getStatusColor={getStatusColor} getInitials={getInitials} />
            </TabsContent>
            <TabsContent value="active" className="mt-0">
              <LeadResults leads={filteredResults} getStatusColor={getStatusColor} getInitials={getInitials} />
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              <LeadResults leads={filteredResults} getStatusColor={getStatusColor} getInitials={getInitials} />
            </TabsContent>
            <TabsContent value="closed" className="mt-0">
              <LeadResults leads={filteredResults} getStatusColor={getStatusColor} getInitials={getInitials} />
            </TabsContent>
            <TabsContent value="lost" className="mt-0">
              <LeadResults leads={filteredResults} getStatusColor={getStatusColor} getInitials={getInitials} />
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      {/* Empty State */}
      {!hasSearched && !isSearching && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Search for leads</h3>
          <p className="text-muted-foreground max-w-md">
            Enter a company name to search for existing leads in the database.
          </p>
        </div>
      )}
    </div>
  )
}

// Lead Results Component
function LeadResults({
  leads,
  getStatusColor,
  getInitials,
}: {
  leads: Lead[]
  getStatusColor: (status: string) => string
  getInitials: (name: string) => string
}) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No leads match the current filter.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {leads.map((lead, index) => (
        <motion.div
          key={lead.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 * index }}
        >
          <Card
            className="overflow-hidden h-full flex flex-col hover:shadow-md transition-all duration-200 border-l-4"
            style={{ borderLeftColor: getStatusColor(lead.status) }}
          >
            <CardContent className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback style={{ backgroundColor: getStatusColor(lead.status), color: "white" }}>
                      {getInitials(lead.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold line-clamp-1">{lead.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{lead.company}</p>
                  </div>
                </div>
                <Badge
                  style={{
                    backgroundColor: getStatusColor(lead.status),
                    color: "white",
                  }}
                  className="ml-auto"
                >
                  {lead.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{lead.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>
                    Assigned to: <span className="font-medium">{lead.employee?.name || "Unassigned"}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>
                    Department: <span className="font-medium">{lead.employee?.department?.name || "N/A"}</span>
                  </span>
                </div>
                {lead.soldAmount !== null && lead.soldAmount !== undefined && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium">${lead.soldAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">
                    Created: {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
            
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
