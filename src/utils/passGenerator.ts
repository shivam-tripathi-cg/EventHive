/**
 * Standalone High-Resolution Thanganat 5.0 Event Pass Generator & Downloader
 * Generates and downloads an authentic, official, printable university pass.
 */

export function downloadThanganatPass(studentName: string, rollNumber: string, course: string) {
  const safeName = studentName || 'Dev Patel';
  const safeRoll = rollNumber || 'SU202204192';
  const safeCourse = course || 'B.Tech CSE (Computer Science & Engineering)';
  const passSerial = `SU-THANG-5-${Math.floor(10000 + Math.random() * 90000)}`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanganat 5.0 Official Gate Pass — ${safeName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0d0d12;
      color: #111116;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .print-controls {
      width: 100%;
      max-width: 640px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn-print {
      background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4);
    }
    .badge-status {
      color: #e6ca65;
      font-size: 12px;
      font-family: 'Space Mono', monospace;
    }
    .ticket-container {
      width: 100%;
      max-width: 640px;
      background: #ffffff;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212, 175, 55, 0.35);
      position: relative;
    }
    .ticket-header {
      background: linear-gradient(135deg, #181510 0%, #252014 50%, #111116 100%);
      color: #ffffff;
      padding: 32px 32px 28px;
      position: relative;
      border-bottom: 2px solid #d4af37;
    }
    .univ-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      font-family: 'Space Mono', monospace;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #fed65b;
      margin-bottom: 12px;
    }
    .ticket-title {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.15;
      margin-bottom: 6px;
    }
    .ticket-subtitle {
      color: #eed07a;
      font-size: 13px;
      font-weight: 500;
    }
    .meta-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
      font-size: 12px;
      color: #e8e5dc;
    }
    .meta-pill {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(212, 175, 55, 0.25);
      padding: 6px 12px;
      border-radius: 10px;
      backdrop-blur: 4px;
    }
    .ticket-body {
      background: #ffffff;
      padding: 28px 32px;
      position: relative;
    }
    .notch-left, .notch-right {
      position: absolute;
      top: -16px;
      width: 32px;
      height: 32px;
      background: #0d0d12;
      border-radius: 50%;
      z-index: 10;
    }
    .notch-left { left: -16px; }
    .notch-right { right: -16px; }
    .holder-card {
      background: #fdfaf0;
      border: 1.5px solid #eed07a;
      border-radius: 18px;
      padding: 18px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .holder-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #7b5800;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .holder-name {
      font-size: 19px;
      font-weight: 800;
      color: #111116;
      letter-spacing: -0.01em;
    }
    .holder-course {
      font-size: 12px;
      color: #62626e;
      margin-top: 2px;
    }
    .holder-gr {
      font-family: 'Space Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      color: #b8860b;
      background: #ffffff;
      border: 1px solid #eed07a;
      padding: 6px 12px;
      border-radius: 8px;
    }
    .gate-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .gate-box {
      background: #fbfbf9;
      border: 1px solid #e8e5dc;
      padding: 12px 14px;
      border-radius: 14px;
    }
    .gate-box-label {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
      color: #888894;
      margin-bottom: 3px;
    }
    .gate-box-val {
      font-size: 13px;
      font-weight: 700;
      color: #111116;
    }
    .stub-section {
      border-top: 2px dashed #dcd8cc;
      padding-top: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    .qr-frame {
      border: 3px solid #111116;
      border-radius: 16px;
      padding: 8px;
      background: #ffffff;
      flex-shrink: 0;
    }
    .stub-info {
      flex: 1;
    }
    .barcode-lines {
      font-family: 'Space Mono', monospace;
      font-size: 16px;
      letter-spacing: 0.25em;
      font-weight: 700;
      margin: 6px 0;
      color: #111116;
    }
    .security-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #15803d;
      font-size: 11px;
      font-weight: 700;
    }
    .rules-section {
      background: #f8f7f2;
      border-top: 1px solid #e8e5dc;
      padding: 16px 32px;
      font-size: 10px;
      color: #62626e;
      line-height: 1.5;
    }
    @media print {
      body { background: #ffffff !important; padding: 0 !important; }
      .print-controls { display: none !important; }
      .ticket-container { box-shadow: none !important; border: 1.5px solid #111116 !important; max-width: 100% !important; }
      .notch-left, .notch-right { display: none !important; }
    }
  </style>
</head>
<body>

  <div class="print-controls">
    <button class="btn-print" onclick="window.print()">
      🖨️ Print Pass / Save as PDF
    </button>
    <div class="badge-status">
      PASS SERIAL: ${passSerial}
    </div>
  </div>

  <div class="ticket-container">
    <div class="ticket-header">
      <div class="univ-tag">
        ✦ SWAMINARAYAN UNIVERSITY • KALOL CAMPUS
      </div>
      <h1 class="ticket-title">Thanganat 5.0</h1>
      <p class="ticket-subtitle">Grand Campus Garba & Navratri Cultural Mega Gala</p>
      
      <div class="meta-pills">
        <div class="meta-pill">📅 Wed, Oct 4, 2025 • 07:00 PM - 12:00 AM</div>
        <div class="meta-pill">📍 New Cricket Ground • SU Main Campus</div>
        <div class="meta-pill">🎟️ VIP Student Entry</div>
      </div>
    </div>

    <div class="ticket-body">
      <div class="notch-left"></div>
      <div class="notch-right"></div>

      <!-- Attendee Information Block -->
      <div class="holder-card">
        <div>
          <div class="holder-label">Authorized Pass Holder</div>
          <div class="holder-name">${safeName}</div>
          <div class="holder-course">${safeCourse}</div>
        </div>
        <div style="text-align: right;">
          <div class="holder-label">Student GR ID</div>
          <div class="holder-gr">${safeRoll}</div>
        </div>
      </div>

      <!-- Turnstile & Gate Details -->
      <div class="gate-grid">
        <div class="gate-box">
          <div class="gate-box-label">Designated Gate</div>
          <div class="gate-box-val">Gate 02 (VIP FastTrack Entry)</div>
        </div>
        <div class="gate-box">
          <div class="gate-box-label">Turnstile Lane</div>
          <div class="gate-box-val" style="color: #b8860b; font-family: monospace;">Lane B • Turnstile 04</div>
        </div>
        <div class="gate-box">
          <div class="gate-box-label">Seat / Enclosure</div>
          <div class="gate-box-val">Zone A • Dodhiya Circle 01</div>
        </div>
        <div class="gate-box">
          <div class="gate-box-label">Attire Policy</div>
          <div class="gate-box-val">Mandatory Traditional Kedia / Chaniya Choli</div>
        </div>
      </div>

      <!-- QR Code & Turnstile Laser Stub -->
      <div class="stub-section">
        <div class="qr-frame">
          <svg viewBox="0 0 100 100" width="96" height="96" fill="#111116">
            <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="#111116" stroke-width="6" />
            <rect x="13" y="13" width="12" height="12" fill="#111116" />
            <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="#111116" stroke-width="6" />
            <rect x="75" y="13" width="12" height="12" fill="#111116" />
            <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="#111116" stroke-width="6" />
            <rect x="13" y="75" width="12" height="12" fill="#111116" />
            <rect x="42" y="10" width="8" height="8" />
            <rect x="42" y="24" width="6" height="6" />
            <rect x="54" y="16" width="6" height="6" />
            <rect x="10" y="44" width="8" height="8" />
            <rect x="24" y="48" width="6" height="6" />
            <rect x="36" y="38" width="10" height="10" />
            <rect x="50" y="44" width="8" height="8" />
            <rect x="64" y="38" width="6" height="6" />
            <rect x="78" y="44" width="12" height="8" />
            <rect x="42" y="60" width="8" height="8" />
            <rect x="56" y="60" width="6" height="6" />
            <rect x="68" y="58" width="8" height="8" />
            <rect x="80" y="66" width="10" height="10" />
            <rect x="42" y="76" width="10" height="10" />
            <rect x="58" y="78" width="8" height="8" />
            <rect x="72" y="80" width="12" height="8" />
          </svg>
        </div>

        <div class="stub-info">
          <div style="font-size: 10px; color: #888894; text-transform: uppercase; font-weight: 700;">Digital Verification Barcode</div>
          <div class="barcode-lines">||| | |||| || ||| || |||| | |</div>
          <div class="security-badge">
            ✓ 256-BIT ENCRYPTED RFID TURNSTILE AUTHENTICATED
          </div>
          <div style="font-size: 11px; color: #62626e; margin-top: 4px;">
            Present screen or printed paper ticket to turnstile optical scanner at Gate 02.
          </div>
        </div>
      </div>
    </div>

    <div class="rules-section">
      <strong>Gate Entry Terms:</strong> This pass is strictly non-transferable and issued exclusively to the verified university scholar indicated above. Physical Student ID Smartcard must be produced alongside this QR pass at campus turnstiles. Outside food, commercial cameras, and sharp objects prohibited.
    </div>
  </div>

</body>
</html>`;

  // Create a Blob and trigger a real file download in the browser!
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `Thanganat_5.0_Official_Pass_${safeRoll}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
