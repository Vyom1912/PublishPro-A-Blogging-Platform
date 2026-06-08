import { Editor } from "@tinymce/tinymce-react";
import api from "../../api/axios";
import "./RTX.css";

function RTE({ value, onChange }) {
  // Called by TinyMCE when user inserts an image via the toolbar
  const handleImageUpload = (blobInfo, progress) =>
    new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());

      api
        .post("/blogs/upload-image", formData)
        .then((res) => {
          // TinyMCE expects the resolved value to be the URL string
          resolve(res.data.location);
        })
        .catch((err) => {
          reject({ message: "Image upload failed: " + err.message, remove: true });
        });
    });

  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      value={value}
      init={{
        height: 450,
        menubar: true,
        plugins: [
          "advlist", "autolink", "lists", "link", "image", "charmap",
          "preview", "anchor", "searchreplace", "visualblocks", "code",
          "fullscreen", "insertdatetime", "media", "table", "help", "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | image media | " +
          "removeformat | help",
        // Wire image uploads to our Cloudinary endpoint
        images_upload_handler: handleImageUpload,
        // Allow drag-and-drop image pastes
        automatic_uploads: true,
        file_picker_types: "image",
        // Keep content secure but allow images
        valid_elements:
          "p,h1,h2,h3,h4,h5,h6,strong/b,em/i,ul,ol,li,a[href|target],img[src|alt|width|height|style],blockquote,br",
        extended_valid_elements: "img[src|alt|width|height|style]",
        content_style: `
          body {
            font-family: system-ui, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            padding: 12px;
          }
          img { max-width: 100%; height: auto; border-radius: 6px; }
        `,
      }}
      onEditorChange={(content) => onChange(content)}
    />
  );
}

export default RTE;
