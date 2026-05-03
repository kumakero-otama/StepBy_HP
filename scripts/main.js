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

(function () {
  const config = window.StepBySiteConfig || {};
  const rankingList = document.querySelector("[data-tactile-ranking-list]");

  if (!rankingList) return;

  const rankingDays = 7;
  const rankingLimit = 5;
  const rankingEndpoint = config.api?.tactileRanking || "/api/tactile-ranking";

  function buildRankingUrl() {
    const url = new URL(rankingEndpoint, window.location.href);
    url.searchParams.set("days", String(rankingDays));
    url.searchParams.set("limit", String(rankingLimit));
    return url;
  }

  function getFirstValue(sources, keys) {
    for (const source of sources) {
      if (!source || typeof source !== "object") continue;

      for (const key of keys) {
        const value = source[key];

        if (value !== undefined && value !== null && value !== "") {
          return value;
        }
      }
    }

    return "";
  }

  function toNumber(value) {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }

    if (typeof value === "string") {
      const parsed = Number.parseFloat(value.replace(/,/g, ""));
      return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
  }

  function formatDistance(meters) {
    if (meters >= 1000) {
      return `${(meters / 1000).toLocaleString("ja-JP", {
        maximumFractionDigits: 1
      })} km`;
    }

    return `${Math.round(meters).toLocaleString("ja-JP")} m`;
  }

  function getInitial(name) {
    return String(name).trim().charAt(0).toUpperCase() || "?";
  }

  function extractRankingEntries(data) {
    const candidates = [
      data,
      data?.ranking,
      data?.rankings,
      data?.items,
      data?.records,
      data?.rows,
      data?.results,
      data?.users,
      data?.data,
      data?.data?.ranking,
      data?.data?.rankings,
      data?.data?.items,
      data?.data?.records,
      data?.data?.rows,
      data?.data?.results,
      data?.data?.users,
      data?.ranking?.items,
      data?.ranking?.records,
      data?.ranking?.rows
    ];

    return candidates.find(Array.isArray) || [];
  }

  function setRankingMessage(message) {
    const item = document.createElement("li");
    item.className = "tactile-ranking__message";
    item.textContent = message;
    rankingList.replaceChildren(item);
  }

  function createAvatar(iconUrl, userName) {
    const avatar = document.createElement("span");
    avatar.className = "tactile-ranking__avatar";

    const fallback = document.createElement("span");
    fallback.className = "tactile-ranking__avatar-fallback";
    fallback.textContent = getInitial(userName);

    if (iconUrl) {
      const image = document.createElement("img");
      image.src = iconUrl;
      image.alt = `${userName}のアイコン`;
      image.loading = "lazy";
      image.referrerPolicy = "no-referrer";
      fallback.hidden = true;

      image.addEventListener("error", () => {
        image.remove();
        fallback.hidden = false;
      });

      avatar.append(image, fallback);
      return avatar;
    }

    avatar.append(fallback);
    return avatar;
  }

  function createRankingItem(entry, index) {
    const user = entry?.user || entry?.profile || {};
    const sources = [entry, user];
    const rawRank = getFirstValue(sources, ["rank", "ranking", "position"]);
    const rank = toNumber(rawRank) || index + 1;
    const userName =
      getFirstValue(sources, [
        "user_name",
        "userName",
        "username",
        "display_name",
        "displayName",
        "name",
        "nickname"
      ]) || `ユーザー${index + 1}`;
    const iconUrl = getFirstValue(sources, [
      "icon_url",
      "iconUrl",
      "avatar_url",
      "avatarUrl",
      "user_icon",
      "userIcon",
      "user_icon_url",
      "userIconUrl",
      "icon",
      "profile_image_url",
      "profileImageUrl",
      "image_url",
      "imageUrl",
      "photo_url",
      "photoUrl"
    ]);
    const distanceMeters = toNumber(
      getFirstValue(sources, [
        "total_distance_m",
        "totalDistanceM",
        "total_distance_meters",
        "totalDistanceMeters",
        "recorded_distance_m",
        "recordedDistanceM",
        "recorded_distance_meters",
        "recordedDistanceMeters",
        "distance_m",
        "distanceM",
        "distance_meters",
        "distanceMeters",
        "total_meters",
        "totalMeters",
        "total_length_m",
        "totalLengthM",
        "meters",
        "distance",
        "total_distance",
        "totalDistance"
      ])
    );

    const item = document.createElement("li");
    item.className = "tactile-ranking__item";

    const rankElement = document.createElement("span");
    rankElement.className = "tactile-ranking__rank";
    rankElement.textContent = String(rank);

    const userElement = document.createElement("span");
    userElement.className = "tactile-ranking__user";

    const nameElement = document.createElement("span");
    nameElement.className = "tactile-ranking__name";
    nameElement.textContent = userName;

    const periodElement = document.createElement("span");
    periodElement.className = "tactile-ranking__period";
    periodElement.textContent = "点字ブロック記録距離";

    const distanceElement = document.createElement("span");
    distanceElement.className = "tactile-ranking__distance";
    distanceElement.textContent = formatDistance(distanceMeters);

    userElement.append(nameElement, periodElement);
    item.append(rankElement, createAvatar(iconUrl, userName), userElement, distanceElement);

    return item;
  }

  async function loadRanking() {
    rankingList.setAttribute("aria-busy", "true");

    try {
      const response = await fetch(buildRankingUrl(), {
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Ranking API responded with ${response.status}`);
      }

      const data = await response.json();
      const entries = extractRankingEntries(data).slice(0, rankingLimit);

      if (entries.length === 0) {
        setRankingMessage("過去7日間の記録はまだありません。");
        return;
      }

      rankingList.replaceChildren(...entries.map(createRankingItem));
    } catch (error) {
      console.error("Failed to load tactile ranking", error);
      setRankingMessage("ランキングを取得できませんでした。時間をおいて再度お試しください。");
    } finally {
      rankingList.setAttribute("aria-busy", "false");
    }
  }

  loadRanking();
})();
