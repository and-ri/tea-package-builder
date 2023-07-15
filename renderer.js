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
});

const getPantry = () => {

  const url = "https://app.tea.xyz/v0/packages/";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      pantry = data;
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