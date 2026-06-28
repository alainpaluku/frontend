import { BookOpen, CalendarDays, GraduationCap, LayoutDashboard } from "lucide-react"
import { KPICard } from "@/components/ui/KPICard"
import { DashboardLayout } from "@/components/ui/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/ui/Loader"
import { usePageData } from "@/hooks/usePageData"
import type { AppData } from "@/types"

function getSectionStats(data: AppData) {
  return {
    courses: data.courses?.length ?? 0,
    schedules: data.schedules?.length ?? 0,
    promotions: data.promotions?.length ?? 0,
  }
}

export function SectionDashboard() {
  const { data, loading } = usePageData(getSectionStats)

  if (loading || !data) return <Loader fullHeight />

  return (
    <DashboardLayout
      title="Tableau de bord — Section"
      subtitle="Gestion pédagogique des cours et horaires"
      stats={
        <>
          <KPICard
            title="Cours"
            value={data.courses}
            icon={<BookOpen className="size-5" />}
            trend="neutral"
          />
          <KPICard
            title="Créneaux"
            value={data.schedules}
            icon={<CalendarDays className="size-5" />}
            trend="neutral"
          />
          <KPICard
            title="Promotions"
            value={data.promotions}
            icon={<GraduationCap className="size-5" />}
            trend="neutral"
          />
        </>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <LayoutDashboard className="size-4" />
            Accès rapide
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Gérer les cours", href: "/section/courses", icon: BookOpen },
            { label: "Voir les horaires", href: "/section/schedules", icon: CalendarDays },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-accent"
            >
              <item.icon className="size-5 text-primary" />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
