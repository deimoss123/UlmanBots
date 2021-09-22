import { latToEng } from '../helperFunctions.js'
import { Permissions } from 'discord.js'
import { embedTemplate } from '../embeds/embeds.js'

export default async (client, message, alias, commandOptions) => {

  // defaultie parametri
  let {
    title = '',
    description,
    expectedArgs = '',
    permissionError = 'Tev nav nepieciešamās atlaujas',
    roleError = 'Tev nav nepieciešamā loma',
    minArgs = 0,
    maxArgs = null,
    permissions = [],
    requiredRoles = [],
    callback,
  } = commandOptions

  const content = latToEng(message.content.toLowerCase())

  const { member, guild } = message

  // Permissions.FLAGS.ADMINISTRATOR

  // Pārbaudīt vai ir pareizās atļaujas
  permissions.map(permission => {
    if (!message.member.permissions.has(permission)) {
      message.reply({
        embeds: [
          {
            title: 'Kļūda',
            description: permissionError,
            color: 0xdb170d, // sarkans
          }],
        allowedMentions: { repliedUser: false },
      })
    }
  })

  // Pārbaudīt vai ir pareizās lomas
  /*requiredRoles.map(requiredRole => {
    const role = guild.roles.cache.find(role => role.name === requiredRole)

    console.log(role)

    if (!role || member.roles.cache.has(role.id)) {
      message.reply({
        embeds: [{
          title: "Kļūda",
          description: roleError,
          color: 0xdb170d // sarkans
        }],
        allowedMentions: { repliedUser: false }
      })

      return
    }
  })*/

  // sadala komandu array un noņem priekšējo lietu
  const args = content.split(/[ ]+/)
  args.shift()

  // nepareizas sintakses funkcija
  const wrongSyntax = () => {message.reply(
      embedTemplate(`${title} - nepareiza sintakse`, `.${alias} ${expectedArgs}`, 'error'))
  }

  // Pārbauda vai ir pareiza sintakse
  if (args.length < minArgs || (args.length > maxArgs && maxArgs !== null)) {
    wrongSyntax()
    return
  }

  // callback atgrieztās vērtības:
  // 0 - nepareiza sintakse
  // 1 - veiksmigi
  // 2 - komandai errors
  const func = await callback(message, args, args.join(' '), client)
  if (!func) wrongSyntax()
  if (func === 1) return 1
}