---
title: Create PDF Forms in Node.js with SurveyJS
description: Learn how to generate interactive PDF forms on a Node.js server using SurveyJS. This tutorial covers installation, configuration, data population, and PDF export. View full code on GitHub.
---

# Create PDF Forms in Node.js

PDF Generator for SurveyJS allows you to generate interactive PDF forms on a Node.js server. This tutorial describes how to configure PDF form creation in a Node.js application.

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/surveyjs-pdf-nodejs (linkStyle))

## Install the `survey-pdf` npm package

PDF Generator for SurveyJS is built upon the <a href="https://github.com/parallax/jsPDF#readme" target="_blank">jsPDF</a> library and is distributed as a <a href="https://www.npmjs.com/package/survey-pdf" target="_blank">`survey-pdf`</a> npm package. Run the following command to install the package and its dependencies, including jsPDF:

```bash
npm install survey-pdf
```

If your survey contains [HTML](https://surveyjs.io/form-library/documentation/api-reference/add-custom-html-to-survey) or [Signature Pad](https://surveyjs.io/form-library/documentation/api-reference/signature-pad-model) questions, install the <a href="https://www.npmjs.com/package/jsdom" target="_blank">`jsdom`</a> package to create a simulated web environment in a Node.js application. Create a JSDOM instance and reference the `window` and `document` objects from the JSDOM instance in a global scope:

```js
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const SurveyPDF = require("survey-pdf");

const { window } = new JSDOM(`...`);
global.window = window;
global.document = window.document;
```

## Export the PDF Form

To export a PDF form, you need to create a `SurveyPDF` instance. Its constructor accepts two parameters: a [survey JSON schema](/Documentation/Library?id=design-survey-create-a-simple-survey#define-a-static-survey-model-in-json) and optional [PDF document settings](/pdf-generator/documentation/api-reference/idocoptions).

To save a PDF document with the exported survey, call the [`save(fileName)`](/Documentation/Pdf-Export?id=surveypdf#save) method on the `SurveyPDF` instance. If you omit the `fileName` parameter, the document uses the default name (`"survey_result.pdf"`).

```js
const surveyJson = { /* ... */ };
const pdfDocOptions: IDocOptions = { /* ... */ };

const surveyPdf = new SurveyPDF.SurveyPDF(surveyJson, pdfDocOptions);
surveyPdf.save("My PDF Form.pdf");
```

## Populate the PDF Form with Data

Specify the `data` property of a `SurveyPDF` instance to define question answers. If a survey contains default values, and you wish to preserve them, call the `mergeData(newObj)` method instead.

```js
surveyPdf.data = {
  // ...
  // An object with question answers
  // ...
};
// ----- or -----
surveyPdf.mergeData({
  // ...
  // An object with question answers
  // ...
});
```

For more information on how to programmatically define question answers, refer to the following help topic: [Populate Form Fields](https://surveyjs.io/form-library/documentation/design-survey/pre-populate-form-fields).

## Customize the PDF Form

If the default appearance of the exported form does not meet your requirements, use the following customization APIs to tailor the generated PDF document:

- [PDF Form Settings](/pdf-generator/documentation/customize-pdf-form-settings)     
Configure page orientation, fonts, compression, read-only mode, and other document-level settings.

- [PDF Appearance Customization](/pdf-generator/documentation/pdf-appearance-customization)      
Customize themes, layouts, and styles.

- [Question Rendering](/pdf-generator/documentation/customize-survey-question-rendering-in-pdf-form)      
Customize the rendering behavior of specific question types.

In this tutorial, the exported PDF form uses the print-optimized Monochrome Light theme:

```js
import { MonochromeLight } from "survey-core/themes";

const surveyPdf = new SurveyPDF({ /* ... */ });
surveyPdf.applyTheme(MonochromeLight);
```

[View Full Code on GitHub](https://github.com/surveyjs/code-examples/tree/main/surveyjs-pdf-nodejs (linkStyle))

## Activate a SurveyJS License

SurveyJS PDF Generator is not available for free commercial use. To integrate it into your application, you must purchase a [commercial license](https://surveyjs.io/licensing) for the software developer(s) who will be working with the PDF Generator APIs and implementing the integration. If you use SurveyJS PDF Generator without a license, an alert banner will appear at the top of each page in an exported PDF document:

<img src="images/alert-banner-pdf.png" alt="SurveyJS PDF Generator: Alert banner" width="772" height="494">

After purchasing a license, follow the steps below to activate it and remove the alert banner:

1. [Log in](https://surveyjs.io/login) to the SurveyJS website using your email address and password. If you've forgotten your password, [request a reset](https://surveyjs.io/reset-password) and check your inbox for the reset link.
2. Open the following page: [How to Remove the Alert Banner](https://surveyjs.io/remove-alert-banner). You can also access it by clicking **Set up your license key** in the alert banner itself.
3. Follow the instructions on that page.

Once you've completed the setup correctly, the alert banner will no longer appear.