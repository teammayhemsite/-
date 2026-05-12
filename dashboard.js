// =========================
// TOGGLE SEÇÕES
// =========================

document.querySelectorAll(".toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.classList.toggle("active");
  });
});

const $ = (id) => document.getElementById(id);

// =========================
// INPUTS PERFIL
// =========================

const nameInput = $("name-input");
const bioInput = $("bio-input");
const avatarInput = $("avatar-input");
const bannerInput = $("banner-input");
const backgroundInput = $("background-input");
const overlayInput = $("overlay-input");

// =========================
// REDES
// =========================

const youtubeInput = $("youtube-input");
const instagramInput = $("instagram-input");
const discordInput = $("discord-input");
const spotifyInput = $("spotify-input");
const tiktokInput = $("tiktok-input");
const whatsappInput = $("whatsapp-input");
const twitterInput = $("twitter-input");
const facebookInput = $("facebook-input");

// =========================
// CARDS EXTRAS (4)
// =========================

const cards = [
  { t: $("extra1-text"), i: $("extra1-img"), l: $("extra1-link") },
  { t: $("extra2-text"), i: $("extra2-img"), l: $("extra2-link") },
  { t: $("extra3-text"), i: $("extra3-img"), l: $("extra3-link") },
  { t: $("extra4-text"), i: $("extra4-img"), l: $("extra4-link") }
];

// =========================
// PREVIEW
// =========================

function updatePreview() {

  $("preview-name").innerText =
    nameInput.value || "Nome";

  $("preview-bio").innerText =
    bioInput.value || "Bio";

  $("preview-avatar").src =
    avatarInput.value || "";

  $("preview-banner").style.backgroundImage =
    `url(${bannerInput.value || ""})`;

  // BALÃO
  const balao = $("preview-overlay");

  if (overlayInput.value && overlayInput.value.trim() !== "") {
    balao.innerText = overlayInput.value;
    balao.style.display = "block";
  } else {
    balao.style.display = "none";
  }

  // REDES PREVIEW
  const socials = {
    youtube: youtubeInput.value,
    instagram: instagramInput.value,
    discord: discordInput.value,
    spotify: spotifyInput.value,
    tiktok: tiktokInput.value,
    whatsapp: whatsappInput.value,
    twitter: twitterInput.value,
    facebook: facebookInput.value
  };

  Object.entries(socials).forEach(([key, value]) => {
    const el = document.getElementById(key + "-link");
    if (el) el.href = value || "#";
  });

  // CARDS PREVIEW
  const container = $("extras-container");
  container.innerHTML = "";

  cards.forEach(c => {

    if (!c.t.value && !c.i.value && !c.l.value) return;

    const card = document.createElement("a");
    card.className = "extra-card";
    card.href = c.l.value || "#";
    card.target = "_blank";

    card.innerHTML = `
      <div class="extra-card-icon">
        <img src="${c.i.value || ""}">
      </div>
      <span>${c.t.value || ""}</span>
    `;

    container.appendChild(card);
  });
}

// =========================
// LISTENERS LIVE
// =========================

document.querySelectorAll("input, textarea").forEach(el => {
  el.addEventListener("input", updatePreview);
});

// =========================
// CARREGAR PERFIL
// =========================

async function loadDashboard() {

  const { data: { user } } =
    await supabaseClient.auth.getUser();

  if (!user) return;

  const { data } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!data) return;

  nameInput.value = data.display_name || "";
  bioInput.value = data.bio || "";
  avatarInput.value = data.avatar_url || "";
  bannerInput.value = data.banner_url || "";
  backgroundInput.value = data.background_url || "";
  overlayInput.value = data.balao || "";

  youtubeInput.value = data.youtube_url || "";
  instagramInput.value = data.instagram_url || "";
  discordInput.value = data.discord_url || "";
  spotifyInput.value = data.spotify_url || "";
  tiktokInput.value = data.tiktok_url || "";
  whatsappInput.value = data.whatsapp_url || "";
  twitterInput.value = data.twitter_url || "";
  facebookInput.value = data.facebook_url || "";

  cards.forEach((c, i) => {
    c.t.value = data[`extra${i+1}_text`] || "";
    c.i.value = data[`extra${i+1}_img`] || "";
    c.l.value = data[`extra${i+1}_link`] || "";
  });

  updatePreview();
}

loadDashboard();

// =========================
// SALVAR PERFIL
// =========================

document.getElementById("save-btn").addEventListener("click", async () => {

  const { data: { user } } =
    await supabaseClient.auth.getUser();

  if (!user) {
    alert("Usuário não logado");
    return;
  }

  const username =
    user.email.split("@")[0].toLowerCase().trim();

  const payload = {
    id: user.id,
    username,

    display_name: nameInput.value,
    bio: bioInput.value,

    avatar_url: avatarInput.value,
    banner_url: bannerInput.value,
    background_url: backgroundInput.value,
    balao: overlayInput.value,

    youtube_url: youtubeInput.value,
    instagram_url: instagramInput.value,
    discord_url: discordInput.value,
    spotify_url: spotifyInput.value,
    tiktok_url: tiktokInput.value,
    whatsapp_url: whatsappInput.value,
    twitter_url: twitterInput.value,
    facebook_url: facebookInput.value
  };

  cards.forEach((c, i) => {
    payload[`extra${i+1}_text`] = c.t.value;
    payload[`extra${i+1}_img`] = c.i.value;
    payload[`extra${i+1}_link`] = c.l.value;
  });

  const { error } = await supabaseClient
    .from("profiles")
    .upsert(payload);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Perfil salvo com sucesso!");

  window.location.href = `/${username}`;
});
