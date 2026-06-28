import { CalendarDays } from "lucide-react"
import { DashboardLayout } from "@/components/ui/DashboardLayout"
import { ScheduleGrid } from "@/components/ui/ScheduleGrid"
import { Loader } from "@/components/ui/Loader"
import { usePageData } from "@/hooks/usePageData"
import type { AppData } from "@/types"

function getScheduleData(data: AppData) {
  return { schedules: data.schedules ?? [] }
}

export function SectionSchedules() {
  const { data, loading } = usePageData(getScheduleData)

  if (loading || !data) return <Loader fullHeight />

  return (
    <DashboardLayout
      title="Horaires"
      subtitle="Grille horaire des cours"
      icon={<CalendarDays className="size-5" />}
    >
      <ScheduleGrid slots={data.schedules} />
    </DashboardLayout>
  )
}
