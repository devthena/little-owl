import {
  ActivityType,
  ColorResolvable,
  EmbedBuilder,
  Presence,
} from 'discord.js';

import { CONFIG } from '@/constants';
import { LogCode } from '@/enums/logs';
import { BotState } from '@/interfaces/bot';

import { log } from '../helpers';

export const onPresenceUpdate = async (
  state: BotState,
  oldPresence: Presence | null,
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

    if (isStreaming) {
      // member has started streaming
      if (
        liveRole &&
        newPresence.member?.manageable &&
        !newPresence.member?.roles.cache.has(liveRole.id)
      ) {
        newPresence.member?.roles
          .add(liveRole)
          .then(_data => {
            log({
              type: LogCode.Activity,
              description: `${newPresence.member?.user.username} aka ${newPresence.member?.displayName} has started streaming.`,
              footer: `Discord User ID: ${newPresence.member?.id}`,
            });
          })
          .catch(console.error);
      }

      // stream announcement for server owner
      if (
        !hasBeenStreaming &&
        CONFIG.ALERTS.LIVE.ENABLED &&
        newPresence.guild.ownerId === newPresence.member?.id
      ) {
        const streamActivity = newPresence.activities.find(
          activity => activity.type == ActivityType.Streaming
        );

        const streamAlertChannelExists = newPresence.guild.channels.cache.find(
          channel => channel.id === CONFIG.ALERTS.LIVE.ID
        );

        const isStreamAlertInCooldown =
          Date.now() < state.cooldowns.stream.getTime();

        if (
          streamActivity &&
          streamAlertChannelExists &&
          !isStreamAlertInCooldown
        ) {
          let liveMessage = '';

          if (streamActivity.details) liveMessage += streamActivity.details;
          if (streamActivity.url) liveMessage += `\n\n${streamActivity.url}`;

          const liveImage = streamActivity.assets?.largeImageURL();

          const botEmbed = new EmbedBuilder()
            .setColor(CONFIG.COLORS.BLUE as ColorResolvable)
            .setAuthor({
              name: newPresence.member.displayName,
              iconURL: newPresence.member.displayAvatarURL(),
            })
            .setTitle(`Now Streaming ${streamActivity.state}`)
            .setDescription(liveMessage)
            .setThumbnail(newPresence.member.user.displayAvatarURL())
            .setFooter({
              text: `Posted on ${streamActivity.createdAt.toDateString()}`,
            });

          if (liveImage) botEmbed.setImage(liveImage);

          const streamAlertChannel = newPresence.guild.channels.cache.get(
            CONFIG.ALERTS.LIVE.ID
          );

          if (!streamAlertChannel || !streamAlertChannel.isTextBased()) return;

          streamAlertChannel
            .send(`@everyone ${newPresence.member.displayName} is now live!`)
            .then(_data => {
              streamAlertChannel.send({ embeds: [botEmbed] });
            })
            .catch(console.error)
            .finally(() => {
              state.cooldowns.stream = new Date(
                Date.now() + 12 * 60 * 60 * 1000
              );
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

    return;
  }

  if (
    liveRole &&
    newPresence.member?.manageable &&
    newPresence.member?.roles.cache.has(liveRole.id)
  ) {
    newPresence.member?.roles.remove(liveRole).catch(console.error);
  }
};
