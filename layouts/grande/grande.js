// =========================================================
// GRANDE LAYOUT — Profile loader (redesign)
// Dois cards: principal (banner+avatar+nome) + conexões (grid)
// =========================================================

async function loadProfile() {

  const username = getProfileUsername();
  if (!username) { showNotFound(); return; }

  const data = await fetchProfileData(username);
  if (!data) { showNotFound(); return; }

  const visitorId = getVisitorId();

  // =========================
  // EFEITOS + ENTRANCE
  // =========================

  setupEffects(data);
  setupEntrance(data);

  // =========================
  // TÍTULO
  // =========================

  setupPageTitle(data);

  // =========================
  // BACKGROUND
  // =========================

  setupBackground(data);

  // =========================
  // CARD PRINCIPAL — BANNER
  // =========================

  const banner = document.getElementById("banner");
  if (banner && data.banner_url) {
    banner.style.backgroundImage = `url(${data.banner_url})`;
  }

  // =========================
  // AVATAR
  // =========================

  setupAvatar(data);

  // =========================
  // NOME + HANDLE
  // =========================

  const usernameEl = document.getElementById("username");
  if (usernameEl) {
    usernameEl.innerText = data.display_name || data.username;
  }

  const handleEl = document.getElementById("handle");
  if (handleEl) {
    handleEl.innerText = `@${data.username}`;
  }

  // =========================
  // BIO
  // =========================

  const bioEl = document.getElementById("bio");
  if (bioEl) {
    bioEl.innerText = data.bio || "";
  }

  // =========================
  // TEXT COLOR
  // =========================

  const cardMain = document.querySelector(".card-main");
  const cardConn = document.querySelector(".card-connections");

  if (cardMain) cardMain.style.setProperty("--text-color", data.text_color || "white");
  if (cardConn) cardConn.style.setProperty("--text-color", data.text_color || "white");

  // =========================
  // CARD BACKGROUND (no card principal)
  // =========================

  if (data.card_background_url && cardMain) {
    cardMain.style.backgroundImage = `url(${data.card_background_url})`;
    cardMain.style.backgroundSize = "cover";
    cardMain.style.backgroundPosition = "center";
  }

  // =========================
  // BADGES
  // =========================

  if (cardMain) setupBadges(data, cardMain);

  // =========================
  // LIKES
  // =========================

  setupLikes(data, visitorId);

  // =========================
  // ALBUM
  // =========================

  setupAlbum(data);

  // =========================
  // MUSIC PLAYER
  // =========================

  setupMusicPlayer(data);

  // =========================
  // CONEXÕES — Social cards customizados
  // =========================

  const socialsEl = document.getElementById("socials");
  if (socialsEl) {
    socialsEl.innerHTML = "";
    buildConnectionCards(data, socialsEl);
  }

  // =========================
  // EXTRAS
  // =========================

  setupExtras(data);

}

// =========================================================
// SOCIAL CONNECTION CARDS — Grid com ícone + nome + user + link
// =========================================================

function buildConnectionCards(data, container) {

  const socials = [
    { url: data.discord_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/discord.png", title: "Discord", user: data.username },
    { url: data.instagram_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/instagram.png", title: "Instagram", user: data.username },
    { url: data.tiktok_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/tiktok.png", title: "TikTok", user: data.username },
    { url: data.twitter_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/x.png", title: "Twitter/X", user: data.username },
    { url: data.youtube_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/youtube.png", title: "Youtube", user: data.username },
    { url: data.spotify_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/spotify.png", title: "Spotify", user: data.username },
    { url: data.whatsapp_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/whatsapp.png", title: "WhatsApp", user: data.username },
    { url: data.facebook_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/facebook.png", title: "Facebook", user: data.username },
    { url: data.telegram_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/telegram.png", title: "Telegram", user: data.username },
    { url: data.github_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/github.png", title: "GitHub", user: data.username },
    { url: data.linkedin_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/linkedin.png", title: "LinkedIn", user: data.username },
    { url: data.kick_url, icon: "https://cdn.simpleicons.org/kick", title: "Kick", user: data.username },
    { url: data.roblox_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/roblox.png", title: "Roblox", user: data.username },
    { url: data.steam_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/steam.png", title: "Steam", user: data.username },
    { url: data.xbox_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/xbox.png", title: "Xbox", user: data.username },
    { url: data.twitch_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/twitch.png", title: "Twitch", user: data.username },
    { url: data.privacy_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/privacy.png", title: "Privacy", user: data.username },
    { url: data.onlyfans_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/onlyfans.png", title: "OnlyFans", user: data.username },
    { url: data.fivem_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/fivem.png", title: "FiveM", user: data.username },
    { url: data.pinterest_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/pinterest.png", title: "Pinterest", user: data.username },
    { url: data.email_url, icon: "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/email.png", title: "Contact", user: data.username },
    { url: data.threads_url, icon: "https://cdn.simpleicons.org/threads", title: "Threads", user: data.username },
    { url: data.bsky_url, icon: "https://cdn.simpleicons.org/bluesky", title: "Bluesky", user: data.username },
    { url: data.vsco_url, icon: "https://cdn.simpleicons.org/vsco", title: "VSCO", user: data.username },
    { url: data.pix_url, icon: "https://cdn.simpleicons.org/pix", title: "Pix", user: data.username },
  ];

  let hasAny = false;

  socials.forEach(s => {

    if (!s.url || s.url.trim() === "") return;

    hasAny = true;

    // Tenta extrair o username/identifier da URL
    let displayUser = s.user || "";
    try {
      const urlObj = new URL(s.url);
      const pathUser = urlObj.pathname.replace(/^\/+|\/+$/g, "").split("/").pop();
      if (pathUser && pathUser.length > 0 && pathUser.length < 40) {
        displayUser = pathUser;
      }
    } catch (e) {
      // Se não é URL válida (tipo email), mostra o valor raw
      if (s.url.includes("@")) {
        displayUser = s.url.replace("mailto:", "");
      }
    }

    container.innerHTML += `
      <a href="${s.url}" target="_blank" class="connection-card">
        <div class="connection-icon">
          <img src="${s.icon}" alt="${s.title}">
        </div>
        <div class="connection-info">
          <strong>${s.title}</strong>
          <span>${displayUser}</span>
        </div>
        <i class="fa-solid fa-arrow-up-right-from-square connection-external"></i>
      </a>
    `;

  });

  // Se nenhuma rede social foi adicionada, esconde o card de conexões
  if (!hasAny) {
    const cardConn = document.querySelector(".card-connections");
    if (cardConn) cardConn.style.display = "none";
  }

}

loadProfile();
