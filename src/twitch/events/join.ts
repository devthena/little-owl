export const onJoin = (channel: string, username: string, self: boolean) => {
  if (self) return console.log('* littleowlbot is online *');
  console.log(`${username} has joined ${channel}`);
};
