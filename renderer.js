var pantry;

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
});

const getPantry = () => {

  const url = "https://app.tea.xyz/v0/packages/";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      pantry = data;
      
      // Let's add it manually
      pantry.push('tea.xyz/gx/make');
    })
    .catch((error) => {
      console.error("Error:", error);
    });

};


const autocomplete = (text) => {

  let search = [];

  const filteredArray = pantry.filter(item => item.includes(text));

  filteredArray.slice(0, 10).forEach((item) => {
    search.push(item);
  });

  return search;
}

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
}