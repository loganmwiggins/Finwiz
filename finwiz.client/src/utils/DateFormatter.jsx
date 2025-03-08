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