import React, { useState } from 'react'
import styles from './page.module.css'

import { addDoc, collection } from "firebase/firestore";

import { db } from '../../config/firebase'
const EmailPopUpCollector = () => {

    const [userEmail, setUserEmail] = useState('');


    // fonction to submit email to firebase firestore

    const handleSubmit = async () => {
        try {
            const docRef = await addDoc(collection(db, "emails"), {
                email: userEmail,
                createdAt: new Date(),
            });
            console.log("doc add");

        } catch (error) {
            console.error("error while adding doc", error);


        }
    }

    return (
        <main>
            <div className={styles.container}>

                <input
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className={styles.email_input}
                    placeholder="Enter your email"
                    type="text" />
            </div>


            <button
                onClick={

                    () => console.log(userEmail)
                }
                className={styles.submit_button}
            >
                Submit
            </button>
        </main>
    )
}

export default EmailPopUpCollector;