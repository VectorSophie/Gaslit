(function () {
  function scrambleWord(word) {
    if (word.length <= 3) return word;
    const chars = word.split('');
    const middle = chars.slice(1, -1);
    for (let i = middle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [middle[i], middle[j]] = [middle[j], middle[i]];
    }
    return chars[0] + middle.join('') + chars[chars.length - 1];
  }

  function glitchText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.nodeValue.split(/\b/);
      node.nodeValue = words.map(word => {
        if (/\w{4,}/.test(word) && Math.random() < 0.1) {
          return scrambleWord(word);
        }
        return word;
      }).join('');
    } else {
      node.childNodes.forEach(child => glitchText(child));
    }
  }

  function tagGlitchElements() {
    document.querySelectorAll("div, p, button, img, h1, h2, h3, span, a").forEach(el => {
      if (Math.random() < 0.3) {
        el.classList.add("glitchy");
      }
    });
  }

  let shakeHasRun = false;

  function shakeGlitchyElementsOnce() {
    if (shakeHasRun) return;
    shakeHasRun = true;

    const elements = document.querySelectorAll('.glitchy');
    elements.forEach(el => {
      el.style.transition = 'transform 1.5s ease-in-out';
      el.style.transform = `rotate(${(Math.random() * 1 - 0.5).toFixed(2)}deg)
                            translate(${(Math.random() * 2 - 1).toFixed(2)}px, ${(Math.random() * 2 - 1).toFixed(2)}px)`;
    });

    setTimeout(() => {
      elements.forEach(el => {
        el.style.transform = '';
      });
    }, 2000);
  }

  function glitchImages() {
    document.querySelectorAll("img").forEach(img => {
      if (!img.complete) {
        const originalSrc = img.src;
        const glitchPlaceholder =
          "data:image/svg+xml;base64," +
          btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                  <filter id="glitch">
                    <feTurbulence type="turbulence" baseFrequency="0.5" numOctaves="5" stitchTiles="stitch"/>
                    <feColorMatrix type="matrix"
                      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
                  </filter>
                  <rect width="100%" height="100%" filter="url(#glitch)" fill="black"/>
                </svg>`);

        img.src = glitchPlaceholder;
        const delay = Math.random() * 2000 + 500;
        setTimeout(() => {
          img.src = originalSrc;
        }, delay);
      }
    });
  }

  document.body.addEventListener('click', function (event) {
    const target = event.target;
    if (target.classList.contains('glitchy')) {
      event.preventDefault();
      event.stopPropagation();

      if (target.tagName === 'A' && target.href) {
        setTimeout(() => {
          window.location.href = target.href;
        }, 500);
      } else {
        setTimeout(() => {
          target.click();
        }, 500);
      }
    }
  }, true);

  function startGlitch() {
    glitchText(document.body);
    tagGlitchElements();
    glitchImages();

    setInterval(() => glitchText(document.body), 3000);
    setTimeout(shakeGlitchyElementsOnce, Math.random() * 4000 + 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", startGlitch);
  } else {
    startGlitch();
  }
})();
