# **Bot Setup and Usage Guide**  

👋 **Hey!** I made this bot for a server called **LSCRP**, but unfortunately, they kicked me out and were really rude, taking away my staff role after I helped them with everything. I decided to share this bot with everyone so it doesn’t go to waste and can still be useful to others!  

---

## **How to Set Up the Bot**  

### **1. Edit the `bot.js` File**  

- Open the `bot.js` file and locate the following lines:

  ```javascript
  token: "", // Discord Token
  clientId: "", // Discord Bot ClientID
  guildId: "", // Guild ID
  ownerId: "", // Owner ID
  permissionRole: null, // Role with specific permissions (optional)
  logChannel: null, // Channel for logging events (optional)
  appealLogChannel: "", // Channel ID for appeal logs
  allowedGuilds: ["BCSO SERVER ID", "SAST SERVER ID", "LAPD SERVER ID", "AND MORE!"], // Add more server IDs as needed
  appealServerInvite: "https://discord.gg/SERVER" // Invite link to the appeal server
  ```

- **Update the values** for each field:  
  - `token`: Your Discord bot token.  
  - `clientId`: Your bot’s client ID.  
  - `guildId`: The main server’s ID.  
  - `allowedGuilds`: List of server IDs where this bot is allowed to function.  

### **2. Edit the `config.json` File**  

In `config.json`, make sure to update the following:  

```json
{
  "token": "Your Discord Token Here",
  "clientId": "Your Bot Client ID",
  "guildId": "Your Main Server ID",
  "ownerId": "Your Discord User ID",
  "permissionRole": "Role ID with permissions (optional)",
  "logChannel": "Channel ID for logs",
  "appealLogChannel": "Channel ID for appeal logs",
  "allowedGuilds": [
    "1253720578527854674",
    "1251848648304627786"
  ],
  "appealServerInvite": "https://discord.gg/SERVER"
}
```

### **3. Save and Restart**  
After editing both files, save your changes and restart the bot to apply them.

---

## **Need Help?**  
If you run into any issues, feel free to open an issue on my GitHub page. Thanks for using the bot, and I hope it helps your community! 😊
