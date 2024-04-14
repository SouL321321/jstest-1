const { readdirSync } = require("fs");

module.exports = (client) => {
  client.selectMenus = new Map();
  client.buttons = new Map();
  client.handleComponents = async () => {
    const componentFolders = readdirSync("./src/components");
    for (const folder of componentFolders) {
      const componentFiles = readdirSync(`./src/components/${folder}`).filter(
        (file) => file.endsWith(".js")
      );

      const { buttons, selectMenus } = client;

      switch (folder) {
        case "buttons":
          for (const file of componentFiles) {
            try {
              const button = require(`../../components/${folder}/${file}`);
              if (button.customId) {
                buttons.set(button.customId, button);
              } else if (button.data && button.data.name) {
                buttons.set(button.data.name, button);
              } else {
                console.error(`Component in ${folder}/${file} does not have a customId or name.`);
              }
            } catch (error) {
              console.error(`Error loading button component ${folder}/${file}:`, error);
            }
          }
          break;

        case "selectMenus":
          for (const file of componentFiles) {
            try {
              const menu = require(`../../components/${folder}/${file}`);
              if (menu.customId) {
                selectMenus.set(menu.customId, menu);
              } else if (menu.data && menu.data.name) {
                selectMenus.set(menu.data.name, menu);
              } else {
                console.error(`Component in ${folder}/${file} does not have a customId or name.`);
              }
            } catch (error) {
              console.error(`Error loading selectMenu component ${folder}/${file}:`, error);
            }
          }
          break;

        default:
          break;
      }
    }
  };
};
