import { Message } from "discord.js";

const DEFAULT_ROLE_ID = process.env.DEFAULT_ROLE_ID || '';

export const onGuildMemberAdd = async (message: Message) => {

    const welcomeRole = message.guild?.roles.cache.find(role => role.id === DEFAULT_ROLE_ID);

    // if role does not exist, do nothing
    if(!DEFAULT_ROLE_ID || !welcomeRole) return;

    message.member?.roles.add(welcomeRole?.id || DEFAULT_ROLE_ID)

}