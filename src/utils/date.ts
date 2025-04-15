export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date"
    }

    // Get current date for comparison
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Format date based on how recent it is
    if (date >= today) {
      return `Today at ${formatTime(date)}`
    } else if (date >= yesterday) {
      return `Yesterday at ${formatTime(date)}`
    } else {
      return `${date.toLocaleDateString()} at ${formatTime(date)}`
    }
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Unknown date"
  }
}

function formatTime(date: Date): string {
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"

  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'

  const minutesStr = minutes < 10 ? `0${minutes}` : minutes

  return `${hours}:${minutesStr} ${ampm}`
}
