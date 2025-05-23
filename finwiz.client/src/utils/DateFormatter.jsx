// Helper function to format DateTime into "yyyy-MM-dd"
export const formatDateToInput = (dateString) => {
    return dateString ? dateString.split("T")[0] : null;
};

export const formatDate = (dateTimeStr, showYear = true) => {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return "Invalid date";

    const options = { month: 'long', day: 'numeric' };
    if (showYear) options.year = 'numeric';

    return date.toLocaleDateString('en-US', options);
}

export const findDaysUntil = (targetDate) => {
    const currentDate = new Date();
    const target = new Date(targetDate);

    // Calculate the difference in milliseconds
    const diffInMs = target - currentDate;

    // Convert milliseconds to days
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
}

export const getNextDayDate = (dayOfMonth) => {
    if (!dayOfMonth || dayOfMonth < 1 || dayOfMonth > 31) return null;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Clamp the day to the number of days in this month
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const safeDay = Math.min(dayOfMonth, daysInCurrentMonth);

    const thisMonthDate = new Date(currentYear, currentMonth, safeDay);

    if (thisMonthDate >= today) {
        return thisMonthDate.toISOString(); // still upcoming this month
    }

    // Otherwise, calculate next month's date
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    const daysInNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
    const nextSafeDay = Math.min(dayOfMonth, daysInNextMonth);

    const nextMonthDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextSafeDay);

    return nextMonthDate.toISOString();
};
