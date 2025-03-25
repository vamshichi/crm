"use client"

import { motion } from "framer-motion"
import { Mail, Briefcase, FolderKanban, BadgeCheck } from "lucide-react"
import CallbackLeadsCount from "./CallbackLeadsCount"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Define the TypeScript interface for Employee
interface Employee {
  id: string
  name: string
  email: string
  role: string
  department?: { name: string } | null
}

// Define Props Type
interface EmployeeProfileProps {
  employee: Employee
}

export default function EmployeeProfile({ employee }: EmployeeProfileProps) {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Employee Information Card */}
      <Card className="lg:col-span-3 w-full border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-700 to-green-900 text-white p-6 flex justify-between items-center w-full">
  {/* Left Section: Employee Info */}
  <div className="flex items-center gap-6"> {/* Increased gap for spacing */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md"
    >
      {getInitials(employee.name)}
    </motion.div>

    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex items-center gap-2"
      >
        <h2 className="text-2xl font-bold">{employee.name}</h2>
        <BadgeCheck className="text-blue-300" size={20} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="flex items-center gap-2 mt-1"
      >
        <Badge variant="outline" className="bg-white/10 border-0 text-blue-100">
          {employee.role}
        </Badge>
        {employee.department && (
          <Badge variant="outline" className="bg-white/10 border-0 text-blue-100">
            {employee.department.name}
          </Badge>
        )}
      </motion.div>
    </div>
  </div>

  {/* Right Section: Callback Leads Count - Properly Spaced */}
  <div className="ml-10"> {/* Added margin-left for spacing */}
    <CallbackLeadsCount employeeId={employee.id} />
  </div>
</CardHeader>


        <CardContent className="p-6">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-1">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Contact Information</h3>
              <Separator className="my-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Email Address</p>
                    <p className="font-medium text-slate-900 dark:text-slate-200">{employee.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Position</p>
                    <p className="font-medium text-slate-900 dark:text-slate-200">{employee.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Department Information</h3>
              <Separator className="my-2" />
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <FolderKanban size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Department</p>
                  <p className="font-medium text-slate-900 dark:text-slate-200">
                    {employee.department?.name || "No department assigned"}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </CardContent>

      </Card>
    </motion.div>
  )
}
