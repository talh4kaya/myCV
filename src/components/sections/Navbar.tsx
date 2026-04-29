import { motion } from 'framer-motion';
import VisitorCounter from '../VisitorCounter';

const Navbar = () => {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full p-4 md:p-8 z-50 mix-blend-difference flex justify-between items-center"
        >
            <img
                src="/me.png"
                alt="TK Logo"
                className="w-14 h-14 object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0"
            />
            <VisitorCounter />
        </motion.nav>
    );
};

export default Navbar;
