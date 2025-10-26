import Head from "next/head";
import { Children } from "react";
import styles from "./layout.module.css"
import utilStyles from "../src/styles/utils.module.css"
import Link from "next/link";

const name = "Shin Code";
export const siteTitle = "Next.js Blog";

function Layout({children, home}) {
    return (
        <div className={styles.container}>
            <Head>
                <link rel="icon" href="/favicon.ico"></link>
            </Head>
            <header className={styles.header}>
                <img src="images/profile.png" className={utilStyles.borderCircle}/>
                <h1 className={utilStyles.heading2Xl}>{name}</h1>
            </header>
            <main>{children}</main>
            {!home && (
                <div>
                    <Link href="/">←ホームへ戻る</Link>
                </div>
            )}
        </div>
    );
}

export default Layout;