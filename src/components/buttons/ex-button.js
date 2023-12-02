module.exports = {
    data: {
        name: `ex-button`
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: `https://discord.gg/NpYJje43`
        });
    }
}