import { latToEng } from '../helperFunctions.js'
import { Permissions } from 'discord.js'
import { embedError, embedTemplate, noPing } from '../embeds/embeds.js'
import { settingsCache } from './admin/iestatijumi.js'
import chalk from 'chalk'
import { findUser, setDateCooldown } from '../ekonomija.js'

export default async (client, message, alias, commandOptions) => {

  // defaultie parametri
  let {
    title = '',
    description = '',
    expectedArgs = '',
    roleError = 'Tikai administrātori var izmantot šo komandu',
    minArgs = 0,
    maxArgs = null,
    requiredRoles = [],
    modCommand = false,
    uses = 0,
    extraUses = 0,
    callback,
  } = commandOptions

  const content = latToEng(message.content.toLowerCase())

  const { member, guildId } = message

  // Pārbaudīt vai ir pareizās lomas
  let roletest = member.id === process.env.DEVUSERID ? 1 : 0
  if (requiredRoles.length) {
    if (member.roles.cache.some(r => requiredRoles.includes(r.id))) roletest = 1
  } else if (modCommand) {
    if (member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) roletest = 1
  } else roletest = 1

  if (!roletest) {
    message.reply(noPing(roleError))
    return 2
  }

  // sadala komandu array un noņem priekšējo lietu
  const args = content.split(/[ ]+/)
  args.shift()

  // nepareizas sintakses funkcija
  const wrongSyntax = () => {
    message.reply(
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

  const date = new Date()

  console.log(
    `${date.toLocaleTimeString('en-GB')} ` +
    `${chalk.blueBright(`[${message.guild.name}]`)} ` +
    `${chalk.bold(`${message.member.displayName}`)} ` +
    `${chalk.gray(`(${message.author.id})`)}: ` +
    `${alias} ${args.join(' ')}`,
  )

  if (uses) {
    let { dateCooldowns } = await findUser(guildId, member.id)
    if (!dateCooldowns[title]) {
      dateCooldowns = {
        uses,
        extraUses,
        date: date.toDateString()
      }
      await setDateCooldown(guildId, member.id, title, dateCooldowns)
    } else if (dateCooldowns[title].date !== date.toDateString()) {
      await setDateCooldown(guildId, member.id, title, {
        uses,
        extraUses,
        date: date.toDateString()
      })
    }
  }

  const func = await callback(message, args, args.join(' '), client)
  if (func === 0) wrongSyntax()
  if (func === 1) return 1
}