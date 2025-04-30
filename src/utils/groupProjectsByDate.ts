// utils/groupProjectsByDate.ts
import { type Project } from '@/modules/projects/models/project.model'
import { isToday, isYesterday, isThisWeek, format, compareDesc } from 'date-fns'

export function groupProjectsByDate(projects: Project[]) {
  const groups: Record<string, Project[]> = {
    Hoy: [],
    Ayer: [],
    'Esta semana': []
  }

  const others: Record<string, Project[]> = {}

  for (const project of projects) {
    const date = new Date(project.last_modified)
    let key = ''

    if (isToday(date)) {
      key = 'Hoy'
    } else if (isYesterday(date)) {
      key = 'Ayer'
    } else if (isThisWeek(date)) {
      key = 'Esta semana'
    } else {
      key = format(date, 'dd MMM yyyy')
    }

    if (['Hoy', 'Ayer', 'Esta semana'].includes(key)) {
      groups[key].push(project)
    } else {
      if (!others[key]) others[key] = []
      others[key].push(project)
    }
  }

  // Ordenamos los proyectos dentro de cada grupo por fecha descendente
  for (const key in groups) {
    groups[key].sort((a, b) =>
      compareDesc(new Date(a.last_modified), new Date(b.last_modified))
    )
  }

  for (const key in others) {
    others[key].sort((a, b) =>
      compareDesc(new Date(a.last_modified), new Date(b.last_modified))
    )
  }

  // Combina primero los grupos conocidos en orden, luego los demás por fecha descendente
  const sortedOthers = Object.entries(others).sort(
    ([a], [b]) =>
      compareDesc(new Date(b), new Date(a)) // fechas más recientes primero
  )

  const orderedGroups: Record<string, Project[]> = {}

  for (const label of ['Hoy', 'Ayer', 'Esta semana']) {
    if (groups[label]?.length) {
      orderedGroups[label] = groups[label]
    }
  }

  for (const [key, value] of sortedOthers) {
    orderedGroups[key] = value
  }

  return orderedGroups
}
