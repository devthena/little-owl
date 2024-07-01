# Little Owl

A private Twitch and Discord bot for the AthenaUS community.

This is a Node.js application using TMI.js and Discord.js with MongoDB.

For the official command list, you can check the [Parthenon website](https://parthenon.app/commands).

The following are for the Team Developers:

## Preparation

- Install `nvm` and `yarn`
- Pull the latest `stage` branch after cloning the repository
- Create a `.env` file based on the `.env.sample` (Ask the code owners for the secrets)

## Development

Enable developer mode in your Discord app by going to `Settings -> Advanced -> Developer Mode`

### Command Registration

- New commands for Discord would need to be registered
- Run `yarn bot:register` to manually register all prod and stage commands

### Local Environment

- Run `nvm use` to use the proper Node version
- Run `yarn install` to install dependencies
- Run `yarn dev` to run a local instance of the bot using stage environment variables

## Contribution

If you want to contribute to this bot, reach out to the admins and ask to be added to their developer team. Once added, you should get an email invite that is tied to your account. You should then be able to see the application from the [Discord developer portal](https://discord.com/developers/applications).

## Support or Feedback

Join the AthenaUS community!

You can contact Athena if you have any questions or feedback by [sending an email](mailto:athena@parthenon.app) or joining her [Discord server](https://discord.com/invite/5dzECDz).
