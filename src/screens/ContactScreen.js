import React from 'react';
import ContactForm from '../components/Contact/ContactForm';
import { motion } from 'framer-motion';

const ContactScreen = () => {
    return (
        <section className="max-w-screen-xl py-24 mx-auto px-6 overflow-y-hidden">
            {/* heading */}
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex flex-col items-center space-x-2 pb-4">
                    <h1 className="text-gray-700 poppins text-3xl">
                        Liên hệ
                        {/* <span className="text-blue-600 font-semibold select-none">Us</span> */}
                    </h1>
                    <div className="bg-blue-600 flex items-center justify-center w-16 h-1 mt-2 rounded-full"></div>
                </div>
            </motion.div>

            {/* form */}
            <ContactForm />
        </section>
    );
};

export default ContactScreen;
