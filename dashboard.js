const nameInput =
document.getElementById("name-input");

const bioInput =
document.getElementById("bio-input");

const avatarInput =
document.getElementById("avatar-input");

const bannerInput =
document.getElementById("banner-input");

const backgroundInput =
document.getElementById("background-input");

const overlayInput =
document.getElementById("overlay-input");

const youtubeInput =
document.getElementById("youtube-input");

const instagramInput =
document.getElementById("instagram-input");

const discordInput =
document.getElementById("discord-input");

const spotifyInput =
document.getElementById("spotify-input");

const tiktokInput =
document.getElementById("tiktok-input");

const whatsappInput =
document.getElementById("whatsapp-input");

const facebookInput =
document.getElementById("facebook-input");

const twitterInput =
document.getElementById("twitter-input");


// =========================
// PREVIEW
// =========================

nameInput.addEventListener("input", () => {

  document.getElementById(
    "preview-name"
  ).innerText =
  nameInput.value || "usuário";

});

bioInput.addEventListener("input", () => {

  document.getElementById(
    "preview-bio"
  ).innerText =
  bioInput.value || "sua bio aqui...";

});

avatarInput.addEventListener("input", () => {

  document.getElementById(
    "preview-avatar"
  ).src =
  avatarInput.value;

});

bannerInput.addEventListener("input", () => {

  document.getElementById(
    "preview-banner"
  ).style.backgroundImage =
  `url(${bannerInput.value})`;

});

overlayInput.addEventListener("input", () => {

  document.getElementById(
    "preview-overlay"
  ).innerText =
  overlayInput.value || "eu amo Deus";

});

backgroundInput.addEventListener("input", () => {

  document.body.style.backgroundImage =
  `url(${backgroundInput.value})`;

  document.body.style.backgroundSize =
  "cover";

  document.body.style.backgroundPosition =
  "center";

  document.body.style.backgroundRepeat =
  "no-repeat";

  document.body.style.backgroundAttachment =
  "fixed";

});

youtubeInput.addEventListener("input", () => {

  document.getElementById(
    "youtube-link"
  ).href =
  youtubeInput.value;

});

instagramInput.addEventListener("input", () => {

  document.getElementById(
    "instagram-link"
  ).href =
  instagramInput.value;

});

discordInput.addEventListener("input", () => {

  document.getElementById(
    "discord-link"
  ).href =
  discordInput.value;

});

spotifyInput.addEventListener("input", () => {

  document.getElementById(
    "spotify-link"
  ).href =
  spotifyInput.value;

});


// =========================
// CARREGAR PERFIL SALVO
// =========================

async function loadDashboard() {

  const {
    data: { user }
  } =
  await supabaseClient.auth.getUser();

  if (!user) return;

  const { data, error } =
  await supabaseClient
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .single();

  console.log(data);
  console.log(error);

  if (error || !data) return;

  // INPUTS

  nameInput.value =
  data.username || "";

  bioInput.value =
  data.bio || "";

  avatarInput.value =
  data.avatar_url || "";

  bannerInput.value =
  data.banner_url || "";

  backgroundInput.value =
  data.background_url || "";

  overlayInput.value =
  data.balao || "";

  youtubeInput.value =
  data.youtube_url || "";

  instagramInput.value =
  data.instagram_url || "";

  discordInput.value =
  data.discord_url || "";

  spotifyInput.value =
  data.spotify_url || "";

  tiktokInput.value =
  data.tiktok_url || "";

  whatsappInput.value =
  data.whatsapp_url || "";

  facebookInput.value =
  data.facebook_url || "";

  twitterInput.value =
  data.twitter_url || "";

  // PREVIEW

  document.getElementById(
    "preview-name"
  ).innerText =
  data.username || "usuário";

  document.getElementById(
    "preview-bio"
  ).innerText =
  data.bio || "sua bio aqui...";

  document.getElementById(
    "preview-avatar"
  ).src =
  data.avatar_url || "";

  document.getElementById(
    "preview-banner"
  ).style.backgroundImage =
  `url(${data.banner_url || ""})`;

  document.getElementById(
    "preview-overlay"
  ).innerText =
  data.balao || "";

}

loadDashboard();


// =========================
// SALVAR
// =========================

const saveBtn =
document.getElementById("save-btn");

saveBtn.addEventListener("click", async () => {

  const {
    data: { user }
  } =
  await supabaseClient.auth.getUser();

  if (!user) {

    alert("Usuário não logado");
    return;

  }

  const usernameFinal =

  nameInput.value.trim()

  ||

  user.email.split("@")[0];

  const { error } =

  await supabaseClient
  .from("profiles")
  .upsert({

    id: user.id,

    username: usernameFinal,

    bio: bioInput.value,

    balao: overlayInput.value,

    avatar_url: avatarInput.value,

    banner_url: bannerInput.value,

    background_url: backgroundInput.value,

    youtube_url: youtubeInput.value,

    instagram_url: instagramInput.value,

    discord_url: discordInput.value,

    spotify_url: spotifyInput.value,

    tiktok_url: tiktokInput.value,

    whatsapp_url: whatsappInput.value,

    facebook_url: facebookInput.value,

    twitter_url: twitterInput.value

  });

  if (error) {

    console.log(error);

    alert(error.message);

    return;

  }

  const profileLink =
  `${location.origin}/${usernameFinal}`;

  alert(
    `Perfil salvo!\n\n${profileLink}`
  );

  window.location.href =
  profileLink;

});
