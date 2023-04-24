import { ActivityType, EmbedBuilder, Presence } from 'discord.js';
import { BotsProps } from 'src/interfaces';
import { CONFIG } from '../../constants';

export const onPresenceUpdate = async (
  Bots: BotsProps,
  oldPresence: Presence,
  newPresence: Presence
) => {
  if (!newPresence.guild?.available) return;

  if (newPresence.activities.length) {
    const isStreaming = newPresence.activities.some(
      activity => activity.type === ActivityType.Streaming
    );

    const hasBeenStreaming = oldPresence
      ? oldPresence.activities.some(
          activity => activity.type === ActivityType.Streaming
        )
      : false;

    // member has started streaming
    if (!hasBeenStreaming && isStreaming) {
      // stream announcement for server owner
      if (
        CONFIG.CHANNELS.ALERTS.ENABLED &&
        newPresence.guild.ownerId === newPresence.member?.id
      ) {
        const streamActivity = newPresence.activities.find(
          activity => activity.type == ActivityType.Streaming
        );

        const streamAlertChannelExists = newPresence.guild.channels.cache.find(
          channel => channel.id === CONFIG.CHANNELS.ALERTS.ID
        );

        if (
          streamActivity &&
          streamAlertChannelExists &&
          !Bots.cooldowns.streamAlerts
        ) {
          let liveMessage = '';

          if (streamActivity.details) liveMessage += streamActivity.details;
          if (streamActivity.url) liveMessage += `\n\n${streamActivity.url}`;

          const liveImage = streamActivity.assets
            ? streamActivity.assets.largeImageURL()
            : null;

          const botEmbed = new EmbedBuilder()
            .setAuthor({
              name: newPresence.member.displayName,
              iconURL: newPresence.member.displayAvatarURL(),
            })
            .setTitle(`Now Streaming ${streamActivity.state}`)
            .setDescription(liveMessage)
            .setImage(liveImage)
            .setFooter({
              text: `Posted on ${streamActivity.createdAt.toDateString()}`,
            });

          const streamAlertChannel = newPresence.guild.channels.cache.get(
            CONFIG.CHANNELS.ALERTS.ID
          );

          if (!streamAlertChannel || !streamAlertChannel.isTextBased()) return;

          streamAlertChannel
            .send(`@everyone ${newPresence.member.displayName} is now live!`)
            .then(_data => {
              streamAlertChannel.send({ embeds: [botEmbed] });
            })
            .catch(console.error)
            .finally(() => {
              Bots.cooldowns.streamAlerts = true;

              setTimeout(() => {
                Bots.cooldowns.streamAlert = false;
              }, CONFIG.CHANNELS.ALERTS.COOLDOWN_MS);
            });
        }
      }
    }
  }
};
