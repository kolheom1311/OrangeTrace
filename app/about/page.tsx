"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Pointer } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const teamImageUrls = {
  ceo: 'https://firebasestorage.googleapis.com/v0/b/articea-app.appspot.com/o/assets%2FMohit.png?alt=media&token=b046af12-9cb1-48c2-8432-00c9e127615c',
  cto: 'https://firebasestorage.googleapis.com/v0/b/articea-app.appspot.com/o/assets%2FOmKolhe.png?alt=media&token=22d97a88-9b60-4964-8da1-be8163e10907',
  coo: 'https://firebasestorage.googleapis.com/v0/b/articea-app.appspot.com/o/assets%2FKshitij.png?alt=media&token=287363a3-8b88-4b87-81fa-b1e49a72ce97',
};

const LinkedInUrls = {
  ceo: 'https://www.linkedin.com/in/mohit-patil-bb48b024a/',
  cto: 'https://linkedin.com/in/kolheom1311',
  coo: 'https://www.linkedin.com/in/kshitij-sadegaonkar/',
};

const AboutUsPage = () => {
  const initialTeamMembers = [
    { id: 'ceo', name: 'Mohit Patil', role: 'Co-Founder & CEO ', bio: 'The visionary leader with over 15 years in supply chain management, Mohit drives our mission to bring transparency to global trade.', imageUrl: teamImageUrls.ceo, linkedin: LinkedInUrls.ceo },
    { id: 'cto', name: 'Om Kolhe', role: 'Founder & CTO', bio: 'Om is the architectural mastermind behind our platform, leveraging cutting-edge technology to build a robust and secure ecosystem.', imageUrl: teamImageUrls.cto, linkedin: LinkedInUrls.cto },
    { id: 'coo', name: 'Kshitij Sadegaonkar', role: 'Co-Founder & Chief Operating Officer', bio: 'With a talent for optimizing complex processes, Kshitij ensures that our operations run smoothly and our clients achieve success.', imageUrl: teamImageUrls.coo, linkedin: LinkedInUrls.coo },
  ];
  
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);

  const stats = [
    { value: '10M+', label: 'Transactions Tracked' },
    { value: '12', label: 'Industries Served' },
    { value: '99.9%', label: 'Uptime Guarantee' },
    { value: '2', label: 'Languages Supported' },
  ];

  const values = [
    { title: 'Integrity', description: "We operate with unwavering honesty and transparency. Trust is not just a feature; it's our foundation." },
    { title: 'Innovation', description: "We relentlessly pursue technological advancements to solve real-world problems in the most efficient way possible." },
    { title: 'Customer-Centricity', description: "Our clients' success is our success. We build partnerships and deliver solutions that create tangible value." },
  ];

  return (
    <div className="bg-background text-foreground">
      <motion.section 
        className="text-center py-20 px-4 bg-muted/40"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        transition={{ staggerChildren: 0.2 }}
      >
        <motion.h1 
          className="text-5xl md:text-6xl font-extrabold text-orange-600 tracking-tight"
          variants={fadeInUp}
        >
          About OrangeTrace
        </motion.h1>
        <motion.p 
          className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground"
          variants={fadeInUp}
        >
          Illuminating the path from source to consumer. We are building the future of transparent and trustworthy supply chains.
        </motion.p>
      </motion.section>
      <motion.section 
        className="py-16 px-4 max-w-6xl mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-card-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To empower businesses and consumers with verifiable, real-time data, fostering unparalleled trust and integrity in the global marketplace. We believe that every product has a story, and our mission is to make that story accessible, transparent, and undeniable.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Founded in the vibrant tech hub of Maharashtra, India, OrangeTrace was born from a desire to solve the critical trust deficit in complex supply chains.
            </p>
          </motion.div>
          <motion.div 
            className="rounded-lg overflow-hidden shadow-lg"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop" alt="Our Team collaborating" className="w-full h-full object-cover"/>
          </motion.div>
        </div>
      </motion.section>
      <motion.section 
        className="bg-orange-600 text-white py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-6xl mx-auto px-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-14 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl md:text-5xl font-bold">{stat.value}</p>
                <p className="mt-2 text-lg font-medium opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
      <motion.section 
        className="py-20 px-4 bg-muted/40"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <motion.div className="text-center max-w-6xl mx-auto" variants={fadeInUp}>
          <h2 className="text-4xl font-bold text-card-foreground">Meet Our Leadership</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The passionate individuals guiding OrangeTrace to new heights.
          </p>
        </motion.div>
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
          variants={staggerContainer}
        >
          {teamMembers.map((member) => (
            <motion.div 
              id={member.id}
              key={member.id} 
              className="bg-card rounded-lg border shadow-md overflow-hidden text-center flex flex-col"
              variants={fadeInUp}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
               <img src={member.imageUrl} alt={member.name} className="w-full h-64 object-cover" draggable="false" style={{ userSelect: 'none', cursor: 'pointer' }}  />
               <div className="p-6 flex flex-col flex-grow" style={{cursor: 'pointer'}}>
                  <div className="flex justify-center items-center gap-2">
                     <h3 className="text-2xl font-bold text-card-foreground">{member.name}</h3>
                     <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title={`View ${member.name}'s LinkedIn Profile`}
                        className="text-muted-foreground hover:text-yellow-400 transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                     </a>
                 </div>
                 <p className="text-orange-500 font-semibold mt-1">{member.role}</p>
                 <p className="text-muted-foreground mt-4 text-sm leading-relaxed flex-grow">{member.bio}</p>
               </div>
             </motion.div>
          ))}
        </motion.div>
      </motion.section>
      <motion.section 
        className="py-16 px-4 max-w-6xl mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.div className="text-center" variants={fadeInUp}>
          <h2 className="text-4xl font-bold text-card-foreground">Our Core Values</h2>
          <p className="mt-4 text-lg text-muted-foreground">The principles that guide every decision we make.</p>
        </motion.div>
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {values.map((value) => (
              <motion.div 
                key={value.title} 
                className="text-center p-6 bg-card rounded-lg border"
                variants={fadeInUp}
              >
                  <h3 className="text-2xl font-bold mb-2 text-card-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
          ))}
        </motion.div>
      </motion.section>
      <motion.section 
        className="bg-muted/40 py-20 px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainer}
      >
        <motion.div className="text-center max-w-3xl mx-auto" variants={fadeInUp}>
          <h2 className="text-4xl font-bold text-card-foreground">Ready to Build a More Transparent Future?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you're a potential partner, a future employee, or just curious, we'd love to connect.
          </p>
        </motion.div>
        <motion.div 
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          variants={fadeInUp}
        >
          <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/careers">Join Our Team</Link>
          </Button>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default AboutUsPage;
