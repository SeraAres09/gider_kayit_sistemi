import { NextResponse } from 'next/server'
import { readFromExpensesSheet } from '../../../utils/googleSheets'

export async function GET() {
  try {
    const data = await readFromExpensesSheet()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error testing Google Sheets connection:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to connect to Google Sheets',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

