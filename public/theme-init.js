// Inline script yerine ayrı dosya: Content-Security-Policy'de 'unsafe-inline'
// açmak zorunda kalmamak için. <head>'de senkron yüklenir.

// Tema, ilk boyamadan önce uygulanır — açılışta beyaz/siyah sıçraması olmasın
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.setAttribute('data-theme', t);
      return;
    }
  } catch (e) { }
  document.documentElement.setAttribute('data-theme', 'dark');
})();

// Google Fonts'u non-blocking yüklüyoruz: şirket ağı bloklarsa fallback fontlarla render devam eder
(function () {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(link);
})();
