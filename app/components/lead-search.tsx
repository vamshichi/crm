"use client";

import type React from "react";
import { useState } from "react";
import { Search, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchLeadsByCompany } from "@/app/api/action/lead-action";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

// Define Lead type
type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  city: string;
  designaction?: string | null;
  message: string;
  status: string;
  soldAmount?: number | null;
  callBackTime?: Date | null;
  employeeId: string;
  createdAt: Date;
  employee: {
    id: string;
    name: string;
    department: {
      id: string;
      name: string;
    };
  };
};

export default function LeadSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [companyExists, setCompanyExists] = useState<boolean | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(false);
    setCompanyExists(null);

    try {
      const results = await searchLeadsByCompany(searchQuery);
      setSearchResults(results);
      setCompanyExists(results.length > 0);
      setHasSearched(true);
    } catch (error) {
      console.error("Error searching leads:", error);
      setCompanyExists(false);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Search by company name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isSearching}>
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      <AnimatePresence>
        {hasSearched && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Alert className={`${companyExists ? "border-green-500 bg-green-50 text-green-800" : "border-red-500 bg-red-50 text-red-800"}`}>
              <div className="flex items-center gap-2">
                {companyExists ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                <AlertTitle className="text-base font-medium">
                  {companyExists ? `Company "${searchQuery}" exists in the database` : `Company "${searchQuery}" does not exist in the database`}
                </AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {companyExists ? `We found ${searchResults.length} lead(s) associated with this company.` : "No leads found for this company. You may want to add this as a new lead."}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {searchResults.length > 0 && (
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <h3 className="text-lg font-medium">Search Results ({searchResults.length})</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((lead, index) => (
              <motion.div key={lead.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 * index }}>
                <Card className="overflow-hidden border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: getStatusColor(lead.status) }}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{lead.name}</h4>
                        <Badge style={{ backgroundColor: getStatusColor(lead.status), color: "white" }}>{lead.status}</Badge>
                      </div>
                      <p className="text-sm font-medium">{lead.company}</p>
                      <div className="text-sm text-muted-foreground">
                        <p>{lead.email}</p>
                        <p>{lead.phone}</p>
                        <p>{lead.city}</p>
                        <p className="font-semibold">
                          Department: <span className="text-blue-600">{lead.employee?.department?.name || "N/A"}</span>
                        </p>
                      </div>
                      {lead.soldAmount !== null && lead.soldAmount !== undefined ? <p className="text-sm font-medium">Amount: ${lead.soldAmount.toFixed(2)}</p> : null}
                      <p className="text-xs text-muted-foreground">Created: {new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Helper function to get color based on status
function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "#22c55e"; // green
    case "pending":
      return "#f59e0b"; // amber
    case "closed":
      return "#6366f1"; // indigo
    case "lost":
      return "#ef4444"; // red
    default:
      return "#64748b"; // slate
  }
}
