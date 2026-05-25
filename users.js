async function loadUsers() {

  const container =
    document.getElementById(
      "users-container"
    );

  const { data, error } =

    await supabaseClient
      .from("profiles")
      .select("*")
      .order("created_at", {
        ascending: false
      });

  console.log(data);
  console.log(error);

  if (error) {

    container.innerHTML =
      "<p>Erro ao carregar usuários</p>";

    return;

  }

  data.forEach(user => {

    const card =
      document.createElement("a");

    card.className =
      "user-card";

    card.href =
      `/${user.username}`;

    card.innerHTML = `

      <img src="
        ${user.avatar_url ||
        "https://via.placeholder.com/70"}
      ">

      <h2>
        ${user.display_name ||
        user.username}
      </h2>

      <p>
        ${user.bio || "Sem bio"}
      </p>

    `;

    container.appendChild(card);

  });

}

loadUsers();