# **Bot Setup and Usage Guide**  

👋 **Hey!** I made this bot for a server called **LSCRP**, but unfortunately, they kicked me out and were really rude, taking away my staff role after I helped them with everything. I decided to share this bot with everyone so it doesn’t go to waste and can still be useful to others!  

---

## **How to Set Up the Bot**  

### **1. Install Node.js and Clone the Repository**  
- Make sure you have [Node.js](https://nodejs.org/) installed.  
- Clone or download the bot’s repository to your local machine.  

### **2. Install Dependencies**  
Open a terminal in the bot’s directory and run:  
```sh
npm install
```

### **3. Configure the Bot (`config.json`)**  
Edit the `config.json` file and update the following values:  
```json
{
  "token": "Your_Discord_Bot_Token",
  "clientId": "Your_Bot_Client_ID",
  "guildId": "Your_Main_Server_ID",
  "ownerId": "Your_Discord_User_ID",
  "permissionRole": "Role_ID_with_Permissions",
  "logChannel": "Log_Channel_ID",
  "appealLogChannel": "Appeal_Log_Channel_ID",
  "allowedGuilds": [
    "1253720578527854674",
    "1251848648304627786"
  ],
  "appealServerInvite": "https://discord.gg/YOUR_SERVER"
}
```

### **4. Deploy the Commands to Discord**  
Run the following command to register the bot's commands:  
```sh
node deploy-commands.js
```

### **5. Start the Bot**  
Once everything is set up, start the bot with:  
```sh
node index.js
```

---

## **Need Help?**  
If you run into any issues, feel free to open an issue on my GitHub page. Thanks for using the bot, and I hope it helps your community! 😊
