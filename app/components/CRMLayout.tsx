import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react" // Added import for React

const categories = ["gmec", "fps", "ips", "tascon"]

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <nav className="mt-5">
          <ul>
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/crm/${category}`}
                  className={`block py-2 px-4 ${
                    pathname === `/crm/${category}` ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}

