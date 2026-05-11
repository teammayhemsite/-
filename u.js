async function loadProfile() {

  const params =
    new URLSearchParams(
      window.location.search
    );

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

  console.log(data);
  console.log(error);

  if (error || !data) {

    document.body.innerHTML =
      "<h1>Perfil não encontrado</h1>";

    return;
  }

  // =========================
  // TÍTULO
  // =========================

  document.title =
    `@${data.username}`;

  // =========================
  // TEXTO
  // =========================

  document.getElementById(
    "username"
  ).innerText =
    data.username || "";

  document.getElementById(
    "bio"
  ).innerText =
    data.bio || "";

  // =========================
  // BALÃO (FIX)
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

  document.getElementById(
    "avatar"
  ).src =
    data.avatar_url || "";

  document.getElementById(
    "banner"
  ).style.backgroundImage =
    `url(${data.banner_url})`;

  // =========================
  // FUNDO
  // =========================

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

  // =========================
  // REDES SOCIAIS
  // =========================

  const socials =
    document.getElementById("socials");

  socials.innerHTML = "";

  if (data.youtube_url) {

    socials.innerHTML += `
      <a href="${data.youtube_url}" target="_blank">
        <img src="https://www.riqueza.life/images/socials/youtube.png" alt="" width="30%">
      </a>
    `;
  }

  if (data.instagram_url) {

    socials.innerHTML += `
      <a href="${data.instagram_url}" target="_blank">
         <img src="https://www.riqueza.life/images/socials/instagram.png" alt="" width="30%">ㅤ
      </a>
    `;
  }

  if (data.discord_url) {

    socials.innerHTML += `
      <a href="${data.discord_url}" target="_blank">
        <img src="https://www.riqueza.life/images/socials/discord.png" alt="" width="30%">
      </a>
    `;
  }

  if (data.spotify_url) {

    socials.innerHTML += `
      <a href="${data.spotify_url}" target="_blank">
        <img src="https://www.riqueza.life/images/socials/spotify.png" alt="" width="30%">
      </a>
    `;
  }

}

loadProfile();
