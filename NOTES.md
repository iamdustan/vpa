
EP Curriculum: https://drive.google.com/drive/folders/1q_-e6I7ZjZaB8UypVwSD2X46vodD8ee5

## Application Form Backend (Google Apps Script)

Deploy the following code as a Web App in Google Apps Script to handle form submissions. Set "Who has access" to "Anyone".

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.firstName,
    data.lastName,
    data.email,
    data.phone,
    data.city,
    data.state,
    data.registration,
    data.track,
    data.experience,
    data.relocate,
    data.additionalInfo
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Update the `ApplyForm` component's `endpoint` prop with the deployed URL.
