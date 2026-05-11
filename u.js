async function loadProfile() {

  // PEGA O USERNAME DA URL
  // exemplo:
  // /krpris -> rewrite -> /u.html?user=krpris

  const params =
  new URLSearchParams(window.location.search);

  const username =
  params.get("user");

  console.log("USERNAME URL:", username);

  console.log("USERNAME:", username);

  if (!username) {

    document.body.innerHTML =
    "<h1>Usuário não encontrado</h1>";

    return;

  }

  // BUSCA NO SUPABASE

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

loadProfile();
