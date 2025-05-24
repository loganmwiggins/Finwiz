import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import '../stylesheets/components/MonthDayPicker.css';

const monthNames = [
    { name: "Jan", value: 1 }, { name: "Feb", value: 2 }, { name: "Mar", value: 3 },
    { name: "Apr", value: 4 }, { name: "May", value: 5 }, { name: "Jun", value: 6 },
    { name: "Jul", value: 7 }, { name: "Aug", value: 8 }, { name: "Sep", value: 9 },
    { name: "Oct", value: 10 }, { name: "Nov", value: 11 }, { name: "Dec", value: 12 }
];

function getDaysInMonth(month) {
    const year = new Date().getFullYear(); // use current year to handle leap years
    return month ? new Date(year, month, 0).getDate() : 31;
}

function MonthDayPicker({
    label = "Month & Day",
    monthName,
    dayName,
    monthValue,
    dayValue,
    askForMonth = true,
    askForDay = true,
    onChange
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState("month");
    const dropdownRef = useRef();

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
            setStep("month");
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectMonth = (month) => {
        onChange({ target: { name: monthName, value: month } });
        if (askForDay) setStep("day");
        else {
            setIsOpen(false);
            setStep("month");
        }
    };

    const handleSelectDay = (day) => {
        onChange({ target: { name: dayName, value: day } });
        setIsOpen(false);
        setStep("month");
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange({ target: { name: monthName, value: null } });
        onChange({ target: { name: dayName, value: null } });
        setStep("month");
    };

    const selectedText = () => {
        if (askForMonth && askForDay && monthValue && dayValue) {
            return `${monthNames[monthValue - 1].name} ${dayValue}`;
        }
        if (askForMonth && monthValue) return monthNames[monthValue - 1].name;
        if (askForDay && dayValue) return `Day ${dayValue}`;
        return "Select date";
    };

    const days = Array.from(
        { length: getDaysInMonth(monthValue) },
        (_, i) => i + 1
    );

    return (
        <div className="MonthDayPicker" ref={dropdownRef}>
            <label className="dropdown-label">{label}</label>
            <div
                className="dropdown-input input"
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
            >
                {selectedText()}
                <div className="input-btn-row">
                    <img
                        src="/assets/icons/x-small.svg"
                        draggable="false"
                        className="dropdown-arrow icon"
                        onClick={handleClear}
                    />
                    <motion.img
                        src="/assets/icons/angle-small-down.svg"
                        draggable="false"
                        className="dropdown-arrow icon"
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="dropdown-popup"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {step === "month" && askForMonth && (
                            <>
                                <label>Select Month</label>
                                <div className="month-grid">
                                    {monthNames.map(m => (
                                        <button
                                            key={m.value}
                                            type="button"
                                            className={`dropdown-option ${monthValue === m.value ? 'selected' : ''}`}
                                            onClick={() => handleSelectMonth(m.value)}
                                        >
                                            {m.name}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {step === "day" && askForDay && (
                            <>
                                <div className="dropdown-header">
                                    <button type="button" className="back-btn" onClick={() => setStep("month")}>
                                        ← Back
                                    </button>
                                    <label>Select Day</label>
                                </div>
                                <div className="day-grid">
                                    {days.map(day => (
                                        <button
                                            key={day}
                                            type="button"
                                            className={`dropdown-option ${dayValue === day ? 'selected' : ''}`}
                                            onClick={() => handleSelectDay(day)}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default MonthDayPicker;