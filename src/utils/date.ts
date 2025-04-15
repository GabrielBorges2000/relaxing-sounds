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
      return `Today at ${formatTime(date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds())}`
    } else if (date >= yesterday) {
      return `Yesterday at ${formatTime(date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds())}`
    } else {
      return `${date.toLocaleDateString()} at ${formatTime(date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds())}`
    }
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Unknown date"
  }
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600); // Get whole hours
  const minutes = Math.floor((seconds % 3600) / 60); // Get whole minutes
  const remainingSeconds = seconds % 60; // Get remaining seconds

  const formattedHours = Math.max(0, hours).toString().padStart(2, '0');
  const formattedMinutes = Math.max(0, minutes).toString().padStart(2, '0');
  const formattedSeconds = Math.max(0, Math.floor(remainingSeconds)).toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
