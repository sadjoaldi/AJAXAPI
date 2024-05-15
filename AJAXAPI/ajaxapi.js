// function pour la récupération de la liste de toutes les régions et mise à jour du menu déroulant "Liste des régions"

async function getRegions() {
  const res = await fetch("https://geo.api.gouv.fr/regions");
  const regions = await res.json();
  console.log(regions);
  return regions;
}

// function pour recuperer la liste des départements d'une région
async function getDepartements(regionId) {
  const res = await fetch(
    `https://geo.api.gouv.fr/regions/${regionId}/departements`
  );
  const departements = await res.json();
  return departements;
}

// function pour recuperer la liste des communes d'un département
async function getCommunes(departementId) {
  const res = await fetch(
    `https://geo.api.gouv.fr/departements/${departementId}/communes`
  );
  const communes = await res.json();
  return communes;
}

// Fonction pour afficher les communes
async function showCommunes() {
  const regionSelect = document.querySelector("#selectRegion");
  const departmentSelect = document.querySelector("#selectDepartement");
  const communesList = document.querySelector("#communeList");

  // Vérification que les éléments sont selectionnés
  if (!regionSelect || !departmentSelect || !communesList) {
    console.error("element not found.");
    return;
  }

  // const selectedRegionId = regionSelect.value;
  const selectedDepartmentId = departmentSelect.value;

  const communes = await getCommunes(selectedDepartmentId);

  // trie des communes en fonction de la population
  communes.sort((a, b) => b.population - a.population);

  communesList.innerHTML = "";
  communes.forEach((commune) => {
    const li = document.createElement("li");
    li.textContent = `${commune.nom} (${commune.population} habitants )`;
    communesList.appendChild(li);
  });
}

// Initialisation de la page
async function init() {
  const regions = await getRegions();
  const regionSelect = document.querySelector("#selectRegion");
  regions.forEach((region) => {
    const option = document.createElement("option");
    option.value = region.code;
    option.textContent = region.nom;
    regionSelect.appendChild(option);
  });

  regionSelect.addEventListener("change", async () => {
    const selectedRegionId = regionSelect.value;
    const departments = await getDepartements(selectedRegionId);
    const departmentSelect = document.querySelector("#selectDepartement");

    departmentSelect.innerHTML = "";
    departments.forEach((department) => {
      const option = document.createElement("option");
      option.value = department.code;
      option.textContent = department.nom;
      departmentSelect.appendChild(option);
    });
  });

  const showCommunesButton = document.querySelector("#btnCommune");
  showCommunesButton.addEventListener("click", showCommunes);
}

init();
