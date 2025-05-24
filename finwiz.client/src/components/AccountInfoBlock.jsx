import { motion } from 'framer-motion';
;
function AccountInfoBlock({ label, content, delay = 0 }) {
    return (
        <motion.div 
            className="acc-info"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
        >
            <p>{label}</p>
            <h1>{content}</h1>
        </motion.div>
    )
}

export default AccountInfoBlock