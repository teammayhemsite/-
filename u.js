async function loadProfile() {

  let username = new URLSearchParams(location.search).get("user");

if (!username) {
  username = location.pathname.split("/").filter(Boolean).pop();
}

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) {
    document.body.innerHTML = "<h1>Perfil não encontrado</h1>";
    return;
  }

  document.getElementById("username").innerText = data.display_name || "Sem nome";
  document.getElementById("bio").innerText = data.bio || "";

  document.getElementById("avatar").src = data.avatar_url || "";
  document.getElementById("banner").style.backgroundImage = `url(${data.banner_url || ""})`;
  document.getElementById("balao").innerText = data.balao || "";

  // REDES
  const socials = document.getElementById("socials");
  socials.innerHTML = "";

  function add(url, img) {
  if (!url) return;

  socials.innerHTML += `
    <a href="${url}" target="_blank">
      <img src="${img}">
    </a>
  `;
}

add(data.youtube_url, "https://www.riqueza.life/images/socials/youtube.png");
add(data.instagram_url, "https://www.riqueza.life/images/socials/instagram.png");
add(data.discord_url, "https://www.riqueza.life/images/socials/discord.png");
add(data.spotify_url, "https://www.riqueza.life/images/socials/spotify.png");

  // CARDS EXTRAS (CORRIGIDO)
  for (let i = 1; i <= 4; i++) {

    const text = data[`extra${i}_text`];
    const img = data[`extra${i}_img`];
    const link = data[`extra${i}_link`];

    if (!text && !img && !link) continue;

    const card = document.createElement("a");
    card.className = "extra-card";
    card.href = link || "#";
    card.target = "_blank";

    card.innerHTML = `
      <div class="extra-card-icon">
        <img src="${img || ''}">
      </div>
      <span>${text || ''}</span>
    `;

    document.querySelector(".cardking").appendChild(card);
  }
}

loadProfile();
