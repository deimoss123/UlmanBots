import { Intents, Client, Permissions } from "discord.js";

import dotenv from "dotenv";
import mongo from "./mongo.js";

import { reakcijas } from "./reakcijas/reakcijas.js";
import commandHandler from "./commands/commandHandler.js";
import { settingsCache } from "./commands/admin/iestatijumi.js";
import settingsSchema from "./schemas/settings-schema.js";
import redis from "./redis.js";
import { calculateDiscounts } from "./commands/ekonomija/veikals/veikals.js";

dotenv.config();

export const redisEnabled = true;
export const okddId = "797584379685240882";
const devMode = false;

// definē DiscordJS klientu
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const getDayOfMonth = async () => {
  if (!redisEnabled) return 1;
  const redisClient = await redis();
  return new Promise((res, rej) => {
    redisClient.get("dayofmonth", (err, r) => {
      if (err) return rej(err);
      return res(r);
    });
  });
};

const checkPerms = (msg) => {
  const perms = [Permissions.FLAGS.SEND_MESSAGES];
  const res = msg.guild.me.permissionsIn(msg.channel).has(perms);
  //console.log(res)
  return res;
};

const mobings = async (msg) => {
  const perms = [Permissions.FLAGS.ADD_REACTIONS];
  if (!msg.guild.me.permissionsIn(msg.channel).has(perms)) return;

  const henrijsId = "571398169359810562";

  if (msg.author.id === henrijsId && msg.guildId === okddId) {
    await msg.react("🏳️‍🌈");
  }
};

// galvenais kods
client.on("ready", async () => {
  console.log("client ready");
  // mēģina savienoties ar mongo datubāzi
  await mongo().then(async (mongoose) => {
    try {
      console.log("connected to mongodb");

      const settings = await settingsSchema.find();

      settings.map((setting) => {
        settingsCache[setting._id] = setting;
      });
    } catch (e) {
      console.error(e);
    }
  });

  if (redisEnabled) {
    try {
      await redis();
      console.log("connected to redis");
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log("REDIS DISABLED!");
  }

  /*
  client.on('guildMemberAdd', async member => {
    if (member.guild.id === okddId) {
      const okddRoles = ['797820158709727243', '797820498713116702']

      const newrole = okddRoles[Math.floor(Math.random() * 2)]

      try {
        await member.roles.add(newrole)
      } catch (e) {
        console.error(e)
      }
    }
  })
  */

  await client.on("messageCreate", async (message) => {
    //await mobings(message)

    if (!settingsCache[message.guildId]) {
      await mongo().then(async (mongoose) => {
        // šitais sūds crasho botu katru reizi kad tiek pievienots jaunam serverim
        // es burtiski nezinu risinājumu šitam
        const newSchema = {
          _id: message.guildId,
          allowedChannels: [],
        };
        settingsSchema[newSchema._id] = newSchema;
        await new settingsSchema(newSchema).save();
      });
    }

    if (!checkPerms(message)) return;

    //if (devMode && message.author.id !== process.env.DEVUSERID) return

    // pārbauda vai ziņa sākas ar . (tad tā būs komanda)
    if (message.content.startsWith(".")) {
      await commandHandler(client, message);
    } else if (message.author.id !== process.env.ULMANISID) {
      await reakcijas(client, message);
    }
  });

  const loop = async () => {
    // parbauda kura diena menesi ir prieks veikala atlaidem
    let date = new Date();

    const currDay = await getDayOfMonth();

    if (currDay !== `${date.getDay()}`) {
      await calculateDiscounts();
      const redisClient = await redis();
      redisClient.set("dayofmonth", `${date.getDay()}`);
      console.log("discounts reset");
    }

    setTimeout(async () => {
      await loop();
    }, 20000);
  };
  await loop();
});

// bots ieloggojas discorda
client.login(process.env.TOKEN).then(() => {
  console.log("logged in");
  client.user.setActivity(".palīdzība", { type: "PLAYING" });
});
