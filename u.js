async function loadProfile() {

  let username = null;

  // TENTA PEGAR ?user=

  const params =
  new URLSearchParams(window.location.search);

  username =
  params.get("user");

  // SE NÃO TIVER ?user=
  // PEGA DA URL

  if (!username) {

    username =
    window.location.pathname
    .replace("/", "")
    .trim();

  }

  console.log("USERNAME:", username);

  // IGNORA u.html

  if (
    !username ||
    username === "u.html"
  ) {

    document.body.innerHTML =
    "<h1>Usuário não encontrado</h1>";

    return;

  }

  // BUSCA PERFIL

  const { data, error } =

  await supabaseClient
  .from("profiles")
  .select("*")
  .eq("username", username)
  .single();

  console.log(data);
  console.log(error);

  if (error || !data) {

    document.body.innerHTML =
    "<h1>Perfil não encontrado</h1>";

    return;

  }

  // TÍTULO

  document.title =
  `@${data.username}`;

  // TEXTO

  document.getElementById("username").innerText =
  data.display_name || data.username;

  document.getElementById("bio").innerText =
  data.bio || "";

  // BALÃO

  const balao =
  document.getElementById("balao");

  if (
    !data.balao ||
    data.balao.trim() === ""
  ) {

    balao.style.display = "none";

  } else {

    balao.style.display = "block";

    balao.innerText =
    data.balao;

  }

  // IMAGENS

  document.getElementById("avatar").src =
  data.avatar_url || "";

  document.getElementById("banner").style.backgroundImage =
  `url(${data.banner_url || ""})`;

  // FUNDO

  if (data.background_url) {

    document.body.style.backgroundImage =
    `url(${data.background_url})`;

    document.body.style.backgroundSize =
    "cover";

    document.body.style.backgroundPosition =
    "center";

    document.body.style.backgroundRepeat =
    "no-repeat";

    document.body.style.backgroundAttachment =
    "fixed";

  }

  // REDES

  const socials =
  document.getElementById("socials");

  socials.innerHTML = "";

  function addSocial(url, iconHTML) {

    if (!url || url.trim() === "")
    return;

    socials.innerHTML += `
      <a href="${url}" target="_blank">
        ${iconHTML}
      </a>
    `;

  }

  addSocial(
    data.youtube_url,
    `<img src="https://www.riqueza.life/images/socials/youtube.png">`
  );

  addSocial(
    data.instagram_url,
    `<img src="https://www.riqueza.life/images/socials/instagram.png">`
  );

  addSocial(
    data.discord_url,
    `<img src="https://www.riqueza.life/images/socials/discord.png">`
  );

  addSocial(
    data.spotify_url,
    `<img src="https://www.riqueza.life/images/socials/spotify.png">`
  );

  addSocial(
    data.tiktok_url,
    `<img src="https://www.riqueza.life/images/socials/tiktok.png">`
  );

  addSocial(
    data.whatsapp_url,
    `<img src="https://www.riqueza.life/images/socials/whatsapp.png">`
  );

  addSocial(
    data.facebook_url,
    `<img src="https://www.riqueza.life/images/socials/twitch.png">`
  );

  addSocial(
    data.twitter_url,
    `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg">`
  );

}

// =========================
// CARD EXTRA
// =========================

const extraCard =
document.getElementById("extra-card");

if (
  !data.extra_card_text ||
  !data.extra_card_link
) {

  extraCard.style.display =
  "none";

} else {

  extraCard.style.display =
  "flex";

  extraCard.href =
  data.extra_card_link;

  document.getElementById(
    "extra-card-text-view"
  ).innerText =
  data.extra_card_text;

  const extraImg =
document.getElementById(
  "extra-card-img"
);

extraImg.src =
data.extra_card_image;

extraImg.style.display =
"block";

}

loadProfile();
