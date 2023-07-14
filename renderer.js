// Document ready
$(function () {
    generate();
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
  });
  
  let strip_row = 0;
  let dep_row = 0;
  
  const addStrip = (element) => {
    let html = `
          <tr id="strip-row-${strip_row}">
              <td><input type="text" class="form-control" placeholder="Value" name="stripe[items][${strip_row}][value]"></td>
              <td><button type="button" class="btn btn-danger" onclick="$('#strip-row-${strip_row}').remove()">Remove</button></td>
          </tr>
      `;
  
    $(`${element} > tbody`).append(html);
  
    $("input").on("change", function () {
      generate();
    });
    $("select").on("change", function () {
      generate();
    });
  
    strip_row++;
  
    generate();
  };
  
  const addDependency = (element) => {
    let html = `
          <tr id="dependency-row-${dep_row}">
              <td><input type="text" class="form-control" placeholder="Name" name="dependencies[${dep_row}][value]"></td>
              <td class="text-center pt-3"><input type="checkbox" class="form-check-input" name="dependencies[${dep_row}][runtime][darwin][x86_64]"></td>
              <td class="text-center pt-3"><input type="checkbox" class="form-check-input" name="dependencies[${dep_row}][runtime][darwin][aarch64]"></td>
              <td class="text-center pt-3"><input type="checkbox" class="form-check-input" name="dependencies[${dep_row}][runtime][linux][x86_64]"></td>
              <td class="text-center pt-3"><input type="checkbox" class="form-check-input" name="dependencies[${dep_row}][runtime][linux][aarch64]"></td>
              <td class="text-center pt-3"><input type="checkbox" class="form-check-input"></td>
              <td class="text-center pt-3"><input type="checkbox" class="form-check-input"></td>
              <td class="text-center pt-3"><input type="checkbox" class="form-check-input"></td>
              <td class="text-center pt-3"><input type="checkbox" class="form-check-input"></td>
              <td class="text-center pt-3"><input type="checkbox" class="form-check-input"></td>
              <td class="text-center pt-3"><input type="checkbox" class="form-check-input"></td>
              <td class="text-center pt-3"><input type="checkbox" class="form-check-input"></td>
              <td class="text-center pt-3"><input type="checkbox" class="form-check-input"></td>
              <td><button type="button" class="btn btn-danger" onclick="$('#dependency-row-${dep_row}').remove()">-</button></td>
          </tr>
      `;
  
    $(`${element} > tbody`).append(html);
  
    $("input").on("change", function () {
      generate();
    });
    $("select").on("change", function () {
      generate();
    });
  
    dep_row++;
  
    generate();
  };
  
  const generate = () => {
    let formData = {};
    $("#config")
      .serializeArray()
      .forEach(function (item) {
        var parts = item.name.split("[");
        var obj = formData;
        for (var i = 0; i < parts.length - 1; i++) {
          var part = parts[i].replace(/]/g, "");
          if (!obj[part]) {
            obj[part] = {};
          }
          obj = obj[part];
        }
        obj[parts[parts.length - 1].replace(/]/g, "")] = item.value;
      });
  
    console.log(formData);
  
    let yml = "";
  
    yml += "distributable:\n";
  
    if (formData.package.url) {
      yml += `    url: ${formData.package.url}\n`;
      yml += `    strip-components: ${
        formData.package.strip ? formData.package.strip : 0
      }\n`;
    }
  
    if (formData.package.display_name) {
      yml += "display-name: " + formData.package.display_name + "\n";
    }
  
    yml += "versions:\n";
    yml += `    ${formData.version.type}: ${formData.version.value}\n`;
  
    if (formData.match.enabled) {
      yml += `    match: /${formData.match.value}/\n`;
    }
  
    if (formData.stripe.enabled) {
      yml += "    strip:\n";
  
      if (formData.stripe.items) {
        for (var key in formData.stripe.items) {
          if (formData.stripe.items.hasOwnProperty(key)) {
            var item = formData.stripe.items[key];
            yml += `        - /${item.value}/\n`;
          }
        }
      }
    }
  
    if (formData.dependencies) {
      yml += "dependencies:\n";
  
      let runtime = {
          all: [],
          darwin: [],
          linux: [],
          darwin_x86_64: [],
          darwin_aarch64: [],
          linux_x86_64: [],
          linux_aarch64: []
      };
  
      for (var key in formData.dependencies) {
        if (formData.dependencies.hasOwnProperty(key)) {
          var item = formData.dependencies[key];
          if (item.runtime) {
              elem = item.runtime
              if (elem.darwin && elem.linux) {
                  if (elem.darwin.x86_64 && elem.darwin.aarch64 && elem.linux.x86_64 && elem.linux.aarch64) {
                      runtime.all.push({value: item.value});
                  } else {
                      if (elem.darwin.x86_64 && elem.darwin.aarch64) {
                          runtime.darwin.push({value: item.value});
                          elem.linux.x86_64 ? runtime.linux_x86_64.push({value: item.value}) : null;
                          elem.linux.aarch64 ? runtime.linux_aarch64.push({value: item.value}) : null;
                      } else if (elem.linux.x86_64 && elem.linux.aarch64) {
                          runtime.linux.push({value: item.value});
                          elem.darwin.x86_64 ? runtime.darwin_x86_64.push({value: item.value}) : null;
                          elem.darwin.aarch64 ? runtime.darwin_aarch64.push({value: item.value}) : null;
                      } else {
                          elem.darwin.x86_64 ? runtime.darwin_x86_64.push({value: item.value}) : null;
                          elem.darwin.aarch64 ? runtime.darwin_aarch64.push({value: item.value}) : null;
                          elem.linux.x86_64 ? runtime.linux_x86_64.push({value: item.value}) : null;
                          elem.linux.aarch64 ? runtime.linux_aarch64.push({value: item.value}) : null;
                      }
                  }
              } else if (elem.darwin) {
                  if (elem.darwin.x86_64 && elem.darwin.aarch64) {
                      runtime.darwin.push({value: item.value});
                  } else {
                      elem.darwin.x86_64 ? runtime.darwin_x86_64.push({value: item.value}) : null;
                      elem.darwin.aarch64 ? runtime.darwin_aarch64.push({value: item.value}) : null;
                  }
              } else if (elem.linux) {
                  if (elem.linux.x86_64 && elem.linux.aarch64) {
                      runtime.linux.push({value: item.value});
                  } else {
                      elem.linux.x86_64 ? runtime.linux_x86_64.push({value: item.value}) : null;
                      elem.linux.aarch64 ? runtime.linux_aarch64.push({value: item.value}) : null;
                  }
              }
          }
  
        }
      }
  
      console.log(runtime);
  
      if (Object.keys(runtime.all).length > 0) {
          runtime.all.map((item) => {
              yml += `    ${item.value}: '*'\n`;
          });
      }
      if (Object.keys(runtime.darwin).length > 0) {
          yml += '    darwin:\n';
          runtime.darwin.map((item) => {
              yml += `        ${item.value}: '*'\n`;
          });
      }
      if (Object.keys(runtime.linux).length > 0) {
          yml += '    linux:\n';
          runtime.linux.map((item) => {
              yml += `        ${item.value}: '*'\n`;
          });
      }
      if (Object.keys(runtime.darwin_x86_64).length > 0) {
          yml += '    darwin/x86-64:\n';
          runtime.darwin_x86_64.map((item) => {
              yml += `        ${item.value}: '*'\n`;
          });
      }
      if (Object.keys(runtime.darwin_aarch64).length > 0) {
          yml += '    darwin/aarch64:\n';
          runtime.darwin_aarch64.map((item) => {
              yml += `        ${item.value}: '*'\n`;
          });
      }
      if (Object.keys(runtime.linux_x86_64).length > 0) {
          yml += '    linux/x86-64:\n';
          runtime.linux_x86_64.map((item) => {
              yml += `        ${item.value}: '*'\n`;
          });
      }
      if (Object.keys(runtime.linux_aarch64).length > 0) {
          yml += '    linux/aarch64:\n';
          runtime.linux_aarch64.map((item) => {
              yml += `        ${item.value}: '*'\n`;
          });
      }
  
    }
  
    $("#output > pre").html(yml);
  
    $("#command > pre").html(`pkg init ${formData.package.name}`);
  };
  