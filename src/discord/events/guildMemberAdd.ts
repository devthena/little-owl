import { Message } from "discord.js";
import { CONFIG } from '../../constants';

export const onGuildMemberAdd = async (message: Message) => {
    const { ENABLED, ID } = CONFIG.ROLES.DEFAULT;

    // if feature is not enabled, do nothing
    if(!ENABLED) return;

    const welcomeRole = message.guild?.roles.cache.find(role => role.id === ID);

    // if role does not exist, do nothing
    if(!ID || !welcomeRole) return;

    // if user already has the role, do nothing
    if(message.member?.roles.cache.some(roles => roles.id === ID)) return;

    message.member?.roles.add(welcomeRole?.id || ID)
}
