import { useEffect, useState } from "react";
import axios from "axios";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const res = await axios.get("http://localhost:8080/api/upload/files");
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/upload",
        formData
      );

      setMessage("✅ Upload successful");
      setFile(null);
      fetchFiles(); // 🔥 refresh list

    } catch (err) {
      setMessage("❌ Upload failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload PDF</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br /><br />

      <button onClick={handleUpload}>Upload</button>

      <p>{message}</p>

      <hr />

      <h3>Uploaded Files</h3>
      <ul>
        {files.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </div>
  );
}

export default UploadPage;