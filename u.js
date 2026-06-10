function showNotFound() {

  document.body.innerHTML = `

    <div class="notfound-page">

      <div class="notfound-overlay"></div>

      <div class="notfound-content">

        <img
          class="astronaut"
          src="https://i.pinimg.com/originals/42/c6/2a/42c62a68fa0154599d1da42a43ac6dcd.gif"
        >

        <div class="notfound-text">

          <h2>Oops!</h2>

          <h1>404</h1>

          <p>
            Perfil não encontrado<br>
            ou inexistente.
          </p>

          <a href="https://teammayhem.vercel.app" class="back-home">
            Voltar ao início
          </a>
          <br>
          <br>
          <br>
          <a href="https://teammayhem.vercel.app/cadastro.html" class="back-home">
            Criar perfil
          </a>
        </div>

      </div>

    </div>

  `;

}

async function loadProfile() {

  let visitorId =
    localStorage.getItem(
      "visitor_id"
    );

  if (!visitorId) {

    visitorId =
      crypto.randomUUID();

    localStorage.setItem(
      "visitor_id",
      visitorId
    );

  }

  let username = null;

  // =========================
  // PEGA USERNAME
  // =========================

  const params =
    new URLSearchParams(window.location.search);

  username =
    params.get("user");

  if (!username) {

    username =
      window.location.pathname
        .replace("/", "")
        .trim();

  }

  console.log("USERNAME:", username);

  if (
    !username ||
    username === "u.html"
  ) {

    showNotFound();

    return;

  }

  // =========================
  // BUSCA PERFIL
  // =========================

  const { data, error } =

    await supabaseClient
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

  console.log(data);
  console.log(error);

  if (error || !data) {

    showNotFound();

    return;

  }

  const card =
    document.querySelector(".cardking");

  if (data.username === "krpris" || data.username === "kaio") {

    card.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="embking">
      <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"></path>
      <path d="M5 21h14"></path>
    </svg> OWNER
    </div>
    `
    );

  }

  const likeBtn =
    document.getElementById(
      "like-btn"
    );

  const likeCount =
    document.getElementById(
      "like-count"
    );

  // =========================
  // CURTIDAS
  // =========================

  const { count } =
    await supabaseClient
      .from("profile_likes")
      .select("*", {
        count: "exact",
        head: true
      })
      .eq("profile_id", data.id);

  likeCount.textContent =
    count || 0;

  // =========================
  // VERIFICA SE JÁ CURTIU
  // =========================

  const { data: alreadyLiked } =
    await supabaseClient
      .from("profile_likes")
      .select("id")
      .eq("profile_id", data.id)
      .eq("visitor_id", visitorId)
      .maybeSingle();

  if (alreadyLiked) {

    likeBtn.classList.add(
      "liked"
    );

  }

  // =========================
  // CURTIR
  // =========================

  likeBtn.onclick =
    async () => {

      console.log("CLICOU");

      if (
        likeBtn.classList.contains(
          "liked"
        )
      ) {
        return;
      }

      const result =
        await supabaseClient
          .from("profile_likes")
          .insert({
            profile_id: data.id,
            visitor_id: visitorId
          });

      console.log(result);

      if (error) {

        console.error(error);

        return;

      }

      likeBtn.classList.add(
        "liked"
      );

      likeCount.textContent =
        Number(
          likeCount.textContent
        ) + 1;

    };

  const entrance =
    document.getElementById(
      "entrance-screen"
    );

  if (!data.entrance_enabled) {

    entrance.style.display =
      "none";

  }


  else {

    document.getElementById(
      "entrance-title"
    ).innerText =

      data.entrance_text?.trim()

      ||

      data.display_name

      ||

      data.username;

  }

  if (data.entrance_enabled) {

    entrance.onclick = async () => {

      const audio =
        document.getElementById(
          "profile-music"
        );

      if (audio && data.music_url) {

        try {

          await audio.play();

        } catch (err) {

          console.log(
            "Erro ao tocar:",
            err
          );

        }

      }

      entrance.style.opacity = "0";
      entrance.style.pointerEvents = "none";

      setTimeout(() => {

        entrance.remove();

      }, 500);

    };

  }
  // =========================
  // TITLE
  // =========================

  document.title =
    `@${data.username}`;

  // =========================
  // TEMPLATE
  // =========================

  document.body.classList.remove(
    "cardking-theme",
    "cardkingdois-theme",
    "template3-theme",
    "template4-theme"
  );

  if (
    data.template ===
    "cardkingdois"
  ) {

    document.body.classList.add(
      "cardkingdois-theme"
    );

  } else if (
    data.template ===
    "template3"
  ) {

    document.body.classList.add(
      "template3-theme"
    );

  }

  else if (
    data.template ===
    "template4"
  ) {

    document.body.classList.add(
      "template4-theme"
    );

  }
  else {

    document.body.classList.add(
      "cardking-theme"
    );

  }

  // =========================
  // BOX STYLE
  // =========================

  if (
    data.box_style ===
    "transparent"
  ) {

    document
      .querySelector(".cardking")
      .style.backdropFilter =
      "blur(1px)";

    document
      .querySelector(".cardking")
      .style.webkitBackdropFilter =
      "blur(1px)";

  } else {

    document
      .querySelector(".cardking")
      .style.backdropFilter =
      "blur(18px)";

    document
      .querySelector(".cardking")
      .style.webkitBackdropFilter =
      "blur(18px)";

  }

  // =========================
  // TEXTO
  // =========================

  document
    .querySelector(".cardking")
    .style.setProperty(
      "--text-color",
      data.text_color || "white"
    );

  document.getElementById(
    "username"
  ).innerText =
    data.display_name || data.username;

  document.getElementById(
    "bio"
  ).innerText =
    data.bio || "";

  // =========================
  // BALÃO
  // =========================

  const balao =
    document.getElementById("balao");

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

  // =========================
  // IMAGENS
  // =========================

  document.getElementById(
    "avatar"
  ).src =

    data.avatar_url

      ? `${data.avatar_url}?v=${Date.now()}`

      : "https://i.pinimg.com/736x/b8/77/85/b8778585aab18dca3f09ad853b5bff2b.jpg";

  const frame =
    document.getElementById("avatar-frame");

  if (data.frame_url) {

    frame.src = data.frame_url;
    frame.style.display = "block";

  } else {

    frame.style.display = "none";

  }

  document.getElementById(
    "banner"
  ).style.backgroundImage =

    data.banner_url

      ? `url(${data.banner_url}?v=${Date.now()})`

      : "";

  // =========================
  // FUNDO
  // =========================

  if (data.background_url) {

    document.body.style.backgroundImage =

      `url(${data.background_url}?v=${Date.now()})`;

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
  // MUSIC PLAYER
  // =========================

  if (data.music_url) {

    const audio =
      document.getElementById(
        "profile-music"
      );

    const pill =
      document.querySelector(
        ".ac2-pill"
      );

    const playBtn =
      document.querySelector(
        ".play-btn"
      );

    const trigger =
      document.querySelector(
        ".ac2-trigger"
      );

    const volume =
      document.querySelector(
        ".ac2-volume"
      );

    pill.classList.add("show");

    audio.src =
      data.music_url;

    audio.volume = 0.1;

    // autoplay

    audio.addEventListener("play", () => {

      trigger.classList.add("playing");

      playBtn.innerHTML =
        `<i class="fas fa-pause"></i>`;

    });

    audio.addEventListener("pause", () => {

      trigger.classList.remove("playing");

      playBtn.innerHTML =
        `<i class="fas fa-play"></i>`;

    });

    // PLAY / PAUSE
    function toggleMusic() {

      if (audio.paused) {

        audio.play();

        trigger.classList.add(
          "playing"
        );

        playBtn.innerHTML =
          `<i class="fas fa-pause"></i>`;

      } else {

        audio.pause();

        trigger.classList.remove(
          "playing"
        );

        playBtn.innerHTML =
          `<i class="fas fa-play"></i>`;

      }

    }

    trigger.onclick =
      toggleMusic;

    playBtn.onclick =
      toggleMusic;

    // volume
    volume.addEventListener(
      "input",
      () => {

        audio.volume =
          volume.value / 100;

      }
    );

  }

  // =========================
  // REDES
  // =========================

  const socials =
    document.getElementById("socials");

  socials.innerHTML = "";

  function addSocial(
    url,
    iconHTML,
    title,
    user
  ) {

    if (
      !url ||
      url.trim() === ""
    ) return;

    // TEMPLATE 3
    if (
      document.body.classList.contains(
        "template3-theme"
      )
    ) {

      socials.innerHTML += `

        <a href="${url}" target="_blank">

          ${iconHTML}

          <div class="social-text">

            <strong>${title}</strong>

            <span>${user || ""}</span>

          </div>

        </a>

      `;

    }

    // TEMPLATE 1 E 2
    else {

      socials.innerHTML += `

        <a href="${url}" target="_blank">

          ${iconHTML}

        </a>

      `;

    }

  }

  addSocial(
    data.youtube_url,
    `<img src="https://www.riqueza.life/images/socials/youtube.png">`,
    "Youtube",
    data.username
  );

  addSocial(
    data.instagram_url,
    `<img src="https://www.riqueza.life/images/socials/instagram.png">`,
    "Instagram",
    data.username
  );

  addSocial(
    data.discord_url,
    `<img src="https://cdn.simpleicons.org/discord">`,
    "Discord",
    data.username
  );

  addSocial(
    data.spotify_url,
    `<img src="https://cdn.simpleicons.org/spotify">`,
    "Spotify",
    data.username
  );

  addSocial(
    data.tiktok_url,
    `<img src="https://www.riqueza.life/images/socials/tiktok.png">`,
    "TikTok",
    data.username
  );

  addSocial(
    data.whatsapp_url,
    `<img src="https://cdn.simpleicons.org/whatsapp">`,
    "WhatsApp",
    data.username
  );

  addSocial(
    data.twitter_url,
    `<img src="https://cdn.simpleicons.org/x">`,
    "Twitter/X",
    data.username
  );

  addSocial(
    data.facebook_url,
    `<img src="https://cdn.simpleicons.org/facebook">`,
    "Facebook",
    data.username
  );

  addSocial(
    data.telegram_url,
    `<img src="https://cdn.simpleicons.org/telegram">`,
    "Telegram",
    data.username
  );

  addSocial(
    data.github_url,
    `<img src="https://cdn.simpleicons.org/github">`,
    "GitHub",
    data.username
  );

  addSocial(
    data.linkedin_url,
    `<img src="https://img.icons8.com/color/48/linkedin.png">`,
    "LinkedIn",
    data.username
  );

  addSocial(
    data.kick_url,
    `<img src="https://cdn.simpleicons.org/kick">`,
    "Kick",
    data.username
  );

  addSocial(
    data.roblox_url,
    `<img src="https://cdn.simpleicons.org/roblox">`,
    "Roblox",
    data.username
  );

  addSocial(
    data.steam_url,
    `<img src="https://cdn.simpleicons.org/steam">`,
    "Steam",
    data.username
  );

  addSocial(
    data.xbox_url,
    `<img src="https://img.icons8.com/color/48/xbox.png">`,
    "Xbox",
    data.username
  );

  addSocial(
    data.twitch_url,
    `<img src="https://cdn.simpleicons.org/twitch">`,
    "Twitch",
    data.username
  );

  addSocial(
    data.privacy_url,
    `<img src="https://www.riqueza.life/images/socials/privacy.png">`,
    "Privacy",
    data.username
  );

  addSocial(
    data.onlyfans_url,
    `<img src="https://cdn.simpleicons.org/onlyfans">`,
    "OnlyFans",
    data.username
  );

  addSocial(
    data.fivem_url,
    `<img src="https://cdn.simpleicons.org/fivem">`,
    "FiveM",
    data.username
  );

  addSocial(
    data.pinterest_url,
    `<img src="https://cdn.simpleicons.org/pinterest">`,
    "Pinterest",
    data.username
  );

  addSocial(
    data.email_url,
    `<img src="https://cdn.simpleicons.org/maildotru">`,
    "Email",
    data.username
  );

  addSocial(
    data.threads_url,
    `<img src="https://cdn.simpleicons.org/threads">`,
    "Threads",
    data.username
  );

  addSocial(
    data.bsky_url,
    `<img src="https://cdn.simpleicons.org/bluesky">`,
    "Bluesky",
    data.username
  );

  addSocial(
    data.vsco_url,
    `<img src="https://cdn.simpleicons.org/vsco">`,
    "VSCO",
    data.username
  );

  addSocial(
    data.pix_url,
    `<img src="https://cdn.simpleicons.org/pix">`,
    "Pix",
    data.username
  );



  // =========================
  // CARDS EXTRAS
  // =========================

  const conteudo =
    document.getElementById(
      "extras-container"
    );

  conteudo.innerHTML = "";

  for (let i = 1; i <= 4; i++) {

    const text =
      (data[`extra${i}_text`] || "").trim();

    const image =
      (data[`extra${i}_img`] || "").trim();

    const link =
      (data[`extra${i}_link`] || "").trim();

    if (
      text === "" &&
      image === "" &&
      link === ""
    ) {
      continue;
    }

    const card =
      document.createElement("a");

    card.className =
      "extra-card";

    card.href =
      link || "#";

    card.target =
      "_blank";

    let imageHTML = "";

    if (image !== "") {

      imageHTML = `
        <div class="extra-card-icon">
          <img src="${image}">
        </div>
      `;

    }

    card.innerHTML = `

      ${imageHTML}

      <span>
        ${text || "Card extra"}
      </span>

    `;

    conteudo.appendChild(card);

  }

}

loadProfile();
