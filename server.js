const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// إعداد مجلد الرفع
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.use(cors());
app.use(express.static('uploads'));

// إعداد التخزين
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'لم يتم رفع أي ملف.' });
  }

  const fileUrl = `http://localhost:${port}/${req.file.filename}`;
  res.send({ message: 'تم رفع الملف بنجاح!', url: fileUrl });
});

app.listen(port, () => {
  console.log(`🔌 السيرفر شغال على http://localhost:${port}`);
});
