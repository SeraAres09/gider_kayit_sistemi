export async function readFromUsersSheet() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'users!A:D',
    });
    const values = response.data.values || [];
    if (values.length <= 1) {  // Sadece başlık satırı varsa veya hiç satır yoksa
      return [];
    }
    const [headers, ...rows] = values;
    return rows.map(row => ({
      id: row[0],
      name: row[1],
      email: row[2],
    }));
  } catch (error) {
    console.error('Error reading from users sheet:', error);
    throw error;
  }
}

