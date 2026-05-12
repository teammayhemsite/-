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

const templateSelect =
document.getElementById(
  "template-select"
);

templateSelect.addEventListener("change", () => {
  updatePreview();
  // opcional: auto salvar ou marcar como "não salvo"
});

const extraCardTextInput =
document.getElementById("extra-card-text");

const extraCardImageInput =
document.getElementById("extra-card-image");

const extraCardLinkInput =
document.getElementById("extra-card-link");

// =========================
// PREVIEW
// =========================

function updatePreview() {

  const previewCard =
  document.getElementById(
    "preview-card"
  );

  // =========================
  // TEMPLATE
  // =========================

  previewCard.classList.remove(
    "minimal"
  );

  if (
    templateSelect.value ===
    "minimal"
  ) {

    previewCard.classList.add(
      "minimal"
    );

  }

  // =========================
  // TEXTO
  // =========================

  document.getElementById(
    "preview-name"
  ).innerText =
  nameInput.value || "usuário";

  document.getElementById(
    "preview-bio"
  ).innerText =
  bioInput.value || "sua bio aqui...";

  // =========================
  // IMAGENS
  // =========================

  document.getElementById(
    "preview-avatar"
  ).src =
  avatarInput.value || "";

  document.getElementById(
    "preview-banner"
  ).style.backgroundImage =
  `url(${bannerInput.value || ""})`;

  // =========================
  // BALÃO
  // =========================

  document.getElementById(
    "preview-overlay"
  ).innerText =
  overlayInput.value || "eu amo Deus";

  // =========================
  // FUNDO
  // =========================

  if (backgroundInput.value) {

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
    
  }

  // =========================
  // REDES
  // =========================

  document.getElementById(
    "youtube-link"
  ).href =
  youtubeInput.value;

  document.getElementById(
    "instagram-link"
  ).href =
  instagramInput.value;

  document.getElementById(
    "discord-link"
  ).href =
  discordInput.value;

  document.getElementById(
    "spotify-link"
  ).href =
  spotifyInput.value;

}


// =========================
// CARREGAR PERFIL
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

  console.log("PROFILE:", data);
  console.log("ERROR:", error);

  if (!data) return;

  nameInput.value =
  data.display_name || "";

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

  templateSelect.value =
  data.template || "king"

  updatePreview();

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
  user.email
  .split("@")[0]
  .toLowerCase()
  .trim();

  console.log(
    "USERNAME FINAL:",
    usernameFinal
  );

  const { error } =

  await supabaseClient
  .from("profiles")
  .upsert({

    id: user.id,

    username: usernameFinal,

    template:
    templateSelect.value,
    
    display_name:
    nameInput.value,

    bio:
    bioInput.value,

    extra_card_text:
   extraCardTextInput.value,

    extra_card_image:
    extraCardImageInput.value,

    extra_card_link:
    extraCardLinkInput.value,

    balao:
    overlayInput.value,

    avatar_url:
    avatarInput.value,

    banner_url:
    bannerInput.value,

    background_url:
    backgroundInput.value,

    youtube_url:
    youtubeInput.value,

    instagram_url:
    instagramInput.value,

    discord_url:
    discordInput.value,

    spotify_url:
    spotifyInput.value,

    tiktok_url:
    tiktokInput.value,

    whatsapp_url:
    whatsappInput.value,

    facebook_url:
    facebookInput.value,

    twitter_url:
    twitterInput.value

  });

  if (error) {

    console.log(error);

    alert(error.message);

    return;

  }

  const profileLink =
  `${location.origin}/${usernameFinal}`;

  console.log(
    "PROFILE LINK:",
    profileLink
  );

  alert(
    `Perfil salvo!\n\n${profileLink}`
  );

  window.location.href =
  profileLink;

});

const inputs = [
  nameInput,
  bioInput,
  avatarInput,
  bannerInput,
  backgroundInput,
  overlayInput,
  youtubeInput,
  instagramInput,
  discordInput,
  spotifyInput,
  tiktokInput,
  whatsappInput,
  facebookInput,
  twitterInput,
  extraCardTextInput,
  extraCardImageInput,
  extraCardLinkInput
];

inputs.forEach(input => {
  input.addEventListener("input", updatePreview);
});

document.querySelectorAll(".toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.classList.toggle("active");
  });
});
