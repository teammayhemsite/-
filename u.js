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

  if (data.card_background_url) {

    card.style.backgroundImage =
      `url(${data.card_background_url})`;

    card.style.backgroundSize =
      "cover";

    card.style.backgroundPosition =
      "center";

  }

  //=================
  // Emblemas
  //================
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

  if (data.username === "vtzadas_021" || data.username === "terunttt") {

    card.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="embboost">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="fill-theme drop-shadow-theme"><path d="M11.3598 1.23178C11.7307 0.92274 12.2693 0.92274 12.6402 1.23178L18.6402 6.23178C18.8682 6.42177 19 6.70322 19 7V17C19 17.2968 18.8682 17.5782 18.6402 17.7682L12.6402 22.7682C12.2693 23.0773 11.7307 23.0773 11.3598 22.7682L5.35982 17.7682C5.13182 17.5782 5 17.2968 5 17V7C5 6.70322 5.13182 6.42177 5.35982 6.23178L11.3598 1.23178ZM12.6757 5.26285C12.2934 4.91238 11.7066 4.91238 11.3243 5.26285L8.32428 8.01285C8.11765 8.20226 8 8.46969 8 8.75V15.25C8 15.5303 8.11765 15.7977 8.32428 15.9872L11.3243 18.7372C11.7066 19.0876 12.2934 19.0876 12.6757 18.7372L15.6757 15.9872C15.8824 15.7977 16 15.5303 16 15.25V8.75C16 8.46969 15.8824 8.20226 15.6757 8.01285L12.6757 5.26285ZM10 14.8101V9.1899L12 7.35657L14 9.1899V14.8101L12 16.6434L10 14.8101Z"></path></svg>
      booster
    </div>
    `
    );

  }

  if (data.username === "szn" || data.username === "phz_062") {

    card.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="embblack">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" width="15" height="15" class="fill-theme drop-shadow-theme"><path d="M74.2 4.2c-4.67 7.25-9.55 14.37-13.97 21.76-8.55 14.3-14.74 29.58-14.95 46.42-.1 7.8 2.05 15.63 4.37 23.51l3.46-5.77 1.2-.5c1.63 16.86 8.45 30.25 24.3 38.35V115.8l1.35-.61c1.13 1.9 2.34 3.76 3.35 5.72 2.1 4.07 3.42 8.74 6.26 12.18 7.05 8.53 17.16 7.05 23.3-2.18a27.8 27.8 0 0 0 4.54-18.45c-.48-4.73-3.66-9.52-6.61-13.57-3.5-4.78-8.04-8.79-11.92-12.92 15.7-5.42 30.62-.78 45.42 3.8 2.76.86 4.86 3.84 8.21 6.64-5.8.31-10.1.1-14.23.86-8.3 1.52-10.33 5.51-7.08 13.15 3.5 8.25 7.18 16.43 10.65 24.7 1.14 2.71 1.88 5.6 3 9.05 15.04-3.63 21.95-15.2 28.58-27.87v12.5c8.42-3.37 13.86-9.15 17.58-15.76 3.67-6.53 5.33-14.19 7.83-21.21l3.97 4.6c10.04-35.61-3.17-64.25-25.54-91.68 2.5.5 3.87.54 5.02 1.05 8.04 3.6 16.64 6.4 23.85 11.26 5.87 3.95 10.62 10 14.86 15.85a168 168 0 0 1 24.52 48.22c5.05 16 4.99 31.74 1.22 48.1-2.8 12.13-9.64 21.83-15.89 31.87-7.08 11.37-15.39 21.97-23.16 32.9l-1.66-.32c-.18-1.3-.65-2.64-.49-3.9 1-7.82 2.13-15.63 3.4-24.79-26.61 9.86-42.1 31.03-61.3 48.73-.52-1.6-1.39-2.81-1.17-3.79 2.61-11.48 4.91-23.06 8.29-34.32 2.08-6.96 7.32-12.16 13.4-16.33 10.71-7.34 21.6-14.46 31.91-22.34 7.57-5.8 13.64-13.19 17.4-22.17.38-.9.86-2.03.63-2.87-.36-1.27-1.3-2.37-2-3.55-1 .7-2.28 1.21-2.96 2.15-4.66 6.41-8.85 13.19-13.9 19.27-2.78 3.38-6.82 5.78-10.47 8.37-7.87 5.59-15.87 11-23.8 16.51-9.22 6.43-15.58 14.98-18.38 25.9-2.06 8.06-3.54 16.27-5.52 24.35-2.08 8.53.83 16.04 4.3 23.48.7 1.5 1.62 2.92 2.3 4.43 4.53 10.11 3.42 10.83-6.94 14.92-2.75 1.08-5.68 1.7-8.63 2.9-4.46.36-8.81.36-13.64.36-1.66-.95-2.73-2.16-4.07-2.8-3.16-1.47-6.48-2.62-9.69-4-3.42-1.46-4.88-3.38-2.7-7.33 3.62-6.54 6.76-13.34 9.93-20.12a8 8 0 0 0 .71-4.72c-2.46-10.69-5.36-21.28-7.7-31.99-2.23-10.23-9.38-16.56-16.92-22.68-10.85-8.8-21.98-17.28-32.51-26.44-4.05-3.52-6.84-8.5-10.1-12.9-1.88-2.52-3.37-5.36-5.43-7.72-.83-.96-2.7-1-4.1-1.45 0 1.66-.57 3.62.12 4.92 7.1 13.5 17.41 24.2 29.4 33.48 8.93 6.9 17.96 13.76 26.26 21.38 3.45 3.16 5.95 7.98 7.4 12.53 2.73 8.52 4.46 17.37 6.4 26.12.4 1.76-.1 3.72-.25 6.82-19.28-18.82-36.34-38.31-61-49.5l2.8 30.2c-2.28-2.17-3.84-3.27-4.92-4.73-9.11-12.28-19.24-23.99-26.81-37.15C9.78 143.36 7 132 4.3 121.14c-1.82-7.33-1.67-15.2-1.85-22.85-.08-3.35 1.36-6.72 1.84-10.12 2.48-17.24 11.02-32.05 19.6-46.61 5-8.5 12.22-15.7 18.52-23.42.7-.86 1.85-1.43 2.9-1.9C54.59 12.1 63.88 8.01 73.6 3.98c.44.07.59.22.59.22m55.53 87.57c-4.18-4.25-11.06-5.5-14.03-2.17 4.48 2.5 8.58 5.73 14.03 2.17"></path></svg>
      BLACK
    </div>
    `
    );

  }

  if (data.username === "bot") {

    card.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="embblack">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" class="fill-theme drop-shadow-theme"><path d="M23.334 11.96c-.713-.726-.872-1.829-.393-2.727.342-.64.366-1.401.064-2.062-.301-.66-.893-1.142-1.601-1.302-.991-.225-1.722-1.067-1.803-2.081-.059-.723-.451-1.378-1.062-1.77-.609-.393-1.367-.478-2.05-.229-.956.347-2.026.032-2.642-.776-.44-.576-1.124-.915-1.85-.915-.725 0-1.409.339-1.849.915-.613.809-1.683 1.124-2.639.777-.682-.248-1.44-.163-2.05.229-.61.392-1.003 1.047-1.061 1.77-.082 1.014-.812 1.857-1.803 2.081-.708.16-1.3.642-1.601 1.302s-.277 1.422.065 2.061c.479.897.32 2.001-.392 2.727-.509.517-.747 1.242-.644 1.96s.536 1.347 1.17 1.7c.888.495 1.352 1.51 1.144 2.505-.147.71.044 1.448.519 1.996.476.549 1.18.844 1.902.798 1.016-.063 1.953.54 2.317 1.489.259.678.82 1.195 1.517 1.399.695.204 1.447.072 2.031-.357.819-.603 1.936-.603 2.754 0 .584.43 1.336.562 2.031.357.697-.204 1.258-.722 1.518-1.399.363-.949 1.301-1.553 2.316-1.489.724.046 1.427-.249 1.902-.798.475-.548.667-1.286.519-1.996-.207-.995.256-2.01 1.145-2.505.633-.354 1.065-.982 1.169-1.7s-.135-1.443-.643-1.96zm-12.584 5.43l-4.5-4.364 1.857-1.857 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.642z"></path></svg>
      BOT's
    </div>
    `
    );

  }

  
  //=================
  // Final Emblemas
  //================

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
    `<img src="https://cdn.simpleicons.org/youtube">`,
    "Youtube",
    data.username
  );

  addSocial(
    data.instagram_url,
    `<img src="https://cdn.simpleicons.org/instagram">`,
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
    `<img src="https://cdn.simpleicons.org/tiktok">`,
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
        ${text || ""}
      </span>

    `;

    conteudo.appendChild(card);

  }

}

loadProfile();
