import React, { useState } from 'react'
import styles from './page.module.css'

const EmailPopUpCollector = () => {

    const [userEmail, setUserEmail] = useState('')
    return (
        <main>
            <div className={styles.container}>

                <input
                    className={styles.email_input}
                    placeholder="Enter your email"
                    type="text" />
            </div>


            <button
                className={styles.submit_button}
            >
                Submit
            </button>
        </main>
    )
}

export default EmailPopUpCollector