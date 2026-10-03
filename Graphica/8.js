document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.visit-btn, .site-link');
  const overlay = document.getElementById('loading-overlay');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); 
      
      const targetUrl = link.getAttribute('href');
      
      overlay.classList.add('active');
      
      setTimeout(() => {
        window.open(targetUrl, '_blank');
        
        setTimeout(() => {
          overlay.classList.remove('active');
        }, 500);
      }, 2000); 
    });
  });
});