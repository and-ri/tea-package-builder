let strip_row = 0;

const addStrip = (element) => {
  let html = `
            <tr id="strip-row-${strip_row}">
                <td><input type="text" class="form-control form-control-sm" placeholder="Value" name="stripe[items][${strip_row}][value]"></td>
                <td><button type="button" class="btn btn-sm btn-danger" onclick="$('#strip-row-${strip_row}').remove();generate();"><i class="bi bi-trash3"></i> Remove</button></td>
            </tr>
        `;

  $(`${element} > tbody`).append(html);

  $("input").on("change", function () {
    generate();
  });
  $("select").on("change", function () {
    generate();
  });
  $("textarea").on("change", function () {
    generate();
  });

  strip_row++;

  generate();
};

let dep_row = 0;

const addDependency = (element) => {
  let html = `
            <tr id="dependency-row-${dep_row}">
                  <td class="position-relative"><input type="text" class="form-control form-control-sm autocomplete" placeholder="Name" data-name="value" name="dependencies[${dep_row}][value]"></td>
                  <td><input type="text" class="form-control form-control-sm" placeholder="Version" data-name="version" name="dependencies[${dep_row}][version]"></td>
                  <td class="text-center pt-3"><input type="checkbox" class="form-check-input" data-name="runtime/darwin/x86_64" name="dependencies[${dep_row}][runtime][darwin][x86_64]"></td>
                  <td class="text-center pt-3"><input type="checkbox" class="form-check-input" data-name="runtime/darwin/aarch64" name="dependencies[${dep_row}][runtime][darwin][aarch64]"></td>
                  <td class="text-center pt-3"><input type="checkbox" class="form-check-input" data-name="runtime/linux/x86_64" name="dependencies[${dep_row}][runtime][linux][x86_64]"></td>
                  <td class="text-center pt-3"><input type="checkbox" class="form-check-input" data-name="runtime/linux/aarch64" name="dependencies[${dep_row}][runtime][linux][aarch64]"></td>
                  <td class="text-center pt-3"><input type="checkbox" class="form-check-input" data-name="build/darwin/x86_64" name="dependencies[${dep_row}][build][darwin][x86_64]"></td>
                  <td class="text-center pt-3"><input type="checkbox" class="form-check-input" data-name="build/darwin/aarch64" name="dependencies[${dep_row}][build][darwin][aarch64]"></td>
                  <td class="text-center pt-3"><input type="checkbox" class="form-check-input" data-name="build/linux/x86_64" name="dependencies[${dep_row}][build][linux][x86_64]"></td>
                  <td class="text-center pt-3"><input type="checkbox" class="form-check-input" data-name="build/linux/aarch64" name="dependencies[${dep_row}][build][linux][aarch64]"></td>
                  <td class="text-center pt-3"><input type="checkbox" class="form-check-input" data-name="testDep/darwin/x86_64" name="dependencies[${dep_row}][testDep][darwin][x86_64]"></td>
                  <td class="text-center pt-3"><input type="checkbox" class="form-check-input" data-name="testDep/darwin/aarch64" name="dependencies[${dep_row}][testDep][darwin][aarch64]"></td>
                  <td class="text-center pt-3"><input type="checkbox" class="form-check-input" data-name="testDep/linux/x86_64" name="dependencies[${dep_row}][testDep][linux][x86_64]"></td>
                  <td class="text-center pt-3"><input type="checkbox" class="form-check-input" data-name="testDep/linux/aarch64" name="dependencies[${dep_row}][testDep][linux][aarch64]"></td>
                <td><button type="button" class="btn btn-sm btn-danger" onclick="$('#dependency-row-${dep_row}').remove();generate();"><i class="bi bi-trash3"></i></button></td>
            </tr>
        `;

  $(`${element} > tbody`).append(html);

  $("input").on("change", function () {
    generate();
  });
  $("select").on("change", function () {
    generate();
  });
  $("textarea").on("change", function () {
    generate();
  });

  $(".autocomplete").on("keyup", function () {
    $(this).next(".autocomplete-result").remove();
    if ($(this).val().length > 1) {
      result = autocomplete($(this).val());

      html =
        '<div class="autocomplete-result position-absolute start-0 mt-3 p-3 rounded-3">';

      if (result.length > 0) {
        result.map((item) => {
          html += `<div><button type="button" class="btn btn-sm border-0" onclick="$(this).parent().parent().parent().find('.autocomplete').val('${item}');$(this).parent().parent().remove();generate()">${item}</button></div>`;
        });
      } else {
        html += `<div>No results!</div>`;
      }

      html += "</div>";

      $(this).after(html);
    }
  });

  dep_row++;

  generate();
};

let build_row = 0;

const addBuildCommand = (element) => {
  let html = `
              <tr id="build-script-row-${build_row}">
                  <td>
                    <div class="form-group mb-3">
                      <textarea class="form-control" placeholder="Command" name="build[script][${build_row}][command]" data-name="command"></textarea>
                    </div>
                    <p>Condition:</p>
                    <div class="row">
                      <div class="form-group col-3">
                        <input type="text" class="form-control" placeholder="Name" name="build[script][${build_row}][condition][name]" data-name="condition">
                      </div>
                      <div class="form-group col-9">
                        <input type="text" class="form-control" placeholder="Value" name="build[script][${build_row}][condition][value]" data-name="value">
                      </div>
                    </div>
                  </td>
                  <td><button type="button" class="btn btn-sm btn-danger" onclick="$('#build-script-row-${build_row}').remove();generate();"><i class="bi bi-trash3"></i> Remove</button></td>
              </tr>
          `;

  $(`${element} > tbody`).append(html);

  $("input").on("change", function () {
    generate();
  });
  $("select").on("change", function () {
    generate();
  });
  $("textarea").on("change", function () {
    generate();
  });

  build_row++;

  generate();
};

let build_env_row = 0;

const addBuildEnv = (element) => {
  let html = `
      <tr id="build-env-row-${build_env_row}">
        <td><input type="text" class="form-control" placeholder="Variable" name="build[env][${build_env_row}][variable]" value="" data-name="variable"></td>
        <td><textarea class="form-control" name="build[env][${build_env_row}][value]" data-name="value"></textarea></td>
        <td><button type="button" class="btn btn-sm btn-danger" onclick="$('#build-env-row-${build_env_row}').remove();generate();"><i class="bi bi-trash3"></i> Remove</button></td>
  </tr>
          `;

  $(`${element} > tbody`).append(html);

  $("input").on("change", function () {
    generate();
  });
  $("select").on("change", function () {
    generate();
  });
  $("textarea").on("change", function () {
    generate();
  });

  build_env_row++;

  generate();
};

const presets = {
  configure: [
    '--disable-debug',
    '--disable-dependency-tracking',
    '--prefix="{{prefix}}"',
    '--libdir="{{prefix}}/lib"'
  ],
  cargo: [
    '--locked',
    '--root="{{prefix}}"',
    '--path=.'
  ],
  cmake: [
    '-DCMAKE_INSTALL_PREFIX="{{prefix}}',
    '-DCMAKE_INSTALL_LIBDIR=lib',
    '-DCMAKE_BUILD_TYPE=Release',
    '-DCMAKE_FIND_FRAMEWORK=LAST',
    '-DCMAKE_VERBOSE_MAKEFILE=ON',
    '-Wno-dev',
    '-DBUILD_TESTING=OFF'
  ],
  go: [
    '-trimpath',
    '-o="{{prefix}}/bin/<name>"'
  ],
  meson: [
    '--prefix="{{prefix}}"',
    '--libdir="{{prefix}}/lib"',
    '--buildtype=release',
    '--wrap-mode=nofallback'
  ]
}

const addPresetArgs = (element) => {
  let preset_name = $('input[name="presets"]:checked').val();

  let value = presets[preset_name].join('\n');

  let html = `
      <tr id="build-env-row-${build_env_row}">
        <td><input type="text" class="form-control" placeholder="Variable" name="build[env][${build_env_row}][variable]" value="${preset_name.toUpperCase()}_ARGS"></td>
        <td><textarea class="form-control" name="build[env][${build_env_row}][value]">${value}</textarea></td>
        <td><button type="button" class="btn btn-sm btn-danger" onclick="$('#build-env-row-${build_env_row}').remove();generate();"><i class="bi bi-trash3"></i> Remove</button></td>
      </tr>
  `;
      
  $(`${element} > tbody`).append(html);

  $('#modalPresets').modal('hide');
  $('input[name="presets"]').prop('checked', false);


  $("input").on("change", function () {
    generate();
  });
  $("select").on("change", function () {
    generate();
  });
  $("textarea").on("change", function () {
    generate();
  });

  build_env_row++;

  generate();

}

let binary_row = 0;

const addBinary = (element) => {
  let html = `
      <tr id="provides-row-${binary_row}">
        <td><input type="text" class="form-control" name="provides[${binary_row}]" placeholder="Binary" value=""></td>
        <td><button type="button" class="btn btn-sm btn-danger" onclick="$('#provides-row-${binary_row}').remove();generate();"><i class="bi bi-trash3"></i> Remove</button></td>
      </tr>
        `;

  $(`${element} > tbody`).append(html);

  $("input").on("change", function () {
    generate();
  });
  $("select").on("change", function () {
    generate();
  });
  $("textarea").on("change", function () {
    generate();
  });

  binary_row++;

  generate();
};

let test_row = 0;

const addTestCommand = (element) => {
  let html = `
              <tr id="test-script-row-${test_row}">
                  <td><input type="text" class="form-control" placeholder="Command" name="test[script][${test_row}]"></td>
                  <td><button type="button" class="btn btn-sm btn-danger" onclick="$('#test-script-row-${test_row}').remove();generate();"><i class="bi bi-trash3"></i> Remove</button></td>
              </tr>
          `;

  $(`${element} > tbody`).append(html);

  $("input").on("change", function () {
    generate();
  });
  $("select").on("change", function () {
    generate();
  });
  $("textarea").on("change", function () {
    generate();
  });

  test_row++;

  generate();
};

let test_env_row = 0;

const addTestEnv = (element) => {
  let html = `
      <tr id="test-env-row-${test_env_row}">
        <td><input type="text" class="form-control" placeholder="Variable" name="test[env][${test_env_row}][variable]" value="" data-name="variable"></td>
        <td><textarea class="form-control" name="test[env][${test_env_row}][value]" data-name="value"></textarea></td>
        <td><button type="button" class="btn btn-sm btn-danger" onclick="$('#test-env-row-${test_env_row}').remove();generate();"><i class="bi bi-trash3"></i> Remove</button></td>
  </tr>
          `;

  $(`${element} > tbody`).append(html);

  $("input").on("change", function () {
    generate();
  });
  $("select").on("change", function () {
    generate();
  });
  $("textarea").on("change", function () {
    generate();
  });

  test_env_row++;

  generate();
};
