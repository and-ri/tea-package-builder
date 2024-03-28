window.$ = window.jQuery = require('jquery');

var pantry;

const PkgxPantry = require('pkgx-pantry');

// Document ready
$(function () {
  generate();
  getPantry();
  $(".hide-switch").on("click", function () {
    if (this.checked) {
      $(this).parent().next(".hide").slideDown();
    } else {
      $(this).parent().next(".hide").slideUp();
    }
  });
  $("input").on("change", function () {
    generate();
  });
  $("select").on("change", function () {
    generate();
  });
  $("textarea").on("change", function () {
    generate();
  });
  $('.copy').on('click', function() {
    let content = $(this).text();
    navigator.clipboard.writeText(content);
    createToast('<i class="bi bi-clipboard-check"></i> Content copied to clipboard');
  });

  // Save package
  $('#btnSave').on('click', function () {
    package.set(packageData.package.name, packageData);
    createToast(`<i class="bi bi-clipboard-check"></i> Package <b>${packageData.package.name}</b> saved!`);
  });

  // Load package
  $('#btnLoad').on('click', function () {
    package.modal();
  });

  // Remove dropdown when clicked outside
  $(document).on('click', function(event) {
    $('.autocomplete-result').remove();
  });
});

const getPantry = async () => {
  try {
    await PkgxPantry.getPackages().then((data) => {
      pantry = data;
    });
  } catch (error) {
    console.error("Error:", error);
  }
};


const autocomplete = (text) => {
  let search = [];
  const filteredArray = pantry.filter(item => item.project.includes(text));
  filteredArray.slice(0, 10).forEach((item) => {
    search.push(item.project);
  });
  return search;
};

var toastCounter = 0;
const createToast = (text) => {
  html = `
  <div class="toast align-items-center text-bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true" id="toast-${toastCounter}">
    <div class="d-flex">
      <div class="toast-body">${text}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
  `;
  $('#toasts').append(html);
  $(`#toast-${toastCounter}`).toast('show');
  toastCounter++;
};
