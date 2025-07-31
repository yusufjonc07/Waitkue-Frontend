<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-section">
        <h3>About WaitKue</h3>
        <p>Making queue management simple and efficient for businesses and customers.</p>
      </div>
      
      <div class="footer-section">
        <h3>Quick Links</h3>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </div>
      
      <div class="footer-section">
        <h3>Connect With Us</h3>
        <div class="social-links">
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-linkedin"></i></a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>© 2025 WaitKue. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
.app-footer {
  background: #154ec1;
  color: #fff;
  padding: 3rem 0 1rem 0;
  width: 100%;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-section h3 {
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.footer-section nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-section a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: #fff;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  font-size: 1.5rem;
}

.footer-bottom {
  margin-top: 2rem;
  padding-top: 1rem;
  text-align: center;
  border-top: 1px solid #333;
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-section nav {
    align-items: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>