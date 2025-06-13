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

function glitchImages() {
  document.querySelectorAll("img").forEach(img => {
    // Only glitch if not already loaded
    if (!img.complete) {
      const originalSrc = img.src;
      const glitchPlaceholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxmaWx0ZXIgaWQ9ImdsaXRjaCI+CjxmZVR1cmJ1bGVuY2UgdHlwZT0idHVyYnVsZW5jZSIgYmFzZUZyZXF1ZW5jeT0wLjUiIG51bU9jdGF2ZXM9IjUiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAgMCAwIDAgMCAwICAwIDAgMCAwIDAgMCAwIDAgMCAtMSAwIi8+CjwvZmlsdGVyPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjZ2xpdGNoKSIgLz4KPC9zdmc+"; // Glitchy placeholder SVG

      img.src = glitchPlaceholder;

      const delay = Math.random() * 2000 + 500;

      setTimeout(() => {
        img.src = originalSrc;
      }, delay);
    }
  });
}

function tagGlitchElements() {
  document.querySelectorAll("div, p, button, img, h1, h2, h3, span, a").forEach(el => {
    if (Math.random() < 0.2) {
      el.classList.add("glitchy");
    } else {
      el.classList.remove("glitchy");
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
    el.style.transform = `rotate(${(Math.random() * 0.6 - 0.3).toFixed(2)}deg) translate(${(Math.random() * 1 - 0.5).toFixed(2)}px, ${(Math.random() * 1 - 0.5).toFixed(2)}px)`;
  });

  setTimeout(() => {
    elements.forEach(el => {
      el.style.transform = '';
    });
  }, 2000);
}

document.body.addEventListener('click', function(event) {
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

window.addEventListener("DOMContentLoaded", startGlitch);
