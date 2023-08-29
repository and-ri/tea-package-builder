const package = {
    list: () => {
        keys = Object.keys(localStorage);

        return keys;
    },
    get: (name) => {
        json = localStorage.getItem(name);
        return JSON.parse(json);
    },
    set: (name, data) => {
        jsonData = JSON.stringify(data);

        localStorage.setItem(name, jsonData);

        if (localStorage.getItem(name) == jsonData) {
            return true; 
        } else {
            return false;
        }
    },
    remove: (name) => {
        localStorage.removeItem(name);

        html = '';
        packages = package.list();

        packages.map((item) => {
            html+= `
                <li class="list-group-item">
                    <div class="hstack justify-content-between align-items-center gap-3">
                        <button type="button" class="btn btn-outline-light w-100" onclick="package.load('${item}')">${item}</button>
                        <button type="button" class="btn btn-sm btn-danger" onclick="package.remove('${item}')"><i class="bi bi-trash3"></i></button>
                    </div>
                </li>
            `;
        });

        $('#modalPackagesList').html(html);
    },
    load: (name) => {
        load_package = package.get(name);

        console.log(load_package);

        // Package
        $('input[name="package[display_name]"]').val(load_package.package.display_name);
        $('input[name="package[name]"]').val(load_package.package.name);
        $('input[name="package[url]"]').val(load_package.package.url);
        $('input[name="package[strip]"]').val(load_package.package.strip);

        // Version
        $('input[name="version[value]"]').val(load_package.version.value);
        $('select[name="version[type]"] > option').attr('selected', false);
        $(`select[name="version[type]"] > option[value=${load_package.version.type}]`).attr('selected', true);

        // Match
        if (load_package.match.enabled == 'on') {
            $('input[name="match[enabled]"]').attr('checked', true);
            $('input[name="match[enabled]"]').parent().next(".hide").slideDown();
        } else {
            $('input[name="match[enabled]"]').attr('checked', false);
            $('input[name="match[enabled]"]').parent().next(".hide").slideUp();
        }

        $('input[name="match[value]"]').val(load_package.match.value);

        // Strip
        if (load_package.stripe && load_package.stripe.enabled == 'on') {
            $('input[name="stripe[enabled]"]').attr('checked', true);
            $('input[name="stripe[enabled]"]').parent().next(".hide").slideDown();
        } else {
            $('input[name="stripe[enabled]"]').attr('checked', false);
            $('input[name="stripe[enabled]"]').parent().next(".hide").slideUp();
        }
        $('#strip > tbody').html('');
        
        if (load_package.stripe && load_package.stripe.items) {
            for (const key in load_package.stripe.items) {
                if (load_package.stripe.items.hasOwnProperty(key)) {
                  const item = load_package.stripe.items[key];
                  addStrip('#strip');
                  $('#strip > tbody > tr:last-child input').val(item.value);
                }
              }
        }

        // Platforms
        if (load_package.platforms) {
            if (load_package.platforms.darwin) {
                $('input[name="platforms[darwin][x86_64]"]').attr('checked', load_package.platforms.darwin.x86_64 == 'on' ? true : false);
                $('input[name="platforms[darwin][aarch64]"]').attr('checked', load_package.platforms.darwin.aarch64 == 'on' ? true : false);
            }
            if (load_package.platforms.linux) {
                $('input[name="platforms[linux][x86_64]"]').attr('checked', load_package.platforms.linux.x86_64 == 'on' ? true : false);
                $('input[name="platforms[linux][aarch64]"]').attr('checked', load_package.platforms.linux.aarch64 == 'on' ? true : false);
            }
        }

        // Dependencies
        $('#dependencies > tbody').html('');

        if (load_package.dependencies) {
            for (const key in load_package.dependencies) {
                const item = load_package.dependencies[key];
                addDependency('#dependencies');
                $('#dependencies > tbody > tr:last-child input[data-name="value"]').val(item.value);
                $('#dependencies > tbody > tr:last-child input[data-name="version"]').val(item.version);

                const variations = ['runtime', 'build', 'testDep'];
                const platforms = ['darwin', 'linux'];
                const architectures = ['x86_64', 'aarch64'];

                variations.forEach(variation => {
                platforms.forEach(platform => {
                    architectures.forEach(architecture => {
                    const inputElement = $(`#dependencies > tbody > tr:last-child input[data-name="${variation}/${platform}/${architecture}"]`);
                    if (inputElement.length) {
                        inputElement.prop('checked', item[variation]?.[platform]?.[architecture] || false);
                    } else {
                        console.log(`Input element not found for ${variation}/${platform}/${architecture}`);
                    }
                    });
                });
                });
            }
        }

        // Build script
        if (load_package.build && load_package.build.script) {
            for (const key in load_package.build.script) {
                const item = load_package.build.script[key];
                addBuildCommand('#build');

                $('#build > tbody > tr:last-child textarea[data-name="command"]').text(item.command);
                $('#build > tbody > tr:last-child input[data-name="condition"]').val(item.condition.name);
                $('#build > tbody > tr:last-child input[data-name="value"]').val(item.condition.value);
            }
        }

        // Build env
        if (load_package.build && load_package.build.env) {
            for (const key in load_package.build.env) {
                const item = load_package.build.env[key];
                addBuildEnv('#env');

                $('#env > tbody > tr:last-child input[data-name="variable"]').val(item.variable);
                $('#env > tbody > tr:last-child textarea[data-name="value"]').text(item.value);
            }
        }

        // Test script
        if (load_package.test && load_package.test.script) {
            for (const key in load_package.test.script) {
                const item = load_package.test.script[key];
                addTestCommand('#test');

                $('#test > tbody > tr:last-child input').val(item);
            }
        }

        // Test env
        if (load_package.test && load_package.test.env) {
            for (const key in load_package.test.env) {
                const item = load_package.test.env[key];
                addTestEnv('#testEnv');

                $('#testEnv > tbody > tr:last-child input[data-name="variable"]').val(item.variable);
                $('#testEnv > tbody > tr:last-child textarea[data-name="value"]').text(item.value);
            }
        }

        // Provides
        if (load_package.provides) {
            for (const key in load_package.provides) {
                const item = load_package.provides[key];
                addBinary('#provides');

                $('#provides > tbody > tr:last-child input').val(item);
            }
        }

        // Directory
        $('input[name="directory[build]"]').val(load_package.directory.build);

        $('#modalPackages').modal('hide');
        generate();
    },
    modal: () => {
        html = '';
        packages = package.list();

        packages.map((item) => {
            html+= `
                <li class="list-group-item">
                    <div class="hstack justify-content-between align-items-center gap-3">
                        <button type="button" class="btn btn-outline-light w-100" onclick="package.load('${item}')">${item}</button>
                        <button type="button" class="btn btn-sm btn-danger" onclick="package.remove('${item}')"><i class="bi bi-trash3"></i></button>
                    </div>
                </li>
            `;
        });

        $('#modalPackagesList').html(html);
        $('#modalPackages').modal('show');
    }
}