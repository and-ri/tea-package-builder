const format = {
    sections: {
        build: { darwin: [], linux: [], all: [], darwin_x86_64: [], darwin_aarch64: [], linux_x86_64: [], linux_aarch64: [] },
        runtime: { darwin: [], linux: [], all: [], darwin_x86_64: [], darwin_aarch64: [], linux_x86_64: [], linux_aarch64: [] },
        test: { darwin: [], linux: [], all: [], darwin_x86_64: [], darwin_aarch64: [], linux_x86_64: [], linux_aarch64: [] }
    },
    platforms: { darwin: [], linux: [], all: [], darwin_x86_64: [], darwin_aarch64: [], linux_x86_64: [], linux_aarch64: [] },
    get: function(section) {
        return format.sections[section];
    },
    getEnv() {
        return format.platforms;
    },
    deps: function(array) {
        format.sections = {
            build: { darwin: [], linux: [], all: [], darwin_x86_64: [], darwin_aarch64: [], linux_x86_64: [], linux_aarch64: [] },
            runtime: { darwin: [], linux: [], all: [], darwin_x86_64: [], darwin_aarch64: [], linux_x86_64: [], linux_aarch64: [] },
            test: { darwin: [], linux: [], all: [], darwin_x86_64: [], darwin_aarch64: [], linux_x86_64: [], linux_aarch64: [] }
        };

        for (let key in array) {
            if (array.hasOwnProperty(key)) {
                let item = array[key];
                if (item.runtime) {
                    format.sort(item, 'runtime');
                }
                if (item.build) {
                    format.sort(item, 'build');
                }
                if (item.test) {
                    format.sort(item, 'test');
                }
            }
        }
    },
    env: (array) => {
        format.platforms = { darwin: [], linux: [], all: [], darwin_x86_64: [], darwin_aarch64: [], linux_x86_64: [], linux_aarch64: [] };
        for (let key in array) {
            if (array.hasOwnProperty(key)) {
                let item = array[key];
                format.sort(item);
            }
        }
    },
    sort: function(item, section = false) {
        if (section) {
            item[section].darwin === undefined ? item[section].darwin = {} : null;
            item[section].darwin.aarch64 === undefined ? item[section].darwin.aarch64 = [] : null;
            item[section].darwin.x86_64 === undefined ? item[section].darwin.x86_64 = [] : null;
            item[section].linux === undefined ? item[section].linux = {} : null;
            item[section].linux.aarch64 === undefined ? item[section].linux.aarch64 = [] : null;
            item[section].linux.x86_64 === undefined ? item[section].linux.x86_64 = [] : null;

            full = [];

            if (item[section].darwin.aarch64.length > 0 && item[section].darwin.x86_64.length > 0 && item[section].linux.aarch64.length > 0 && item[section].linux.x86_64.length > 0) {
                format.sections[section].all.push(item);
                full.push('linux');
                full.push('darwin');
                return;
            }

            if (item[section].darwin.aarch64.length > 0 && item[section].darwin.x86_64.length > 0) {
                format.sections[section].darwin.push(item);
                full.push('darwin');
            }

            if (item[section].linux.aarch64.length > 0 && item[section].linux.x86_64.length > 0) {
                format.sections[section].linux.push(item);
                full.push('linux');
            }

            if (item[section].darwin.aarch64.length > 0 && !full.includes('darwin')) {
                format.sections[section].darwin_aarch64.push(item);
            }

            if (item[section].darwin.x86_64.length > 0 && !full.includes('darwin')) {
                format.sections[section].darwin_x86_64.push(item);
            }

            if (item[section].linux.aarch64.length > 0 && !full.includes('linux')) {
                format.sections[section].linux_aarch64.push(item);
            }

            if (item[section].linux.x86_64.length > 0 && !full.includes('linux')) {
                format.sections[section].linux_x86_64.push(item);
            }
        } else {
            item.darwin === undefined ? item.darwin = {} : null;
            item.darwin.aarch64 === undefined ? item.darwin.aarch64 = [] : null;
            item.darwin.x86_64 === undefined ? item.darwin.x86_64 = [] : null;
            item.linux === undefined ? item.linux = {} : null;
            item.linux.aarch64 === undefined ? item.linux.aarch64 = [] : null;
            item.linux.x86_64 === undefined ? item.linux.x86_64 = [] : null;

            full = [];

            if (item.darwin.aarch64.length > 0 && item.darwin.x86_64.length > 0 && item.linux.aarch64.length > 0 && item.linux.x86_64.length > 0) {
                format.platforms.all.push(item);
                full.push('linux');
                full.push('darwin');
                return;
            }

            if (item.darwin.aarch64.length > 0 && item.darwin.x86_64.length > 0) {
                format.platforms.darwin.push(item);
                full.push('darwin');
            }

            if (item.linux.aarch64.length > 0 && item.linux.x86_64.length > 0) {
                format.platforms.linux.push(item);
                full.push('linux');
            }

            if (item.darwin.aarch64.length > 0 && !full.includes('darwin')) {
                format.platforms.darwin_aarch64.push(item);
            }

            if (item.darwin.x86_64.length > 0 && !full.includes('darwin')) {
                format.platforms.darwin_x86_64.push(item);
            }

            if (item.linux.aarch64.length > 0 && !full.includes('linux')) {
                format.platforms.linux_aarch64.push(item);
            }

            if (item.linux.x86_64.length > 0 && !full.includes('linux')) {
                format.platforms.linux_x86_64.push(item);
            }
        }
    }
};