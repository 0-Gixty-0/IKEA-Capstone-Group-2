import styles from "./PdfReader.module.css";

interface PdfReaderProps {
  pdfUrl: string;
}

const pdfReader: React.FC<PdfReaderProps> = ({ pdfUrl }) => {
  return (
    <div className={styles.pdfReader}>
      <iframe src={pdfUrl} className={styles.pdfIframe} title="Post PDF" />
    </div>
  );
};

export default pdfReader;
