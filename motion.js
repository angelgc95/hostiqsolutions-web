// Shared motion: scroll reveal, app tabs and count-up numbers.
document.documentElement.classList.add('js');
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal, .fix, [data-count]');
  if (!reduce) document.querySelectorAll('[data-count]').forEach(function(el){ el.textContent = '0' + (el.getAttribute('data-suffix') || ''); });
  function show(el){
    el.classList.add('on');
    var end = +el.getAttribute('data-count');
    if (!end || reduce) return;
    var t0 = null;
    function step(t){ t0 = t0 || t; var k = Math.min((t - t0) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + (el.getAttribute('data-suffix') || '');
      if (k < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  if (!('IntersectionObserver' in window)) { els.forEach(show); }
  else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function(el){ io.observe(el); });
  }
  document.querySelectorAll('[role=tablist]').forEach(function(list){
    var tabs = list.querySelectorAll('[role=tab]');
    function pick(tab){
      tabs.forEach(function(t){
        var on = t === tab, panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
        panel.hidden = !on; if (on) { panel.classList.remove('enter'); void panel.offsetWidth; panel.classList.add('enter'); }
      });
    }
    tabs.forEach(function(t, i){
      t.addEventListener('click', function(){ pick(t); });
      t.addEventListener('keydown', function(e){
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); pick(n); }
      });
    });
  });
})();
