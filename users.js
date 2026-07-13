const container =
document.getElementById(
  "users-container"
);

const searchInput =
document.getElementById(
  "search"
);

let allUsers = [];

const FALLBACK_AVATAR =
  "https://i.pinimg.com/736x/b8/77/85/b8778585aab18dca3f09ad853b5bff2b.jpg";

/* SKELETON ENQUANTO CARREGA */

function renderSkeleton(count = 8) {

  container.innerHTML = "";

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

  const { data, error } =

    await supabaseClient
      .from("profiles")
      .select(`
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

  allUsers = data;

  renderUsers(data);
}

/* ESTADO VAZIO */

function renderEmptyState(icon, message) {

  container.innerHTML = `
    <div class="empty-state">
      <i class="fa-solid ${icon}"></i>
      <p>${message}</p>
    </div>
  `;

}

/* RENDER USERS */

function renderUsers(users) {

  container.innerHTML = "";

  if (users.length === 0) {

    renderEmptyState(
      "fa-magnifying-glass",
      "Nenhum usuário encontrado."
    );

    return;

  }

  users.forEach(user => {

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

      <div class="user-card-avatar">
        <img src="${user.avatar_url || FALLBACK_AVATAR}">
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

    container.appendChild(card);
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

    renderUsers(filteredUsers);
  }
);

loadUsers();
