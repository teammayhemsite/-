// =========================================================
// MINIMALISTA LAYOUT — Profile loader
// =========================================================

async function loadProfile() {

  const username = getProfileUsername();
  if (!username) { showNotFound(); return; }

  const data = await fetchProfileData(username);
  if (!data) { showNotFound(); return; }

  const visitorId = getVisitorId();
  const cardEl = document.querySelector(".cardking");
  const socialsEl = document.getElementById("socials");

  setupEffects(data);
  setupEntrance(data);
  setupCardBackground(data, cardEl);
  // No badges in minimalista
  setupAlbum(data);
  setupLikes(data, visitorId);
  setupPageTitle(data);
  // No social box var needed, no banner height var needed
  cardEl.style.setProperty("--text-color", data.text_color || "white");
  cardEl.style.setProperty("--card-width", (data.card_width ?? 95) + "%");
  setupAvatar(data);
  // No banner setup (hidden via CSS)
  // No balloon (hidden via CSS)
  setupDisplayInfo(data);
  setupBackground(data);
  setupMusicPlayer(data);
  setupAllSocials(data, socialsEl, "icons");
  // No extras (hidden via CSS)

}

loadProfile();
