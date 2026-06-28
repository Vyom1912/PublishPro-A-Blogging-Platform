import { Editor } from "@tinymce/tinymce-react";
import "./RTX.css";

function RTE({ value, onChange }) {
  return (
    <Editor
      // Self-hosted TinyMCE via CDN — no API key or domain registration needed.
      // tinymceScriptSrc tells the wrapper to load TinyMCE from this URL
      // instead of the cloud, so the "domain not registered" error goes away.
      tinymceScriptSrc='https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.9.1/tinymce.min.js'
      // licenseKey="gpl"
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      value={value}
      init={{
        content_css: "./RTX.css",

        height: 600,
        menubar: true,
        branding: false,
        resize: true,
        statusbar: true,
        valid_elements:
          "p,h1,h2,h3,h4,h5,h6,strong/b,em/i,ul,ol,li,a[href|target],img[src|alt|width|height],blockquote",
        invalid_elements: "script,style,iframe,div,section",
        extended_valid_elements: "img[src|alt|width|height]",

        plugins: [
          "advlist",
          "anchor",
          "autolink",
          "lists",
          "link",
          "image",
          "media",
          "table",
          "codesample",
          "code",
          "emoticons",
          "charmap",
          "fullscreen",
          "preview",
          "insertdatetime",
          "searchreplace",
          "visualblocks",
          "visualchars",
          "wordcount",
          "quickbars",
          "autosave",
        ],

        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist checklist | outdent indent | link image media table | blockquote codesample | removeformat | fullscreen preview code | help",

        placeholder: "Start writing your amazing article...",
        automatic_uploads: true,
        image_title: true,
        image_caption: true,
        quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote",

        // quickbars_insert_toolbar: "image media table",
        content_style: `
                  body{
                      font-family: Inter, sans-serif;
                      font-size:16px;
                      line-height:1.8;
                      max-width:850px;
                      margin:auto;
                      padding:25px;
                  }

                  img{
                      max-width:100%;
                      border-radius:10px;
                  }

                  table{
                      border-collapse:collapse;
                  }

                  blockquote{
                      border-left:4px solid #2563eb;
                      padding-left:18px;
                      color:#555;
                  }
                `,
        autosave_interval: "30s",
        autosave_restore_when_empty: true,
      }}
      onEditorChange={(content) => onChange(content)}
    />
  );
}

export default RTE;
