import styles from "./PdfReader.module.css";



interface PdfReaderProps {
  pdfUrl: string;
}

const pdfReader: React.FC<PdfReaderProps> = ({
  pdfUrl,
}) => {

  return (
    <iframe
          src={pdfUrl}
          className={styles.pdfReader}
          title="Post PDF"
        />
  );
}

export default pdfReader;
  