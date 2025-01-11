import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function formatPrivateKey(key: string): string {
  return key.replace(/\\n/g, '\n').trim();
}

const getAuth = () => {
  try {
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    if (!privateKey) throw new Error('Google Sheets private key is missing');
    
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    if (!clientEmail) throw new Error('Google Sheets client email is missing');
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    if (!spreadsheetId) throw new Error('Google Sheets spreadsheet ID is missing');

    console.log('Auth Params:', { clientEmail, spreadsheetId, privateKeyLength: privateKey.length });

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

    console.log('Appending to sheet:', { spreadsheetId, values });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'expenses!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    
    console.log('Append response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error appending to expenses sheet:', error);
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

