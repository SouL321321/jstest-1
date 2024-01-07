module.exports = {
    data: {
        name: `ex-button`
    },
    async execute (interaction) {
        await interaction.reply({
            content: `https://discord.gg/7K6TbJgMYt`
        });
    }
}