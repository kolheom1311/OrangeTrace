"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Briefcase, Lightbulb, Users } from 'lucide-react';

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

const CareersPage = () => {
  const perks = [
    {
      icon: <Lightbulb className="h-10 w-10 text-orange-500" />,
      title: 'Work on Meaningful Problems',
      description: 'Join us in solving real-world challenges in the global supply chain, creating a tangible impact for businesses and consumers alike.',
    },
    {
      icon: <Users className="h-10 w-10 text-orange-500" />,
      title: 'A Culture of Collaboration',
      description: 'We believe the best ideas come from teamwork. You\'ll be part of a supportive and diverse team that values every voice.',
    },
    {
      icon: <Briefcase className="h-10 w-10 text-orange-500" />,
      title: 'Growth and Development',
      description: 'We invest in our people. At OrangeTrace, you\'ll have opportunities to learn, grow your skills, and advance your career.',
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {}
      <motion.section
        className="text-center py-20 px-4 bg-muted/40"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-orange-600 tracking-tight">
          Shape the Future With Us
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
          We're on a mission to build a more transparent world. Join a team of passionate innovators dedicated to revolutionizing the supply chain industry.
        </p>
      </motion.section>

      {}
      <motion.section
        className="py-20 px-4 max-w-6xl mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.div className="text-center" variants={fadeInUp}>
          <h2 className="text-4xl font-bold text-card-foreground">Why Join OrangeTrace?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            It's more than just a job. It's an opportunity to make a difference.
          </p>
        </motion.div>
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {perks.map((perk) => (
            <motion.div
              key={perk.title}
              className="text-center p-8 bg-card rounded-lg border"
              variants={fadeInUp}
            >
              <div className="flex justify-center mb-4">{perk.icon}</div>
              <h3 className="text-2xl font-bold mb-2 text-card-foreground">{perk.title}</h3>
              <p className="text-muted-foreground">{perk.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {}
      <motion.section
        className="py-20 px-4 bg-muted/40"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
      >
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-card-foreground">Current Openings</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are not actively hiring for any specific roles at the moment. However, we are always on the lookout for exceptional talent.
          </p>
        </div>
      </motion.section>

      {}
      <motion.section
        className="py-20 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeInUp}
      >
        <div className="text-center max-w-3xl mx-auto bg-card p-10 rounded-lg border">
          <h2 className="text-3xl font-bold text-card-foreground">Don't See a Role For You?</h2>
          <p className="mt-4 text-muted-foreground">
            If you believe you have what it takes to contribute to our mission, we would love to hear from you. Send us your resume and tell us why you want to be a part of the OrangeTrace team.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
              <a href="mailto:orangetrace.official@gmail.com?subject=Spontaneous Career Inquiry">
                Get In Touch
              </a>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default CareersPage;