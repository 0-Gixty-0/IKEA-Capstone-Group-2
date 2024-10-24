import React, { useEffect, useState } from "react";
import styles from "./PdfReader.module.css";



interface PdfReaderProps {
  postId: number;
}

const pdfReader: React.FC<PdfReaderProps> = ({
  postId,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`/api/posts?id=${postId}`);
        const data = await response.json();
        console.log("Fetched post details:", data); // Log the fetched data
        console.log("pdfUrl");
        console.log(data.post.pdfUrl);
        setPdfUrl(data.post.pdfUrl);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostDetails();
  }, [postId]);

  return (
    <>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          className={styles.pdfReader}
          title="Post PDF"
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default pdfReader;
  