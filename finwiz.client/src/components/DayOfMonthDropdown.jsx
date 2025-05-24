import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import '../stylesheets/components/DayOfMonthDropdown.css';

function DayOfMonthDropdown({ name, value, onChange, label = "Day of Month", required = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleSelect = (day) => {
        const syntheticEvent = {
            target: {
                name,
                value: day,
            }
        };
        onChange(syntheticEvent);
        setIsOpen(false);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="DayOfMonthDropdown" ref={dropdownRef}>
            <label className="dropdown-label">
                {label}
                {required && <span style={{ color: 'red' }}> *</span>}
            </label>

            <div 
                className="dropdown-input input" 
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
            >
                {value ? `${value}` : "Select Day of Month"}
                <div className="input-btn-row">
                    <img 
                        src="/assets/icons/x-small.svg"
                        draggable="false"
                        className="dropdown-arrow icon" 
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange({
                                target: {
                                    name,
                                    value: null,
                                }
                            });
                        }}
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
                        className="day-dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <label>Day of Month</label>
                        <div className="day-grid">
                            {days.map(day => (
                                <button 
                                    key={day}
                                    type="button"
                                    className={`dropdown-day ${value === day ? 'selected' : ''}`}
                                    onClick={() => handleSelect(day)}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default DayOfMonthDropdown;