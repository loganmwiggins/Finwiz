// Arrays of possible greetings
const greetings = [
    "Hi", "Hey", "Hello", "Welcome", "Greetings", "What's up", "Howdy",
    "Good to see you", "Hey there", "Hello there"
];
const morningGreetings = [
    "Good morning", "Good morrow", "Rise and shine", "Morning", 
    "Top of the morning", "Grand risings", "A new day awaits", 
    "Start the day right", "Seize the day"
];
const afternoonGreetings = [
    "Good afternoon", "Afternoon", "Good day", "Keep pushing",
    "The day's still young"
];
const eveningGreetings = [
    "Good evening", "Evening", "The night is young", "End the day right",
    "Enjoy your night", "The day's almost done"
];

// Determine time-based greetings
const currentHour = new Date().getHours();
let timeBasedGreetings = [];

if (currentHour >= 5 && currentHour < 12) timeBasedGreetings = morningGreetings;
else if (currentHour >= 12 && currentHour < 18) timeBasedGreetings = afternoonGreetings;
else timeBasedGreetings = eveningGreetings;

// Export array of ALL possible greetnigs
export const allGreetings = [...greetings, ...timeBasedGreetings];

// Export function to randomly pick a greeting
export const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];