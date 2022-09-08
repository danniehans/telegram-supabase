import { serve } from "https://deno.land/std@0.154.0/http/server.ts";
import { Bot, webhookCallback } from "https://deno.land/x/grammy@v1.11.0/mod.ts";
import { format } from "https://deno.land/std@0.154.0/datetime/mod.ts";




const bot = new Bot(Deno.env.get("BOT_TOKEN") ?? "");

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.command("ping", (ctx) => ctx.reply(`Pong! ${Intl.DateTimeFormat('en-GB',{timeZone: 'Singapore', dateStyle: 'full', timeStyle: 'long' }).format(new Date())}`));

const handleUpdate = webhookCallback(bot, "std/http");

serve(async (req) => {
  try {
    const url = new URL(req.url);
    if (url.searchParams.get("secret") !== bot.token) {
      return new Response("not allowed", { status: 405 });
    }
    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
  }
});
