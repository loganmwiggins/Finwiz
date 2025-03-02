// Helper function to format DateTime into "yyyy-MM-dd"
export const formatDateToInput = (dateString) => {
    return dateString ? dateString.split("T")[0] : null;
};