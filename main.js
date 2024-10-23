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
          <td>${department.nom}</td>
          <td>${department.population}</td>
        </tr>`
        ).join('');

        tbody.innerHTML = options;
      })
      .catch(error => console.error('Erreur:', error));
  }
})

/*--------------------------------------------------*/
/*Afficher sa ville*/

const show_ur_city_btn = document.querySelector("#show_ur_city");

show_ur_city_btn.addEventListener('click', () => {

  function success(pos) {
    const crd = pos.coords;
    const map = L.map('map').setView([crd.latitude, crd.longitude], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    fetch(baseUrl + "communes/?lat=" + crd.latitude + "&lon=" + crd.longitude + "&fields=nom,contour")
      .then(response => response.json())
      .then(data => {
        const geojsonFeature = {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": data[0].contour.coordinates
          }
        };

        L.geoJSON(geojsonFeature, { style: { color: 'red' } }).addTo(map);
      })
      .catch(error => console.error('Erreur:', error));
  }

  navigator.geolocation.getCurrentPosition(success);
});