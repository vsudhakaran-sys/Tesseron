const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `file-${suffix}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (_req, file, cb) => {
    const allowed = ['.xlsx', '.xls', '.csv', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`Unsupported file type: ${ext}. Allowed: ${allowed.join(', ')}`));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

module.exports = upload;
