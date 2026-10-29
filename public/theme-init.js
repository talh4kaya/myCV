// Inline script yerine ayrı dosya: Content-Security-Policy'de 'unsafe-inline'
// açmak zorunda kalmamak için. <head>'de senkron yüklenir.

// Tema, ilk boyamadan önce uygulanır — açılışta beyaz/siyah sıçraması olmasın.
// Site her yeni ziyarette koyu açılır; kullanıcının seçimi sadece o sekme
// açıkken (sessionStorage) hatırlanır, sayfa yenilense de korunur.
(function () {
  var theme = 'dark';
  try {
    localStorage.removeItem('theme'); // eski sürümden kalan kalıcı seçim
    var t = sessionStorage.getItem('theme');
    if (t === 'light' || t === 'dark') theme = t;
  } catch (e) { }
  document.documentElement.setAttribute('data-theme', theme);
})();

// Google Fonts'u non-blocking yüklüyoruz: şirket ağı bloklarsa fallback fontlarla render devam eder
(function () {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(link);
})();
