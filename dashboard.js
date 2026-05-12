// =====================
// TOGGLE (PERFIL / REDES / CARDS)
// =====================
document.querySelectorAll(".toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.classList.toggle("active");
  });
});

// =====================
// INPUTS
// =====================
const $ = (id) => document.getElementById(id);

// PERFIL
const nameInput = $("name-input");
const bioInput = $("bio-input");
const avatarInput = $("avatar-input");
const bannerInput = $("banner-input");
const backgroundInput = $("background-input");
const overlayInput = $("overlay-input");

// REDES
const youtubeInput = $("youtube-input");
const instagramInput = $("instagram-input");
const discordInput = $("discord-input");
const spotifyInput = $("spotify-input");

// CARDS
const cards = [
  { t: $("extra1-text"), i: $("extra1-img"), l: $("extra1-link") },
  { t: $("extra2-text"), i: $("extra2-img"), l: $("extra2-link") },
  { t: $("extra3-text"), i: $("extra3-img"), l: $("extra3-link") },
  { t: $("extra4-text"), i: $("extra4-img"), l: $("extra4-link") }
];

// =====================
// PREVIEW
// =====================
function updatePreview() {

  $("preview-name").innerText = nameInput.value || "Nome";
  $("preview-bio").innerText = bioInput.value || "Bio";

  $("preview-avatar").src = avatarInput.value || "";
  $("preview-banner").style.backgroundImage = `url(${bannerInput.value || ""})`;

  $("preview-overlay").innerText = overlayInput.value || "";

  youtubeInput.value && ($("youtube-link").href = youtubeInput.value);
  instagramInput.value && ($("instagram-link").href = instagramInput.value);
  discordInput.value && ($("discord-link").href = discordInput.value);
  spotifyInput.value && ($("spotify-link").href = spotifyInput.value);
}

// auto update
document.querySelectorAll("input, textarea").forEach(el => {
  el.addEventListener("input", updatePreview);
});

// =====================
// SAVE SUPABASE
// =====================
document.getElementById("save-btn").addEventListener("click", async () => {

  const { data: { user } } =
    await supabaseClient.auth.getUser();

  if (!user) {
    alert("Usuário não logado");
    return;
  }

  const usernameFinal =
    user.email.split("@")[0].toLowerCase().trim();

  const payload = {
    id: user.id,
    username: usernameFinal,

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
    whatsapp_url: whatsappInput.value
  };

  cards.forEach((c, i) => {
    payload[`extra${i+1}_text`] = c.text.value;
    payload[`extra${i+1}_img`] = c.img.value;
    payload[`extra${i+1}_link`] = c.link.value;
  });

  const { error } =
    await supabaseClient.from("profiles").upsert(payload);

  if (error) {
    alert(error.message);
    return;
  }

  const profileLink = `${location.origin}/${usernameFinal}`;

  alert("Perfil salvo!");

  // 👇 ISSO AQUI É O QUE FALTAVA
  window.location.href = profileLink;

});
