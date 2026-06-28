// src/hooks/api/index.ts
import { useFetch } from "../useFetch";
import { api } from "@/api/client";
import {
  facultyApi,
  promotionApi,
  courseApi,
  roomApi,
  scheduleApi,
  gradeApi,
  appealApi,
  assignmentApi,
  submissionApi,
  resourceApi,
  academicYearApi,
  teachingUnitApi,
} from "@/api/endpoints/academic";
import { studentApi, teacherApi } from "@/api/endpoints/users";
import {
  announcementApi,
  notificationApi,
} from "@/api/endpoints/communications";

// -- Admin / multi-role hooks (all support `enabled` flag) --

export const useFaculties = (enabled = true) =>
  useFetch(() => facultyApi.list(), [], enabled);

export const usePromotions = (faculty_id?: string, enabled = true) =>
  useFetch(() => promotionApi.list(faculty_id), [faculty_id], enabled);

export const useCourses = (params?: Record<string, string>, enabled = true) =>
  useFetch(() => courseApi.list(params), [JSON.stringify(params)], enabled);

export const useRooms = (enabled = true) =>
  useFetch(() => roomApi.list(), [], enabled);

export const useAcademicYears = (enabled = true) =>
  useFetch(() => academicYearApi.list(), [], enabled);

export const useActiveAcademicYear = (enabled = true) =>
  useFetch(() => academicYearApi.active(), [], enabled);

export const useSchedules = (params?: Record<string, string>, enabled = true) =>
  useFetch(() => scheduleApi.list(params), [JSON.stringify(params)], enabled);

export const useGrades = (params?: Record<string, string>, enabled = true) =>
  useFetch(() => gradeApi.list(params), [JSON.stringify(params)], enabled);

export const useAppeals = (params?: Record<string, string>, enabled = true) =>
  useFetch(() => appealApi.list(params), [JSON.stringify(params)], enabled);

export const useAssignments = (params?: Record<string, string>, enabled = true) =>
  useFetch(() => assignmentApi.list(params), [JSON.stringify(params)], enabled);

export const useSubmissions = (params?: Record<string, string>, enabled = true) =>
  useFetch(() => submissionApi.list(params), [JSON.stringify(params)], enabled);

export const useResources = (params?: Record<string, string>, enabled = true) =>
  useFetch(() => resourceApi.list(params), [JSON.stringify(params)], enabled);

export const useStudents = (params?: Record<string, string>, enabled = true) =>
  useFetch(() => studentApi.list(params), [JSON.stringify(params)], enabled);

export const useStudentHistories = (params?: Record<string, string>, enabled = true) =>
  useFetch(() => studentApi.listHistories(params), [JSON.stringify(params)], enabled);

export const useTeachers = (params?: Record<string, string>, enabled = true) =>
  useFetch(() => teacherApi.list(params), [JSON.stringify(params)], enabled);

export const useTeachingUnits = (params?: Record<string, string>, enabled = true) =>
  useFetch(() => teachingUnitApi.list(params), [JSON.stringify(params)], enabled);

export const useAnnouncements = (params?: Record<string, string>, enabled = true) =>
  useFetch(() => announcementApi.list(params), [JSON.stringify(params)], enabled);

export const useNotifications = (enabled = true) =>
  useFetch(() => notificationApi.list(), [], enabled);

// -- Student-portal-specific hooks (call /student/* protected endpoints) --

export const useStudentOwnProfile = (enabled = true) =>
  useFetch(
    () => api.get<unknown>("/student/profile"),
    [],
    enabled,
  );

export const useStudentGrades = (enabled = true) =>
  useFetch(
    () => api.get<unknown>("/student/grades"),
    [],
    enabled,
  );

export const useStudentResources = (enabled = true) =>
  useFetch(
    () => api.get<unknown>("/student/resources"),
    [],
    enabled,
  );

export const useStudentTimetable = (enabled = true) =>
  useFetch(
    () => api.get<unknown>("/student/timetable"),
    [],
    enabled,
  );
