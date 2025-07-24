import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// HTML代码生成工具
export const generateHTMLTool = createTool({
  id: 'generate-html',
  description: 'Generate HTML code based on requirements. Can create semantic HTML structure with proper accessibility features.',
  inputSchema: z.object({
    requirements: z.string().describe('Detailed requirements for the HTML structure'),
    includeBoilerplate: z.boolean().default(true).describe('Whether to include HTML5 boilerplate'),
    title: z.string().default('Generated Page').describe('Page title'),
    responsive: z.boolean().default(true).describe('Whether to include responsive meta tags'),
  }),
  outputSchema: z.object({
    html: z.string(),
    explanation: z.string(),
    suggestions: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const { requirements, includeBoilerplate, title, responsive } = context;
    
    // 基于需求生成HTML结构
    let html = '';
    let explanation = '';
    const suggestions: string[] = [];

    if (includeBoilerplate) {
      html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    ${responsive ? '<meta name="viewport" content="width=device-width, initial-scale=1.0">' : ''}
    <title>${title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Generated content based on: ${requirements} -->
`;

      // 根据需求生成具体的HTML内容
      if (requirements.toLowerCase().includes('navigation') || requirements.toLowerCase().includes('nav')) {
        html += `    <nav class="main-nav">
        <div class="nav-container">
            <a href="#" class="nav-logo">Logo</a>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>
`;
      }

      html += `    <main class="main-content">
`;

      if (requirements.toLowerCase().includes('hero') || requirements.toLowerCase().includes('banner')) {
        html += `        <section class="hero-section">
            <div class="hero-container">
                <h1 class="hero-title">Welcome to Our Website</h1>
                <p class="hero-description">Your engaging subtitle goes here</p>
                <button class="hero-cta">Get Started</button>
            </div>
        </section>
`;
        suggestions.push('Consider adding a hero background image');
      }

      if (requirements.toLowerCase().includes('form') || requirements.toLowerCase().includes('contact')) {
        html += `        <section class="contact-section">
            <div class="container">
                <h2>Contact Us</h2>
                <form class="contact-form" id="contactForm">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="5" required></textarea>
                    </div>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </section>
`;
        suggestions.push('Add form validation with JavaScript');
      }

      if (requirements.toLowerCase().includes('gallery') || requirements.toLowerCase().includes('image')) {
        html += `        <section class="gallery-section">
            <div class="container">
                <h2>Gallery</h2>
                <div class="gallery-grid">
                    <div class="gallery-item">
                        <img src="https://via.placeholder.com/300x200" alt="Gallery item 1">
                    </div>
                    <div class="gallery-item">
                        <img src="https://via.placeholder.com/300x200" alt="Gallery item 2">
                    </div>
                    <div class="gallery-item">
                        <img src="https://via.placeholder.com/300x200" alt="Gallery item 3">
                    </div>
                </div>
            </div>
        </section>
`;
        suggestions.push('Consider implementing a lightbox for gallery images');
      }

      html += `    </main>

    <footer class="main-footer">
        <div class="footer-container">
            <p>&copy; 2024 Your Website. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;

      explanation = `Generated HTML5 document with semantic structure based on requirements: "${requirements}". ` +
                  `Includes ${responsive ? 'responsive ' : ''}layout with proper accessibility attributes.`;
    } else {
      // 生成片段HTML
      html = `<!-- HTML fragment for: ${requirements} -->
<div class="component">
    <h2>Component Title</h2>
    <p>Component content based on your requirements.</p>
</div>`;
      explanation = `Generated HTML fragment based on requirements: "${requirements}"`;
    }

    return {
      html,
      explanation,
      suggestions,
    };
  },
});

// CSS代码生成工具
export const generateCSSTool = createTool({
  id: 'generate-css',
  description: 'Generate CSS code with modern styling practices, responsive design, and accessibility features.',
  inputSchema: z.object({
    requirements: z.string().describe('Styling requirements and design specifications'),
    framework: z.enum(['vanilla', 'flexbox', 'grid', 'bootstrap']).default('vanilla').describe('CSS framework preference'),
    colorScheme: z.enum(['light', 'dark', 'auto']).default('light').describe('Color scheme preference'),
    responsive: z.boolean().default(true).describe('Include responsive design'),
  }),
  outputSchema: z.object({
    css: z.string(),
    explanation: z.string(),
    suggestions: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const { requirements, framework, colorScheme, responsive } = context;
    
    let css = '';
    const suggestions: string[] = [];

    // 基础重置和变量
    css += `/* Generated CSS based on: ${requirements} */

/* CSS Reset and Variables */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* Color Variables */
    --primary-color: #3b82f6;
    --secondary-color: #64748b;
    --accent-color: #f59e0b;
    --text-color: ${colorScheme === 'dark' ? '#f8fafc' : '#1e293b'};
    --bg-color: ${colorScheme === 'dark' ? '#0f172a' : '#ffffff'};
    --border-color: ${colorScheme === 'dark' ? '#334155' : '#e2e8f0'};
    
    /* Typography */
    --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-size-base: 1rem;
    --line-height: 1.6;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    
    /* Breakpoints */
    --bp-sm: 640px;
    --bp-md: 768px;
    --bp-lg: 1024px;
    --bp-xl: 1280px;
}

body {
    font-family: var(--font-family);
    font-size: var(--font-size-base);
    line-height: var(--line-height);
    color: var(--text-color);
    background-color: var(--bg-color);
}

/* Container */
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
}

`;

    // 根据需求添加特定样式
    if (requirements.toLowerCase().includes('navigation') || requirements.toLowerCase().includes('nav')) {
      css += `/* Navigation Styles */
.main-nav {
    background-color: var(--bg-color);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
}

.nav-logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color);
    text-decoration: none;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: var(--spacing-lg);
}

.nav-menu a {
    color: var(--text-color);
    text-decoration: none;
    transition: color 0.3s ease;
}

.nav-menu a:hover {
    color: var(--primary-color);
}

`;
    }

    if (requirements.toLowerCase().includes('hero') || requirements.toLowerCase().includes('banner')) {
      css += `/* Hero Section */
.hero-section {
    padding: var(--spacing-2xl) 0;
    text-align: center;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    color: white;
}

.hero-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
}

.hero-title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: var(--spacing-md);
}

.hero-description {
    font-size: 1.25rem;
    margin-bottom: var(--spacing-xl);
    opacity: 0.9;
}

.hero-cta {
    background-color: white;
    color: var(--primary-color);
    padding: var(--spacing-md) var(--spacing-xl);
    border: none;
    border-radius: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hero-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

`;
    }

    if (requirements.toLowerCase().includes('form')) {
      css += `/* Form Styles */
.contact-section {
    padding: var(--spacing-2xl) 0;
}

.contact-form {
    max-width: 600px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: var(--spacing-lg);
}

.form-group label {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-weight: 600;
    color: var(--text-color);
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    font-size: var(--font-size-base);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.contact-form button {
    background-color: var(--primary-color);
    color: white;
    padding: var(--spacing-md) var(--spacing-xl);
    border: none;
    border-radius: 0.375rem;
    font-size: var(--font-size-base);
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.contact-form button:hover {
    background-color: #2563eb;
}

`;
    }

    if (requirements.toLowerCase().includes('gallery')) {
      css += `/* Gallery Styles */
.gallery-section {
    padding: var(--spacing-2xl) 0;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-xl);
}

.gallery-item {
    border-radius: 0.5rem;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.gallery-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.gallery-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

`;
    }

    // 添加响应式设计
    if (responsive) {
      css += `/* Responsive Design */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .nav-container {
        flex-direction: column;
        gap: var(--spacing-md);
    }
    
    .nav-menu {
        gap: var(--spacing-md);
    }
    
    .gallery-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 var(--spacing-sm);
    }
    
    .hero-title {
        font-size: 1.75rem;
    }
}

`;
      suggestions.push('Consider using CSS Container Queries for more advanced responsive design');
    }

    // 添加深色模式支持
    if (colorScheme === 'auto') {
      css += `/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
    :root {
        --text-color: #f8fafc;
        --bg-color: #0f172a;
        --border-color: #334155;
    }
}

`;
      suggestions.push('Added automatic dark mode support based on user preferences');
    }

    // 添加通用组件样式
    css += `/* Common Component Styles */
h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: var(--spacing-md);
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.75rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }
h6 { font-size: 1.125rem; }

p {
    margin-bottom: var(--spacing-md);
}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: var(--spacing-xs); }
.mb-2 { margin-bottom: var(--spacing-sm); }
.mb-3 { margin-bottom: var(--spacing-md); }
.mb-4 { margin-bottom: var(--spacing-lg); }

/* Footer */
.main-footer {
    background-color: var(--secondary-color);
    color: white;
    text-align: center;
    padding: var(--spacing-xl) 0;
    margin-top: var(--spacing-2xl);
}
`;

    const explanation = `Generated modern CSS with CSS custom properties, ${responsive ? 'responsive design, ' : ''}` +
                       `${colorScheme} color scheme, and accessibility features based on: "${requirements}"`;

    suggestions.push('Consider using CSS animations for enhanced user experience');
    suggestions.push('Add focus states for better keyboard navigation');

    return {
      css,
      explanation,
      suggestions,
    };
  },
});

// JavaScript代码生成工具
export const generateJavaScriptTool = createTool({
  id: 'generate-javascript',
  description: 'Generate JavaScript code with modern ES6+ features, event handling, and interactive functionality.',
  inputSchema: z.object({
    requirements: z.string().describe('JavaScript functionality requirements'),
    features: z.array(z.string()).default([]).describe('Specific features to implement'),
    vanilla: z.boolean().default(true).describe('Use vanilla JavaScript (no frameworks)'),
    includeValidation: z.boolean().default(true).describe('Include form validation if applicable'),
  }),
  outputSchema: z.object({
    javascript: z.string(),
    explanation: z.string(),
    suggestions: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const { requirements, features, vanilla, includeValidation } = context;
    
    let javascript = '';
    const suggestions: string[] = [];

    javascript += `// Generated JavaScript based on: ${requirements}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main App Initialization
function initializeApp() {
    console.log('App initialized successfully!');
    
`;

    // 表单处理
    if (requirements.toLowerCase().includes('form') || features.includes('form')) {
      javascript += `    // Form Handling
    initializeFormHandling();
`;
      
      if (includeValidation) {
        javascript += `    setupFormValidation();
`;
      }
    }

    // 导航功能
    if (requirements.toLowerCase().includes('navigation') || features.includes('navigation')) {
      javascript += `    // Navigation Handling
    initializeNavigation();
`;
    }

    // 交互功能
    if (requirements.toLowerCase().includes('interactive') || features.includes('interactive')) {
      javascript += `    // Interactive Elements
    initializeInteractiveElements();
`;
    }

    // 动画功能
    if (requirements.toLowerCase().includes('animation') || features.includes('animation')) {
      javascript += `    // Animations
    initializeAnimations();
`;
    }

    javascript += `}

`;

    // 表单处理函数
    if (requirements.toLowerCase().includes('form') || features.includes('form')) {
      javascript += `// Form Handling Functions
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData);
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Form submitted:', formObject);
        showSuccessMessage('Message sent successfully!');
        event.target.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage('Failed to send message. Please try again.');
        
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

`;

      if (includeValidation) {
        javascript += `// Form Validation
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidationError);
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing error
    clearValidationError(event);
    
    // Validation rules
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = \`\${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required\`;
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    } else if (fieldName === 'name' && value && value.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters long';
    } else if (fieldName === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearValidationError(event) {
    const field = event.target;
    const errorElement = field.parentNode.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    field.classList.remove('error');
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.display = 'block';
    
    field.parentNode.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
}

`;
      }
    }

    // 导航功能
    if (requirements.toLowerCase().includes('navigation') || features.includes('navigation')) {
      javascript += `// Navigation Functions
function initializeNavigation() {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === \`#\${currentSection}\`) {
            link.classList.add('active');
        }
    });
}

`;
    }

    // 交互功能
    if (requirements.toLowerCase().includes('interactive') || features.includes('interactive')) {
      javascript += `// Interactive Elements
function initializeInteractiveElements() {
    // Button hover effects
    const buttons = document.querySelectorAll('button, .btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Gallery lightbox effect (if gallery exists)
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
    });
}

function openLightbox(imageSrc, imageAlt) {
    // Create lightbox overlay
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.style.cssText = \`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        cursor: pointer;
    \`;
    
    // Create image element
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = imageAlt;
    img.style.cssText = \`
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 8px;
    \`;
    
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    
    // Close on click
    overlay.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    // Close on escape key
    document.addEventListener('keydown', function closeLightbox(event) {
        if (event.key === 'Escape') {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            document.removeEventListener('keydown', closeLightbox);
        }
    });
}

`;
    }

    // 动画功能
    if (requirements.toLowerCase().includes('animation') || features.includes('animation')) {
      javascript += `// Animation Functions
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('section, .gallery-item, .form-group');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add CSS class for animations
const style = document.createElement('style');
style.textContent = \`
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
\`;
document.head.appendChild(style);

`;
    }

    // 工具函数
    javascript += `// Utility Functions
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = \`message-toast message-\${type}\`;
    messageEl.textContent = message;
    
    messageEl.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: \${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font-size: 0.875rem;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    \`;
    
    document.body.appendChild(messageEl);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(messageEl)) {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(messageEl)) {
                    document.body.removeChild(messageEl);
                }
            }, 300);
        }
    }, 3000);
}

// Add keyframe animations
const animationStyle = document.createElement('style');
animationStyle.textContent = \`
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
\`;
document.head.appendChild(animationStyle);

// Performance optimization: Debounce function
function debounce(func, wait) {
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Dark mode toggle (if needed)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Initialize dark mode from localStorage
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
`;

    const explanation = `Generated modern JavaScript with ES6+ features including: ${features.length > 0 ? features.join(', ') : 'DOM manipulation, event handling, and interactive functionality'}. ` +
                       `${includeValidation ? 'Includes form validation and ' : ''}Uses ${vanilla ? 'vanilla JavaScript' : 'framework-based'} approach.`;

    suggestions.push('Consider adding error handling and loading states for better UX');
    suggestions.push('Add localStorage for user preferences persistence');
    suggestions.push('Implement lazy loading for better performance');

    return {
      javascript,
      explanation,
      suggestions,
    };
  },
});

// 文件创建工具
export const createProjectTool = createTool({
  id: 'create-project',
  description: 'Create a complete web project structure with HTML, CSS, and JavaScript files.',
  inputSchema: z.object({
    projectName: z.string().describe('Name of the project directory'),
    htmlContent: z.string().describe('HTML content to write'),
    cssContent: z.string().describe('CSS content to write'),
    jsContent: z.string().describe('JavaScript content to write'),
    outputPath: z.string().default('./generated-projects').describe('Base path for project creation'),
  }),
  outputSchema: z.object({
    projectPath: z.string(),
    files: z.array(z.string()),
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const { projectName, htmlContent, cssContent, jsContent, outputPath } = context;
    
    try {
      // 创建项目目录
      const projectPath = join(outputPath, projectName);
      
      if (!existsSync(outputPath)) {
        mkdirSync(outputPath, { recursive: true });
      }
      
      if (!existsSync(projectPath)) {
        mkdirSync(projectPath, { recursive: true });
      }

      const files: string[] = [];

      // 创建HTML文件
      const htmlFile = join(projectPath, 'index.html');
      writeFileSync(htmlFile, htmlContent, 'utf8');
      files.push('index.html');

      // 创建CSS文件
      const cssFile = join(projectPath, 'styles.css');
      writeFileSync(cssFile, cssContent, 'utf8');
      files.push('styles.css');

      // 创建JavaScript文件
      const jsFile = join(projectPath, 'script.js');
      writeFileSync(jsFile, jsContent, 'utf8');
      files.push('script.js');

      // 创建README文件
      const readmeContent = `# ${projectName}

A web project generated by Mastra Code Generation Agent.

## Files
- \`index.html\` - Main HTML file
- \`styles.css\` - CSS styles
- \`script.js\` - JavaScript functionality

## How to use
1. Open \`index.html\` in your web browser
2. Or serve the files using a local web server for better performance

## Features
- Responsive design
- Modern CSS with custom properties
- Vanilla JavaScript with ES6+ features
- Accessibility considerations

Generated on: ${new Date().toISOString()}
`;

      const readmeFile = join(projectPath, 'README.md');
      writeFileSync(readmeFile, readmeContent, 'utf8');
      files.push('README.md');

      return {
        projectPath,
        files,
        success: true,
        message: `Project "${projectName}" created successfully at ${projectPath}`,
      };

    } catch (error) {
      return {
        projectPath: '',
        files: [],
        success: false,
        message: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});

// 代码分析和优化工具
export const analyzeCodeTool = createTool({
  id: 'analyze-code',
  description: 'Analyze existing code and provide optimization suggestions and improvements.',
  inputSchema: z.object({
    code: z.string().describe('Code to analyze'),
    codeType: z.enum(['html', 'css', 'javascript']).describe('Type of code'),
    focusAreas: z.array(z.string()).default([]).describe('Specific areas to focus on (performance, accessibility, SEO, etc.)'),
  }),
  outputSchema: z.object({
    analysis: z.string(),
    suggestions: z.array(z.object({
      category: z.string(),
      priority: z.enum(['low', 'medium', 'high']),
      description: z.string(),
      example: z.string().optional(),
    })),
    score: z.number().min(0).max(100),
  }),
  execute: async ({ context }) => {
    const { code, codeType, focusAreas } = context;
    
    const suggestions: Array<{
      category: string;
      priority: 'low' | 'medium' | 'high';
      description: string;
      example?: string;
    }> = [];
    
    let score = 100;
    let analysis = '';

    if (codeType === 'html') {
      analysis += 'HTML Analysis Results:\n';
      
      // Check for semantic HTML
      if (!code.includes('<main>') && !code.includes('<section>') && !code.includes('<article>')) {
        suggestions.push({
          category: 'Accessibility',
          priority: 'high',
          description: 'Use semantic HTML elements for better structure and accessibility',
          example: 'Replace <div> with <main>, <section>, <article>, <nav>, <header>, <footer>'
        });
        score -= 15;
      }

      // Check for alt attributes
      if (code.includes('<img') && !code.includes('alt=')) {
        suggestions.push({
          category: 'Accessibility',
          priority: 'high',
          description: 'Add alt attributes to all images for screen readers',
          example: '<img src="image.jpg" alt="Descriptive text">'
        });
        score -= 10;
      }

      // Check for viewport meta tag
      if (!code.includes('viewport')) {
        suggestions.push({
          category: 'Responsive',
          priority: 'medium',
          description: 'Add viewport meta tag for responsive design',
          example: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
        });
        score -= 10;
      }

      // Check for lang attribute
      if (!code.includes('lang=')) {
        suggestions.push({
          category: 'Accessibility',
          priority: 'medium',
          description: 'Add lang attribute to html element',
          example: '<html lang="en">'
        });
        score -= 5;
      }

      analysis += `Structure: ${code.includes('<main>') ? 'Good semantic structure' : 'Could benefit from semantic elements'}\n`;
      analysis += `Accessibility: ${code.includes('alt=') ? 'Images have alt text' : 'Missing alt attributes'}\n`;
      
    } else if (codeType === 'css') {
      analysis += 'CSS Analysis Results:\n';
      
      // Check for CSS custom properties
      if (!code.includes('--') && !code.includes('var(')) {
        suggestions.push({
          category: 'Maintainability',
          priority: 'medium',
          description: 'Use CSS custom properties for better maintainability',
          example: ':root { --primary-color: #3b82f6; } .element { color: var(--primary-color); }'
        });
        score -= 10;
      }

      // Check for responsive design
      if (!code.includes('@media')) {
        suggestions.push({
          category: 'Responsive',
          priority: 'high',
          description: 'Add media queries for responsive design',
          example: '@media (max-width: 768px) { /* mobile styles */ }'
        });
        score -= 15;
      }

      // Check for focus states
      if (!code.includes(':focus')) {
        suggestions.push({
          category: 'Accessibility',
          priority: 'medium',
          description: 'Add focus states for keyboard navigation',
          example: 'button:focus { outline: 2px solid #3b82f6; }'
        });
        score -= 8;
      }

      // Check for modern layout methods
      if (!code.includes('flexbox') && !code.includes('grid') && !code.includes('display: flex') && !code.includes('display: grid')) {
        suggestions.push({
          category: 'Performance',
          priority: 'medium',
          description: 'Consider using modern layout methods like Flexbox or Grid',
          example: '.container { display: flex; justify-content: center; }'
        });
        score -= 8;
      }

      analysis += `Maintainability: ${code.includes('--') ? 'Uses CSS custom properties' : 'Could benefit from CSS variables'}\n`;
      analysis += `Responsive: ${code.includes('@media') ? 'Has responsive design' : 'Missing media queries'}\n`;
      
    } else if (codeType === 'javascript') {
      analysis += 'JavaScript Analysis Results:\n';
      
      // Check for modern ES6+ features
      if (!code.includes('const ') && !code.includes('let ')) {
        suggestions.push({
          category: 'Code Quality',
          priority: 'medium',
          description: 'Use const/let instead of var for better scoping',
          example: 'const element = document.getElementById("myId");'
        });
        score -= 10;
      }

      // Check for error handling
      if (!code.includes('try') && !code.includes('catch')) {
        suggestions.push({
          category: 'Error Handling',
          priority: 'high',
          description: 'Add error handling for better user experience',
          example: 'try { /* code */ } catch (error) { console.error(error); }'
        });
        score -= 15;
      }

      // Check for event delegation
      if (code.includes('addEventListener') && !code.includes('event.target')) {
        suggestions.push({
          category: 'Performance',
          priority: 'medium',
          description: 'Consider using event delegation for better performance',
          example: 'document.addEventListener("click", (e) => { if (e.target.matches(".button")) { /* handle */ } });'
        });
        score -= 8;
      }

      // Check for accessibility
      if (!code.includes('aria-') && !code.includes('role=')) {
        suggestions.push({
          category: 'Accessibility',
          priority: 'medium',
          description: 'Add ARIA attributes for better accessibility',
          example: 'element.setAttribute("aria-expanded", "true");'
        });
        score -= 8;
      }

      analysis += `Modern syntax: ${code.includes('const') || code.includes('let') ? 'Uses modern variable declarations' : 'Consider upgrading to ES6+'}\n`;
      analysis += `Error handling: ${code.includes('try') ? 'Has error handling' : 'Missing error handling'}\n`;
    }

    // Focus area specific suggestions
    if (focusAreas.includes('performance')) {
      suggestions.push({
        category: 'Performance',
        priority: 'medium',
        description: 'Consider lazy loading images and code splitting for better performance',
        example: '<img loading="lazy" src="image.jpg" alt="Description">'
      });
    }

    if (focusAreas.includes('seo')) {
      suggestions.push({
        category: 'SEO',
        priority: 'medium',
        description: 'Add meta descriptions and structured data for better SEO',
        example: '<meta name="description" content="Page description">'
      });
    }

    analysis += `\nOverall Score: ${score}/100\n`;
    analysis += `Code Quality: ${score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Improvement'}`;

    return {
      analysis,
      suggestions,
      score: Math.max(0, score),
    };
  },
}); 