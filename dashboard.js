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

  // username automático

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

        spotify_url: spotifyInput.value

      });

  if (error) {

    console.log(error);

    alert(error.message);

    return;
  }

  alert("Perfil salvo!");

  // PERFIL PELO ID

  window.open(
    `u.html?id=${user.id}`,
    "_blank"
  );

});