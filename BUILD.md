# NJSOSS — Build Instructions

## Web App

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview production build
```

## Desktop App (Electron)

### Prerequisites
```bash
npm install
```

### Run Electron in dev mode (hot reload)
```bash
npm run electron:dev
```

### Preview production build in Electron
```bash
npm run electron:preview
```

### Build installers

**All platforms (current OS only):**
```bash
npm run electron:build
```

**Windows** — produces `.exe` installer (NSIS) + portable `.exe`:
```bash
npm run electron:build:win
```
Output: `electron-dist/NJSOSS Pirate Activity Network Setup x.x.x.exe`

**macOS** — produces `.dmg` + `.zip`:
```bash
npm run electron:build:mac
```
Output: `electron-dist/NJSOSS Pirate Activity Network-x.x.x.dmg`

**Linux** — produces `.AppImage`, `.deb`, `.rpm`:
```bash
npm run electron:build:linux
```
Output: `electron-dist/NJSOSS Pirate Activity Network-x.x.x.AppImage`

### Icons (required before distributing)
Replace placeholder files in `electron/resources/` with proper icons:
- `icon.ico` — Windows (256×256 multi-size ICO)
- `icon.icns` — macOS (1024×1024)
- `icon.png` — Linux (512×512 PNG)

You can generate these from `icon.svg` using a tool like ImageMagick or an online ICO converter.

## Mobile

The app automatically detects screen width < 768px and switches to:
- Full-screen 3D starmap with touch controls
- Slide-up intel feed drawer
- Bottom tab navigation (Starmap / Intel / Ships)
- Floating action button to report pirates

No separate build needed — same build serves both desktop and mobile web.
