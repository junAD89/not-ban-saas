"use client"


import { motion } from 'framer-motion';
import { useState } from 'react';


export default function Home() {

    const [image, setImage] = useState<string | null>(null)

    const fetchScrenshot = async () => {
        const response = await fetch("/api/screenshot?url=https://example.com");
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




                <div>
                    <button onClick={fetchScrenshot}>Prendre une capture</button>
                    {image && <img src={image} alt="Screenshot" />}
                </div>
            </div>



        </motion.div>
    );
}
