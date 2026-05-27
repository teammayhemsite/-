// =========================
// TOGGLE SEÇÕES
// =========================

document.querySelectorAll(".toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.classList.toggle("active");
  });
});

const $ = (id) => document.getElementById(id);

// =========================
// INPUTS PERFIL
// =========================

const nameInput = $("name-input");
const bioInput = $("bio-input");

const avatarFile = $("avatar-file");
const bannerFile = $("banner-file");
const backgroundFile = $("background-file");

const overlayInput = $("overlay-input");

const templateInput = $("template-input");
const textColorInput = $("text-color-input");
const boxStyleInput = $("box-style-input");

// =========================
// REDES
// =========================

const youtubeInput = $("youtube-input");
const instagramInput = $("instagram-input");
const discordInput = $("discord-input");
const spotifyInput = $("spotify-input");
const tiktokInput = $("tiktok-input");
const whatsappInput = $("whatsapp-input");
const twitterInput = $("twitter-input");
const facebookInput = $("facebook-input");

// =========================
// CARDS EXTRAS
// =========================

const cards = [
  { t: $("extra1-text"), i: $("extra1-img"), l: $("extra1-link") },
  { t: $("extra2-text"), i: $("extra2-img"), l: $("extra2-link") },
  { t: $("extra3-text"), i: $("extra3-img"), l: $("extra3-link") },
  { t: $("extra4-text"), i: $("extra4-img"), l: $("extra4-link") }
];

// =========================
// UPLOAD SUPABASE
// =========================

async function uploadImage(file, userId, type, oldUrl = null) {

  const filePath = `users/${userId}/${type}.png`;

  const { error } = await supabaseClient
    .storage
    .from("images")
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.log(error);
    return null;
  }

  const { data } = supabaseClient
    .storage
    .from("images")
    .getPublicUrl(filePath);

  return `${data.publicUrl}?v=${Date.now()}`;
}

  if (oldUrl && oldUrl.includes("/images/")) {
    const oldPath = oldUrl.split("/images/")[1];

    await supabaseClient
      .storage
      .from("images")
      .remove([oldPath]);
  }

  return data.publicUrl;
}

// =========================
// PREVIEW
// =========================

function updatePreview() {
  const previewCard = document.querySelector(".cardking");

  if (boxStyleInput.value === "transparent") {
    previewCard.style.backdropFilter = "blur(1px)";
  } else {
    previewCard.style.backdropFilter = "blur(18px)";
  }

  previewCard.style.setProperty("--text-color", textColorInput.value);

  document.body.classList.remove(
    "cardking-theme",
    "cardkingdois-theme",
    "template3-theme"
  );

  document.body.classList.add(
    templateInput.value === "cardkingdois"
      ? "cardkingdois-theme"
      : templateInput.value === "template3"
      ? "template3-theme"
      : "cardking-theme"
  );

  $("preview-name").innerText = nameInput.value || "Nome";
  $("preview-bio").innerText = bioInput.value || "Bio";

  // imagens preview (LOCAL FILE)
  if (avatarFile.files[0]) {
    $("preview-avatar").src = URL.createObjectURL(avatarFile.files[0]);
  }

  if (bannerFile.files[0]) {
    $("preview-banner").style.backgroundImage =
      `url(${URL.createObjectURL(bannerFile.files[0])})`;
  }

  if (backgroundFile.files[0]) {
    document.body.style.backgroundImage =
      `url(${URL.createObjectURL(backgroundFile.files[0])})`;
    document.body.style.backgroundSize = "cover";
  }

  const balao = $("preview-overlay");

  if (overlayInput.value.trim()) {
    balao.style.display = "block";
    balao.innerText = overlayInput.value;
  } else {
    balao.style.display = "none";
  }

  // extras
  const container = $("extras-container");
  container.innerHTML = "";

  cards.forEach(c => {
    if (!c.t.value && !c.i.value && !c.l.value) return;

    const card = document.createElement("a");
    card.className = "extra-card";
    card.href = c.l.value || "#";
    card.target = "_blank";

    card.innerHTML = `
      <div class="extra-card-icon">
        <img src="${c.i.value || "https://via.placeholder.com/55"}">
      </div>
      <span>${c.t.value || ""}</span>
    `;

    container.appendChild(card);
  });
}

// inputs live
document.querySelectorAll("input, textarea, select")
  .forEach(el => el.addEventListener("input", updatePreview));

// =========================
// CARREGAR
// =========================

async function loadDashboard() {
  const { data: { user } } =
    await supabaseClient.auth.getUser();

  if (!user) return;

  const { data } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!data) return;

  nameInput.value = data.display_name || "";
  bioInput.value = data.bio || "";

  overlayInput.value = data.balao || "";
  templateInput.value = data.template || "cardking";
  boxStyleInput.value = data.box_style || "blur";
  textColorInput.value = data.text_color || "white";

  youtubeInput.value = data.youtube_url || "";
  instagramInput.value = data.instagram_url || "";
  discordInput.value = data.discord_url || "";
  spotifyInput.value = data.spotify_url || "";
  tiktokInput.value = data.tiktok_url || "";
  whatsappInput.value = data.whatsapp_url || "";
  twitterInput.value = data.twitter_url || "";
  facebookInput.value = data.facebook_url || "";

  cards.forEach((c, i) => {
    c.t.value = data[`extra${i + 1}_text`] || "";
    c.i.value = data[`extra${i + 1}_img`] || "";
    c.l.value = data[`extra${i + 1}_link`] || "";
  });

  updatePreview();
}

loadDashboard();

// =========================
// SALVAR PERFIL
// =========================

document.getElementById("save-btn")
.addEventListener("click", async () => {

  const { data: { user } } =
    await supabaseClient.auth.getUser();

  if (!user) return;

  const username = user.email.split("@")[0].toLowerCase();

  const { data: old } = await supabaseClient
    .from("profiles")
    .select("avatar_url, banner_url, background_url")
    .eq("id", user.id)
    .single();

  // uploads
  let avatarUrl = old?.avatar_url;
  let bannerUrl = old?.banner_url;
  let backgroundUrl = old?.background_url;

  if (avatarFile.files[0]) {
  const uploaded = await uploadImage(
    avatarFile.files[0],
    user.id,
    "avatar",
    old?.avatar_url
  );

  if (uploaded) avatarUrl = uploaded;
}

  if (bannerFile.files[0]) {
  const uploaded = await uploadImage(
    bannerFile.files[0],
    user.id,
    "banner",
    old?.banner_url
  );

  if (uploaded) bannerUrl = uploaded;
}
  
  if (backgroundFile.files[0]) {
  const uploaded = await uploadImage(
    backgroundFile.files[0],
    user.id,
    "background",
    old?.background_url
  );

  if (uploaded) backgroundUrl = uploaded;
}
  
  const payload = {
    id: user.id,
    username,

    display_name: nameInput.value,
    bio: bioInput.value,

    avatar_url: avatarUrl,
    banner_url: bannerUrl,
    background_url: backgroundUrl,

    balao: overlayInput.value,
    text_color: textColorInput.value,
    template: templateInput.value,
    box_style: boxStyleInput.value,

    youtube_url: youtubeInput.value,
    instagram_url: instagramInput.value,
    discord_url: discordInput.value,
    spotify_url: spotifyInput.value,
    tiktok_url: tiktokInput.value,
    whatsapp_url: whatsappInput.value,
    twitter_url: twitterInput.value,
    facebook_url: facebookInput.value
  };

  cards.forEach((c, i) => {
    payload[`extra${i + 1}_text`] = c.t.value;
    payload[`extra${i + 1}_img`] = c.i.value;
    payload[`extra${i + 1}_link`] = c.l.value;
  });

  const { error } = await supabaseClient
    .from("profiles")
    .upsert(payload);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Perfil salvo com sucesso!");
  window.location.href = `/${username}`;
});
