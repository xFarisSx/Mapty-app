'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let works = document.querySelectorAll('.workout');

class Workout {
  options = {
    month: 'long',
    day: 'numeric',
  };
  date = new Date();
  id = (Date.now() + '').slice(-10);
  dateLocale = this.date.toLocaleDateString(navigator.language, this.options);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.title = `${this.type.replace(
      this.type[0],
      this.type[0].toUpperCase()
    )} on ${this.dateLocale}`;
    this.calcPace();
    console.log(this.listWorkout);
    this.listWorkout();
  }

  listWorkout() {
    const html = `<li class="workout workout--running" data-id="${this.id}">
          <h2 class="workout__title">${this.title}</h2>
          <div class="workout__details">
            <span class="workout__icon">🏃‍♂️</span>
            <span class="workout__value">${new Intl.NumberFormat(
              navigator.language
            ).format(this.distance)}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${new Intl.NumberFormat(
              navigator.language
            ).format(this.duration)}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${new Intl.NumberFormat(
              navigator.language
            ).format(this.cadence)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${new Intl.NumberFormat(
              navigator.language
            ).format(this.cadence * this.duration)}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;

    containerWorkouts.insertAdjacentHTML('beforeend', html);
    works = document.querySelectorAll('.workout');
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.title = `${this.type.replace(
      this.type[0],
      this.type[0].toUpperCase()
    )} on ${this.dateLocale}`;
    this.calcSpeed();
    this.listWorkout();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }

  listWorkout() {
    const html = `<li class="workout workout--cycling" data-id="${this.id}">
          <h2 class="workout__title">${this.title}</h2>
          <div class="workout__details">
            <span class="workout__icon">🚴‍♀️</span>
            <span class="workout__value">${new Intl.NumberFormat(
              navigator.language
            ).format(this.distance)}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${new Intl.NumberFormat(
              navigator.language
            ).format(this.duration)}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${new Intl.NumberFormat(
              navigator.language
            ).format(this.speed)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${new Intl.NumberFormat(
              navigator.language
            ).format(this.elevationGain)}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;

    containerWorkouts.insertAdjacentHTML('beforeend', html);
    works = document.querySelectorAll('.workout');
  }
}

class App {
  #map;
  #mapEvent;
  constructor() {
    localStorage.getItem('workouts')
      ? '1'
      : localStorage.setItem('workouts', JSON.stringify([]));
    this.workouts = JSON.parse(localStorage.getItem('workouts'));
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField);
    if (this.workouts !== []) {
      this.showAll();
    }
  }

  showAll() {
    for (let cur of this.workouts) {
      console.log(cur);
      if (cur.type == 'running') this.listWorkout2(cur);
      else this.listWorkout(cur);
      setTimeout(
        function () {
          this.renderWorkoutMarker(cur);
        }.bind(this),
        100
      );
      for (let cur of works) {
        cur.addEventListener('click', this._goto.bind(this, cur));
      }
    }
  }

  listWorkout(cur) {
    const html = `<li class="workout workout--cycling" data-id="${cur.id}">
    <h2 class="workout__title">${cur.title}</h2>
    <div class="workout__details">
    <span class="workout__icon">🚴‍♀️</span>
    <span class="workout__value">${new Intl.NumberFormat(
      navigator.language
    ).format(cur.distance)}</span>
            <span class="workout__unit">km</span>
            </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${new Intl.NumberFormat(
              navigator.language
            ).format(cur.duration)}</span>
              <span class="workout__unit">min</span>
              </div>
              <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${new Intl.NumberFormat(
                navigator.language
              ).format(cur.speed)}</span>
                <span class="workout__unit">km/h</span>
                </div>
                <div class="workout__details">
                <span class="workout__icon">⛰</span>
                <span class="workout__value">${new Intl.NumberFormat(
                  navigator.language
                ).format(cur.elevationGain)}</span>
                  <span class="workout__unit">m</span>
                  </div>
                  </li>`;

    containerWorkouts.insertAdjacentHTML('beforeend', html);
    works = document.querySelectorAll('.workout');
  }

  listWorkout2(cur) {
    const html = `<li class="workout workout--running" data-id="${cur.id}">
    <h2 class="workout__title">${cur.title}</h2>
    <div class="workout__details">
    <span class="workout__icon">🏃‍♂️</span>
    <span class="workout__value">${new Intl.NumberFormat(
      navigator.language
    ).format(cur.distance)}</span>
      <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${new Intl.NumberFormat(
        navigator.language
      ).format(cur.duration)}</span>
            <span class="workout__unit">min</span>
            </div>
          <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${new Intl.NumberFormat(
            navigator.language
          ).format(cur.cadence)}</span>
            <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${new Intl.NumberFormat(
              navigator.language
            ).format(cur.cadence * cur.duration)}</span>
              <span class="workout__unit">spm</span>
              </div>
              </li>`;

    containerWorkouts.insertAdjacentHTML('beforeend', html);
    works = document.querySelectorAll('.workout');
  }

  _goto(cur, e) {
    this.#map.flyTo(
      this.workouts.find(work => work.id == cur.dataset.id).coords
    );
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),

        function () {
          alert('Could not get your position');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    // console.log(latitude, longitude);
    // console.log(`https://www.google.com/maps/@${latitude},${longitude},14z`);

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    const type = inputType.value;
    const duration = +inputDuration.value;
    const distance = +inputDistance.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    if (type === 'running') {
      const cadence = +inputCadence.value;
      if (
        !validInputs(duration, distance, cadence) ||
        !allPositive(duration, distance, cadence)
      )
        return alert('Inputs have to be + numbers!');

      workout = new Running([lat, lng], distance, duration, cadence);
    }
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !validInputs(duration, distance, elevation) ||
        !allPositive(duration, distance)
      )
        return alert('Inputs have to be + numbers!');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    this.workouts.push(workout);
    console.log(this.workouts);
    localStorage.setItem('workouts', JSON.stringify(this.workouts));

    this.renderWorkoutMarker(workout);

    form.classList.add('hidden');

    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    for (let cur of works) {
      cur.addEventListener('click', this._goto.bind(this, cur));
    }
  }

  renderWorkoutMarker(workout) {
    const options = {
      month: 'long',
      day: 'numeric',
    };
    let dateW = new Date(workout.date);
    console.log(dateW);
    const date = new Intl.DateTimeFormat(navigator.language, options).format(
      dateW
    );

    L.marker(workout.coords)
      ?.addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type.replace(
          workout.type[0],
          workout.type[0].toUpperCase()
        )} on ${date}`
      )
      .openPopup();
  }
}

const app = new App();
