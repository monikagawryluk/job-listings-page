'use strict';

//// Variables

const state = {
  jobsData: [],
};

const jobsContainer = document.querySelector('.container');

//// Functions

const createDataArray = function (data) {
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
    };
    state.jobsData.push(jobObj);
  });
};

const generateMarkupLanguage = function (lang) {
  return `<button class="btn-tag" data-languages="${lang.toLowerCase()}">${lang}</button>`;
};

const generateMarkupTool = function (tool) {
  return `<button class="btn-tag" data-tools="${tool.toLowerCase()}">${tool}</button>`;
};

const generateJobMarkup = function (job) {
  const markupLanguages = job.languages
    .map(lang => generateMarkupLanguage(lang))
    .join('\n');

  const markupTools = job.tools
    .map(lang => generateMarkupTool(lang))
    .join('\n');

  return `
    <div class="job-item container-small">
      <div class="logo-box">
        <img class="logo" src="${job.logo}" alt="${job.company} logo" />
      </div>
      <div class="text-box">
        <div class="info-box">
          <div class="company-box">
            <div class="company">${job.company}</div>
            ${
              job.new || job.featured
                ? `<div class="offer-tags">
            ${
              job.new
                ? '<div class="feature-tag feature-tag--new">New!</div>'
                : ''
            }
            ${
              job.featured
                ? '<div class="feature-tag feature-tag--featured">Featured</div>'
                : ''
            }
            </div>`
                : ''
            }
          </div>
          <button class="position">${job.position}</button>
          <div class="details">
            <div class="posted">${job.postedAt}</div>
            <div class="dot"></div>
            <div class="contract">${job.contract}</div>
            <div class="dot"></div>
            <div class="location">${job.location}</div>
          </div>
        </div>
        <div class="tags-box">
          <button class="btn-tag" data-role="${job.role.toLowerCase()}">${
    job.role
  }</button>
          <button class="btn-tag" data-level="${job.level.toLowerCase()}">${
    job.level
  }</button>
          ${job.languages.length !== 0 ? markupLanguages : ''}
          ${job.tools.length !== 0 ? markupTools : ''}
        </div>
      </div>
    </div>
  `;
};

const renderJobItems = function () {
  state.jobsData.forEach(job => {
    jobsContainer.insertAdjacentHTML('beforeend', generateJobMarkup(job));
  });
};

const renderErrorMessage = function () {
  jobsContainer.innerHTML = '';

  const markup = `
      <p class="error">Sorry, something went wrong. Jobs data couldn't be loaded.</p>
      <p class="error">Please try again.</p>
    `;
  jobsContainer.insertAdjacentHTML('beforeend', markup);
};

const init = async function () {
  try {
    // Get jobs data from file data.json
    const res = await fetch('data.json');
    const data = await res.json();

    // Add jobs data to state
    createDataArray(data);

    //  Czy wrzucić tu funkcję do wyczyszczenia containera

    // Render jobs items
    renderJobItems();
  } catch (err) {
    console.log(err);
    renderErrorMessage();
  }
};
init();

//// Event Listeners

jobsContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('btn-tag')) return;

  const tag = e.target;
  // const tagType = tag.dataset.
});
