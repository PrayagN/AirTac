// Force Node.js runtime (not Edge) for googleapis support
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req) {
  try {
    const { email, feedback } = await req.json();

    if (!email || !feedback) {
      return NextResponse.json(
        { success: false, message: "Email and feedback are required." },
        { status: 400 }
      );
    }

    // 1. Verify environment variables
    const authEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    console.log(authEmail, rawKey, sheetId);

    if (!authEmail || !rawKey || !sheetId) {
      console.error("[Feedback API] Missing environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration missing. Please check .env.local" },
        { status: 500 }
      );
    }

    // 2. Sanitize and format the Private Key
    // Service accounts keys must be in PEM format with literal newlines.
    // We handle both escaped (\n) and quoted formats.
    const authKey = rawKey
      .replace(/^"|"$/g, "") // Remove wrapping quotes
      .replace(/\\n/g, "\n") // Convert escaped \n to actual newlines
      .trim();

    // 3. Authenticate using fromJSON (more robust)
    const auth = google.auth.fromJSON({
      type: "service_account",
      client_email: authEmail,
      private_key: authKey,
    });

    // Set explicit scopes
    auth.scopes = ["https://www.googleapis.com/auth/spreadsheets"];

    const sheets = google.sheets({ version: "v4", auth });

    // 4. Append row
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "feedback",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[new Date().toISOString(), email.trim(), feedback.trim()]],
      },
    });

    console.log("[Feedback API] Successfully appended to Sheet");
    return NextResponse.json({ success: true, message: "Feedback saved to Google Sheets!" });
  } catch (err) {
    console.error("[Feedback API Error]", err.message);

    if (err.response?.data) {
      const details = JSON.stringify(err.response.data);
      console.error("[Sheets API Details]", details);

      // Specific error guidance
      if (details.includes("PERMISSION_DENIED")) {
        return NextResponse.json(
          { success: false, message: "Permission Denied. Did you share the sheet with the Service Account email as an Editor?" },
          { status: 500 }
        );
      }
    }

    let userMsg = err.message;
    if (userMsg.includes("missing required authentication credential")) {
      userMsg = "Authentication failed. Please check if GOOGLE_PRIVATE_KEY is correctly formatted in .env.local";
    }

    return NextResponse.json(
      { success: false, message: `Error: ${userMsg}` },
      { status: 500 }
    );
  }
}





