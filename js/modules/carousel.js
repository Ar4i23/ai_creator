export function initCarousel() {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const cards = [...root.querySelectorAll(".format-card")];
  /* Каждая карточка знает свою картинку — для отражения */
  cards.forEach((card) => {
    const img = card.querySelector("img");
    if (img) card.style.setProperty("--img", `url("${img.src}")`);
  });
  const dotsBox = document.querySelector(".carousel__dots");
  const n = cards.length;
  let active = 0;
  let timer = null;

  /* Точки */
  const dots = cards.map((_, i) => {
    const b = document.createElement("button");
    b.className = "carousel__dot";
    b.type = "button";
    b.setAttribute("aria-label", `Формат ${i + 1}`);
    b.addEventListener("click", () => {
      go(i);
      restart();
    });
    dotsBox.appendChild(b);
    return b;
  });

  function render() {
    cards.forEach((card, i) => {
      let rel = (i - active) % n;
      if (rel > n / 2) rel -= n;
      if (rel < -n / 2) rel += n;

      const old = Number(card.dataset.pos || 0);

      if (Math.abs(rel - old) > 1) {
        /* Прыжок через шов: мгновенно, без анимации через центр */
        card.style.transition = "none";
        card.dataset.pos = rel;
        void card.offsetWidth; // принудительный reflow
        card.style.transition = ""; // возвращаем плавность
      } else {
        card.dataset.pos = rel; // обычный шаг — плавно
      }
    });
    dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
  }

  const next = () => {
    active = (active + 1) % n;
    render();
  };
  const prev = () => {
    active = (active - 1 + n) % n;
    render();
  };
  const go = (i) => {
    active = i;
    render();
  };

  const start = () => {
    stop();
    timer = setInterval(next, 3000);
  };
  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };
  const restart = () => start();

  root.querySelector(".carousel__arrow--next").addEventListener("click", () => {
    next();
    restart();
  });
  root.querySelector(".carousel__arrow--prev").addEventListener("click", () => {
    prev();
    restart();
  });

  /* При первом появлении: один полный оборот, потом авто 3с */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        let step = 0;
        const spin = setInterval(() => {
          next();
          step += 1;
          if (step >= n) {
            clearInterval(spin);
            start();
          }
        }, 180);
      });
    },
    { threshold: 0.4 },
  );
  io.observe(root);

  render();
}
