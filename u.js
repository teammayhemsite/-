async function loadProfile() {

  const params =
    new URLSearchParams(window.location.search);

  const userId =
    params.get("id");

  if (!userId) {

    document.body.innerHTML =
      "<h1>Usuário não encontrado</h1>";

    return;
  }

  const { data, error } =
    await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

  if (error || !data) {

    document.body.innerHTML =
      "<h1>Perfil não encontrado</h1>";

    return;
  }

  // =========================
  // TÍTULO
  // =========================

  document.title = `@${data.username}`;

  // =========================
  // TEXTO
  // =========================

  document.getElementById("username").innerText =
    data.username || "";

  document.getElementById("bio").innerText =
    data.bio || "";

  // =========================
  // BALÃO (OCULTA SE VAZIO)
  // =========================

  const balao = document.getElementById("balao");

  if (!data.balao || data.balao.trim() === "") {
    balao.style.display = "none";
  } else {
    balao.style.display = "block";
    balao.innerText = data.balao;
  }

  // =========================
  // IMAGENS
  // =========================

  document.getElementById("avatar").src =
    data.avatar_url || "";

  document.getElementById("banner").style.backgroundImage =
    `url(${data.banner_url || ""})`;

  // =========================
  // FUNDO
  // =========================

  if (data.background_url) {

    document.body.style.backgroundImage =
      `url(${data.background_url})`;

    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
  }

  // =========================
  // REDES SOCIAIS
  // =========================

  const socials =
    document.getElementById("socials");

  socials.innerHTML = "";

  function addSocial(url, iconHTML) {
    if (!url || url.trim() === "") return;

    socials.innerHTML += `
      <a href="${url}" target="_blank">
        ${iconHTML}
      </a>
    `;
  }

  // ICONES PADRÃO (FontAwesome + imagens onde precisa)

  addSocial(data.youtube_url, ` <img src="https://www.riqueza.life/images/socials/youtube.png" alt="">`);

  addSocial(data.instagram_url,
    ` <img src="https://www.riqueza.life/images/socials/instagram.png" alt="">`
  );

  addSocial(data.discord_url,
    `<img src="https://www.riqueza.life/images/socials/discord.png" alt="">`
  );

  addSocial(data.spotify_url, `<img src="https://www.riqueza.life/images/socials/spotify.png" alt="">`);

  // NOVAS REDES

  addSocial(data.tiktok_url,
    `<img src="https://www.riqueza.life/images/socials/tiktok.png" alt="">`
  );

  addSocial(data.whatsapp_url,
    `<img src="https://www.riqueza.life/images/socials/whatsapp.png">`
  );

  addSocial(data.facebook_url,
    `<img src="https://www.riqueza.life/images/socials/twitch.png">`
  );

  addSocial(data.twitter_url,
    `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg">`
  );

}

loadProfile();
