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
  const carousel = document.querySelector("[data-stats-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-stats-track]");
  const slides = Array.from(track.querySelectorAll(".howto-slide"));
  const prevButton = carousel.querySelector("[data-stats-prev]");
  const nextButton = carousel.querySelector("[data-stats-next]");
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
  const statsStatus = document.querySelector("[data-stats-status]");
  const statsDateLabel = document.querySelector("[data-stats-date-label]");
  const trendChart = document.querySelector("[data-stats-trend-chart]");
  const trendStatus = document.querySelector("[data-stats-trend-status]");
  const statsValues = {
    totalTactileLengthMeters: document.querySelector("[data-stats-value='totalTactileLengthMeters']"),
    totalRoadInfoPosts: document.querySelector("[data-stats-value='totalRoadInfoPosts']"),
    totalUsers: document.querySelector("[data-stats-value='totalUsers']")
  };
  const rankingList = document.querySelector("[data-tactile-ranking-list]");
  const periodSelect = document.querySelector("[data-ranking-period]");

  if (!rankingList && !statsStatus && !trendChart) return;

  const defaultRankingDays = 7;
  const rankingLimit = 5;
  const rankingEndpoint = config.api?.tactileRanking || "/api/tactile-ranking";
  const statsEndpoint = config.api?.stats || getSiblingApiEndpoint("/api/stats");
  const recordsEndpoint = config.api?.records || getSiblingApiEndpoint("/api/records");
  const sessionInfoEndpoint = config.api?.tactileSessionInfo || getSiblingApiEndpoint("/api/tactile-session-info");
  let currentRankingDays = defaultRankingDays;
  let rankingRequestId = 0;

  function getRankingUrlBase() {
    return new URL(rankingEndpoint, window.location.href);
  }

  function getSiblingApiEndpoint(path) {
    return new URL(path, getRankingUrlBase().origin).href;
  }

  function buildRankingUrl() {
    return buildApiUrl(rankingEndpoint, {
      days: currentRankingDays,
      limit: rankingLimit
    });
  }

  function buildStatsUrl(date) {
    return buildApiUrl(statsEndpoint, {
      date
    });
  }

  function buildApiUrl(endpoint, params = {}) {
    const url = new URL(endpoint, window.location.href);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });

    return url;
  }

  function resolveApiAssetUrl(value) {
    if (!value) return "";

    try {
      return new URL(value, getRankingUrlBase().origin).href;
    } catch (error) {
      return value;
    }
  }

  function getSelectedRankingDays() {
    const selectedDays = Number.parseInt(periodSelect?.value, 10);
    return Number.isFinite(selectedDays) && selectedDays > 0 ? selectedDays : defaultRankingDays;
  }

  function getSelectedPeriodLabel() {
    return periodSelect?.selectedOptions?.[0]?.textContent?.trim() || `${currentRankingDays}日間`;
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

  function formatCount(value, unit) {
    return `${Math.round(toNumber(value)).toLocaleString("ja-JP")}${unit}`;
  }

  function formatDateParam(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getTodayDateParam() {
    return formatDateParam(new Date());
  }

  function getPastWeekDateParams() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return formatDateParam(date);
    });
  }

  function formatDateLabel(dateParam) {
    const parts = String(dateParam).split("-").map((part) => Number.parseInt(part, 10));

    if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
      return dateParam;
    }

    return `${parts[0]}/${parts[1]}/${parts[2]}`;
  }

  function formatShortDateLabel(dateParam) {
    const parts = String(dateParam).split("-").map((part) => Number.parseInt(part, 10));

    if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
      return dateParam;
    }

    return `${parts[1]}/${parts[2]}`;
  }

  function formatAxisDistance(meters) {
    if (meters >= 1000) {
      return `${(meters / 1000).toLocaleString("ja-JP", {
        maximumFractionDigits: meters >= 10000 ? 0 : 1
      })}km`;
    }

    return `${Math.round(meters).toLocaleString("ja-JP")}m`;
  }

  function formatMonthDayLabel(dateParam) {
    const parts = String(dateParam).split("-").map((part) => Number.parseInt(part, 10));

    if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
      return dateParam;
    }

    return `${parts[1]}月${parts[2]}日`;
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

  function extractRecordEntries(data) {
    const candidates = [
      data,
      data?.paths,
      data?.records,
      data?.items,
      data?.results,
      data?.data,
      data?.data?.paths,
      data?.data?.records,
      data?.data?.items,
      data?.data?.results
    ];

    return candidates.find(Array.isArray) || [];
  }

  function getRecordGeometry(record) {
    const rawGeometry = getFirstValue(
      [record],
      ["geom_geojson", "geomGeojson", "geometry", "geojson", "path", "line"]
    );

    if (!rawGeometry) return null;

    if (typeof rawGeometry === "object") {
      return rawGeometry;
    }

    try {
      return JSON.parse(rawGeometry);
    } catch (error) {
      console.error("Failed to parse tactile record geometry", error);
      return null;
    }
  }

  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  function getCoordinateDistanceMeters(first, second) {
    const firstLongitude = toNumber(first?.[0]);
    const firstLatitude = toNumber(first?.[1]);
    const secondLongitude = toNumber(second?.[0]);
    const secondLatitude = toNumber(second?.[1]);

    if (
      !Number.isFinite(firstLongitude) ||
      !Number.isFinite(firstLatitude) ||
      !Number.isFinite(secondLongitude) ||
      !Number.isFinite(secondLatitude)
    ) {
      return 0;
    }

    const earthRadiusMeters = 6371008.8;
    const latitudeDelta = toRadians(secondLatitude - firstLatitude);
    const longitudeDelta = toRadians(secondLongitude - firstLongitude);
    const firstLatitudeRadians = toRadians(firstLatitude);
    const secondLatitudeRadians = toRadians(secondLatitude);
    const haversine =
      Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(firstLatitudeRadians) *
        Math.cos(secondLatitudeRadians) *
        Math.sin(longitudeDelta / 2) ** 2;

    return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  }

  function getLineDistanceMeters(coordinates) {
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return 0;
    }

    return coordinates.reduce((total, coordinate, index) => {
      if (index === 0) return 0;
      return total + getCoordinateDistanceMeters(coordinates[index - 1], coordinate);
    }, 0);
  }

  function getGeometryDistanceMeters(geometry) {
    if (!geometry || typeof geometry !== "object") return 0;

    if (geometry.type === "Feature") {
      return getGeometryDistanceMeters(geometry.geometry);
    }

    if (geometry.type === "LineString") {
      return getLineDistanceMeters(geometry.coordinates);
    }

    if (geometry.type === "MultiLineString" && Array.isArray(geometry.coordinates)) {
      return geometry.coordinates.reduce((total, coordinates) => {
        return total + getLineDistanceMeters(coordinates);
      }, 0);
    }

    if (geometry.type === "GeometryCollection" && Array.isArray(geometry.geometries)) {
      return geometry.geometries.reduce((total, childGeometry) => {
        return total + getGeometryDistanceMeters(childGeometry);
      }, 0);
    }

    return 0;
  }

  function getRecordDistanceMeters(record) {
    const providedDistance = toNumber(
      getFirstValue(
        [record],
        [
          "distance_m",
          "distanceM",
          "distance_meters",
          "distanceMeters",
          "meters",
          "length_m",
          "lengthM"
        ]
      )
    );

    if (providedDistance > 0) {
      return providedDistance;
    }

    return getGeometryDistanceMeters(getRecordGeometry(record));
  }

  function setRankingMessage(message, detail = "") {
    const item = document.createElement("li");
    item.className = "tactile-ranking__message";

    const messageElement = document.createElement("span");
    messageElement.className = "tactile-ranking__message-text";
    messageElement.textContent = message;
    item.append(messageElement);

    if (detail) {
      const detailElement = document.createElement("span");
      detailElement.className = "tactile-ranking__message-detail";
      detailElement.textContent = `詳細: ${detail}`;
      item.append(detailElement);
    }

    rankingList.replaceChildren(item);
  }

  async function getResponseErrorDetail(response) {
    const statusDetail = `${response.status} ${response.statusText}`.trim();

    try {
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await response.json();
        const apiMessage = getFirstValue(
          [data, data?.error],
          ["message", "detail", "error", "code", "status", "type"]
        );

        return apiMessage ? `${statusDetail} / ${apiMessage}` : statusDetail;
      }

      if (contentType.includes("text/html")) {
        return `${statusDetail} / HTMLのエラーページが返されました。APIのURLを確認してください。`;
      }

      const text = (await response.text()).replace(/\s+/g, " ").trim();

      if (text) {
        return `${statusDetail} / ${text.slice(0, 160)}`;
      }
    } catch (error) {
      console.error("Failed to read tactile ranking error response", error);
    }

    return statusDetail;
  }

  async function fetchJson(url) {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      const detail = await getResponseErrorDetail(response);
      const error = new Error(`API responded with ${detail}`);
      error.detail = detail;
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  function setStatsStatus(message, detail = "") {
    if (!statsStatus) return;

    statsStatus.textContent = detail ? `${message} 詳細: ${detail}` : message;
  }

  function setTrendStatus(message, detail = "") {
    if (!trendStatus) return;

    trendStatus.textContent = detail ? `${message} 詳細: ${detail}` : message;
  }

  function setStatsValue(key, value) {
    const element = statsValues[key];

    if (element) {
      element.textContent = value;
    }
  }

  function parseStatsData(data) {
    const sources = [data, data?.stats, data?.data, data?.data?.stats];

    return {
      totalTactileLengthMeters: toNumber(
        getFirstValue(sources, [
          "totalTactileLengthMeters",
          "total_tactile_length_meters",
          "totalTactileDistanceMeters",
          "total_tactile_distance_meters",
          "totalTactileLength",
          "total_tactile_length"
        ])
      ),
      totalRoadInfoPosts: toNumber(
        getFirstValue(sources, [
          "totalRoadInfoPosts",
          "total_road_info_posts",
          "totalRoadPosts",
          "total_road_posts",
          "roadInfoPosts",
          "road_info_posts",
          "roadInfoCount",
          "road_info_count"
        ])
      ),
      totalUsers: toNumber(
        getFirstValue(sources, [
          "totalUsers",
          "total_users",
          "userCount",
          "user_count",
          "activeUsers",
          "active_users"
        ])
      )
    };
  }

  function setTrendMessage(message) {
    if (!trendChart) return;

    const messageElement = document.createElement("p");
    messageElement.className = "stats-trend__message";
    messageElement.textContent = message;
    trendChart.replaceChildren(messageElement);
  }

  function createSvgElement(name, attributes = {}) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", name);

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });

    return element;
  }

  function renderStatsTrend(points) {
    if (!trendChart) return;

    if (points.length === 0) {
      setTrendMessage("表示できる推移データがありません。");
      return;
    }

    const width = 640;
    const height = 280;
    const padding = {
      top: 24,
      right: 24,
      bottom: 48,
      left: 78
    };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...points.map((point) => point.value), 1);
    const yMax = maxValue * 1.12;
    const baselineY = padding.top + plotHeight;
    const getX = (index) => {
      if (points.length === 1) {
        return padding.left + plotWidth / 2;
      }

      return padding.left + (plotWidth / (points.length - 1)) * index;
    };
    const getY = (value) => baselineY - (value / yMax) * plotHeight;
    const coordinates = points.map((point, index) => ({
      ...point,
      x: getX(index),
      y: getY(point.value)
    }));
    const linePath = coordinates
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      .join(" ");
    const areaPath = `${linePath} L ${coordinates[coordinates.length - 1].x.toFixed(2)} ${baselineY} L ${coordinates[0].x.toFixed(2)} ${baselineY} Z`;
    let longPressTimer = 0;
    let tooltipGroup;
    const svg = createSvgElement("svg", {
      class: "stats-trend__svg",
      viewBox: `0 0 ${width} ${height}`,
      role: "img",
      "aria-labelledby": "stats-trend-title stats-trend-desc"
    });
    const title = createSvgElement("title", { id: "stats-trend-title" });
    title.textContent = "総点字ブロック記録距離推移";
    const desc = createSvgElement("desc", { id: "stats-trend-desc" });
    desc.textContent = `${formatDateLabel(points[0].date)}から${formatDateLabel(points[points.length - 1].date)}までの総点字ブロック記録距離です。`;

    svg.append(title, desc);

    function hideTooltip() {
      tooltipGroup?.setAttribute("display", "none");
    }

    function clearLongPressTimer() {
      if (longPressTimer) {
        window.clearTimeout(longPressTimer);
        longPressTimer = 0;
      }
    }

    function showTooltip(point) {
      const dateText = formatMonthDayLabel(point.date);
      const distanceText = formatAxisDistance(point.value);
      const tooltipWidth = Math.max(104, Math.max(dateText.length, distanceText.length) * 12 + 28);
      const tooltipHeight = 56;
      const tooltipGap = 16;
      const tooltipX = Math.min(
        Math.max(point.x - tooltipWidth / 2, 8),
        width - tooltipWidth - 8
      );
      const tooltipY =
        point.y - tooltipHeight - tooltipGap < 8
          ? point.y + tooltipGap
          : point.y - tooltipHeight - tooltipGap;
      const rect = createSvgElement("rect", {
        class: "stats-trend__tooltip-box",
        x: tooltipX,
        y: tooltipY,
        width: tooltipWidth,
        height: tooltipHeight,
        rx: 10,
        ry: 10
      });
      const dateLine = createSvgElement("text", {
        class: "stats-trend__tooltip-text",
        x: tooltipX + tooltipWidth / 2,
        y: tooltipY + 22,
        "text-anchor": "middle"
      });
      const distanceLine = createSvgElement("text", {
        class: "stats-trend__tooltip-text stats-trend__tooltip-text--distance",
        x: tooltipX + tooltipWidth / 2,
        y: tooltipY + 42,
        "text-anchor": "middle"
      });

      dateLine.textContent = dateText;
      distanceLine.textContent = distanceText;
      tooltipGroup.replaceChildren(rect, dateLine, distanceLine);
      tooltipGroup.removeAttribute("display");
    }

    function startLongPress(point) {
      clearLongPressTimer();
      hideTooltip();
      longPressTimer = window.setTimeout(() => {
        longPressTimer = 0;
        showTooltip(point);
      }, 520);
    }

    Array.from({ length: 5 }, (_, index) => {
      const value = (yMax / 4) * index;
      const y = baselineY - (value / yMax) * plotHeight;
      const gridLine = createSvgElement("line", {
        class: "stats-trend__grid-line",
        x1: padding.left,
        y1: y,
        x2: width - padding.right,
        y2: y
      });
      const label = createSvgElement("text", {
        class: "stats-trend__axis-label stats-trend__axis-label--y",
        x: padding.left - 12,
        y: y + 5,
        "text-anchor": "end"
      });

      label.textContent = formatAxisDistance(value);
      svg.append(gridLine, label);
    });

    coordinates.forEach((point, index) => {
      const label = createSvgElement("text", {
        class: "stats-trend__axis-label stats-trend__axis-label--x",
        x: point.x,
        y: height - 18,
        "text-anchor": "middle"
      });

      label.textContent = formatShortDateLabel(point.date);
      svg.append(label);

      if (index > 0 && index < coordinates.length - 1) {
        const tick = createSvgElement("line", {
          class: "stats-trend__tick-line",
          x1: point.x,
          y1: padding.top,
          x2: point.x,
          y2: baselineY
        });
        svg.append(tick);
      }
    });

    svg.append(
      createSvgElement("path", {
        class: "stats-trend__area",
        d: areaPath
      }),
      createSvgElement("path", {
        class: "stats-trend__line",
        d: linePath
      })
    );

    coordinates.forEach((point) => {
      const markerGroup = createSvgElement("g", {
        class: "stats-trend__point-target",
        tabindex: "0",
        role: "button",
        "aria-label": `${formatMonthDayLabel(point.date)} ${formatAxisDistance(point.value)}`
      });
      const touchTarget = createSvgElement("circle", {
        class: "stats-trend__point-hit-area",
        cx: point.x,
        cy: point.y,
        r: 18
      });
      const marker = createSvgElement("circle", {
        class: "stats-trend__point",
        cx: point.x,
        cy: point.y,
        r: 5
      });

      markerGroup.append(touchTarget, marker);
      markerGroup.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        startLongPress(point);
      });
      markerGroup.addEventListener("pointerup", clearLongPressTimer);
      markerGroup.addEventListener("pointercancel", clearLongPressTimer);
      markerGroup.addEventListener("pointerleave", clearLongPressTimer);
      markerGroup.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
      markerGroup.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showTooltip(point);
        }
      });
      svg.append(markerGroup);
    });

    tooltipGroup = createSvgElement("g", {
      class: "stats-trend__tooltip",
      display: "none"
    });
    svg.append(tooltipGroup);
    svg.addEventListener("pointerdown", (event) => {
      if (!event.target.closest(".stats-trend__point-target")) {
        clearLongPressTimer();
        hideTooltip();
      }
    });

    trendChart.replaceChildren(svg);
  }

  async function loadStats() {
    if (!statsStatus) return;

    const targetDate = getTodayDateParam();
    setStatsStatus("全体統計を読み込み中です。");

    if (statsDateLabel) {
      statsDateLabel.textContent = `${formatDateLabel(targetDate)}時点の累計`;
    }

    try {
      const data = await fetchJson(buildStatsUrl(targetDate));
      const stats = parseStatsData(data);

      setStatsValue("totalTactileLengthMeters", formatDistance(stats.totalTactileLengthMeters));
      setStatsValue("totalRoadInfoPosts", formatCount(stats.totalRoadInfoPosts, "件"));
      setStatsValue("totalUsers", formatCount(stats.totalUsers, "人"));
      setStatsStatus("");
    } catch (error) {
      console.error("Failed to load site stats", error);
      setStatsValue("totalTactileLengthMeters", "--");
      setStatsValue("totalRoadInfoPosts", "--");
      setStatsValue("totalUsers", "--");
      setStatsStatus(
        "全体統計を取得できませんでした。",
        error.detail || error.message || "不明なエラー"
      );
    }
  }

  async function loadStatsTrend() {
    if (!trendChart) return;

    setTrendMessage("推移を読み込み中です。");
    setTrendStatus("");

    try {
      const dates = getPastWeekDateParams();
      const statsList = await Promise.all(
        dates.map(async (date) => {
          const data = await fetchJson(buildStatsUrl(date));
          const stats = parseStatsData(data);

          return {
            date,
            value: stats.totalTactileLengthMeters
          };
        })
      );
      renderStatsTrend(statsList);
    } catch (error) {
      console.error("Failed to load stats trend", error);
      setTrendMessage("推移を取得できませんでした。");
      setTrendStatus("推移を取得できませんでした。", error.detail || error.message || "不明なエラー");
    }
  }

  async function fetchSessionInfo(sessionId) {
    if (!sessionId) return null;

    try {
      const data = await fetchJson(buildApiUrl(sessionInfoEndpoint, { sessionId }));
      return data?.session || data?.data?.session || null;
    } catch (error) {
      console.error("Failed to load tactile session info", error);
      return null;
    }
  }

  async function loadRankingFromRecords() {
    const data = await fetchJson(buildApiUrl(recordsEndpoint));
    const records = extractRecordEntries(data);
    const cutoffTime = Date.now() - currentRankingDays * 24 * 60 * 60 * 1000;
    const users = new Map();

    records.forEach((record) => {
      const recordedAt = Date.parse(
        getFirstValue([record], ["started_at", "startedAt", "created_at", "createdAt"])
      );

      if (!Number.isFinite(recordedAt) || recordedAt < cutoffTime) {
        return;
      }

      const userId = String(getFirstValue([record], ["user_id", "userId", "userid", "uid"]));
      const sessionId = getFirstValue([record], ["session_id", "sessionId"]);
      const distanceMeters = getRecordDistanceMeters(record);

      if (!userId || distanceMeters <= 0) {
        return;
      }

      const user = users.get(userId) || {
        userId,
        sessionId,
        distanceMeters: 0
      };

      user.distanceMeters += distanceMeters;

      if (!user.sessionId && sessionId) {
        user.sessionId = sessionId;
      }

      users.set(userId, user);
    });

    const topUsers = Array.from(users.values())
      .sort((first, second) => second.distanceMeters - first.distanceMeters)
      .slice(0, rankingLimit);

    const sessionInfos = await Promise.all(
      topUsers.map((user) => fetchSessionInfo(user.sessionId))
    );

    return topUsers.map((user, index) => {
      const sessionInfo = sessionInfos[index] || {};

      return {
        rank: index + 1,
        userId: user.userId,
        username: sessionInfo.username || `ユーザー${user.userId}`,
        iconUrl: sessionInfo.iconUrl || "",
        distanceMeters: user.distanceMeters
      };
    });
  }

  function createAvatar(iconUrl, userName) {
    const avatar = document.createElement("span");
    avatar.className = "tactile-ranking__avatar";

    const fallback = document.createElement("span");
    fallback.className = "tactile-ranking__avatar-fallback";
    fallback.textContent = getInitial(userName);

    if (iconUrl) {
      const image = document.createElement("img");
      image.src = resolveApiAssetUrl(iconUrl);
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
    const requestId = ++rankingRequestId;

    rankingList.setAttribute("aria-busy", "true");
    setRankingMessage(`過去${getSelectedPeriodLabel()}のランキングを読み込み中です。`);

    try {
      let entries = [];

      try {
        const data = await fetchJson(buildRankingUrl());
        entries = extractRankingEntries(data).slice(0, rankingLimit);
      } catch (error) {
        if (error.status !== 404) {
          throw error;
        }

        console.warn("Tactile ranking API was not found. Falling back to records API.", error);
        entries = await loadRankingFromRecords();
      }

      if (requestId !== rankingRequestId) {
        return;
      }

      if (entries.length === 0) {
        setRankingMessage(`過去${getSelectedPeriodLabel()}の記録はまだありません。`);
        return;
      }

      rankingList.replaceChildren(...entries.map(createRankingItem));
    } catch (error) {
      if (requestId !== rankingRequestId) {
        return;
      }

      console.error("Failed to load tactile ranking", error);
      setRankingMessage(
        "ランキングを取得できませんでした。",
        error.detail || error.message || "不明なエラー"
      );
    } finally {
      if (requestId === rankingRequestId) {
        rankingList.setAttribute("aria-busy", "false");
      }
    }
  }

  periodSelect?.addEventListener("change", () => {
    currentRankingDays = getSelectedRankingDays();
    loadRanking();
  });

  currentRankingDays = getSelectedRankingDays();
  loadStats();
  loadStatsTrend();
  loadRanking();
})();
