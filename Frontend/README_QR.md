Placing the Razorpay QR image

If you have a QR image (e.g., `razorpay-qr.png`) you can place it so the frontend serves it directly from the public folder.

1. Copy the image into:

   Frontend/public/images/razorpay-qr.png

2. Restart the dev server (if running):

```powershell
cd 'd:\CICD Project\Frontend'
npm start
```

Quick helper (PowerShell)

From the repository root you can run the included script to copy a source image into the correct location. Example:

```powershell
# From repository root (d:\CICD Project)
.
\scripts\place-razorpay-qr.ps1 -SourcePath 'C:\Users\you\Downloads\razorpay-qr.png'
```

The script will create the `Frontend/public/images/` directory if missing and copy the file as `razorpay-qr.png`.

If you prefer the image bundled into JS (so it's imported), tell me and I will commit the image into `src/assets` and change the component to import it directly.
