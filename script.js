'use strict';

//// Variables

const state = {
  jobsData: [],
  activeFilters: [],
};

const mainEl = document.querySelector('.main');
const jobsContainerEl = document.querySelector('.container--jobs');
const searchContainerEl = document.querySelector('.container--search');
const searchTagsContainerEl = document.querySelector('.search-tags');

//// Functions

const init = async function () {
  try {
    // Get jobs data from file data.json
    const res = await fetch('data.json');
    const data = await res.json();

    // Add jobs data to state
    addJobsDataToState(data);

    // Render all job items
    renderJobItems(state.jobsData);

    // Mark job items that have tag "Featured"
    markFeaturedJobItems();
  } catch (err) {
    console.log(err);
    renderErrorMessage();
  }
};
init();

const addJobsDataToState = function (data) {
  data.forEach(el => {
    const jobObj = {
      id: el.id,
      company: el.company,
      logo: el.logo,
      new: el.new,
      featured: el.featured,
      position: el.position,
      role: el.role,
      level: el.level,
      postedAt: el.postedAt,
      contract: el.contract,
      location: el.location,
      languages: el.languages,
      tools: el.tools,
      tags: [el.role, el.level, ...el.languages, ...el.tools],
    };

    state.jobsData.push(jobObj);
  });
};

const generateSearchTagHTML = function (filter, tagContent) {
  return `
    <li class="search-tag" data-filter="${filter}">
      <span class="search-tag-name">${tagContent}</span>
      <button class="btn-remove" data-filter="${filter}">
        <img
          class="icon-remove"
          src="images/icon-remove.svg"
          alt="icon close"
        />
      </button>
    </li>
  `;
};

const generateFeatureTagsHTML = function (job) {
  if (!job.new && !job.featured) return '';

  return `
    <div class="feature-tags">
      ${job.new ? '<span class="feature-tag feature-tag--new">New!</span>' : ''}
      ${
        job.featured
          ? '<span class="feature-tag feature-tag--featured">Featured</span>'
          : ''
      }
    </div>
  `;
};

const generateOfferTagsHTML = function (job) {
  const offerTagsHTML = job.tags
    .map(
      tag =>
        `<button class="btn-offer-tag" data-filter="${tag.toLowerCase()}">${tag}</button>`
    )
    .join('\n');

  return offerTagsHTML;
};

const generateJobItemHTML = function (job) {
  return `
    <li class="item item--job" data-featured="${job.featured}">
      <div class="logo-box">
        <img class="logo" src="${job.logo}" alt="${job.company} logo" />
      </div>
      <div class="text-box">
        <div class="info-box">
          <div class="company-box">
            <span class="company">${job.company}</span>
            ${generateFeatureTagsHTML(job)}
          </div>
          <button class="position">${job.position}</button>
          <ul class="details">
            <li class="details-item">${job.postedAt}</li>
            <li class="details-item">${job.contract}</li>
            <li class="details-item">${job.location}</li>
          </div>
        </div>
        <div class="offer-tags-box">
          ${generateOfferTagsHTML(job)}
        </div>
      </div>
    </li>
  `;
};

const renderJobItems = function (jobs) {
  jobs.forEach(job => {
    jobsContainerEl.insertAdjacentHTML('beforeend', generateJobItemHTML(job));
  });
};

const markFeaturedJobItems = function () {
  document.querySelectorAll('.item--job').forEach(job => {
    if (job.dataset.featured === 'false') return;
    job.style.setProperty('--beforeVisibility', 'visible');
  });
};

const clearContainer = function (container) {
  container.innerHTML = '';
};

const renderErrorMessage = function () {
  const errorHTML = `
      <p class="error">Sorry, something went wrong. Jobs data couldn't be loaded.</p>
      <p class="error">Please try again.</p>
    `;
  jobsContainerEl.insertAdjacentHTML('beforeend', errorHTML);
};

const showOrHideSearchContainer = function () {
  searchContainerEl.classList.toggle('hidden');
  mainEl.classList.toggle('main--container-search-visible');
};

const filterJobOffers = function () {
  return state.jobsData.filter(job =>
    state.activeFilters.every(filter =>
      job.tags.map(tag => tag.toLowerCase()).includes(filter)
    )
  );
};

//// Event Listeners

// Click offer tag => Filter jobs offers
jobsContainerEl.addEventListener('click', function (e) {
  const offerTag = e.target;
  if (!offerTag.classList.contains('btn-offer-tag')) return;

  // Show search container, if it isn't visible
  if (state.activeFilters.length === 0) showOrHideSearchContainer();

  // Add filter to activeFilters array in state, if it isn't already there
  const filter = offerTag.dataset.filter;
  if (state.activeFilters.includes(filter)) return;
  state.activeFilters.push(filter);

  // Create search tag HTML and render search tag in search container
  const searchTagHTML = generateSearchTagHTML(filter, offerTag.innerHTML);
  searchTagsContainerEl.innerHTML =
    searchTagsContainerEl.innerHTML + searchTagHTML;

  // Choose job offers that match all selected filters
  const filteredJobs = filterJobOffers();

  // Render filtered job items
  clearContainer(jobsContainerEl);
  renderJobItems(filteredJobs);

  // Mark job items that have tag "Featured"
  markFeaturedJobItems();
});

// Click "X" in search tag => Remove this filter
searchTagsContainerEl.addEventListener('click', function (e) {
  const btnRemoveFilter = e.target.closest('.btn-remove');
  if (!btnRemoveFilter) return;

  // Remove filter from activeFilters array in state
  const filter = btnRemoveFilter.dataset.filter;
  state.activeFilters = state.activeFilters.filter(
    currentFilter => currentFilter !== filter
  );

  // Remove search tag from search container
  const searchTagEl = Array.from(document.querySelectorAll('.search-tag'))
    .filter(el => el.dataset.filter === filter)
    .at(0);
  searchTagEl.remove();

  // Hide search container when the last filter was deleted
  if (state.activeFilters.length === 0) showOrHideSearchContainer();

  // Choose job offers that match all remain filters
  const filteredJobs = filterJobOffers();

  // Render job items
  clearContainer(jobsContainerEl);
  renderJobItems(filteredJobs);

  // Mark job items that have tag "Featured"
  markFeaturedJobItems();
});

// Click "Clear" in search container => Remove all filters
searchContainerEl.addEventListener('click', function (e) {
  const btnClear = e.target;
  if (!btnClear.classList.contains('btn-clear')) return;

  // Remove all filters from activeFilters array in state
  state.activeFilters = [];

  // Clear and hide search container
  clearContainer(searchTagsContainerEl);
  showOrHideSearchContainer();

  // Render all job
  clearContainer(jobsContainerEl);
  renderJobItems(state.jobsData);

  // Mark job items that have tag "Featured"
  markFeaturedJobItems();
});
