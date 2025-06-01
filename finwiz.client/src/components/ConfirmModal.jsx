import { motion, AnimatePresence } from "framer-motion";

import '../stylesheets/components/ConfirmModal.css';

function ConfirmModal({ isOpen, header, message, cancelBtn, confirmBtn, onConfirm, onCancel }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="modal-overlay"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                >
                    <motion.div 
                        className="modal-content"
                        initial={{ scale: 0.9, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h3>{header}</h3>
                        <p className="modal-message p-sm">{message}</p>

                        <div className="modal-buttons">
                            {cancelBtn && (
                                <button className="btn btn-outline" onClick={onCancel}>{cancelBtn}</button>
                            )}
                            <button className="btn btn-accent" onClick={onConfirm}>{confirmBtn}</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ConfirmModal;