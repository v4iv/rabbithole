/**
 * Calculates dynamic issue count from August 2022 (Issue 01):
 * August 2022 = Issue 01
 * September 2022 = Issue 02
 * Each subsequent month increments the count by 1.
 */
export function getIssueNumber(date: Date = new Date()): number {
  const startYear = 2022
  const startMonth = 7 // August is index 7 (0-indexed: January = 0, August = 7)
  const diff =
    (date.getFullYear() - startYear) * 12 + (date.getMonth() - startMonth)
  return Math.max(1, diff + 1)
}

export function getIssueFormatted(date: Date = new Date()): string {
  return String(getIssueNumber(date)).padStart(2, "0")
}

export function getIssueTag(date: Date = new Date()): string {
  const issueNum = getIssueFormatted(date)
  return `Issue Nº ${issueNum} · ${date.getFullYear()}`
}
