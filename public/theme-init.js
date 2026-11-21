// Inline script yerine ayrı dosya: Content-Security-Policy'de 'unsafe-inline'
// açmak zorunda kalmamak için. <head>'de senkron yüklenir.

// Tema, ilk boyamadan önce uygulanır (açılışta beyaz/siyah sıçraması olmasın).
// Varsayılan: ziyaretçinin cihazında/tarayıcısında hangi tema seçiliyse o
// (açık ya da koyu). Ziyaretçi sitedeki düğmeyle değiştirirse bu seçim
// yalnızca o sekme açıkken (sessionStorage) hatırlanır.
(function () {
  var theme = 'dark';
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) theme = 'light';
  } catch (e) { }
  try {
    localStorage.removeItem('theme'); // eski sürümden kalan kalıcı seçim
    var t = sessionStorage.getItem('theme');
    if (t === 'light' || t === 'dark') theme = t;
  } catch (e) { }
  document.documentElement.setAttribute('data-theme', theme);
})();
