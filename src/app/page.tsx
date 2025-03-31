"use client"

import Link from 'next/link';
import styles from './page.module.css'
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

        <div className={styles.topnav}>
          <a href="#home"
          //  className={styles.active}
          >
            Not-Ban
          </a>
          <div className="choose">

            {/* <a href="#">Pricing</a>
  <a href="#">Review</a>
  <a href="#">FAQ</a> */}
          </div>

          <button

            className={styles.ctaButton}
          >
            <Link href={"registerEmail"}>

              Get Started
            </Link>

          </button>






        </div>
        <div className={styles.hero_section}>
          <div className={styles.hero_section_principale_text}>
            <h1>
              Says goodbye of Reddit Ban
            </h1>

          </div>

          <div className={styles.hero_section_secondaire_text}>
            <p>
              The best way to be not bired of getting banned and wasting your potential
            </p>
          </div>


          <div className={styles.footer_button_container}>

            <button
              className={styles.footer_ctaButton}
            >
              <Link href={"registerEmail"}>

                Get Started
              </Link>
            </button>


            <div>
              <button onClick={fetchScrenshot}>Prendre une capture</button>
              {image && <img src={image} alt="Screenshot" />}
            </div>
          </div>
        </div>



      </div>
    </motion.div>
  );
}
