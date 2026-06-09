import { Editor } from "@tinymce/tinymce-react";
import "./RTX.css";
function RTE({ value, onChange }) {
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY} // Replace with your TinyMCE API key if you have one
      value={value}
      init={{
        content_css: "./RTX.cssS",
        height: 400,
        valid_elements:
          "p,h1,h2,h3,h4,h5,h6,strong/b,em/i,ul,ol,li,a[href|target],img[src|alt|width|height],blockquote",

        invalid_elements: "script,style,iframe,div,section",

        extended_valid_elements: "img[src|alt|width|height]",
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
        uploadcare_public_key: import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY,
      }}
      onEditorChange={(content) => onChange(content)}
    />
  );
}

export default RTE;
