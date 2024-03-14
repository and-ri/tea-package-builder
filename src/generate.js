let packageData = {};

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

  packageData = formData;

  let yml = "";

  yml += "distributable:\n";

  if (formData.package.url) {
    yml += `  url: ${formData.package.url}\n`;
    yml += `  strip-components: ${
      formData.package.strip ? formData.package.strip : 0
    }\n`;
  }

  if (formData.package.display_name) {
    yml += "\ndisplay-name: " + formData.package.display_name + "\n";
  }

  yml += "\nversions:\n";
  if (formData.version.type == 'value') {
    yml += `  - ${formData.version.value}\n`;
  } else {
    yml += `  ${formData.version.type}: ${formData.version.value}\n`;
  }

  if (formData.match.enabled) {
    yml += `  match: /${formData.match.value}/\n`;
  }

  if (formData.stripe && formData.stripe.enabled) {
    yml += "  strip:\n";

    if (formData.stripe.items) {
      for (var key in formData.stripe.items) {
        if (formData.stripe.items.hasOwnProperty(key)) {
          var item = formData.stripe.items[key];
          yml += `    - /${item.value}/\n`;
        }
      }
    }
  }

  if (formData.platforms) {
    yml += '\nplatforms:\n';
    if (formData.platforms.darwin && formData.platforms.linux) {
      if (formData.platforms.darwin.x86_64 && formData.platforms.darwin.aarch64) {
        yml += `  - darwin\n`;
      } else {
        if (formData.platforms.darwin.x86_64) {
          yml += `  - darwin/x86-64\n`;
        } else if (formData.platforms.darwin.aarch64) {
          yml += `  - darwin/aarch64\n`;
        }
      }
      if (formData.platforms.linux.x86_64 && formData.platforms.linux.aarch64) {
        yml += `  - linux\n`;
      } else {
        if (formData.platforms.linux.x86_64) {
          yml += `  - linux/x86-64\n`;
        } else if (formData.platforms.linux.aarch64) {
          yml += `  - linux/aarch64\n`;
        }
      }
    } else {
      if (formData.platforms.darwin) {
        if (formData.platforms.darwin.x86_64 && formData.platforms.darwin.aarch64) {
          yml += `  - darwin\n`;
        } else {
          if (formData.platforms.darwin.x86_64) {
            yml += `  - darwin/x86-64\n`;
          } else if (formData.platforms.darwin.aarch64) {
            yml += `  - darwin/aarch64\n`;
          }
        }
      }
      if (formData.platforms.linux) {
        if (formData.platforms.linux.x86_64 && formData.platforms.linux.aarch64) {
          yml += `  - linux\n`;
        } else {
          if (formData.platforms.linux.x86_64) {
            yml += `  - linux/x86-64\n`;
          } else if (formData.platforms.linux.aarch64) {
            yml += `  - linux/aarch64\n`;
          }
        }
      }
    }
  }

  // Format dependencies
  format.deps(formData.dependencies);

  if (formData.dependencies) {
    runtime = format.get("runtime");

    if (
      Object.keys(runtime.all).length > 0 ||
      Object.keys(runtime.darwin).length > 0 ||
      Object.keys(runtime.linux).length > 0 ||
      Object.keys(runtime.darwin_x86_64).length > 0 ||
      Object.keys(runtime.darwin_aarch64).length > 0 ||
      Object.keys(runtime.linux_x86_64).length > 0 ||
      Object.keys(runtime.linux_aarch64).length > 0
    ) {
      yml += "\ndependencies:\n";
    }

    if (Object.keys(runtime.all).length > 0) {
      runtime.all.map((item) => {
        yml += `  ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
    if (Object.keys(runtime.darwin).length > 0) {
      yml += "  darwin:\n";
      runtime.darwin.map((item) => {
        yml += `    ${item.value}: ${
          item.version ? item.version : "'*'"
        }\n`;
      });
    }
    if (Object.keys(runtime.linux).length > 0) {
      yml += "  linux:\n";
      runtime.linux.map((item) => {
        yml += `    ${item.value}: ${
          item.version ? item.version : "'*'"
        }\n`;
      });
    }
    if (Object.keys(runtime.darwin_x86_64).length > 0) {
      yml += "  darwin/x86-64:\n";
      runtime.darwin_x86_64.map((item) => {
        yml += `    ${item.value}: ${
          item.version ? item.version : "'*'"
        }\n`;
      });
    }
    if (Object.keys(runtime.darwin_aarch64).length > 0) {
      yml += "  darwin/aarch64:\n";
      runtime.darwin_aarch64.map((item) => {
        yml += `    ${item.value}: ${
          item.version ? item.version : "'*'"
        }\n`;
      });
    }
    if (Object.keys(runtime.linux_x86_64).length > 0) {
      yml += "  linux/x86-64:\n";
      runtime.linux_x86_64.map((item) => {
        yml += `    ${item.value}: ${
          item.version ? item.version : "'*'"
        }\n`;
      });
    }
    if (Object.keys(runtime.linux_aarch64).length > 0) {
      yml += "  linux/aarch64:\n";
      runtime.linux_aarch64.map((item) => {
        yml += `    ${item.value}: ${
          item.version ? item.version : "'*'"
        }\n`;
      });
    }
  }

  yml += "\nbuild:\n";

  if (formData.dependencies) {
    // Build
    build = format.get("build");

    if (
      Object.keys(build.all).length > 0 ||
      Object.keys(build.darwin).length > 0 ||
      Object.keys(build.linux).length > 0 ||
      Object.keys(build.darwin_x86_64).length > 0 ||
      Object.keys(build.darwin_aarch64).length > 0 ||
      Object.keys(build.linux_x86_64).length > 0 ||
      Object.keys(build.linux_aarch64).length > 0
    ) {
      yml += "  dependencies:\n";
    }

    if (Object.keys(build.all).length > 0) {
      build.all.map((item) => {
        yml += `    ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
    if (Object.keys(build.darwin).length > 0) {
      yml += "    darwin:\n";
      build.darwin.map((item) => {
        yml += `      ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
    if (Object.keys(build.linux).length > 0) {
      yml += "    linux:\n";
      build.linux.map((item) => {
        yml += `      ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
    if (Object.keys(build.darwin_x86_64).length > 0) {
      yml += "    darwin/x86-64:\n";
      build.darwin_x86_64.map((item) => {
        yml += `      ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
    if (Object.keys(build.darwin_aarch64).length > 0) {
      yml += "    darwin/aarch64:\n";
      build.darwin_aarch64.map((item) => {
        yml += `      ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
    if (Object.keys(build.linux_x86_64).length > 0) {
      yml += "    linux/x86-64:\n";
      build.linux_x86_64.map((item) => {
        yml += `      ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
    if (Object.keys(build.linux_aarch64).length > 0) {
      yml += "    linux/aarch64:\n";
      build.linux_aarch64.map((item) => {
        yml += `      ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
  }
  if (formData.build && formData.directory && formData.directory.build) {
    yml += `  working-directory: ${formData.directory.build}\n`;
  }
  if (formData.build && formData.build.script) {
    yml += "  script:\n";
    for (var key in formData.build.script) {
      if (formData.build.script.hasOwnProperty(key)) {
        var item = formData.build.script[key];
        if (item.condition && item.condition.name && item.condition.value) {
          let commands = item.command.split(/\r\n|\r|\n/g);

          if (commands.length > 1) {
            yml += `    - run: |\n`;
            commands.map((item) => {
              yml += `        ${item}\n`;
            });
          } else {
            yml += `    - run: ${item.command}\n`;
          }
          yml += `      ${item.condition.name}: ${item.condition.value}\n`;
        } else {

          let commands = item.command.split(/\r\n|\r|\n/g);

          if (commands.length > 1) {
            yml += `    - run: |\n`;
            commands.map((item) => {
              yml += `        ${item}\n`;
            });
          } else {
            yml += `    - ${item.command}\n`;
          }
        }
      }
    }
  }
  if (formData.build && formData.build.env) {
    yml += "  env:\n";

    buildEnvPlatform = {
      all: [],
      darwin: [],
      linux: [],
      darwin_x86_64: [],
      darwin_aarch64: [],
      linux_x86_64: [],
      linux_aarch64: [],
      aarch64: [],
      x86_64: []
    };

    format.env(formData.build.env);

    buildEnv = format.getEnv();

    if (Object.keys(buildEnv.all).length > 0) {
      buildEnv.all.map((item) => {
        let values = item.value.split(/\r\n|\r|\n/g);

        if (values.length > 1) {
          yml += `    ${item.variable}:\n`;
          values.map((item) => {
            yml += `      - ${item}\n`;
          });
        } else {
          yml += `    ${item.variable}: ${item.value}\n`;
        }
      });
    }

    if (Object.keys(buildEnv.darwin).length > 0) {
      yml += "    darwin:\n";
      buildEnv.darwin.map((item) => {
        let values = item.value.split(/\r\n|\r|\n/g);

        if (values.length > 1) {
          yml += `      ${item.variable}:\n`;
          values.map((item) => {
            yml += `        - ${item}\n`;
          });
        } else {
          yml += `      ${item.variable}: ${item.value}\n`;
        }
      });
    }

    if (Object.keys(buildEnv.linux).length > 0) {
      yml += "    linux:\n";
      buildEnv.linux.map((item) => {
        let values = item.value.split(/\r\n|\r|\n/g);

        if (values.length > 1) {
          yml += `      ${item.variable}:\n`;
          values.map((item) => {
            yml += `        - ${item}\n`;
          });
        } else {
          yml += `      ${item.variable}: ${item.value}\n`;
        }
      });
    }

    if (Object.keys(buildEnv.darwin_x86_64).length > 0) {
      yml += "    darwin/x86-64:\n";
      buildEnv.darwin_x86_64.map((item) => {
        let values = item.value.split(/\r\n|\r|\n/g);

        if (values.length > 1) {
          yml += `      ${item.variable}:\n`;
          values.map((item) => {
            yml += `        - ${item}\n`;
          });
        } else {
          yml += `      ${item.variable}: ${item.value}\n`;
        }
      });
    } 

    if (Object.keys(buildEnv.darwin_aarch64).length > 0) {
      yml += "    darwin/aarch64:\n";
      buildEnv.darwin_aarch64.map((item) => {
        let values = item.value.split(/\r\n|\r|\n/g);

        if (values.length > 1) {
          yml += `      ${item.variable}:\n`;
          values.map((item) => {
            yml += `        - ${item}\n`;
          });
        } else {
          yml += `      ${item.variable}: ${item.value}\n`;
        }
      });
    }

    if (Object.keys(buildEnv.linux_x86_64).length > 0) {
      yml += "    linux/x86-64:\n";
      buildEnv.linux_x86_64.map((item) => {
        let values = item.value.split(/\r\n|\r|\n/g);

        if (values.length > 1) {
          yml += `      ${item.variable}:\n`;
          values.map((item) => {
            yml += `        - ${item}\n`;
          });
        } else {
          yml += `      ${item.variable}: ${item.value}\n`;
        }
      });
    }

    if (Object.keys(buildEnv.linux_aarch64).length > 0) {
      yml += "    linux/aarch64:\n";
      buildEnv.linux_aarch64.map((item) => {
        let values = item.value.split(/\r\n|\r|\n/g);

        if (values.length > 1) {
          yml += `      ${item.variable}:\n`;
          values.map((item) => {
            yml += `        - ${item}\n`;
          });
        } else {
          yml += `      ${item.variable}: ${item.value}\n`;
        }
      });
    }
  }

  if (formData.provides) {
    yml += "\nprovides:\n";

    for (var key in formData.provides) {
      if (formData.provides.hasOwnProperty(key)) {
        var item = formData.provides[key];

        yml += `  - bin/${item}\n`;
      }
    }
  }

  if (formData.test) {
    yml += "\ntest:\n";

    // Test
    testDep = format.get("test");

    if (
      Object.keys(testDep.all).length > 0 ||
      Object.keys(testDep.darwin).length > 0 ||
      Object.keys(testDep.linux).length > 0 ||
      Object.keys(testDep.darwin_x86_64).length > 0 ||
      Object.keys(testDep.darwin_aarch64).length > 0 ||
      Object.keys(testDep.linux_x86_64).length > 0 ||
      Object.keys(testDep.linux_aarch64).length > 0
    ) {
      yml += "  dependencies:\n";
    }

    if (Object.keys(testDep.all).length > 0) {
      testDep.all.map((item) => {
        yml += `    ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
    if (Object.keys(testDep.darwin).length > 0) {
      yml += "    darwin:\n";
      testDep.darwin.map((item) => {
        yml += `      ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
    if (Object.keys(testDep.linux).length > 0) {
      yml += "    linux:\n";
      testDep.linux.map((item) => {
        yml += `      ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
    if (Object.keys(testDep.darwin_x86_64).length > 0) {
      yml += "    darwin/x86-64:\n";
      testDep.darwin_x86_64.map((item) => {
        yml += `      ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
    if (Object.keys(testDep.darwin_aarch64).length > 0) {
      yml += "    darwin/aarch64:\n";
      testDep.darwin_aarch64.map((item) => {
        yml += `      ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
    if (Object.keys(testDep.linux_x86_64).length > 0) {
      yml += "    linux/x86-64:\n";
      testDep.linux_x86_64.map((item) => {
        yml += `      ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }
    if (Object.keys(testDep.linux_aarch64).length > 0) {
      yml += "    linux/aarch64:\n";
      testDep.linux_aarch64.map((item) => {
        yml += `      ${item.value}: ${item.version ? item.version : "'*'"}\n`;
      });
    }

    if (formData.test.script) {
      yml += "  script:\n";
      for (var key in formData.test.script) {
        if (formData.test.script.hasOwnProperty(key)) {
          var item = formData.test.script[key];
          yml += `    - ${item}\n`;
        }
      }
    }
    if (formData.test && formData.test.env) {
      yml += "  env:\n";
      for (var key in formData.test.env) {
        if (formData.test.env.hasOwnProperty(key)) {
          var item = formData.test.env[key];

          let values = item.value.split(/\r\n|\r|\n/g);

          if (values.length > 1) {
            yml += `    ${item.variable}:\n`;
            values.map((item) => {
              yml += `      - ${item}\n`;
            });
          } else {
            yml += `    ${item.variable}: ${values}\n`;
          }
        }
      }
    }
  }

  $("#output > pre").html(yml);

  $("#command > pre").html(`bk init ${formData.package.name}`);

  $("#build-command > pre").html(`bk build ${formData.package.name}`);

  $("#test-command > pre").html(`bk test ${formData.package.name}`);
};
