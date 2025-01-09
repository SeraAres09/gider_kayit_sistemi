import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

export async function appendToSheet(values: any[][]) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'Giderler!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
}

export async function readFromSheet() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'Giderler!A:F',
    });
    return response.data.values || [];
  } catch (error) {
    console.error('Error reading from sheet:', error);
    throw error;
  }
}

