# Survey summary endpoint

This Apps Script reads the Google Form response sheet and returns aggregate counts for each question. It does not return names or individual responses.

## Deploy

1. Open the response spreadsheet.
2. Select **Extensions > Apps Script**.
3. Replace the editor contents with `Code.gs` from this folder.
4. Save the project.
5. Select **Deploy > New deployment**.
6. Choose **Web app**.
7. Set **Execute as** to **Me**.
8. Set **Who has access** to **Anyone**.
9. Deploy and authorize access when prompted.
10. Copy the `/exec` URL and provide it for the workshop app.

The endpoint should return JSON shaped like this:

```json
{
  "responseCount": 12,
  "questions": [
    {
      "question": "Have you written any code?",
      "counts": {
        "Never": 5,
        "A little": 4,
        "Yes, regularly": 3
      }
    }
  ]
}
```

The endpoint aggregates answers only. It does not expose respondent names or individual rows.
