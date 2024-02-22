const Finder = {
    days: 365,
    min: 10000,
    url: `https://formulae.brew.sh/api/analytics/install/365d.json`,
    pantry_url: 'https://pkgx.dev/pkgs/index.json',
    pantry: [],
    formulas: [],
    excludes: [
        'ca-certificates', 'libx11', 'jpeg-xl', 'libnghttp2',
        'awscli', 'icu4c', 'little-cms2', 'pcre2', 'libxcb',
        'xorgproto', 'krb5', 'libxext', 'libvmaf', 'libxau',
        'sdl2', 'graphite2', 'tcl-tk', 'gnu-tar', 'mongosh',
        'python-markupsafe', 'gtk+3', 'hdf5', 'svt-av1',
        'at-spi2-core', 'jupyterlab', 'glib-networking',
        'apache-arrow', 'argocd', 'gnu-getopt', 'flyctl',
        'dart-lang/dart/dart', 'python-typing-extensions',
        'bdw-gc', 'hashicorp/tap/terraform', 'libvidstab',
        'docker-compose', 'py3cairo', 'pygobject3', 'gnu-sed',
        'hicolor-icon-theme', 'utf8cpp', 'swiftlint', 'docker-compose',
        'mysql-client', 'pyenv', 'tidy-html5'
    ],

    getPantry: () => {
        fetch(Finder.pantry_url)
            .then((response) => response.json())
            .then((data) => {
                Finder.pantry = data;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    },

    getFormulas: () => {
        fetch(Finder.url)
            .then((response) => response.json())
            .then((data) => {
                Finder.formulas = data.items;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    },

    find: (period, min) => {
        Finder.days = period;
        Finder.min = min;
        Finder.url = `https://formulae.brew.sh/api/analytics/install/${Finder.days}d.json`;

        Finder.getFormulas();
        Finder.getPantry();

        $('#finder-output').html('<div class="text-center pt-5 mt-5"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>');

        setTimeout(() => {
            $('#finder-output').html('');
            Finder.formulas.forEach((formula) => {
                if (parseInt(formula.count.replace(',', '')) > parseInt(Finder.min) && Finder.matchInPantry(formula.formula).length === 0) {
                    html = `
                        <div class="border p-3 ">
                            <div class="row">
                                <div class="col-3">#${formula.number}</div>
                                <div class="col-3"><a href="https://formulae.brew.sh/formula/${formula.formula}" target="_blank">${formula.formula}</a></div>
                                <div class="col-3">${formula.count} installs (${Finder.min})</div>
                                <div class="col-3">${formula.percent}%</div>
                            </div>
                        </div>
                    `;
                    
                    $('#finder-output').append(html);
                } else {
                    console.log('formula ' + parseInt(formula.count.replace(',', '')) + ' (' + formula.count + ') is less than ' + parseInt(Finder.min));
                }
            });
        }, 1000);
    },
    matchInPantry: (text) => {
        let search = [];

        if (Finder.excludes.filter(item => item === text).length > 0) {
            return [true];
        }

        if (text && text.includes('@')) {
            text = text.split('@')[0];
        }

        // console.log(text);

        const filteredArray = Finder.pantry.filter(item => item.project.includes(text));

        filteredArray.slice(0, 10).forEach((item) => {
            search.push(item.project);
        });

        const filteredArray2 = Finder.pantry.filter(item => item.name.includes(text));      
        
        filteredArray2.slice(0, 10).forEach((item) => {
            search.push(item.project);
        });

        return search;
    }
}

$(function () {
    $('#btnFind').on('click', function () {
        Finder.find(
            $('#period').val(),
            $('#minInstalls').val()
        );
    });
});