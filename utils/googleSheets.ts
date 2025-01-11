import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function formatPrivateKey(key: string): string {
  // Remove any extra whitespace and ensure proper line breaks
  const formattedKey = key
    .replace(/\\n/g, '\n')
    .replace(/\s+/g, '\n')
    .replace(/^-----(BEGIN|END) PRIVATE KEY-----\s*/, '')
    .replace(/\s*-----(BEGIN|END) PRIVATE KEY-----$/, '');

  return `-----BEGIN PRIVATE KEY-----\n${formattedKey}\n-----END PRIVATE KEY-----`;
}

const getAuth = () => {
  try {
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    if (!privateKey) throw new Error('Google Sheets private key is missing');
    
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    if (!clientEmail) throw new Error('Google Sheets client email is missing');
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error('Google Sheets spreadsheet ID is missing');

    // Format the private key properly
    const formattedKey = formatPrivateKey(privateKey);

    return new JWT({
      email: clientEmail,
      key: formattedKey,
      scopes: SCOPES,
    });
  } catch (error) {
    console.error('Error initializing Google Sheets auth:', error);
    throw error;
  }
};

const getSheets = () => {
  const auth = getAuth();
  return google.sheets({ version: 'v4', auth });
};

export async function appendToExpensesSheet(values: any[][]) {
  try {
    const sheets = getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('Spreadsheet ID is not configured');
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'expenses!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error appending to expenses sheet:', error);
    if (error instanceof Error && error.message.includes('DECODER routines')) {
      throw new Error('Google Sheets authentication failed. Please check your credentials.');
    }
    throw error;
  }
}

export async function readFromExpensesSheet() {
  try {
    const sheets = getSheets();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('Spreadsheet ID is not configured');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'expenses!A:F',
    });
    
    return response.data.values || [];
  } catch (error) {
    console.error('Error reading from expenses sheet:', error);
    if (error instanceof Error && error.message.includes('DECODER routines')) {
      throw new Error('Google Sheets authentication failed. Please check your credentials.');
    }
    throw error;
  }
}

