import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";

import Layout, {siteTitle} from "../../components/Layout";
import utilStyle from "../styles/utils.module.css";
import { getPostsData } from "@/posts/post";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SSGの場合
export async function getStaticProps(){
  const allPostsData = getPostsData();
  console.log(allPostsData);

  return{
    props: {
      allPostsData
    },
  };
}

export default function Home({allPostsData}) {
  return (
    <Layout Home>
      <Head>
        <title>
          {siteTitle}
        </title>
      </Head>
      <section className={utilStyle.headingMd}>
        <p>プロフィール文です。</p>
      </section>
      
      <section className={`${utilStyle.headingMd} ${utilStyle.padding1px}`}>
        <h2>📝エンジニアのブログ</h2>
        <div className={styles.grid}>
          {allPostsData.map(({id, title, date, thumbnail }) => (
            <article key={id}>
              <Link href={`/posts/${id}`}>
                <img src={`${thumbnail}`} 
                className={styles.thumbnailImage}></img>
              </Link>
              <Link href={`/posts/${id}`}>
                <p className={utilStyle.boldText}>{title}</p>
              </Link>
              <br />
              <small className={utilStyle.lightText}>
                {date}
              </small>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
