async function loadProfile() {

  const params =
  new URLSearchParams(
    window.location.search
  );

  const username =
  params.get("user");

  console.log(
    "USERNAME URL:",
    username
  );

  if (!username) {

    document.body.innerHTML =
    "<h1>Usuário não encontrado</h1>";

    return;

  }

  const { data, error } =

  await supabaseClient
  .from("profiles")
  .select("*")
  .eq("username", username)
  .single();

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error || !data) {

    document.body.innerHTML =
    "<h1>Perfil não encontrado</h1>";

    return;

  }

  document.title =
  `@${data.username}`;

  document.getElementById(
    "username"
  ).innerText =
  data.display_name ||
  data.username;

  document.getElementById(
    "bio"
  ).innerText =
  data.bio || "";

  const balao =
  document.getElementById(
    "balao"
  );

  if (
    !data.balao ||
    data.balao.trim() === ""
  ) {

    balao.style.display =
    "none";

  } else {

    balao.style.display =
    "block";

    balao.innerText =
    data.balao;

  }

  document.getElementById(
    "avatar"
  ).src =
  data.avatar_url || "";

  document.getElementById(
    "banner"
  ).style.backgroundImage =
  `url(${data.banner_url || ""})`;

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

  const socials =
  document.getElementById(
    "socials"
  );

  socials.innerHTML = "";

  function addSocial(
    url,
    iconHTML
  ) {

    if (!url) return;

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

loadProfile();
