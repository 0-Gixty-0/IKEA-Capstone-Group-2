import Image from "next/image";
import styles from "./page.module.css";
import EditArticle from "./edit-page";

const mockArticle = {
  title: "Sample Article",
  content: "This is a sample article content.",
  author: "Albin"
};

const handleSave = (updatedArticle) => {
  console.log("Article updated:", updatedArticle);
};

export default function Home() {
  return (
    <div>
      EditArticle article={mockArticle} onSave={handleSave} />
    </div>
  );

}
