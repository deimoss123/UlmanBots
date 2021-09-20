import { Permissions } from 'discord.js'

export default {
  title: "Addition",
  expectedArgs: '<num1> <num2>',
  permissionError: 'Tu neesi admins',
  roleError: "Tev vajag Owner lomu",
  minArgs: 2,
  maxArgs: 2,
  callback: (message, args) => {
    const num1 = parseInt(args[0])
    const num2 = parseInt(args[1])

    message.reply(`${num1 + num2}`)
    return 1
  },
  permissions: [Permissions.FLAGS.ADMINISTRATOR],
  requiredRoles: ['owner']
}

