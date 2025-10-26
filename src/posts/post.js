import path from "path";
import fs, { fdatasync } from "fs";
import matter from "gray-matter";
import {remark} from "remark";
import html from "remark-html";
 
const postsDirectory = path.join(process.cwd(), "src", "posts");

export function getPostsData() {
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });

  // .md / .mdx のファイルだけを対象に（.DS_Store 等やフォルダは除外）
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => /\.mdx?$/i.test(name) && !name.startsWith(".")); // .md or .mdx

  const allPostsData = files.map((fileName) => {
    const id = fileName.replace(/\.mdx?$/i, ""); // 拡張子を除いたID
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data } = matter(fileContents); // frontmatter
    return { id, ...data };
  });

  // ついでに日付で降順ソート（任意）
  allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  return allPostsData;
}

// getStaticPathでreturnで使うPathを取得する
export function getAllPostIds() {
  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
  return entries
    .filter(e => e.isFile())
    .map(e => e.name)
    .filter(name => /\.md$/i.test(name) && !name.startsWith(".")) // ★ここ
    .map(fileName => ({ params: { id: fileName.replace(/\.md$/i, "") } }));
}

// idに基づいてブログ投稿データを返す
export async function getPostData(id){
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContent = fs.readFileSync(fullPath, "utf8");

    const { data, content }  = matter(fileContent);
    
    const processed = await remark().use(html).process(content)
    const contentHTML = String(processed)

    return {
        id,
        contentHTML,
        ...sanitizeFrontmatter(data),   
    };
}

// Dateなどを文字列化（getStaticPropsでJSON化エラーを防ぐ）
function sanitizeFrontmatter(d) {
    return {
      title: d.title ?? "",
      date: d.date ? new Date(d.date).toISOString() : null,
      thumbnail: d.thumbnail ?? "",
    };
  }