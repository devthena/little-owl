import { ActivityType, EmbedBuilder, Presence } from 'discord.js';
import { BotsProps } from 'src/interfaces';
import { CONFIG } from '../../constants';
import { LogEventType, logEvent } from '../../utils';

export const onPresenceUpdate = async (
  Bots: BotsProps,
  oldPresence: Presence,
  newPresence: Presence
) => {
  if (!newPresence.guild?.available) return;

  const liveRole = newPresence.guild.roles.cache.find(
    role => CONFIG.ROLES.LIVE.ENABLED && role.id === CONFIG.ROLES.LIVE.ID
  );

  // member has gone offline
  if (newPresence.status === 'offline' || newPresence.status === 'invisible') {
    if (
      liveRole &&
      newPresence.member?.manageable &&
      newPresence.member?.roles.cache.has(liveRole.id)
    ) {
      newPresence.member?.roles.remove(liveRole).catch(console.error);
    }
    return;
  }

  if (newPresence.activities.length) {
    const isStreaming = newPresence.activities.some(
      activity => activity.type === ActivityType.Streaming
    );

    const hasBeenStreaming =
      oldPresence &&
      oldPresence.activities.some(
        activity => activity.type === ActivityType.Streaming
      );

    // member has started streaming
    if (!hasBeenStreaming && isStreaming) {
      if (
        liveRole &&
        newPresence.member?.manageable &&
        !newPresence.member?.roles.cache.has(liveRole.id)
      ) {
        newPresence.member?.roles
          .add(liveRole)
          .then(_data => {
            logEvent({
              Bots,
              type: LogEventType.Activity,
              description: `${newPresence.member?.user.username} aka ${newPresence.member?.displayName} has started streaming.`,
              footer: `Discord User ID: ${newPresence.member?.id}`,
            });
          })
          .catch(console.error);
      }

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

          const liveImage = streamActivity.assets?.largeImageURL();

          const botEmbed = new EmbedBuilder()
            .setAuthor({
              name: newPresence.member.displayName,
              iconURL: newPresence.member.displayAvatarURL(),
            })
            .setTitle(`Now Streaming ${streamActivity.state}`)
            .setDescription(liveMessage)
            .setFooter({
              text: `Posted on ${streamActivity.createdAt.toDateString()}`,
            });

          if (liveImage) botEmbed.setImage(liveImage);

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
      return;
    }

    // member has ended their stream
    if (
      liveRole &&
      newPresence.member?.manageable &&
      newPresence.member?.roles.cache.has(liveRole.id)
    ) {
      newPresence.member?.roles.remove(liveRole).catch(console.error);
    }
  }
};
