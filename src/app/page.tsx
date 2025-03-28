"use client"

import styles from './page.module.css'


export default function Home() {

  async function fetchData() {
    const res = await fetch("/api/hello");
    const data = await res.json();
    console.log(data);
  }

  async function jesuisbeau() {
    const res = await fetch('/api/jesuisbeau');
    const data = await res.json();
    console.log(data);

  }

  async function newGet() {
    const res = await fetch('/api/route.ts');
    const data = await res.json;
    console.log(data);
  }



  return (
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
          Get Started
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
            Get Started
          </button>
        </div>
      </div>



    </div>
  );
}
