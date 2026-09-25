// =========================================================
// SHARED.JS — Lógica compartilhada entre TODOS os layouts
// =========================================================

// =========================
// 404
// =========================

function showNotFound() {
  document.body.innerHTML = `
    <div class="notfound-page">
      <div class="notfound-overlay"></div>
      <div class="notfound-content">
        <img
          class="astronaut"
          src="https://i.pinimg.com/originals/42/c6/2a/42c62a68fa0154599d1da42a43ac6dcd.gif"
        >
        <div class="notfound-text">
          <h2>Oops!</h2>
          <h1>404</h1>
          <p>
            Perfil não encontrado<br>
            ou inexistente.
          </p>
          <a href="https://teammayhem.vercel.app" class="back-home">
            Voltar ao início
          </a>
          <br><br><br>
          <a href="https://teammayhem.vercel.app/cadastro.html" class="back-home">
            Criar perfil
          </a>
        </div>
      </div>
    </div>
  `;
}

// =========================
// ENTRANCE STARS
// =========================

function renderEntranceStars(style) {
  const container = document.getElementById("entrance-stars");
  if (!container) return;
  container.innerHTML = "";
  if (style !== "aurora" && style !== "grade") return;

  const count = 26;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "entrance-star";
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    const size = 1.5 + Math.random() * 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.opacity = (0.3 + Math.random() * 0.5).toFixed(2);
    container.appendChild(star);
  }
}

// =========================
// HELPERS
// =========================

function getProfileUsername() {
  const params = new URLSearchParams(window.location.search);
  let username = params.get("user");
  if (!username) {
    username = window.location.pathname.replace("/", "").trim();
  }
  if (!username || username === "u.html") return null;
  return username;
}

async function fetchProfileData(username) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) return null;
  return data;
}

function getVisitorId() {
  let visitorId = localStorage.getItem("visitor_id");
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("visitor_id", visitorId);
  }
  return visitorId;
}

function formatTime(seconds) {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// =========================
// SETUP: EFEITOS DE FUNDO
// =========================

function setupEffects(data) {
  const effectCanvas = document.getElementById("profile-effect-canvas");
  if (effectCanvas && window.ProfileEffects) {
    window.ProfileEffects.start(effectCanvas, data.effect);
  }
}

// =========================
// SETUP: ENTRANCE
// =========================

function setupEntrance(data) {
  const entrance = document.getElementById("entrance-screen");
  if (!entrance) return;

  // Avatar da entrance
  const entranceAvatar = document.getElementById("entrance-avatar");
  const entranceAvatarFallback = document.getElementById("entrance-avatar-fallback");

  if (entranceAvatar) {
    if (data.avatar_url) {
      entranceAvatar.src = data.avatar_url;
      entranceAvatar.style.display = "block";
      if (entranceAvatarFallback) entranceAvatarFallback.style.display = "none";
    } else {
      entranceAvatar.style.display = "none";
      if (entranceAvatarFallback) {
        const label = data.display_name || data.username || "?";
        entranceAvatarFallback.textContent = label.trim().charAt(0).toUpperCase();
        entranceAvatarFallback.style.display = "flex";
      }
    }
  }

  if (!data.entrance_enabled) {
    entrance.style.display = "none";
    return;
  }

  entrance.dataset.style = data.entrance_style || "aurora";

  document.getElementById("entrance-title").textContent =
    data.display_name || data.username || "";

  document.getElementById("entrance-subtitle").textContent =
    data.entrance_text?.trim() || "Clique aqui";

  renderEntranceStars(entrance.dataset.style);

  entrance.onclick = async () => {
    const audio = document.getElementById("profile-music");
    if (audio && data.music_url) {
      try { await audio.play(); } catch (err) {
        console.log("Erro ao tocar:", err);
      }
    }
    entrance.style.opacity = "0";
    entrance.style.pointerEvents = "none";
    setTimeout(() => { entrance.remove(); }, 500);
  };
}

// =========================
// SETUP: TÍTULO
// =========================

function setupPageTitle(data) {
  document.title = `@${data.username}`;
}

// =========================
// SETUP: BACKGROUND
// =========================

function setupBackground(data) {
  if (data.background_url) {
    document.body.style.backgroundImage = `url(${data.background_url})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
  }
}

// =========================
// SETUP: CARD BACKGROUND
// =========================

function setupCardBackground(data, cardEl) {
  if (data.card_background_url) {
    cardEl.style.backgroundImage = `url(${data.card_background_url})`;
    cardEl.style.backgroundSize = "cover";
    cardEl.style.backgroundPosition = "center";
  }
}

// =========================
// SETUP: CSS VARIABLES DO CARD
// =========================

function setupCardStyleVars(data, cardEl, socialBoxEl) {
  cardEl.style.setProperty("--card-width", (data.card_width ?? 95) + "%");
  cardEl.style.setProperty("--card-max-width", (data.card_max_width ?? 600) + "px");
  cardEl.style.setProperty("--card-radius", (data.card_radius ?? 20) + "px");
  cardEl.style.setProperty("--card-blur", (data.card_blur ?? 18) + "px");
  cardEl.style.setProperty("--card-bg-opacity", (data.card_bg_opacity ?? 0) / 100);
  cardEl.style.setProperty("--card-border-opacity", (data.card_border_opacity ?? 20) / 100);
  cardEl.style.setProperty("--banner-height", (data.banner_height ?? 170) + "px");
  cardEl.style.setProperty("--avatar-size", (data.avatar_size ?? 95) + "px");
  cardEl.style.setProperty("--text-color", data.text_color || "white");

  if (socialBoxEl) {
    socialBoxEl.style.setProperty("--social-margin-top", (data.social_margin_top ?? 20) + "px");
  }
}

// =========================
// SETUP: AVATAR
// =========================

function setupAvatar(data) {
  const avatar = document.getElementById("avatar");
  if (avatar) {
    avatar.src = data.avatar_url ||
      "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/semfotodeperfil.jpg";
  }

  const frame = document.getElementById("avatar-frame");
  if (frame) {
    if (data.frame_url) {
      frame.src = data.frame_url;
      frame.style.display = "block";
    } else {
      frame.style.display = "none";
    }
  }
}

// =========================
// SETUP: BANNER
// =========================

function setupBanner(data) {
  const banner = document.getElementById("banner");
  if (banner) {
    banner.style.backgroundImage = data.banner_url
      ? `url(${data.banner_url})`
      : "";
  }
}

// =========================
// SETUP: NOME E BIO
// =========================

function setupDisplayInfo(data) {
  const usernameEl = document.getElementById("username");
  if (usernameEl) {
    usernameEl.innerText = data.display_name || data.username;
  }

  const bioEl = document.getElementById("bio");
  if (bioEl) {
    bioEl.innerText = data.bio || "";
  }
}

// =========================
// SETUP: BALÃO
// =========================

function setupBalloon(data) {
  const balao = document.getElementById("balao");
  if (!balao) return;

  if (!data.balao || data.balao.trim() === "") {
    balao.style.display = "none";
  } else {
    balao.style.display = "block";
    balao.innerText = data.balao;
  }
}

// =========================
// SETUP: BADGES
// =========================

function setupBadges(data, cardEl) {
  if (data.username === "" || data.username === "") {
    cardEl.insertAdjacentHTML("afterbegin", `
      <div class="embking">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
          <path d="M5 21h14"></path>
        </svg> OWNER
      </div>
    `);
  }

  if (data.username === "vtzadas_021") {
    cardEl.insertAdjacentHTML("afterbegin", `
      <div class="embblack">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
          <path d="M5 21h14"></path>
        </svg> FOUNDER
      </div>
    `);
  }

  if (data.username === "") {
    cardEl.insertAdjacentHTML("afterbegin", `
      <div class="embverified">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="1 1.5 22 21">
          <path fill="currentColor" d="m8.6 22.5l-1.9-3.2l-3.6-.8l.35-3.7L1 12l2.45-2.8l-.35-3.7l3.6-.8l1.9-3.2L12 2.95l3.4-1.45l1.9 3.2l3.6.8l-.35 3.7L23 12l-2.45 2.8l.35 3.7l-3.6.8l-1.9 3.2l-3.4-1.45l-3.4 1.45Zm2.35-6.95L16.6 9.9l-1.4-1.45l-4.25 4.25l-2.15-2.1L7.4 12l3.55 3.55Z"></path>
        </svg> 𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱
      </div>
    `);
  }
}

// =========================
// SETUP: CURTIDAS
// =========================

async function setupLikes(data, visitorId) {
  const likeBtn = document.getElementById("like-btn");
  const likeCount = document.getElementById("like-count");
  if (!likeBtn || !likeCount) return;

  const { count } = await supabaseClient
    .from("profile_likes")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", data.id);

  likeCount.textContent = count || 0;

  const { data: alreadyLiked } = await supabaseClient
    .from("profile_likes")
    .select("id")
    .eq("profile_id", data.id)
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (alreadyLiked) {
    likeBtn.classList.add("liked");
  }

  likeBtn.onclick = async () => {
    if (likeBtn.classList.contains("liked")) return;

    const { error } = await supabaseClient
      .from("profile_likes")
      .insert({
        profile_id: data.id,
        visitor_id: visitorId
      });

    if (error) {
      console.error(error);
      return;
    }

    likeBtn.classList.add("liked");
    likeCount.textContent = Number(likeCount.textContent) + 1;
  };
}

// =========================
// SETUP: MUSIC PLAYER
// =========================

function setupMusicPlayer(data) {
  if (!data.music_url) {
    const player = document.getElementById("music-player");
    if (player) player.classList.add("hidden");
    return;
  }

  const audio = document.getElementById("profile-music");
  const player = document.getElementById("music-player");
  const playBtn = document.getElementById("playButton");
  const playIcon = document.getElementById("play-icon");
  const muteBtn = document.getElementById("mute-btn");
  const muteIcon = document.getElementById("mute-icon");
  const closeBtn = document.getElementById("closePlayerBtn");
  const volume = document.getElementById("volumeSlider");
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl = document.getElementById("duration");
  const progressBar = document.getElementById("progressBar");
  const progressContainer = document.getElementById("progressContainer");
  const avatarImg = document.getElementById("player-avatar");
  const songNameEl = document.getElementById("player-song-name");

  player.classList.remove("hidden");

  audio.src = data.music_url;
  audio.volume = 0.1;

  avatarImg.src = data.avatar_url ||
    "https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/semfotodeperfil.jpg";
  songNameEl.textContent = data.display_name || data.username || "tocando agora";

  function toggleMusic() {
    if (audio.paused) { audio.play(); } else { audio.pause(); }
  }

  audio.addEventListener("play", () => {
    playIcon.className = "fa-solid fa-pause";
  });

  audio.addEventListener("pause", () => {
    playIcon.className = "fa-solid fa-play";
  });

  playBtn.onclick = toggleMusic;

  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    currentTimeEl.textContent = formatTime(audio.currentTime);
    if (audio.duration) {
      progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    }
  });

  progressContainer.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const rect = progressContainer.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = ratio * audio.duration;
  });

  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    if (audio.volume === 0) { audio.muted = true; } else { audio.muted = false; }
    muteIcon.className = audio.muted
      ? "fa-solid fa-volume-xmark"
      : "fa-solid fa-volume-high";
  });

  volume.value = audio.volume;

  muteBtn.onclick = () => {
    audio.muted = !audio.muted;
    muteIcon.className = audio.muted
      ? "fa-solid fa-volume-xmark"
      : "fa-solid fa-volume-high";
  };

  closeBtn.onclick = () => {
    audio.pause();
    player.classList.add("hidden");
  };
}

// =========================
// SETUP: REDES SOCIAIS (modo ícone)
// =========================

function addSocialIcon(socialsEl, url, iconHTML) {
  if (!url || url.trim() === "") return;
  socialsEl.innerHTML += `
    <a href="${url}" target="_blank">
      ${iconHTML}
    </a>
  `;
}

// =========================
// SETUP: REDES SOCIAIS (modo card com texto — template Grande)
// =========================

function addSocialCard(socialsEl, url, iconHTML, title, user) {
  if (!url || url.trim() === "") return;
  socialsEl.innerHTML += `
    <a href="${url}" target="_blank">
      ${iconHTML}
      <div class="social-text">
        <strong>${title}</strong>
        <span>${user || ""}</span>
      </div>
    </a>
  `;
}

// =========================
// SETUP: TODAS AS REDES
// =========================

function setupAllSocials(data, socialsEl, mode) {
  socialsEl.innerHTML = "";

  const add = mode === "cards" ? addSocialCard : addSocialIcon;

  const socials = [
    { url: data.youtube_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/youtube.png">`, title: "Youtube" },
    { url: data.instagram_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/instagram.png">`, title: "Instagram" },
    { url: data.discord_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/discord.png">`, title: "Discord" },
    { url: data.spotify_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/spotify.png">`, title: "Spotify" },
    { url: data.tiktok_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/tiktok.png">`, title: "TikTok" },
    { url: data.whatsapp_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/whatsapp.png">`, title: "WhatsApp" },
    { url: data.twitter_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/x.png">`, title: "Twitter/X" },
    { url: data.facebook_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/facebook.png">`, title: "Facebook" },
    { url: data.telegram_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/telegram.png">`, title: "Telegram" },
    { url: data.github_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/github.png">`, title: "GitHub" },
    { url: data.linkedin_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/linkedin.png">`, title: "LinkedIn" },
    { url: data.kick_url, icon: `<img src="https://cdn.simpleicons.org/kick">`, title: "Kick" },
    { url: data.roblox_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/roblox.png">`, title: "Roblox" },
    { url: data.steam_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/steam.png">`, title: "Steam" },
    { url: data.xbox_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/xbox.png">`, title: "Xbox" },
    { url: data.twitch_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/twitch.png">`, title: "Twitch" },
    { url: data.privacy_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/privacy.png">`, title: "Privacy" },
    { url: data.onlyfans_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/onlyfans.png">`, title: "OnlyFans" },
    { url: data.fivem_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/fivem.png">`, title: "FiveM" },
    { url: data.pinterest_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/pinterest.png">`, title: "Pinterest" },
    { url: data.email_url, icon: `<img src="https://kknalifzcckzvypmkbgx.supabase.co/storage/v1/object/public/assets/socials/email.png">`, title: "Email" },
    { url: data.threads_url, icon: `<img src="https://cdn.simpleicons.org/threads">`, title: "Threads" },
    { url: data.bsky_url, icon: `<img src="https://cdn.simpleicons.org/bluesky">`, title: "Bluesky" },
    { url: data.vsco_url, icon: `<img src="https://cdn.simpleicons.org/vsco">`, title: "VSCO" },
    { url: data.pix_url, icon: `<img src="https://cdn.simpleicons.org/pix">`, title: "Pix" },
  ];

  socials.forEach(s => {
    if (mode === "cards") {
      add(socialsEl, s.url, s.icon, s.title, data.username);
    } else {
      add(socialsEl, s.url, s.icon);
    }
  });
}

// =========================
// SETUP: CARDS EXTRAS
// =========================

function setupExtras(data) {
  const conteudo = document.getElementById("extras-container");
  if (!conteudo) return;

  conteudo.innerHTML = "";

  for (let i = 1; i <= 4; i++) {
    const text = (data[`extra${i}_text`] || "").trim();
    const image = (data[`extra${i}_img`] || "").trim();
    const link = (data[`extra${i}_link`] || "").trim();

    if (text === "" && image === "" && link === "") continue;

    const card = document.createElement("a");
    card.className = "extra-card";
    card.href = link || "#";
    card.target = "_blank";

    let imageHTML = "";
    if (image !== "") {
      imageHTML = `
        <div class="extra-card-icon">
          <img src="${image}">
        </div>
      `;
    }

    card.innerHTML = `
      ${imageHTML}
      <span>${text || ""}</span>
    `;

    conteudo.appendChild(card);
  }
}

// =========================
// SETUP: ÁLBUM
// =========================

function setupAlbum(data) {
  const albumImages = [
    data.album1_url,
    data.album2_url,
    data.album3_url,
    data.album4_url
  ];

  const albumImgEls = document.querySelectorAll(".album-grid img");

  albumImgEls.forEach((img, index) => {
    const url = albumImages[index];
    img.style.display = url ? "block" : "none";
  });

  const visiblePhotos = albumImages.filter(url => !!url);
  const hasAlbum = visiblePhotos.length > 0;

  const albumGrid = document.querySelector(".album-grid");
  if (albumGrid && visiblePhotos.length === 1) {
    albumGrid.style.gridTemplateColumns = "1fr";
  }

  let albumLoaded = false;

  function loadAlbumImages() {
    if (albumLoaded) return;
    albumLoaded = true;
    albumImgEls.forEach((img, index) => {
      const url = albumImages[index];
      if (url) img.src = url;
    });
  }

  const albumPage = document.getElementById("album-page");
  const albumBtn = document.getElementById("album-btn");
  const closeAlbum = document.getElementById("close-album");

  if (albumBtn && albumPage) {
    albumBtn.onclick = () => {
      loadAlbumImages();
      albumPage.classList.add("active");
    };
  }

  if (closeAlbum && albumPage) {
    closeAlbum.onclick = () => {
      albumPage.classList.remove("active");
    };
  }

  if (!hasAlbum) {
    if (albumBtn) albumBtn.style.display = "none";
  }
}
