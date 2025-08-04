const form = document.getElementById('uploadForm');
const responseDiv = document.getElementById('response');
const progressBar = document.getElementById('progressBar');
const percentText = document.getElementById('percentText');
const progressContainer = document.getElementById('progress-container');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://localhost:3000/upload', true);

  progressContainer.style.display = 'block';
  progressBar.value = 0;
  percentText.textContent = '0%';
  responseDiv.innerHTML = '';

  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      const percent = Math.round((event.loaded / event.total) * 100);
      progressBar.value = percent;
      percentText.textContent = `${percent}%`;
    }
  });

  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      responseDiv.innerHTML = `
        <p style="color: green; font-weight: bold;">✅ ${data.message}</p>
        <div style="margin-top: 10px; display: flex; align-items: center;">
          <input type="text" id="downloadLink" value="${data.url}" readonly
            style="flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px;">
          <button onclick="copyLink()" 
            style="margin-left: 10px; padding: 10px 15px; background-color: #03a9f4; color: white; border: none; border-radius: 6px; cursor: pointer;">
            📋 نسخ
          </button>
        </div>
      `;
      form.reset();
    } else {
      responseDiv.innerHTML = `<p style="color:red;">❌ حصل خطأ أثناء رفع الملف.</p>`;
    }

    progressContainer.style.display = 'none';
  };

  xhr.onerror = function () {
    responseDiv.innerHTML = `<p style="color:red;">❌ فشل الاتصال بالسيرفر.</p>`;
    progressContainer.style.display = 'none';
  };

  xhr.send(formData);
});

function copyLink() {
  const linkInput = document.getElementById("downloadLink");
  linkInput.select();
  linkInput.setSelectionRange(0, 99999); 
  document.execCommand("copy");
  alert("✅ تم نسخ الرابط!");
}
