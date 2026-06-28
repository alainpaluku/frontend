// src/hooks/usePageData.ts
import { useAuth } from "@/contexts/AuthContext"
import {
  useFaculties, usePromotions, useStudents, useTeachers, useCourses,
  useSchedules, useRooms, useGrades, useAppeals, useAssignments,
  useSubmissions, useAnnouncements, useNotifications, useAcademicYears,
  useStudentOwnProfile, useStudentGrades, useStudentResources,
} from "./api"

import type { AppData, Promotion, Student } from "@/types"

/**
 * Role-aware central data store.
 *
 * For admin/staff roles: fetches all management data from admin endpoints.
 * For the student role: fetches only student-specific data from /student/* endpoints.
 *
 * The `enabled` flag on each useFetch call prevents 403/404 spam in the
 * browser console when a role lacks permission for a given endpoint.
 */
export function useStore(): AppData {
  const { roleName } = useAuth()
  const isStudent  = roleName === "student"
  const isStaff    = !isStudent   // teacher, apparitorat, secretariat_*, rectorat, section

  // ── Admin / staff data (disabled for student role) ─────────────────────
  const facultiesData      = useFaculties(isStaff).data      || []
  const promotionsRaw      = usePromotions(undefined, isStaff).data || []
  const studentsAdminData  = useStudents(undefined, isStaff).data   || []
  const teachersData       = useTeachers(undefined, isStaff).data   || []
  const coursesData        = useCourses(undefined, isStaff).data    || []
  const schedulesData      = useSchedules(undefined, isStaff).data  || []
  const roomsData          = useRooms(isStaff).data                 || []
  const academicYearsData  = useAcademicYears(isStaff).data         || []
  // Announcements: no GET route on /api/notifications yet — disabled to avoid 404 spam
  const announcementsData  = useAnnouncements(undefined, false).data || []
  // Admin grades (teacher/secretariat roles)
  const adminGradesResult  = useGrades(undefined, isStaff)

  // ── Appeals / assignments / submissions: backend routes not yet implemented ──
  // Disabled to prevent 404 console spam. Will be re-enabled once backend routes exist.
  const appealsData     = useAppeals(undefined, false).data     || []
  const assignmentsData = useAssignments(undefined, false).data || []
  const submissionsData = useSubmissions(undefined, false).data || []

  // ── Student-portal-specific data (disabled for staff roles) ────────────
  const ownProfileResult     = useStudentOwnProfile(isStudent)
  const studentGradesResult  = useStudentGrades(isStudent)
  const studentResourcesResult = useStudentResources(isStudent)

  // ── Notifications (every authenticated user via /me/notifications) ──────
  const notificationsData = useNotifications().data || []

  // ── Compose students list ───────────────────────────────────────────────
  // For staff: use the admin student list.
  // For student: derive a minimal Student record from the own-profile endpoint.
  const ownProfileStudents: Student[] = (() => {
    if (!isStudent) return []
    const raw = ownProfileResult.data as any
    if (!raw) return []
    const profile = raw.profile || raw
    if (!profile?.id) return []
    return [{
      id:               profile.id,
      user_id:          profile.user_id         || "",
      matricule:        profile.matricule        || profile.code || "",
      birth_date:       profile.birth_date       || "",
      phone_number:     profile.phone_number     || "",
      faculty_id:       profile.faculty_id       || "",
      promotion_id:     profile.promotion_id     || "",
      academic_year_id: profile.academic_year_id || "",
      status:           "en_cours",
      first_name:       profile.user?.first_name || "",
      middle_name:      profile.user?.middle_name,
      last_name:        profile.user?.last_name  || "",
      email:            profile.user?.email      || "",
      faculty:          profile.faculty          || undefined,
      promotion:        profile.promotion        || undefined,
      academic_year:    profile.academic_year    || undefined,
      histories:        (raw.academic_history as any[]) || [],
    }]
  })()

  const studentsData = isStudent ? ownProfileStudents : studentsAdminData

  // ── Compose grades ──────────────────────────────────────────────────────
  // Admin/teacher route returns Grade[] directly.
  // Student route returns { grades: Grade[], count: number }.
  const gradesData = isStudent
    ? (((studentGradesResult.data as any)?.grades) || [])
    : (adminGradesResult.data || [])

  // ── Compose resources ───────────────────────────────────────────────────
  // Student route returns { resources: CourseResource[] }.
  // Admin resource route does not exist yet.
  const resourcesData = isStudent
    ? (((studentResourcesResult.data as any)?.resources) || [])
    : []

  // ── Normalize promotions (ensure code field exists) ─────────────────────
  const promotions: Promotion[] = promotionsRaw.map(p => ({
    ...p,
    code:      p.code || p.name?.substring(0, 3).toUpperCase() || "",
    faculty_id: p.faculty_id || "",
  }))

  return {
    faculties:      facultiesData,
    promotions,
    students:       studentsData,
    teachers:       teachersData,
    courses:        coursesData,
    schedules:      schedulesData,
    rooms:          roomsData,
    grades:         gradesData,
    gradeAppeals:   appealsData,
    assignments:    assignmentsData,
    submissions:    submissionsData,
    courseResources: resourcesData,
    announcements:  announcementsData,
    notifications:  notificationsData,
    academicYears:  academicYearsData,
    users:          [],
    teacherTitles:  ["Professeur", "Professeure", "Assistant", "Assistante", "Chef de Travaux", "Maître de Conférences"],
  }
}

export function usePageData<T>(selector: (data: AppData) => T) {
  const store = useStore()

  try {
    const data = selector(store)
    return { data, loading: false, error: null }
  } catch (e) {
    return { data: null, loading: false, error: e instanceof Error ? e.message : "Erreur" }
  }
}
