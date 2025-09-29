"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const routes = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/suggestions", label: "Suggestions" },
  { href: "/billing", label: "Billing" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold">
          Smart Meter
        </Link>
        <nav className="flex items-center gap-2">
          {routes.map((r) => (
            <Link key={r.href} href={r.href}>
              <Button variant={pathname === r.href ? "default" : "ghost"} className={cn("h-8 px-3")}>
                {r.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
