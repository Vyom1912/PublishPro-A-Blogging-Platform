import { Editor } from "@tinymce/tinymce-react";
import "./RTX.css";

const isSmallScreen = () => window.matchMedia("(max-width: 767px)").matches;

function RTE({ value, onChange, editorRef }) {
  const small = isSmallScreen();

  return (
    <Editor
      // Self-hosted TinyMCE via CDN — no API key or domain registration needed.
      // tinymceScriptSrc tells the wrapper to load TinyMCE from this URL
      // instead of the cloud, so the "domain not registered" error goes away.
      tinymceScriptSrc='https://cdnjs.cloudflare.com/ajax/libs/tinymce/7.9.1/tinymce.min.js'
      licenseKey='gpl'
      value={value}
      onInit={(_evt, editor) => {
        if (editorRef) editorRef.current = editor;
      }}
      init={{
        height: small ? 460 : 600,
        menubar: !small,
        branding: false,
        promotion: false,
        resize: true,
        statusbar: true,
        // Long toolbars scroll sideways on phones instead of wrapping into
        // four rows that push the writing area off screen.
        toolbar_mode: small ? "scrolling" : "sliding",
        toolbar_sticky: true,
        toolbar_sticky_offset: 62,
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

        toolbar: small
          ? "undo redo | blocks | bold italic underline | bullist numlist | link image | blockquote | removeformat"
          : "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | link image media table | blockquote codesample | removeformat | fullscreen preview code",

        placeholder: "Start writing your amazing article...",
        automatic_uploads: true,
        image_title: true,
        image_caption: true,
        quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote",
        quickbars_insert_toolbar: false,

        content_style: `
                  body{
                      font-family: system-ui, "Segoe UI", Roboto, sans-serif;
                      font-size:16px;
                      line-height:1.8;
                      max-width:850px;
                      margin:auto;
                      padding:${small ? "12px" : "25px"};
                  }

                  img{
                      max-width:100%;
                      height:auto;
                      border-radius:10px;
                  }

                  table{
                      border-collapse:collapse;
                  }

                  blockquote{
                      border-left:4px solid #547792;
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
