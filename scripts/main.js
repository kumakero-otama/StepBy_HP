(function () {
  const config = window.StepBySiteConfig;
  const header = document.querySelector(".site-header");
  const versionElement = document.querySelector("[data-site-version]");
  const pressArea = document.querySelector(".site-header__press-area");
  const backToTopButton = document.querySelector(".back-to-top");
  const dropdowns = document.querySelectorAll("[data-dropdown]");

  if (!config || !config.links) {
    return;
  }

  document.querySelectorAll("[data-app-link]").forEach((element) => {
    const linkKey = element.getAttribute("data-app-link");
    const href = config.links[linkKey];

    if (href) {
      element.setAttribute("href", href);
    }
  });

  if (versionElement && config.version) {
    versionElement.textContent = config.version;
  }

  if (!header || !pressArea) {
    return;
  }

  const showVersion = () => {
    if (config.version) {
      header.classList.add("site-header--show-version");
      versionElement?.setAttribute("aria-hidden", "false");
    }
  };

  const hideVersion = () => {
    header.classList.remove("site-header--show-version");
    versionElement?.setAttribute("aria-hidden", "true");
  };

  ["mousedown", "touchstart", "pointerdown"].forEach((eventName) => {
    pressArea.addEventListener(eventName, showVersion);
  });

  ["mouseup", "mouseleave", "touchend", "touchcancel", "pointerup", "pointercancel"].forEach((eventName) => {
    pressArea.addEventListener(eventName, hideVersion);
  });

  backToTopButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  const closeDropdowns = (except) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown !== except) {
        dropdown.classList.remove("is-open");
        dropdown.querySelector(".header-dropdown__trigger")?.setAttribute("aria-expanded", "false");
      }
    });
  };

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(".header-dropdown__trigger");

    trigger?.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !dropdown.classList.contains("is-open");

      closeDropdowns(dropdown);
      dropdown.classList.toggle("is-open", willOpen);
      trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  document.addEventListener("click", () => {
    closeDropdowns();
  });
})();

(function () {
  const carousel = document.querySelector("[data-howto-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-howto-track]");
  const slides = Array.from(track.querySelectorAll(".howto-slide"));
  const prevButton = carousel.querySelector("[data-howto-prev]");
  const nextButton = carousel.querySelector("[data-howto-next]");
  const dots = Array.from(carousel.querySelectorAll(".howto-carousel__dot"));

  let currentIndex = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === currentIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  }

  prevButton.addEventListener("click", function () {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  nextButton.addEventListener("click", function () {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      currentIndex = index;
      updateCarousel();
    });
  });

  updateCarousel();
})();