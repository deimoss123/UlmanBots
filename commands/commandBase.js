import { latToEng } from '../helperFunctions.js'
import { Permissions } from 'discord.js'
import { embedError, embedTemplate } from '../embeds/embeds.js'
import { settingsCache } from './admin/iestatijumi.js'

export default async (client, message, alias, commandOptions) => {

  // defaultie parametri
  let {
    title = '',
    description,
    expectedArgs = '',
    roleError = 'Tev nav nepieciešamā loma',
    minArgs = 0,
    maxArgs = null,
    requiredRoles = [],
    modCommand = 0,
    callback,
  } = commandOptions

  const content = latToEng(message.content.toLowerCase())

  const { member } = message
  console.log(member.guild.id)

  // Pārbaudīt vai ir pareizās lomas
  let roletest = member.id === '222631002265092096' ? 1 : 0
  if (requiredRoles.length) {
    if (member.roles.cache.some(r => requiredRoles.includes(r.id))) roletest = 1
  } else if (modCommand) {
    if (member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) roletest = 1
    if (settingsCache[member.guild.id]?.modRoles) {
      if (member.roles.cache.some(r => settingsCache[member.guild.id].modRoles.includes(r.id))) roletest = 1
    }
  } else roletest = 1

  if (!roletest) {
    message.reply(embedError(message, alias, roleError))
    return 2
  }

  // sadala komandu array un noņem priekšējo lietu
  const args = content.split(/[ ]+/)
  args.shift()

  // nepareizas sintakses funkcija
  const wrongSyntax = () => {message.reply(
      embedTemplate(message, `${title} - nepareiza sintakse`, `.${alias} ${expectedArgs}`, 'error'))
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
  if (func === 0) wrongSyntax()
  if (func === 1) return 1
}