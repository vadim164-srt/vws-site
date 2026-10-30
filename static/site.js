/* VWS: меню, запись, галерея. Адрес обработчика заявок задаётся в window.VWS_FORM_ENDPOINT (см. README). */
(function(){
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var burger=$('.burger'), nav=$('#nav');
  if(burger){burger.addEventListener('click',function(){var o=burger.getAttribute('aria-expanded')!=='true';burger.setAttribute('aria-expanded',o);nav.classList.toggle('open',o);document.body.style.overflow=o?'hidden':''});}

  var dlg=$('#book');
  $$('[data-book]').forEach(function(b){b.addEventListener('click',function(e){
    if(!dlg||!dlg.showModal) return; e.preventDefault();
    var f=$('form',dlg); resetForm(f);
    var svc=b.getAttribute('data-service'), brand=b.getAttribute('data-brand');
    if(svc) f.service.value=svc; if(brand) f.brand.value=brand;
    dlg.showModal(); setTimeout(function(){f.name.focus()},50);
  })});
  $$('[data-close]').forEach(function(b){b.addEventListener('click',function(){b.closest('dialog').close()})});
  $$('dialog').forEach(function(d){d.addEventListener('click',function(e){if(e.target===d)d.close()})});

  function resetForm(f){if(!f)return;var ok=$('.form__ok',f.parentNode);if(ok)ok.hidden=true;f.hidden=false;}
  $$('input[type=tel]').forEach(function(i){i.addEventListener('input',function(){
    var d=i.value.replace(/\D/g,''); if(d[0]==='8')d='7'+d.slice(1); if(d&&d[0]!=='7')d='7'+d; d=d.slice(0,11);
    var o='+7'; if(d.length>1)o+=' ('+d.slice(1,4); if(d.length>=4)o+=') '+d.slice(4,7); if(d.length>=7)o+='-'+d.slice(7,9); if(d.length>=9)o+='-'+d.slice(9,11);
    i.value=d?o:'';
  })});

  $$('form.form').forEach(function(f){f.addEventListener('submit',function(e){
    e.preventDefault();
    var tel=f.phone; if(tel && tel.value.replace(/\D/g,'').length<11){tel.setCustomValidity('Укажите телефон полностью: +7 и 10 цифр');tel.reportValidity();tel.setCustomValidity('');return;}
    var data={}; new FormData(f).forEach(function(v,k){data[k]=v}); data.page=location.pathname;
    var ok=$('.form__ok',f.parentNode), btn=$('button[type=submit]',f);
    var done=function(sent){f.hidden=true;ok.hidden=false;$('[data-sent]',ok).hidden=!sent;$('[data-demo]',ok).hidden=sent;};
    var url=window.VWS_FORM_ENDPOINT;
    if(!url){done(false);return;}
    btn.disabled=true;
    fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
      .then(function(r){done(r.ok)}).catch(function(){done(false)}).then(function(){btn.disabled=false});
  })});

  var lb=$('#lb');
  $$('.gallery button, button.ph').forEach(function(b){b.addEventListener('click',function(){
    if(!lb||!lb.showModal)return; var img=$('img',b); $('img',lb).src=img.src; $('img',lb).alt=img.alt; $('p',lb).textContent=img.alt||''; lb.showModal();
  })});
})();
