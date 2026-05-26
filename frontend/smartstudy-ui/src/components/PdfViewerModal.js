import {

  Document,
  Page,
  pdfjs

} from "react-pdf";
import { useState } from "react";
pdfjs.GlobalWorkerOptions.workerSrc =

`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
function PdfViewerModal({

  fileUrl,
  onClose

}) {

  const [numPages, setNumPages] =
    useState(null);

  return (

    <div
      style={overlay}
    >

      <div
        style={modal}
      >

        <button
          onClick={onClose}
          style={closeBtn}
        >
          ✖
        </button>

        <Document
          file={fileUrl}

          onLoadSuccess={({
            numPages
          }) =>
            setNumPages(numPages)
          }
        >

          {
            Array.from(
              new Array(numPages),
              (el, index) => (

                <Page
                  key={index}
                  pageNumber={index + 1}
                  width={700}
                />

              )
            )
          }

        </Document>

      </div>

    </div>

  );

}

export default PdfViewerModal;

const overlay = {

  position: "fixed",

  top: 0,
  left: 0,

  width: "100%",
  height: "100%",

  background:
    "rgba(0,0,0,0.7)",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  zIndex: 9999

};

const modal = {

  background: "white",

  width: "80%",

  height: "90%",

  overflow: "auto",

  padding: "20px",

  borderRadius: "12px"

};

const closeBtn = {

  position: "sticky",

  top: 0,

  float: "right",

  background: "#ef4444",

  color: "white",

  border: "none",

  padding: "10px",

  borderRadius: "8px",

  cursor: "pointer"

};