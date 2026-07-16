/**
 * ChiefinTechSolutions — Main JavaScript
 * Handles: loading, navigation, dark mode, scroll effects,
 * FAQ accordion, form validation, particles, search overlay,
 * tab switching, stagger animations, ripple effects.
 */

'use strict';

/* ── Utility ─────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Loading Screen ──────────────────────────────────────────── */
function initLoader() {
  const screen = $('#loading-screen');
  if (!screen) return;

  const hide = () => {
    screen.classList.add('hidden');
    document.body.style.overflow = '';
  };

  document.body.style.overflow = 'hidden';

  // Hide after animation completes (1.8s) + small buffer
  setTimeout(hide, 2000);

  // Fallback: hide immediately if page already loaded fast
  if (document.readyState === 'complete') {
    setTimeout(hide, 500);
  }
}

/* ── Theme (Dark / Light) ────────────────────────────────────── */
function initTheme() {
  const root   = document.documentElement;
  const toggle = $('#theme-toggle');
  if (!toggle) return;

  // Respect OS preference on first visit
  const stored = localStorage.getItem('cts-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = stored || (prefersDark ? 'dark' : 'light');

  root.setAttribute('data-theme', initial);

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('cts-theme', next);
  });
}

/* ── Navigation ──────────────────────────────────────────────── */
function initNav() {
  const navbar    = $('#navbar');
  const hamburger = $('#hamburger');
  const mobileNav = $('#nav-mobile');
  const navLinks  = $$('#nav-mobile .nav-link, #nav-mobile .btn');
  if (!navbar) return;

  // Scroll state
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 20);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section highlighting
  const sections = $$('section[id]');
  const navItems = $$('.nav-links .nav-link');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navItems.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach(s => sectionObserver.observe(s));
}

/* ── Scroll Reveal ───────────────────────────────────────────── */
function initReveal() {
  const elements = $$('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ── Stagger Children ────────────────────────────────────────── */
function initStagger() {
  const containers = $$('.stagger-children');
  if (!containers.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  containers.forEach(el => observer.observe(el));
}

/* ── Back to Top ─────────────────────────────────────────────── */
function initBackToTop() {
  const btn = $('#back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── FAQ Accordion ───────────────────────────────────────────── */
function initFAQ() {
  const items = $$('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── About Mission/Vision Tabs ───────────────────────────────── */
function initTabs() {
  const tabs = $$('.mv-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      $$('.mv-panel').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const panel = $(`#tab-${target}`);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ── Hero Particle Effect ────────────────────────────────────── */
function initParticles() {
  const container = $('#particles');
  if (!container) return;

  // Reduce particles on mobile
  const count = window.innerWidth < 768 ? 15 : 35;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size   = Math.random() * 3 + 1;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 15;
    const dur    = Math.random() * 15 + 12;
    const drift  = (Math.random() - 0.5) * 120;

    Object.assign(p.style, {
      width:           `${size}px`,
      height:          `${size}px`,
      left:            `${left}%`,
      animationDelay:  `${delay}s`,
      animationDuration:`${dur}s`,
      '--drift':       `${drift}px`,
      background:      `rgba(${Math.random() > 0.6 ? '6,182,212' : '37,99,235'}, ${Math.random() * 0.5 + 0.2})`,
    });

    container.appendChild(p);
  }
}

/* ── Contact Form Validation ─────────────────────────────────── */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  const fields = {
    name:    { el: $('#contact-name'),    err: $('#name-error'),    validate: v => v.trim().length >= 2 },
    email:   { el: $('#contact-email'),   err: $('#email-error'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    service: { el: $('#contact-service'), err: $('#service-error'), validate: v => v !== '' },
    message: { el: $('#contact-message'), err: $('#message-error'), validate: v => v.trim().length >= 10 },
  };

  const showError = (field, show) => {
    field.el.classList.toggle('error', show);
    field.err.style.display = show ? 'block' : 'none';
  };

  // Live validation on blur
  Object.values(fields).forEach(field => {
    if (!field.el) return;
    field.el.addEventListener('blur', () => {
      showError(field, !field.validate(field.el.value));
    });
    field.el.addEventListener('input', () => {
      if (field.el.classList.contains('error')) {
        showError(field, !field.validate(field.el.value));
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    Object.values(fields).forEach(field => {
      if (!field.el) return;
      const ok = field.validate(field.el.value);
      showError(field, !ok);
      if (!ok) valid = false;
    });

    if (!valid) return;

    const btn = $('#form-submit');
    const success = $('#form-success');

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending…';
    }

    // Simulate form submission (replace with real endpoint)
    setTimeout(() => {
      form.reset();
      if (success) {
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          Send Message`;
      }
    }, 1200);
  });
}

/* ── Newsletter Form ─────────────────────────────────────────── */
function initNewsletter() {
  const form = $('#newsletter-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    if (!input) return;

    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.borderColor = '#ef4444';
      return;
    }

    const btn = form.querySelector('.newsletter-btn');
    if (btn) {
      btn.textContent = '✓ Subscribed!';
      btn.disabled = true;
      btn.style.background = '#10b981';
    }
    input.value = '';
    input.style.borderColor = '';
  });
}

/* ── Search Overlay ──────────────────────────────────────────── */
function initSearch() {
  const overlay  = $('#search-overlay');
  const openBtn  = $('#search-btn');
  const closeBtn = $('#search-close');
  const input    = $('#search-input');
  if (!overlay) return;

  const open = () => {
    overlay.classList.add('open');
    input?.focus();
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (input) input.value = '';
  };

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);

  // Close on ESC or overlay click
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });
}

/* ── Ripple Effect on Buttons ────────────────────────────────── */
function initRipple() {
  $$('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      Object.assign(ripple.style, {
        left: `${e.clientX - rect.left}px`,
        top:  `${e.clientY - rect.top}px`,
      });
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

/* ── Smooth Scroll for Anchor Links ─────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Process Step Hover Active ───────────────────────────────── */
function initProcessSteps() {
  const steps = $$('.process-step');
  if (!steps.length) return;

  // Auto-cycle active state
  let current = 0;
  const cycle = () => {
    steps.forEach((s, i) => s.classList.toggle('active', i === current));
    current = (current + 1) % steps.length;
  };
  cycle();
  setInterval(cycle, 1800);

  // Manual override on hover
  steps.forEach((step, i) => {
    step.addEventListener('mouseenter', () => {
      steps.forEach((s, j) => s.classList.toggle('active', j === i));
    });
  });
}

/* ── Footer Year ─────────────────────────────────────────────── */
function initFooterYear() {
  const el = $('#footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Parallax Hero Background ────────────────────────────────── */
function initParallax() {
  const hero = $('#hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      hero.style.setProperty('--parallax-y', `${y * 0.35}px`);
    }
  }, { passive: true });
}

/* ── Service Card click (same-page demo) ─────────────────────── */
function initServiceCards() {
  $$('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const target = $('#contact');
      if (!target) return;
      const navH = 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ── Image Lazy Loading ──────────────────────────────────────── */
function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return; // native support

  const imgs = $$('img[loading="lazy"]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        observer.unobserve(img);
      }
    });
  });
  imgs.forEach(img => observer.observe(img));
}

/* ── Intelligent AI Chatbot Widget ───────────────────────────── */
function initChatbot() {
  const windowEl = $('#chat-window');
  const btnEl    = $('#chat-btn');
  const closeEl  = $('#chat-close');
  const inputEl  = $('#chat-input');
  const sendEl   = $('#chat-send');
  const bodyEl   = $('#chat-body');

  if (!windowEl || !btnEl || !closeEl || !inputEl || !sendEl || !bodyEl) return;

  // Toggle Chat window
  btnEl.addEventListener('click', () => {
    windowEl.classList.toggle('open');
    if (windowEl.classList.contains('open')) {
      inputEl.focus();
    }
  });

  closeEl.addEventListener('click', () => {
    windowEl.classList.remove('open');
  });

  // Suggestion Chips Click
  bodyEl.addEventListener('click', e => {
    if (e.target.classList.contains('chat-chip')) {
      const question = e.target.textContent;
      sendUserMessage(question);
      $('#chat-chips')?.remove(); // Remove suggestions once user interacts
    }
  });

  // Send Message Actions
  const handleSend = () => {
    const text = inputEl.value.trim();
    if (!text) return;
    sendUserMessage(text);
    inputEl.value = '';
  };

  sendEl.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSend();
  });

  function sendUserMessage(msg) {
    appendMessage(msg, 'user');
    showTypingIndicator();

    // AI Response Delay
    setTimeout(() => {
      removeTypingIndicator();
      const reply = generateAIResponse(msg);
      appendMessage(reply, 'assistant');
    }, 1000 + Math.random() * 800);
  }

  function appendMessage(text, sender) {
    const row = document.createElement('div');
    row.className = `chat-msg-row ${sender}`;
    row.innerHTML = `<div class="chat-bubble-msg">${text}</div>`;
    bodyEl.appendChild(row);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function showTypingIndicator() {
    removeTypingIndicator(); // Ensure no duplicates
    const row = document.createElement('div');
    row.className = 'chat-msg-row assistant';
    row.id = 'chat-typing-indicator';
    row.innerHTML = `
      <div class="chat-bubble-msg typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    bodyEl.appendChild(row);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = $('#chat-typing-indicator');
    if (indicator) indicator.remove();
  }

  // ── Comprehensive Q&A Knowledge Base (Rules Table) ───────────
  // Each rule: { keywords: [...], response: "..." }
  // Rules are checked in order; first match wins.
  const KB = [

    // ════════════════════════════════════════════════════════════
    // 🌍 MULTI-LANGUAGE SECTION (Swahili, French, Spanish, German)
    // ════════════════════════════════════════════════════════════

    // ── Swahili Rules ──────────────────────────────────────────
    {
      keywords: ['mambo', 'habari', 'jambo', 'hujambo', 'sasa', 'vipi', 'niaje', 'habari yako'],
      response: "Habari! 👋 Karibu ChiefinTechSolutions! Mimi ni msaidizi wako wa AI. Unaweza kuniuliza kuhusu huduma zetu za kiteknolojia kama vile kutengeneza mifumo ya programu (software), tovuti (websites), usalama wa mitandao (cybersecurity), au mitandao ya ofisi (networking). Nikupe usaidizi gani leo?"
    },
    {
      keywords: ['programu', 'tovuti', 'mifumo', 'software kiswahili', 'website kiswahili'],
      response: "ChiefinTechSolutions inatengeneza programu maalum za kompyuta (custom software), tovuti za kisasa (websites), mifumo ya ERP, CRM, POS, na programu za simu (iOS & Android). Mifumo yetu yote ni salama, ya haraka, na inalingana na mahitaji ya biashara yako."
    },
    {
      keywords: ['usalama wa mitandao', 'usalama wa mifumo', 'udukuzi', 'kuzuia udukuzi', 'usalama kiswahili'],
      response: "Tunatoa huduma za usalama wa mifumo na mitandao (cybersecurity) ikiwa ni pamoja na kufanya majaribio ya udukuzi (penetration testing), kuzuia udukuzi (firewall configuration), na kuweka mifumo salama ya kuhifadhi data (data backups). Mifumo yetu yote inajengwa kwa kuzingatia usalama."
    },
    {
      keywords: ['mitandao ya ofisi', 'nyaya za mtandao', 'ruta', 'swichi', 'wifi kiswahili'],
      response: "Tunafanya usanifu na ufungaji wa mitandao ya ofisi (LAN/WAN), ufungaji wa nyaya za mtandao (structured cabling Cat6/fiber), mifumo ya Wi-Fi ya kampuni, na usanidi wa swichi na ruta (Cisco, MikroTik, Ubiquiti)."
    },
    {
      keywords: ['bei gani', 'gharama ya', 'gharama za', 'bei ya', 'bei za', 'quote kiswahili', 'bei kiswahili'],
      response: "Tunatoa ushauri wa kwanza BILA GHARAMA yoyote. Bei za miradi yetu inategemea ukubwa na mahitaji ya mradi wako. Tafadhali jaza fomu ya mawasiliano hapa chini, tutumie barua pepe kwa hello@chiefintechsolutions.co.ke, au tupigie simu/WhatsApp kwa +254 790 901 285."
    },
    {
      keywords: ['ofisi zenu', 'wapi', 'mahali ofisi', 'nairobi kenya kiswahili'],
      response: "Ofisi zetu kuu ziko Nairobi, Kenya 🇰🇪. Tunahudumia wateja kote nchini na pia remotely katika nchi za Afrika Mashariki (Uganda, Tanzania, Rwanda)."
    },
    {
      keywords: ['nambari ya simu', 'mawasiliano kiswahili', 'tupigie', 'barua pepe kiswahili'],
      response: "Unaweza kuwasiliana nasi kwa Simu au WhatsApp kwa nambari +254 790 901 285, au barua pepe hello@chiefintechsolutions.co.ke. Sisi hujibu maswali yote ndani ya siku moja ya kazi."
    },

    // ── French Rules ───────────────────────────────────────────
    {
      keywords: ['bonjour', 'salut', 'bonsoir', 'coucou', 'comment ca va'],
      response: "Bonjour! 👋 Bienvenue chez ChiefinTechSolutions! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui avec vos projets technologiques?"
    },
    {
      keywords: ['logiciel', 'logiciels', 'site web', 'sites web', 'application mobile', 'applications mobiles'],
      response: "ChiefinTechSolutions conçoit des logiciels sur mesure, des sites web professionnels, des applications mobiles (iOS et Android), ainsi que des systèmes ERP et CRM adaptés à vos besoins d'affaires."
    },
    {
      keywords: ['cybersécurité', 'sécurité informatique', 'pare-feu', 'test d\'intrusion'],
      response: "Nous offrons des services de cybersécurité complets: tests d'intrusion (penetration testing), audits de sécurité, configuration de pare-feu et plans de sauvegarde de données."
    },
    {
      keywords: ['prix french', 'devis', 'tarif', 'tarifs', 'coût devis'],
      response: "Nous proposons des consultations initiales gratuites. Pour obtenir un devis ou nous contacter, appelez le +254 790 901 285 (WhatsApp disponible) ou écrivez à hello@chiefintechsolutions.co.ke."
    },

    // ── Spanish Rules ──────────────────────────────────────────
    {
      keywords: ['buenos dias', 'buenas tardes', 'buenas noches', 'como estas'],
      response: "¡Hola! 👋 ¡Bienvenido a ChiefinTechSolutions! Soy tu asistente virtual. ¿Cómo puedo ayudarte hoy con tus requerimientos tecnológicos?"
    },
    {
      keywords: ['sitio web spanish', 'sitios web spanish', 'desarrollo de software', 'aplicacion movil', 'aplicaciones moviles'],
      response: "Desarrollamos software a medida, sitios web profesionales, aplicaciones móviles (iOS y Android) y sistemas de gestión empresarial (ERP y CRM)."
    },
    {
      keywords: ['precio spanish', 'costo spanish', 'cotizacion', 'tarifas spanish'],
      response: "Ofrecemos asesoría inicial gratuita. Para cotizaciones o consultas, contáctanos al +254 790 901 285 (WhatsApp) o escribe a hello@chiefintechsolutions.co.ke."
    },

    // ── German Rules ───────────────────────────────────────────
    {
      keywords: ['guten tag', 'guten morgen', 'guten abend', 'wie gehts'],
      response: "Hallo! 👋 Willkommen bei ChiefinTechSolutions! Ich bin Ihr KI-Assistent. Wie kann ich Ihnen heute bei Ihren technologischen Anforderungen helfen?"
    },
    {
      keywords: ['softwareentwicklung', 'webseite german', 'webseiten german', 'anwendung german', 'anwendungen german'],
      response: "Wir entwickeln maßgeschneiderte Software, professionelle Webseiten, mobile Apps (iOS & Android) sowie ERP- und CRM-Systeme für Ihr Unternehmen."
    },
    {
      keywords: ['preis german', 'preise german', 'kosten german', 'angebot german'],
      response: "Wir bieten eine kostenlose Erstberatung. Für Angebote oder Fragen kontaktieren Sie uns unter +254 790 901 285 (WhatsApp) oder per E-Mail an hello@chiefintechsolutions.co.ke."
    },

    // ── English Rules (Fallback & Standard) ────────────────────
    {
      keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'hola', 'greetings', 'sup', 'yo'],
      response: "Hello! 👋 Welcome to ChiefinTechSolutions! I'm your AI assistant, ready to help you with any questions about our technology services. What can I help you with today?"
    },

    // ── Farewells ──────────────────────────────────────────────
    {
      keywords: ['bye', 'goodbye', 'see you', 'later', 'thanks', 'thank you', 'cheers', 'appreciate'],
      response: "Thank you for reaching out to ChiefinTechSolutions! 🙏 Feel free to come back anytime. You can also call or WhatsApp us on +254 790 901 285. Have a wonderful day!"
    },

    // ── About the Company ──────────────────────────────────────
    {
      keywords: ['who are you', 'about you', 'tell me about', 'what is chiefin', 'what do you do', 'company', 'about chiefin', 'your company', 'who you are'],
      response: "ChiefinTechSolutions is a premium technology company based in Nairobi, Kenya. We deliver end-to-end technology solutions including custom software development, cybersecurity, enterprise networking, AI integrations, robotics & automation, and IT support — helping businesses across Kenya and East Africa build, secure, and scale their digital infrastructure."
    },

    // ── Mission & Vision ───────────────────────────────────────
    {
      keywords: ['mission', 'vision', 'values', 'believe', 'purpose', 'goals', 'aim'],
      response: "Our mission is to empower businesses in Kenya and across East Africa with world-class technology solutions that are affordable, reliable, and built to last. We believe every organization — from startups to enterprises — deserves premium technology that drives real results."
    },

    // ── Team & Founder ─────────────────────────────────────────
    {
      keywords: ['team', 'founder', 'who built', 'staff', 'engineers', 'ceo', 'cto', 'director', 'experts', 'developers'],
      response: "ChiefinTechSolutions is built by a team of passionate engineers, designers, and cybersecurity specialists with deep expertise across software engineering, enterprise networking, AI, and digital transformation. Our team brings together skills from computer science, electrical engineering, and business technology."
    },

    // ── Services Overview ──────────────────────────────────────
    {
      keywords: ['services', 'what do you offer', 'what can you do', 'offerings', 'solutions', 'products'],
      response: "We offer 6 core service pillars:\n\n1️⃣ Custom Software Development (web apps, mobile, ERP, POS, CRM)\n2️⃣ Cybersecurity (pen testing, firewalls, compliance)\n3️⃣ Enterprise Networking (LAN/WAN, Wi-Fi, cabling, VPN)\n4️⃣ AI & ML Integrations (chatbots, automation, analytics)\n5️⃣ Robotics & IoT (smart systems, sensors, RPA)\n6️⃣ IT Support & Hardware (helpdesk, CCTV, biometrics, setup)\n\nWould you like to know more about any specific service?"
    },

    // ── Custom Software / Web Development ──────────────────────
    {
      keywords: ['software', 'web', 'website', 'websites', 'landing page', 'landing pages', 'portal', 'portals', 'dashboard', 'dashboards', 'erp', 'pos', 'crm', 'saas', 'platform', 'platforms', 'system', 'systems', 'database', 'databases', 'backend', 'frontend', 'full stack', 'fullstack'],
      response: "Our software team builds:\n• Responsive websites & business portals\n• Custom ERP, CRM, and POS systems\n• SaaS platforms & multi-tenant applications\n• Admin dashboards & management systems\n• API development & third-party integrations\n• Database design (MySQL, PostgreSQL, MongoDB)\n\nEvery solution is engineered to your exact business workflow — no off-the-shelf templates."
    },

    // ── Mobile Apps ────────────────────────────────────────────
    {
      keywords: ['mobile', 'android', 'ios', 'app', 'apps', 'flutter', 'react native', 'phone app', 'phone apps', 'smartphone', 'smartphones'],
      response: "We develop native and cross-platform mobile applications for Android and iOS:\n• Flutter & React Native cross-platform apps\n• Native Android (Kotlin/Java) development\n• Native iOS (Swift) development\n• M-Pesa / payment gateway integrations\n• Offline-capable field apps\n• App Store & Google Play deployment\n\nFrom idea to launch, we handle the full mobile development lifecycle."
    },

    // ── E-Commerce ─────────────────────────────────────────────
    {
      keywords: ['ecommerce', 'e-commerce', 'shop', 'shops', 'store', 'stores', 'online store', 'online stores', 'shopping cart', 'shopping carts', 'woocommerce', 'shopify', 'sell online'],
      response: "We build fully custom e-commerce solutions including online stores with shopping carts, inventory management, M-Pesa and card payment integrations, order tracking, and logistics APIs. We also set up and customize WooCommerce and Shopify stores with custom themes and plugins tailored for the Kenyan market."
    },

    // ── Cybersecurity ──────────────────────────────────────────
    {
      keywords: ['security', 'cyber', 'penetration', 'pen test', 'pen tests', 'firewall', 'firewalls', 'hack', 'hacks', 'vulnerability', 'vulnerabilities', 'protect', 'compliance', 'gdpr', 'iso', 'data breach', 'endpoint', 'endpoints', 'antivirus', 'ransomware'],
      response: "Our cybersecurity services include:\n• Professional penetration testing (web, mobile, network)\n• Vulnerability assessments & security audits\n• Firewall & endpoint security configuration\n• Security Information & Event Management (SIEM)\n• Data backup, recovery planning & disaster response\n• Staff security awareness training\n• ISO 27001 & compliance consulting\n\nWe build all our systems secure-by-design from day one."
    },

    // ── Networking ─────────────────────────────────────────────
    {
      keywords: ['network', 'networks', 'cable', 'cables', 'cabling', 'wifi', 'wi-fi', 'switch', 'switches', 'router', 'routers', 'lan', 'wan', 'vpn', 'vpns', 'cisco', 'mikrotik', 'ubiquiti', 'fiber', 'server room', 'server rooms', 'structured'],
      response: "We handle all enterprise networking needs:\n• LAN/WAN design & implementation\n• Structured office cabling (Cat5e, Cat6, fiber)\n• Business Wi-Fi system design & installation\n• Cisco, MikroTik, and Ubiquiti configurations\n• Corporate VPN setup & firewall rules\n• Server room & rack installation\n• Network monitoring & performance optimization"
    },

    // ── Cloud Services ─────────────────────────────────────────
    {
      keywords: ['cloud', 'aws', 'azure', 'google cloud', 'gcp', 'hosting', 'vps', 'server', 'servers', 'devops', 'docker', 'kubernetes', 'deployment', 'deployments', 'ci/cd'],
      response: "We provide cloud infrastructure services including:\n• AWS, Microsoft Azure, and Google Cloud setup\n• VPS provisioning, configuration & hardening\n• Docker containerization & Kubernetes orchestration\n• CI/CD pipeline design (GitHub Actions, GitLab)\n• Cloud cost optimization & architecture reviews\n• Managed hosting for web apps and APIs\n• Automated backups & disaster recovery"
    },

    // ── AI & Machine Learning ──────────────────────────────────
    {
      keywords: ['artificial intelligence', 'machine learning', 'ai', 'ml', 'nlp', 'chatbot', 'chatbots', 'generative', 'llm', 'llms', 'gpt', 'intelligence', 'prediction', 'predictions', 'recommendation', 'recommendations', 'deep learning'],
      response: "Our AI & ML services include:\n• Custom AI chatbot development (like this one!)\n• Large Language Model (LLM) integrations (GPT, Gemini)\n• Natural Language Processing (NLP) pipelines\n• Predictive analytics dashboards\n• Computer vision & image recognition systems\n• AI-powered recommendation engines\n• Business automation with AI decision-making\n\nWe help businesses harness AI to save time and increase revenue."
    },

    // ── Robotics & Automation / IoT ────────────────────────────
    {
      keywords: ['robot', 'robots', 'automation', 'automations', 'iot', 'internet of things', 'sensor', 'sensors', 'rpa', 'robotic process', 'firmware', 'embedded', 'arduino', 'raspberry', 'smart'],
      response: "Our robotics & automation solutions include:\n• Robotic Process Automation (RPA) for office workflows\n• Industrial IoT sensor networks & dashboards\n• Custom embedded firmware (Arduino, Raspberry Pi)\n• Smart building automation (lights, HVAC, access control)\n• Automated reporting & data pipeline bots\n• Barcode, RFID, and QR code system integrations"
    },

    // ── IT Support & Helpdesk ──────────────────────────────────
    {
      keywords: ['it support', 'helpdesk', 'help desk', 'maintenance', 'support contract', 'support contracts', 'sla', 'slas', 'troubleshoot', 'repair', 'repairs', 'technical support', 'remote support'],
      response: "We offer flexible IT support packages:\n• Remote and on-site helpdesk support\n• Proactive system monitoring & maintenance\n• Hardware repair, upgrade & replacement\n• Software installation & license management\n• Staff IT onboarding & troubleshooting\n• Monthly retainer support contracts available\n\nOur SLA options range from same-day to 4-hour response times depending on your plan."
    },

    // ── Hardware & Equipment ───────────────────────────────────
    {
      keywords: ['hardware', 'computer', 'computers', 'laptop', 'laptops', 'printer', 'printers', 'equipment', 'setup', 'configure', 'install', 'workstation', 'workstations', 'server hardware'],
      response: "We supply and set up business-grade hardware including:\n• Laptops, desktops & workstations\n• Network switches, routers & access points\n• Printers, scanners & multi-function devices\n• UPS units & power protection\n• Server hardware & NAS storage\n• Full office IT infrastructure setup from scratch"
    },

    // ── CCTV & Security Cameras ────────────────────────────────
    {
      keywords: ['cctv', 'camera', 'cameras', 'surveillance', 'security camera', 'security cameras', 'nvr', 'dvr', 'ip camera', 'ip cameras', 'access control', 'biometric', 'biometrics'],
      response: "We install and configure:\n• IP CCTV surveillance systems (indoor & outdoor)\n• NVR/DVR recording & remote viewing setup\n• Biometric access control (fingerprint, face recognition)\n• Electric gate & door access control systems\n• Integration with your security command center\n• Remote monitoring via smartphone apps\n\nWe serve offices, warehouses, schools, and residential properties."
    },

    // ── M-Pesa & Payment Integrations ─────────────────────────
    {
      keywords: ['mpesa', 'm-pesa', 'payment', 'payments', 'payment gateway', 'payment gateways', 'stripe', 'pesapal', 'paypal', 'flutterwave', 'daraja', 'lipa na mpesa', 'stk push'],
      response: "We specialize in M-Pesa integrations for Kenyan businesses:\n• M-Pesa Daraja API (STK Push, C2B, B2C, B2B)\n• Lipa Na M-Pesa integration for websites & apps\n• PesaPal, Flutterwave, and Stripe payment gateways\n• PayPal and international payment processing\n• Automated payment reconciliation & receipting\n• Subscription billing systems\n\nWe've integrated M-Pesa into countless systems across Kenya."
    },

    // ── Data Analytics & Business Intelligence ─────────────────
    {
      keywords: ['data', 'analytics', 'business intelligence', 'bi', 'report', 'reports', 'dashboard', 'dashboards', 'power bi', 'tableau', 'excel', 'insight', 'insights', 'kpi', 'kpis', 'metrics'],
      response: "We build data solutions that turn your raw information into actionable insights:\n• Custom analytics dashboards & KPI trackers\n• Power BI & Tableau report development\n• Automated report generation & scheduling\n• Database integration & ETL pipelines\n• Sales, inventory & financial analytics\n• Real-time business performance monitoring"
    },

    // ── IT Training ────────────────────────────────────────────
    {
      keywords: ['training', 'workshop', 'workshops', 'learn', 'course', 'courses', 'teach', 'educate', 'skills', 'capacity building'],
      response: "We provide practical IT training workshops for businesses and teams:\n• Cybersecurity awareness training for staff\n• Microsoft 365 & Google Workspace training\n• Custom software onboarding & user training\n• Basic IT skills for non-technical staff\n• Advanced training for IT administrators\n• On-site or remote training sessions available\n\nAll training is tailored to your team's current skill level."
    },

    // ── Tech Stack / Technologies Used ────────────────────────
    {
      keywords: ['technology', 'stack', 'programming', 'language', 'react', 'node', 'python', 'django', 'php', 'laravel', 'javascript', 'typescript', 'java', 'swift', 'flutter', 'vue', 'angular', 'next', 'postgres', 'mysql', 'mongo'],
      response: "Our engineering team works with a modern, battle-tested technology stack:\n\n🖥️ Frontend: React, Next.js, Vue.js, Angular, HTML/CSS\n⚙️ Backend: Node.js, Python (Django/FastAPI), PHP (Laravel), Java\n📱 Mobile: Flutter, React Native, Swift, Kotlin\n🗄️ Databases: PostgreSQL, MySQL, MongoDB, Redis\n☁️ Cloud: AWS, Azure, GCP, Docker, Kubernetes\n🔐 Security: OWASP, Kali Linux, Nessus, Burp Suite\n🌐 Networking: Cisco, MikroTik, Ubiquiti, pfSense"
    },

    // ── Portfolio / Past Work ──────────────────────────────────
    {
      keywords: ['portfolio', 'past work', 'examples', 'projects', 'case study', 'case studies', 'clients', 'previous', 'experience', 'track record'],
      response: "We have delivered successful projects across many sectors including:\n• Custom POS systems for retail chains in Nairobi\n• Hospital management systems for healthcare providers\n• School management portals with parent apps\n• E-commerce platforms with M-Pesa integration\n• Office networking for corporate headquarters\n• Cybersecurity audits for financial institutions\n\nVisit our Portfolio section on the website to see featured solutions we build."
    },

    // ── Industries Served ──────────────────────────────────────
    {
      keywords: ['industry', 'industries', 'sector', 'sectors', 'healthcare', 'hospital', 'hospitals', 'education', 'school', 'schools', 'retail', 'finance', 'bank', 'banks', 'ngo', 'ngos', 'government', 'governments', 'hotel', 'hotels', 'hospitality', 'logistics', 'manufacturing', 'sacco', 'saccos'],
      response: "We serve businesses across all major sectors in Kenya and East Africa:\n\n🏥 Healthcare & hospitals\n🎓 Education & schools\n🏦 Finance, banks & SACCOs\n🏪 Retail & supermarkets\n🏨 Hotels & hospitality\n🚚 Logistics & transport\n🏭 Manufacturing & industry\n🌍 NGOs & development organizations\n🏛️ Government agencies\n📡 Telecommunications\n\nNo matter your industry, we tailor our solutions to your specific needs."
    },

    // ── Small Business / Startups ──────────────────────────────
    {
      keywords: ['small business', 'small businesses', 'startup', 'startups', 'sme', 'smes', 'entrepreneur', 'entrepreneurs', 'new business', 'new businesses', 'just starting', 'budget', 'affordable', 'small company', 'small companies'],
      response: "Absolutely! We work with businesses of all sizes — from solo entrepreneurs and early-stage startups to large enterprises. We offer flexible, budget-friendly packages tailored specifically for small and medium businesses. Our goal is to give every business, regardless of size, access to world-class technology. Let's discuss your vision and find a solution that fits your budget."
    },

    // ── Remote Work Capability ─────────────────────────────────
    {
      keywords: ['remote', 'online', 'virtual', 'anywhere', 'outside nairobi', 'outside kenya', 'diaspora', 'international'],
      response: "Yes! We work with clients both locally and remotely across Kenya, East Africa, and beyond. Software development, AI integrations, cloud deployments, and cybersecurity audits can all be delivered fully remotely. For physical installations like networking, CCTV, and hardware setup, we operate on-site within Nairobi and can arrange logistics for upcountry locations."
    },

    // ── Project Timeline & Turnaround ──────────────────────────
    {
      keywords: ['timeline', 'timelines', 'how long', 'duration', 'turnaround', 'deadline', 'deadlines', 'time to complete', 'delivery time', 'when will'],
      response: "Project timelines depend on scope and complexity:\n\n⏱️ Simple landing website: 3–7 days\n📱 Mobile app: 4–10 weeks\n🖥️ Custom web platform/ERP: 6–16 weeks\n🔐 Cybersecurity audit: 1–2 weeks\n🌐 Office networking setup: 1–5 days\n☁️ Cloud migration: 1–4 weeks\n\nWe provide a detailed project timeline in your proposal after the discovery call. We always meet agreed deadlines."
    },

    // ── Maintenance & Post-Launch Support ──────────────────────
    {
      keywords: ['maintenance', 'after launch', 'post launch', 'update', 'updates', 'upgrade', 'upgrades', 'ongoing', 'monthly', 'annual', 'warranty', 'guarantee', 'support after'],
      response: "Yes, we provide comprehensive post-launch support! Our maintenance packages include:\n• Bug fixes & software updates\n• Security patches & vulnerability monitoring\n• Feature additions & enhancements\n• Monthly performance reports\n• 24/7 emergency support (premium plans)\n• Annual system audits\n\nWe offer monthly and annual maintenance retainer plans. We don't just build and disappear — we're long-term technology partners."
    },

    // ── Pricing & Quotes ───────────────────────────────────────
    {
      keywords: ['price', 'prices', 'pricing', 'cost', 'costs', 'how much', 'rate', 'rates', 'fee', 'fees', 'charge', 'charges', 'invoice', 'invoices', 'quote', 'quotes', 'estimate', 'estimates', 'budget', 'budgets', 'affordable', 'cheap', 'expensive'],
      response: "All our projects are custom-built to your requirements, so pricing varies by scope. Here's a general guide:\n\n💻 Basic website: from KSh 25,000\n📱 Mobile app: from KSh 80,000\n🖥️ Custom platform/ERP: from KSh 150,000\n🔐 Security audit: from KSh 40,000\n🌐 Office networking: from KSh 30,000\n\nWe offer FREE initial consultations. Contact us at +254 790 901 285 or hello@chiefintechsolutions.co.ke for a detailed, no-obligation quote."
    },

    // ── Consultation & Getting Started ─────────────────────────
    {
      keywords: ['consult', 'consultation', 'consultations', 'get started', 'start', 'begin', 'first step', 'onboard', 'sign up', 'hire', 'engage', 'work together'],
      response: "Getting started is easy! Here's how:\n\n1. 📞 Call or WhatsApp us on +254 790 901 285\n2. 📧 Email hello@chiefintechsolutions.co.ke\n3. 📝 Fill the Contact Form on this page\n\nWe'll schedule a FREE discovery call where we listen to your goals, assess your needs, and put together a tailored proposal — usually within 24 hours. No commitment required."
    },

    // ── Contact Details ────────────────────────────────────────
    {
      keywords: ['phone', 'telephone', 'number', 'tel', 'call us', 'whatsapp', 'email', 'contact', 'reach', 'get in touch'],
      response: "You can reach us through:\n\n📞 Phone/WhatsApp: +254 790 901 285\n📧 Email: hello@chiefintechsolutions.co.ke\n📝 Contact Form: Available on this page\n\nWe respond to all inquiries within one business day. WhatsApp is the fastest way to get a response!"
    },

    // ── Location & Office ──────────────────────────────────────
    {
      keywords: ['location', 'locations', 'office', 'offices', 'address', 'where are you', 'nairobi', 'kenya', 'visit', 'physical', 'find you'],
      response: "We are based in Nairobi, Kenya — the technology hub of East Africa! 🇰🇪\n\nWe serve clients:\n• Across all Nairobi counties\n• Upcountry Kenya (Mombasa, Kisumu, Nakuru, Eldoret)\n• East Africa (Uganda, Tanzania, Rwanda)\n• Remote clients globally\n\nOn-site visits can be arranged for networking, hardware, and CCTV installations. Contact us to schedule a site visit!"
    },

    // ── Business Hours ─────────────────────────────────────────
    {
      keywords: ['hours', 'open', 'working hours', 'when', 'available', 'time', 'business hours', 'weekends'],
      response: "Our business hours are:\n\n🕗 Monday – Friday: 8:00 AM – 6:00 PM (EAT)\n🕗 Saturday: 9:00 AM – 2:00 PM (EAT)\n🔴 Sunday: Closed (Emergency support available for premium clients)\n\nYou can always send us a WhatsApp message or email outside business hours and we'll respond first thing in the morning."
    },

    // ── Social Media ───────────────────────────────────────────
    {
      keywords: ['social media', 'facebook', 'instagram', 'linkedin', 'twitter', 'x', 'youtube', 'tiktok', 'follow', 'social'],
      response: "Follow us on social media to stay updated with our latest projects and tech insights:\n\n📘 Facebook: ChiefinTechSolutions\n💼 LinkedIn: ChiefinTechSolutions\n📸 Instagram: @chiefintechsolutions\n🐦 Twitter/X: @ChiefinTech\n\nWe share helpful tech tips, project showcases, and industry news — follow us to stay connected with the Kenyan tech community!"
    },

    // ── Microsoft 365 / Google Workspace ──────────────────────
    {
      keywords: ['microsoft', 'microsoft 365', 'office 365', 'google workspace', 'gmail', 'outlook', 'teams', 'email hosting', 'domain email', 'business email'],
      response: "We set up and manage business email and productivity suites:\n• Microsoft 365 (Outlook, Teams, SharePoint, OneDrive)\n• Google Workspace (Gmail, Drive, Meet, Docs)\n• Custom domain email setup (you@yourcompany.co.ke)\n• Email migration from old platforms\n• Staff account provisioning & policy management\n• Security hardening for business email accounts"
    },

    // ── Domain & Web Hosting ───────────────────────────────────
    {
      keywords: ['domain', 'domains', 'hosting', 'web hosting', '.co.ke', '.com', 'dns', 'cpanel', 'ssl', 'https', 'website hosting'],
      response: "We handle all web presence essentials:\n• Domain registration (.co.ke, .com, .org, .africa)\n• Shared, VPS, and dedicated web hosting\n• SSL certificate installation (HTTPS)\n• DNS management & configuration\n• cPanel & Plesk setup\n• Website speed optimization & CDN setup\n\nWe ensure your website is fast, secure, and always online."
    },

    // ── Help & Topic List ──────────────────────────────────────
    {
      keywords: ['help', 'what can you answer', 'topics', 'menu', 'options', 'list', 'capabilities', 'what do you know'],
      response: "I can answer questions about:\n\n• 🏢 Company info & team\n• 💻 Software & web development\n• 📱 Mobile apps\n• 🛒 E-commerce & M-Pesa\n• 🔐 Cybersecurity\n• 🌐 Office networking\n• ☁️ Cloud & hosting\n• 🤖 AI & automation\n• 📹 CCTV & access control\n• 📊 Data analytics\n• 🎓 IT training\n• 💰 Pricing & quotes\n• 📍 Location & business hours\n• 📞 Contact details\n\nJust type your question naturally!"
    },

    // ── Negative / Problem States ──────────────────────────────
    {
      keywords: ['problem', 'problems', 'issue', 'issues', 'broken', 'not working', 'bug', 'bugs', 'error', 'errors', 'crash', 'crashes', 'down', 'urgent', 'emergency', 'emergencies'],
      response: "We're sorry to hear you're experiencing an issue! 🚨 For urgent technical matters, please contact our support team directly:\n\n📞 WhatsApp/Call: +254 790 901 285 (fastest response)\n📧 Email: hello@chiefintechsolutions.co.ke\n\nIf you are an existing client on a support contract, please use your dedicated support channel. Our team typically responds to urgent issues within 1–4 hours during business hours."
    },

    // ── Competitor Comparisons ─────────────────────────────────
    {
      keywords: ['better than', 'compare', 'versus', 'vs', 'why choose', 'why you', 'what makes you different', 'unique', 'advantage', 'advantages'],
      response: "Great question! Here's what sets ChiefinTechSolutions apart:\n\n✅ End-to-end capability — software, networking, security & hardware under one roof\n✅ Kenya-first focus — we understand local business needs, regulations & M-Pesa ecosystem\n✅ Transparent pricing — no hidden costs, clear proposals\n✅ Long-term partnerships — we offer post-launch maintenance\n✅ Fast turnaround — we meet deadlines\n✅ Senior-level engineers — not junior freelancers\n✅ Free initial consultation — no commitment required"
    },

    // ── Testimonials / Reviews ─────────────────────────────────
    {
      keywords: ['testimonial', 'testimonials', 'review', 'reviews', 'feedback', 'satisfied', 'happy', 'client experience', 'success story', 'success stories', 'rating', 'ratings'],
      response: "Our clients across Nairobi and East Africa consistently praise us for:\n• Delivering projects on time and within budget\n• Excellent communication throughout the process\n• Building systems that actually solve their problems\n• Providing responsive after-sales support\n• Making complex technology easy to understand\n\nWe're proud to have helped businesses scale their operations through smart technology. Visit our website to read client testimonials!"
    },

    // ── Delivery / Process ─────────────────────────────────────
    {
      keywords: ['process', 'how do you work', 'methodology', 'steps', 'delivery', 'approach', 'workflow', 'workflows', 'agile', 'scrum'],
      response: "We follow a proven 10-step delivery process:\n\n1️⃣ Discovery — understanding your goals\n2️⃣ Consultation — aligning on requirements\n3️⃣ Planning — detailed project roadmap\n4️⃣ Design — UI/UX wireframes & prototypes\n5️⃣ Development — iterative engineering\n6️⃣ Testing — QA, security & performance\n7️⃣ Deployment — live launch & configuration\n8️⃣ Training — onboarding your team\n9️⃣ Support — post-launch assistance\n10️⃣ Continuous Improvement — ongoing enhancements\n\nWe use Agile methodology with regular demos so you're always in the loop."
    },

  ]; // end KB

  function generateAIResponse(input) {
    const text = input.toLowerCase().trim();

    // Check each rule for a keyword match
    for (const rule of KB) {
      for (const kw of rule.keywords) {
        // Escape special regex characters
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Build regex pattern requiring word boundaries only for word-starting/ending keywords
        let pattern = '';
        if (/^[a-zA-Z0-9_]/.test(kw)) {
          pattern += '\\b';
        }
        pattern += escaped;
        if (/[a-zA-Z0-9_]$/.test(kw)) {
          pattern += '\\b';
        }

        const regex = new RegExp(pattern, 'i');
        if (regex.test(text)) {
          return rule.response;
        }
      }
    }

    // Default Fallback
    return "That's a great question! To give you the most accurate answer, I'd recommend reaching out to our team directly:\n\n📞 WhatsApp/Call: +254 790 901 285\n📧 Email: hello@chiefintechsolutions.co.ke\n📝 Contact Form: Available on this page\n\nOur engineers will respond within one business day. You can also type 'help' to see all the topics I can assist with!";
  }
}

/* ── Initialize All ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  initNav();
  initReveal();
  initStagger();
  initBackToTop();
  initFAQ();
  initTabs();
  initParticles();
  initContactForm();
  initNewsletter();
  initSearch();
  initRipple();
  initSmoothScroll();
  initProcessSteps();
  initFooterYear();
  initParallax();
  initServiceCards();
  initLazyImages();
  initChatbot();
});

