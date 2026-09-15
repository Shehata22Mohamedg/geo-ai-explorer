/**
 * Google Apps Script endpoint for the workshop survey summary.
 * Deploy as a Web app with access set to anyone who has the link.
 */
const SHEET_ID = "1-o2RLcTa0ajUJGTrSnITo84sCfbcnzT9p_LAWUuk4UM";
const SHEET_GID = 1274102428;

function doGet() {
  const sheet = SpreadsheetApp.openById(SHEET_ID)
    .getSheets()
    .find((candidate) => candidate.getSheetId() === SHEET_GID);

  if (!sheet) {
    return json({ error: "Response sheet not found." });
  }

  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) {
    return json({ responseCount: 0, questions: [] });
  }

  const headers = values[0];
  const questions = headers.slice(1).map((question, questionIndex) => {
    const counts = {};
    values.slice(1).forEach((row) => {
      const answer = row[questionIndex + 1];
      if (answer) counts[answer] = (counts[answer] || 0) + 1;
    });
    return { question, counts };
  });

  return json({ responseCount: values.length - 1, questions });
}

function json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
