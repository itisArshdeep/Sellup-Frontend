import { QRCodeSVG } from 'qrcode.react';

export default function UPIQRCode({ upiId, amount, note }) {
  const upiLink = `upi://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(note)}`;
  
  return (
    <div className="text-center">
      <div className="inline-block p-4 bg-white rounded-lg border">
        <QRCodeSVG 
          value={upiLink} 
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>
      <div className="mt-4 p-3 bg-gray-100 rounded">
        <p className="font-medium">Scan to Pay</p>
        <p className="text-sm text-gray-600">UPI ID: {upiId}</p>
        <p className="text-sm text-gray-600">Amount: ₹{amount}</p>
      </div>
    </div>
  );
}