import { notFound } from "next/navigation"
import CRMLayout from "@/app/components/CRMLayout"
import CategoryDashboard from "@/app/components/CategoryDashboard"

const validCategories = ["gmec", "fps", "ips", "tascon"]

export default function CategoryPage({ params }: { params: { category: string } }) {
  if (!validCategories.includes(params.category)) {
    notFound()
  }

  return (
    <CRMLayout>
      <CategoryDashboard category={params.category as "gmec" | "fps" | "ips" | "tascon"} />
    </CRMLayout>
  )
}
