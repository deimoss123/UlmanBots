export default {
  title: 'Ping',

  callback: (message) => {
    message.reply('pong')

    return 1
  },
}

