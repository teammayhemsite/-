// =========================================================
// GRANDE LAYOUT — Profile loader
// =========================================================

async function loadProfile() {

  const username = getProfileUsername();
  if (!username) { showNotFound(); return; }

  const data = await fetchProfileData(username);
  if (!data) { showNotFound(); return; }

  const visitorId = getVisitorId();
  const cardEl = document.querySelector(".cardking");
  const socialBoxEl = document.querySelector(".social-box");
  const socialsEl = document.getElementById("socials");

  setupEffects(data);
  setupEntrance(data);
  setupCardBackground(data, cardEl);
  setupBadges(data, cardEl);
  setupAlbum(data);
  setupLikes(data, visitorId);
  setupPageTitle(data);
  setupCardStyleVars(data, cardEl, socialBoxEl);
  setupAvatar(data);
  setupBanner(data);
  setupBalloon(data);
  setupDisplayInfo(data);
  setupBackground(data);
  setupMusicPlayer(data);

  // Grande uses "cards" mode — social links show text labels
  setupAllSocials(data, socialsEl, "cards");

  setupExtras(data);

}

loadProfile();
