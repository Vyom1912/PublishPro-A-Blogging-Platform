import { Editor } from "@tinymce/tinymce-react";

function RTE({ value, onChange }) {
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY} // Replace with your TinyMCE API key if you have one
      value={value}
      init={{
        height: 400,
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
