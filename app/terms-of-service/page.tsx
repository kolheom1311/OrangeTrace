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

const TermsOfServicePage = () => {
  return (
    <div className="bg-background text-foreground">
      <motion.section
        className="text-center py-20 px-4 bg-muted/40"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-orange-600 tracking-tight">
          Terms of Service
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
          Welcome to OrangeTrace! These Terms of Service ("Terms") govern your use of the OrangeTrace website, mobile applications, and services (collectively, the "Service"), operated by OrangeTrace Pvt. Ltd. By accessing or using our Service, you agree to be bound by these Terms.
        </motion.p>

        <motion.h2 variants={fadeInUp}>1. Accounts and Registration</motion.h2>
        <motion.p variants={fadeInUp}>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
        </motion.p>

        <motion.h2 variants={fadeInUp}>2. Marketplace and Transactions</motion.h2>
        <motion.p variants={fadeInUp}>
          OrangeTrace provides a platform for farmers, buyers, and other stakeholders in the agricultural supply chain to connect and transact. We are not a party to any transaction between users. We do not guarantee the quality, safety, or legality of items listed, the truth or accuracy of users' content or listings, or the ability of users to complete a transaction.
        </motion.p>
        
        <motion.h2 variants={fadeInUp}>3. User Conduct</motion.h2>
        <motion.ul variants={fadeInUp}>
          <li>You agree not to use the Service for any unlawful purpose or any purpose prohibited under this clause.</li>
          <li>You agree not to use the Service in any way that could damage the Service, the reputation of OrangeTrace, or the general business of OrangeTrace Pvt. Ltd.</li>
          <li>You further agree not to use the Service to harass, abuse, or threaten others or otherwise violate any person's legal rights.</li>
        </motion.ul>

        <motion.h2 variants={fadeInUp}>4. Intellectual Property</motion.h2>
        <motion.p variants={fadeInUp}>
          The Service and its original content, features, and functionality are and will remain the exclusive property of OrangeTrace Pvt. Ltd. and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of OrangeTrace Pvt. Ltd.
        </motion.p>

        <motion.h2 variants={fadeInUp}>5. Limitation of Liability</motion.h2>
        <motion.p variants={fadeInUp}>
          In no event shall OrangeTrace Pvt. Ltd., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </motion.p>

        <motion.h2 variants={fadeInUp}>6. Governing Law</motion.h2>
        <motion.p variants={fadeInUp}>
          These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
        </motion.p>

        <motion.h2 variants={fadeInUp}>7. Changes to Terms</motion.h2>
        <motion.p variants={fadeInUp}>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
        </motion.p>

        <motion.h2 variants={fadeInUp}>8. Contact Us</motion.h2>
        <motion.p variants={fadeInUp}>
          If you have any questions about these Terms, please contact us at: orangetrace.official@gmail.com.
        </motion.p>
      </motion.section>
    </div>
  );
};

export default TermsOfServicePage;