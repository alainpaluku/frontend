import { BookOpen } from "lucide-react"
import { DashboardLayout } from "@/components/ui/DashboardLayout"
import { DataTable, type Column } from "@/components/ui/DataTable"
import { Loader } from "@/components/ui/Loader"
import { usePageData } from "@/hooks/usePageData"
import type { AppData, Course } from "@/types"

function getCourseData(data: AppData) {
  return { courses: data.courses ?? [] }
}

export function SectionCourses() {
  const { data, loading } = usePageData(getCourseData)

  if (loading || !data) return <Loader fullHeight />

  const columns: Column<Course>[] = [
    {
      key: "code",
      header: "Code",
      render: (c) => <span className="font-mono text-xs">{c.code}</span>,
    },
    {
      key: "name",
      header: "Intitulé",
      render: (c) => <span className="font-medium">{c.name}</span>,
    },
    {
      key: "credits",
      header: "Crédits",
      align: "right",
      render: (c) => <span>{c.credits}</span>,
    },
    {
      key: "teacher",
      header: "Enseignant",
      render: (c) =>
        c.teacher
          ? `${c.teacher.first_name ?? ""} ${c.teacher.last_name ?? ""}`.trim()
          : "—",
    },
  ]

  return (
    <DashboardLayout
      title="Cours"
      subtitle="Liste des cours disponibles"
      icon={<BookOpen className="size-5" />}
    >
      <DataTable<Course>
        columns={columns}
        data={data.courses}
        emptyMessage="Aucun cours enregistré."
        searchable
        searchKeys={["code", "name"] as (keyof Course)[]}
      />
    </DashboardLayout>
  )
}
