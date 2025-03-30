"use client"

import React, { useState } from 'react'
import styles from './page.module.css'

import { motion } from "framer-motion";

import { addDoc, collection } from "firebase/firestore";

import { db } from '../config/firebase'
import { Toaster, toast } from 'sonner';

export default function RegisterEmail() {
    const [userEmail, setUserEmail] = useState('');

    // Nous avons supprimé la variable error non utilisée

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    // fonction to submit email to firebase firestore

    const handleSubmit = async () => {
        try {
            // verification if the email is valid
            if (!isValidEmail(userEmail)) {
                toast("Please enter a valid email address.");
                return;
            }

            try {
                const docRef = await addDoc(collection(db, "emails"), {
                    email: userEmail,
                    createdAt: new Date(),
                });
                console.log("doc added with ID:", docRef.id); // Utilisation de docRef ici
            } catch (error) {
                console.error("error while adding doc", error);
            }

            setUserEmail('');
            toast("Email added successfully!");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Toaster position="top-center" />

            <main className={styles.allContainer}>
                <div className={styles.topText}>
                    Enter Your emails to join beta user and get more features in preview
                </div>
                <div className={styles.container}>
                    <div>
                        <input
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className={styles.email_input}
                            placeholder="Enter your email"
                            type="email" />
                    </div>

                    <button
                        onClick={() => {
                            console.log(userEmail);
                            handleSubmit();
                        }}
                        className={styles.submit_button}
                    >
                        Submit
                    </button>
                </div>
            </main>
        </motion.div>
    )
}