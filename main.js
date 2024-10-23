const baseUrl = "https://geo.api.gouv.fr/";

/*--------------------------------------------------*/
/*Ajouts des régions dans le select*/
const select_region = document.querySelector("#select_region");

fetch(baseUrl + "regions")
  .then(response => response.json())
  .then(data => {
    const options = data.map(region =>
      `<option value="${region.code}">${region.nom}</option>`
    ).join('');

    select_region.innerHTML = `<option value="0">--------------</option>` + options;
  })
  .catch(error => console.error('Erreur:', error));


/*--------------------------------------------------*/
/*Ajouts des départements dans le select*/
const select_department = document.querySelector("#select_department");

select_region.addEventListener('change', (e) => {
  const code = e.target.value;

  if (code > 0) {
    fetch(baseUrl + "regions/" + code + "/departements")
      .then(response => response.json())
      .then(data => {
        const options = data.map(department =>
          `<option value="${department.code}">${department.nom}</option>`
        ).join('');

        select_department.innerHTML = options;
      })
      .catch(error => console.error('Erreur:', error));
  }
});


/*--------------------------------------------------*/
/*Affiche la liste des villes du département sélectionné*/
const show_towns_btn = document.querySelector("#show_towns");
const tbody = document.querySelector("tbody");

show_towns_btn.addEventListener('click', () => {
  const code = select_department.value;
  if (code) {
    fetch(baseUrl + "departements/" + code + "/communes")
      .then(response => response.json())
      .then(data => {
        const sortingByPopulation = data.sort((a, b) => b.population - a.population);
        const options = sortingByPopulation.map(department =>
          `<tr scope="row">
          <th>${department.nom}</th>
          <th>${department.population}</th>
        </tr>`
        ).join('');

        tbody.innerHTML = options;
      })
      .catch(error => console.error('Erreur:', error));
  }
})
