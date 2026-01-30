// ===========================
// CUSTOM CURSOR
// ===========================
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

let cursorX = 0;
let cursorY = 0;
let outlineX = 0;
let outlineY = 0;

document.addEventListener("mousemove", (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;

  if (cursorDot) {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
  }
});

function animateOutline() {
  outlineX += (cursorX - outlineX) * 0.15;
  outlineY += (cursorY - outlineY) * 0.15;

  if (cursorOutline) {
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
  }

  requestAnimationFrame(animateOutline);
}

animateOutline();

// Expand cursor on interactive elements
document
  .querySelectorAll("a, button, .project-card, .skill-category")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (cursorDot)
        cursorDot.style.transform = "translate(-50%, -50%) scale(1.5)";
      if (cursorOutline)
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
    });

    el.addEventListener("mouseleave", () => {
      if (cursorDot)
        cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
      if (cursorOutline)
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
    });
  });

// ===========================
// PROGRESS BAR
// ===========================
window.addEventListener("scroll", () => {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    progressBar.style.width = scrolled + "%";
  }
});

// ===========================
// PARTICLES
// ===========================
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) return;

  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 10 + "s";
    particle.style.animationDuration = Math.random() * 10 + 10 + "s";
    particlesContainer.appendChild(particle);
  }
}

createParticles();

// ===========================
// IMAGE CAROUSEL
// ===========================
class ImageCarousel {
  constructor(element) {
    this.element = element;
    this.track = element.querySelector(".carousel-track");
    this.images = Array.from(element.querySelectorAll(".carousel-track img"));
    this.indicatorsContainer = element.querySelector(".carousel-indicators");
    this.currentIndex = 0;
    this.interval = null;
    this.intervalTime = 4000; // 4 segundos
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    if (this.images.length <= 1) return; // No carousel needed for single image

    this.createIndicators();
    this.startAutoPlay();
    this.setupTouchEvents();
    this.setupHoverPause();
  }

  createIndicators() {
    this.images.forEach((_, index) => {
      const indicator = document.createElement("div");
      indicator.className = `carousel-indicator ${index === 0 ? "active" : ""}`;
      indicator.addEventListener("click", () => this.goToSlide(index));
      this.indicatorsContainer.appendChild(indicator);
    });
    this.indicators = Array.from(
      this.indicatorsContainer.querySelectorAll(".carousel-indicator"),
    );
  }

  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentIndex);
    });
  }

  goToSlide(index) {
    this.images[this.currentIndex].classList.remove("active");
    this.currentIndex = index;
    this.images[this.currentIndex].classList.add("active");
    this.updateIndicators();
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.goToSlide(prevIndex);
  }

  startAutoPlay() {
    this.interval = setInterval(() => this.nextSlide(), this.intervalTime);
  }

  stopAutoPlay() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  setupHoverPause() {
    this.element.addEventListener("mouseenter", () => this.stopAutoPlay());
    this.element.addEventListener("mouseleave", () => this.startAutoPlay());
  }

  setupTouchEvents() {
    this.element.addEventListener(
      "touchstart",
      (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
        this.stopAutoPlay();
      },
      { passive: true },
    );

    this.element.addEventListener(
      "touchend",
      (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
        this.startAutoPlay();
      },
      { passive: true },
    );
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }
}

// Initialize all carousels
document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".image-carousel");
  carousels.forEach((carousel) => new ImageCarousel(carousel));
});

// ===========================
// PORTFOLIO CANVAS ANIMATION
// ===========================
class PortfolioAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.particleCount = 50;
    this.mouse = { x: 0, y: 0 };

    this.init();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
    this.setupMouseTracking();
    this.animate();

    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  setupMouseTracking() {
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
  }

  drawParticles() {
    this.particles.forEach((particle) => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 51, 102, ${particle.opacity})`;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = "#ff3366";
      this.ctx.fill();

      // Draw connections
      this.particles.forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.2 * (1 - distance / 100)})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.stroke();
        }
      });
    });
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        particle.x -= dx * 0.02;
        particle.y -= dy * 0.02;
      }

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width)
        particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height)
        particle.speedY *= -1;

      // Keep particles within bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawParticles();
    this.updateParticles();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize portfolio animation
document.addEventListener("DOMContentLoaded", () => {
  const portfolioCanvas = document.getElementById("portfolioCanvas");
  if (portfolioCanvas) {
    new PortfolioAnimation(portfolioCanvas);
  }
});

// ===========================
// MENU TOGGLE
// ===========================
function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  const menuToggle = document.querySelector(".menu-toggle");
  navLinks.classList.toggle("active");
  menuToggle.classList.toggle("active");
}

function closeMenu() {
  const navLinks = document.getElementById("navLinks");
  const menuToggle = document.querySelector(".menu-toggle");
  navLinks.classList.remove("active");
  menuToggle.classList.remove("active");
}

// ===========================
// SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// ===========================
// REVEAL ANIMATIONS
// ===========================
const reveals = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  reveals.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("active");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); // Initial check

// ===========================
// COUNTER ANIMATION
// ===========================
function animateCounters() {
  const counters = document.querySelectorAll(".stat-value[data-target]");

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    // Start animation when element is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(counter);
  });
}

animateCounters();

// ===========================
// SKILL BARS ANIMATION
// ===========================
function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progress = entry.target.getAttribute("data-progress");
          entry.target.style.width = progress + "%";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  skillBars.forEach((bar) => observer.observe(bar));
}

animateSkillBars();

// ===========================
// PARALLAX EFFECT
// ===========================
window.addEventListener("mousemove", (e) => {
  const floatingElement = document.querySelector(".floating-element");
  if (floatingElement) {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
    floatingElement.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }
});

// ===========================
// FORM HANDLING
// ===========================
const contactForm = document.getElementById("contactForm");
const messageTextarea = document.getElementById("message");
const charCount = document.getElementById("charCount");
const submitBtn = document.getElementById("submitBtn");
const formStatus = document.getElementById("formStatus");

// Character counter
if (messageTextarea && charCount) {
  messageTextarea.addEventListener("input", () => {
    const count = messageTextarea.value.length;
    charCount.textContent = count;

    if (count > 1000) {
      charCount.style.color = "var(--accent)";
      messageTextarea.value = messageTextarea.value.substring(0, 1000);
    } else {
      charCount.style.color = "var(--concrete)";
    }
  });
}

// Form submission with EmailJS
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value.trim();

    // Validation
    if (!name || !email || !subject || !message) {
      showFormStatus("Por favor completa todos los campos", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showFormStatus("Por favor ingresa un email válido", "error");
      return;
    }

    // Set button to loading state
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    try {
      // OPCIÓN 1: Usar EmailJS (Recomendado)
      // Descomentar estas líneas cuando configures EmailJS
      /*
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message
      });
      */

      // OPCIÓN 2: Usar mailto (Funcional pero limitado)
      const emailSubject = encodeURIComponent(
        `[${subject}] Nuevo mensaje de ${name}`,
      );
      const emailBody = encodeURIComponent(
        `Nombre: ${name}\n` +
          `Email: ${email}\n` +
          `Tipo de Proyecto: ${subject}\n\n` +
          `Mensaje:\n${message}`,
      );

      window.location.href = `mailto:javierramos.04@outlook.com?subject=${emailSubject}&body=${emailBody}`;

      // Show success message
      setTimeout(() => {
        submitBtn.classList.remove("loading");
        submitBtn.classList.add("success");
        showFormStatus(
          "¡Mensaje enviado exitosamente! Te responderé pronto.",
          "success",
        );

        // Reset form
        setTimeout(() => {
          contactForm.reset();
          charCount.textContent = "0";
          submitBtn.classList.remove("success");
          submitBtn.disabled = false;
          formStatus.style.display = "none";
        }, 3000);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      showFormStatus(
        "Hubo un error al enviar el mensaje. Por favor intenta de nuevo.",
        "error",
      );
    }
  });
}

function showFormStatus(message, type) {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
  formStatus.style.display = "block";

  if (type === "error") {
    setTimeout(() => {
      formStatus.style.display = "none";
    }, 5000);
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ===========================
// BACK TO TOP BUTTON
// ===========================
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ===========================
// PROJECT CARDS ANIMATION
// ===========================
const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card, index) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 200);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  card.style.opacity = "0";
  card.style.transform = "translateY(50px)";
  card.style.transition = "all 0.6s ease";
  observer.observe(card);
});

// ===========================
// LAZY LOADING IMAGES
// ===========================
const images = document.querySelectorAll('img[loading="lazy"]');

if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.src; // Trigger loading
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// ===========================
// KEYBOARD NAVIGATION
// ===========================
document.addEventListener("keydown", (e) => {
  // ESC to close mobile menu
  if (e.key === "Escape") {
    closeMenu();
  }
});

// ===========================
// PERFORMANCE: Debounce scroll events
// ===========================
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll-heavy functions
window.addEventListener(
  "scroll",
  debounce(() => {
    revealOnScroll();
  }, 10),
);

// ===========================
// CONSOLE MESSAGE
// ===========================
console.log(
  "%c¡Hola Developer! 👋",
  "color: #ff3366; font-size: 20px; font-weight: bold;",
);
console.log(
  "%c¿Curioseando el código? Me gusta tu estilo.",
  "color: #00f0ff; font-size: 14px;",
);
console.log(
  "%cSi tienes preguntas sobre cómo está hecho este sitio, no dudes en contactarme.",
  "color: #e8e8e8; font-size: 12px;",
);
console.log("%c- Javi", "color: #ff3366; font-size: 12px; font-style: italic;");
