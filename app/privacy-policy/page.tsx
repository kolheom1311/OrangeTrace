"use client";

import React from 'react';
import { motion } from 'framer-motion';
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-background text-foreground">
      <motion.section
        className="text-center py-20 px-4 bg-muted/40"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-orange-600 tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
          Last Updated: September 22, 2025
        </p>
      </motion.section>

      <motion.section
        className="py-16 px-4 max-w-4xl mx-auto prose dark:prose-invert"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.p variants={fadeInUp}>
          OrangeTrace Pvt. Ltd. ("us", "we", or "our") operates the OrangeTrace website and mobile application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
        </motion.p>

        <motion.h2 variants={fadeInUp}>1. Information Collection and Use</motion.h2>
        <motion.p variants={fadeInUp}>
          We collect several different types of information for various purposes to provide and improve our Service to you.
        </motion.p>
        <motion.ul variants={fadeInUp}>
            <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information, such as your name, email address, phone number, and address.</li>
            <li><strong>Transactional Data:</strong> We collect information related to the batches you register, products you list, orders you place, and payments you make through our marketplace.</li>
            <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used. This may include your computer's IP address, browser type, browser version, the pages of our Service that you visit, and other diagnostic data.</li>
        </motion.ul>

        <motion.h2 variants={fadeInUp}>2. How We Use Your Data</motion.h2>
        <motion.p variants={fadeInUp}>
          OrangeTrace uses the collected data for various purposes:
        </motion.p>
        <motion.ul variants={fadeInUp}>
          <li>To provide and maintain our Service.</li>
          <li>To notify you about changes to our Service.</li>
          <li>To facilitate transactions and track supply chain data.</li>
          <li>To provide customer support and respond to your inquiries.</li>
          <li>To monitor the usage of our Service and prevent fraud.</li>
          <li>To improve our platform and develop new features.</li>
        </motion.ul>
        
        <motion.h2 variants={fadeInUp}>3. Data Sharing and Disclosure</motion.h2>
        <motion.p variants={fadeInUp}>
          We do not sell your personal data. We may share your information with third-party service providers to facilitate our Service, such as payment processors and cloud hosting services. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose. We may also disclose your data if required by law.
        </motion.p>

        <motion.h2 variants={fadeInUp}>4. Data Security</motion.h2>
        <motion.p variants={fadeInUp}>
          The security of your data is important to us. We use commercially acceptable means to protect your Personal Data, including encryption and secure server infrastructure. However, remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
        </motion.p>

        <motion.h2 variants={fadeInUp}>5. Your Data Protection Rights</motion.h2>
        <motion.p variants={fadeInUp}>
          You have certain data protection rights, including the right to access, update, or delete the information we have on you. You can manage your account information through your dashboard or by contacting us directly.
        </motion.p>
        <motion.h2 variants={fadeInUp}>6. Children's Privacy</motion.h2>
        <motion.p variants={fadeInUp}>
          Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18.
        </motion.p>

        <motion.h2 variants={fadeInUp}>7. Changes to This Privacy Policy</motion.h2>
        <motion.p variants={fadeInUp}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top.
        </motion.p>

        <motion.h2 variants={fadeInUp}>8. Contact Us</motion.h2>
        <motion.p variants={fadeInUp}>
          If you have any questions about this Privacy Policy, please contact us at: orangetrace.official@gmail.com.
        </motion.p>
      </motion.section>
    </div>
  );
};

export default PrivacyPolicyPage;
