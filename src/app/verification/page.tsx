"use client"


import { motion } from 'framer-motion';
import { useState } from 'react';


export default function Home() {

    const [image, setImage] = useState<string | null>(null);

    const [userName, setUserName] = useState('');

    const fetchScrenshot = async () => {
        if (!image) {
            setImage(null)
        }
        // Call your API to take a screenshot of the page
        const response = await fetch(`/api/screenshot?url=https://reddit.com/user/${userName}`);
        const data = await response.json();
        setImage(`data:image/png;base64,${data.screenshot}`);
    };

    return (

        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div>

                <input type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}

                />




                <div>
                    <button onClick={fetchScrenshot}>Prendre une capture</button>
                    {image && <img src={image} alt="Screenshot" />}
                </div>
            </div>



        </motion.div>
    );
}
