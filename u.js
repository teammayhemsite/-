const container =
document.getElementById(
  "users-container"
);

const podiumEl =
document.getElementById(
  "podium"
);

const searchInput =
document.getElementById(
  "search"
);

let allUsers = [];
let rankMap = new Map();

const FALLBACK_AVATAR =
  "https://i.pinimg.com/736x/b8/77/85/b8778585aab18dca3f09ad853b5bff2b.jpg";

/* SKELETON ENQUANTO CARREGA */

function renderSkeleton(count = 8) {

  container.innerHTML = "";

  podiumEl.classList.add("visible");

  podiumEl.innerHTML = `
    <div class="podium-skeleton ps-1"></div>
    <div class="podium-skeleton ps-2"></div>
    <div class="podium-skeleton ps-3"></div>
  `;

  for (let i = 0; i < count; i++) {

    const card =
      document.createElement("div");

    card.className =
      "user-card-skeleton";

    card.innerHTML = `
      <div class="skeleton-circle"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
    `;

    container.appendChild(card);

  }

}

/* CARREGAR USERS */

async function loadUsers() {

  renderSkeleton();

  const { data, error } =

    await supabaseClient
      .from("profiles")
      .select(`
        id,
        username,
        display_name,
        bio,
        avatar_url
      `)
      .order("created_at", {
        ascending: true
      });

  console.log(data);
  console.log(error);

  if (error) {

    renderEmptyState(
      "fa-triangle-exclamation",
      "Não deu pra carregar os usuários agora. Tenta de novo em instantes."
    );

    return;
  }

  // =========================
  // CONTAGEM DE CURTIDAS
  // =========================

  const { data: likesRows, error: likesError } =

    await supabaseClient
      .from("profile_likes")
      .select("profile_id");

  console.log(likesError);

  const likeCounts = {};

  (likesRows || []).forEach(row => {

    likeCounts[row.profile_id] =
      (likeCounts[row.profile_id] || 0) + 1;

  });

  const withLikes =
    data.map(user => ({
      ...user,
      likes: likeCounts[user.id] || 0
    }));

  // Mais curtidas primeiro; empate desempata por ordem alfabética
  withLikes.sort((a, b) => {

    if (b.likes !== a.likes) return b.likes - a.likes;

    return (a.display_name || a.username)
      .localeCompare(b.display_name || b.username);

  });

  allUsers = withLikes;

  rankMap = new Map(
    allUsers.map((user, i) => [user.id, i + 1])
  );

  renderUsers(allUsers, { showPodium: true });
}

/* ESTADO VAZIO */

function renderEmptyState(icon, message) {

  podiumEl.classList.remove("visible");
  podiumEl.innerHTML = "";

  container.innerHTML = `
    <div class="empty-state">
      <i class="fa-solid ${icon}"></i>
      <p>${message}</p>
    </div>
  `;

}

/* CARD DE USUÁRIO (lista) */

function buildUserCard(user, rank) {

  const card =
    document.createElement("a");

  card.className =
    "user-card";

  card.href =
    `/${user.username}`;

  const showHandle =
    user.display_name &&
    user.display_name !== user.username;

  card.innerHTML = `

    <span class="rank-badge">#${rank}</span>

    <div class="user-card-avatar">
      <img src="${user.avatar_url || FALLBACK_AVATAR}">
    </div>

    <div class="user-card-likes">
      <i class="fa-solid fa-heart"></i> ${user.likes || 0}
    </div>

    <h2>
      ${user.display_name || user.username}
    </h2>

    ${showHandle
      ? `<span class="handle">@${user.username}</span>`
      : ""
    }

    <p>
      ${user.bio || "Sem bio"}
    </p>

  `;

  return card;

}

/* CARD DO PÓDIUM (top 3) */

function buildPodiumPlace(user, place) {

  const el =
    document.createElement("a");

  el.className =
    `podium-place place-${place}`;

  el.href =
    `/${user.username}`;

  const showHandle =
    user.display_name &&
    user.display_name !== user.username;

  el.innerHTML = `

    <div class="podium-crown">
      ${place === 1 ? '<i class="fa-solid fa-crown"></i>' : ""}
    </div>

    <div class="podium-avatar">
      <img src="${user.avatar_url || FALLBACK_AVATAR}">
    </div>

    <h3>${user.display_name || user.username}</h3>

    ${showHandle
      ? `<span class="handle">@${user.username}</span>`
      : ""
    }

    <div class="podium-likes">
      <i class="fa-solid fa-heart"></i> ${user.likes || 0}
    </div>

    <div class="podium-base">${place}</div>

  `;

  return el;

}

/* RENDER USERS */

function renderUsers(users, { showPodium = false } = {}) {

  container.innerHTML = "";

  if (users.length === 0) {

    renderEmptyState(
      "fa-magnifying-glass",
      "Nenhum usuário encontrado."
    );

    return;

  }

  const canShowPodium =
    showPodium && users.length >= 3;

  if (!canShowPodium) {

    podiumEl.classList.remove("visible");
    podiumEl.innerHTML = "";

    users.forEach(user => {

      container.appendChild(
        buildUserCard(user, rankMap.get(user.id) || "?")
      );

    });

    return;

  }

  podiumEl.classList.add("visible");
  podiumEl.innerHTML = "";

  users.slice(0, 3).forEach((user, i) => {

    podiumEl.appendChild(
      buildPodiumPlace(user, i + 1)
    );

  });

  users.slice(3).forEach((user, i) => {

    container.appendChild(
      buildUserCard(user, i + 4)
    );

  });

}

/* PESQUISA */

searchInput.addEventListener(
  "input",
  () => {

    const value =
      searchInput.value
      .toLowerCase();

    const filteredUsers =
      allUsers.filter(user =>

        (user.display_name || "")
        .toLowerCase()
        .includes(value)

        ||

        (user.username || "")
        .toLowerCase()
        .includes(value)
      );

    renderUsers(filteredUsers, {
      showPodium: value.trim() === ""
    });
  }
);

loadUsers();
