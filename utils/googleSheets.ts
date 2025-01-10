import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { hash } from 'bcrypt';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const auth = new JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL!,
  key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

export async function appendToExpensesSheet(values: any[][]) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'expenses!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error appending to expenses sheet:', error);
    throw error;
  }
}

export async function readFromExpensesSheet() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'expenses!A:F',
    });
    return response.data.values || [];
  } catch (error) {
    console.error('Error reading from expenses sheet:', error);
    throw error;
  }
}

export async function readFromUsersSheet() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'users!A:D',
    });
    const values = response.data.values || [];
    if (values.length <= 1) {
      return [];
    }
    const [headers, ...rows] = values;
    return rows.map(row => ({
      id: row[0],
      name: row[1],
      email: row[2],
      password: row[3],
      isAdmin: row[4] === 'true'
    }));
  } catch (error) {
    console.error('Error reading from users sheet:', error);
    throw error;
  }
}

export async function appendToUsersSheet(user: { name: string, email: string, password: string, isAdmin: boolean }) {
  try {
    const hashedPassword = await hash(user.password, 10);
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'users!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[Date.now().toString(), user.name, user.email, hashedPassword, user.isAdmin.toString()]],
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error appending to users sheet:', error);
    throw error;
  }
}

// Add the admin user if it doesn't exist
export async function ensureAdminUser() {
  const users = await readFromUsersSheet();
  const adminUser = users.find(user => user.email === 'seraares202009@gmail.com');
  if (!adminUser) {
    await appendToUsersSheet({
      name: 'Admin',
      email: 'seraares202009@gmail.com',
      password: '19032003Bjk*',
      isAdmin: true
    });
  }
}

