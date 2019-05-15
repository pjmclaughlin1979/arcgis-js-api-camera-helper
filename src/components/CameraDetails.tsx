import React, { useState, useEffect, useRef } from "react";
import raw from "raw.macro";
import beautify from 'js-beautify';
import Button from 'calcite-react/Button';

interface CameraProps {
  camera: object;
}

// have to do this since space_in_empty_paren is not in 
// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/js-beautify
//
// I've created a PR but we're waiting on that: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/35491
// but also https://github.com/Microsoft/TypeScript/issues/7148#issuecomment-270502523
declare global {
  interface JsBeautifyOptions {
    space_in_empty_paren?: boolean;
  }
}

export default function CameraDetails({ camera }: CameraProps) {
  

  const copyTextArea = useRef<HTMLTextAreaElement>(null);
  const [calculatedFullRequest, setCalculatedFullRequest] = useState('');

  useEffect(() => {
    console.log('useEffect');

    function createCodepen(cameraJsCode: object) {
      console.log('createCodepen', cameraJsCode);
      const styleTemplate = raw("../templates/style.css");
      const htmlHeadTemplate = raw("../templates/head.html");
      const htmlTemplate = raw("../templates/html.html");
      const jsTemplate = raw("../templates/js.txt");
      var jt = beautify.js_beautify(jsTemplate.replace('[CAMERAHERE]', JSON.stringify(cameraJsCode)), { indent_size: 2, space_in_empty_paren: true });
  
      var data = {
        editors: "001",
        html: htmlTemplate,
        css: styleTemplate,
        js: jt,
        head: htmlHeadTemplate,
        js_external: 'https://js.arcgis.com/4.11/dojo/dojo.js',
        css_external: 'https://js.arcgis.com/4.11/esri/css/main.css;https://s3-us-west-1.amazonaws.com/patterns.esri.com/files/calcite-web/1.0.2/css/calcite-web.min.css',
      };
  
      var JSONstring = 
        JSON.stringify(data);
          // Quotes will screw up the JSON
          // .replace(/"/g, "&​quot;") // careful copy and pasting, I had to use a zero-width space here to get markdown to post this.
          // .replace(/'/g, "&apos;");
  
      return JSONstring;
    }
    setCalculatedFullRequest(createCodepen(camera));
  }, [camera]);

  

  function copyJsonButtonClickHandler() {
    if (copyTextArea && copyTextArea.current) {
      copyTextArea.current.focus();
      copyTextArea.current.select();
      document.execCommand("copy");
    }
  }
  return (
    <div className="CameraDetails">
      <textarea
        rows={15}
        cols={50}
        readOnly={true}
        value={JSON.stringify(camera, null, 2)}
        ref={copyTextArea}
      />
      <br />
      <Button
        className="btn btn-clear"
        onClick={() => {
          copyJsonButtonClickHandler();
        }}
      >
        Copy JSON
      </Button>

      <form
        action="https://codepen.io/pen/define"
        method="POST"
        target="_blank"
        className="right"
      >
        <input type="hidden" id="formDataCodepen" name="data" value={calculatedFullRequest} />
        <Button
          type="submit"
          className="right"
        >New app at this location</Button>
      </form>
    </div>
  );
}
