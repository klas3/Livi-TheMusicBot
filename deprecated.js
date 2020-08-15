/*eslint-disable*/
// if (guilds[message.guild.id] === {}) {
  // db.all("select name from sqlite_master where type='table'", (err, tables) => {
  //   if (err) {
  //     throw err;
  //   }
  //   const found = tables.find((g) => g.name === `guild${message.guild.id}`);
  //   if (found === undefined) {
  //     db.run(`CREATE TABLE guild${message.guild.id} (id INT, comp TEXT);`);
  //   }
  // });
// }

// if (message.content.startsWith(`${guilds[message.guild.id].prefix}createPlaylist`) || message.content.startsWith(`${guilds[message.guild.id].prefix}cpl`)) {
  //   message.delete(1000);
  //   db.all(`SELECT id,comp FROM guild${message.guild.id} WHERE id = '${message.author.id}'`, (err, row) => {
  //     if (err) {
  //       throw err;
  //     }
  //     if (row.length === 0) {
  //       let compositions;
  //       if (message.content.startsWith(`${guilds[message.guild.id].prefix}createPlaylist`)) { compositions = message.content.slice(16); } else { compositions = message.content.slice(5); }
  //       if (compositions.length !== 0) {
  //         db.run(`INSERT INTO guild${message.guild.id} (id, comp) VALUES ('${message.author.id}', '${compositions}')`);
  //         message.channel.send('👍 *You successfully created your playlist! Type* ***!seePlaylist*** *to see it!*');
  //       }
  //     } else {
  //       message.channel.send('❌ *You have already create your playlist! Say* ***!updatePlaylist*** *or* ***!deletePlaylist***');
  //     }
  //   });
  // }

  // if (message.content.startsWith(`${guilds[message.guild.id].prefix}updatePlaylist`) || message.content.startsWith(`${guilds[message.guild.id].prefix}upl`)) {
  //   message.delete(1000);
  //   db.all(`SELECT id,comp FROM guild${message.guild.id} WHERE id = '${message.author.id}'`, (err, row) => {
  //     if (err) {
  //       throw err;
  //     }
  //     if (row.length === 0) {
  //       message.channel.send("❌ *You don't have a playlist now! Type* ***!createPlaylist*** *to create this!*");
  //     } else {
  //       let compositions;
  //       if (message.content.startsWith(`${guilds[message.guild.id].prefix}updatePlaylist`)) { compositions = message.content.slice(16); } else { compositions = message.content.slice(5); }
  //       if (compositions.length !== 0) {
  //         let uplFlag = true;
  //         const array = compositions.split(' ');
  //         array.forEach((comp) => {
  //           const uplCheck = checking(comp, message);
  //           if (!uplCheck) uplFlag = false;
  //         });
  //         if (uplFlag) {
  //           compositions = `${row[0].comp} ${compositions}`;
  //           db.run(`UPDATE guild${message.guild.id} SET comp = '${compositions}' WHERE id = '${message.author.id}'`);
  //           message.channel.send('👍 *You successfully updated your playlist! Type* ***!seePlaylist*** *to see it!*');
  //         } else {
  //           message.channel.send('👎 *You entered invalid urls!*');
  //         }
  //       }
  //     }
  //   });
  // }

  // if (message.content.startsWith(`${guilds[message.guild.id].prefix}seePlaylist`) || message.content.startsWith(`${guilds[message.guild.id].prefix}spl`)) {
  //   db.all(`SELECT id,comp FROM guild${message.guild.id} WHERE id = '${message.author.id}'`, (err, row) => {
  //     if (err) {
  //       throw err;
  //     }
  //     if (row.length !== 0) {
  //       const compos = row[0].comp.split(' ');
  //       playlistNow(compos, message);
  //     } else {
  //       message.channel.send("❌ *You don't have a playlist now! Type* ***!createPlaylist*** *to create this!*");
  //     }
  //   });
  // }

  // if (message.content.startsWith(`${guilds[message.guild.id].prefix}deletePlaylist`) || message.content.startsWith(`${guilds[message.guild.id].prefix}dpl`)) {
  //   db.all(`SELECT id,comp FROM guild${message.guild.id} WHERE id = '${message.author.id}'`, (err, row) => {
  //     if (err) {
  //       throw err;
  //     }
  //     if (row[0] !== undefined) {
  //       db.run(`DELETE FROM guild${message.guild.id} WHERE id = '${message.author.id}'`);
  //       message.channel.send('✅ *Your playlist has been successfully deleted!*');
  //     } else {
  //       message.channel.send('❌ *Your playlist is emty now!*');
  //     }
  //   });
  // }

  // if (message.content.startsWith(`${guilds[message.guild.id].prefix}playPlaylist`) || message.content.startsWith(`${guilds[message.guild.id].prefix}ppl`)) {
  //   if (message.member.voiceChannel) {
  //     if (client.voiceConnections.get(message.guild.id) === undefined) {
  //       db.each(`SELECT comp FROM guild${message.guild.id} WHERE id = '${message.author.id}'`, (err, row) => {
  //         if (err) {
  //           throw err;
  //         }
  //         if (row.comp !== undefined) {
  //           const compos = row.comp.split(' ');
  //           guilds[message.guild.id].previous = false;
  //           guilds[message.guild.id].counter = 0;
  //           const x = compos.length + guilds[message.guild.id].collectorIdArr.length;
  //           for (let i = guilds[message.guild.id].collectorIdArr.length; i < x; i += 1) {
  //             guilds[message.guild.id].collectorIdArr[i] = message.author.id;
  //           }
  //           guilds[message.guild.id].queue = compos;
  //           guilds[message.guild.id].queueArr = guilds[message.guild.id].queue;
  //           player(message, guilds[message.guild.id].queue[0]);
  //           guilds[message.guild.id].conec = message.member.voiceChannel;
  //           message.member.voiceChannel.join()
  //             .then(() => {
  //               sayAndPlay(message, 'Starting. R', guilds[message.guild.id].queue, 0);
  //             })
  //             .catch();
  //         } else {
  //           message.channel.send("❌ *You don't have a playlist! Type* ***!createPlaylist*** *to create this!*");
  //         }
  //       });
  //     } else {
  //       db.each(`SELECT comp FROM guild${message.guild.id} WHERE id = '${message.author.id}';`, (err, row) => {
  //         if (err) {
  //           throw err;
  //         }
  //         if (row.comp !== undefined) {
  //           const compos1 = row.comp.split(' ');
  //           const x1 = compos1.length + guilds[message.guild.id].collectorIdArr.length;
  //           for (let i = guilds[message.guild.id].collectorIdArr.length; i < x1; i += 1) {
  //             guilds[message.guild.id].collectorIdArr[i] = message.author.id;
  //           }
  //           guilds[message.guild.id].queue = guilds[message.guild.id].queue.concat(compos1);
  //           guilds[message.guild.id].queueArr = guilds[message.guild.id].queue;
  //           message.channel.send('✅ *Compositions was added to the queue!*');
  //         }
  //       });
  //     }
  //   } else {
  //     message.channel.send('☝ *You need to join a voice channel!*');
  //   }
  // }


  // function playlistNow(list, message) {
  //   if (list.length !== 0) {
  //     const flag = true;
  //     Promise.all(list.map((composition) => ytdl.getInfo(composition)))
  //       .then((infos) => {
  //         if (infos !== undefined) {
  //           if (flag) {
  //             const mes = `\`\`\`yaml${
  //               infos.map((info, index) => `\n${index + 1}) ${info.title}`).join('')
  //             }\n\`\`\``;
  //             message.channel.send({
  //               embed: {
  //                 color: 3447003,
  //                 title: '*__Current list of compositions in your playlist__*',
  //                 author: {
  //                   icon_url: client.user.avatarURL,
  //                   name: client.user.username,
  //                 },
  //                 description: mes,
  //               },
  //             });
  //           }
  //         } else {
  //           message.channel.send('❌ *Invalid urls in playlist!*');
  //         }
  //       });
  //   }
  // }



  // client.on('guildMemberRemove', (member) => {
//   if (member.id === client.user.id && guilds[member.guild.id] !== undefined) {
//     guilds[member.guild.id] = {};
//     db.all("select name from sqlite_master where type='table'", (err, tables) => {
//       if (err) {
//         throw err;
//       }
//       const found = tables.find((g) => g.name === `guild${message.guild.id}`);
//       if (found !== undefined) {
//         db.run(`DROP TABLE guild${member.guild.id}`);
//       }
//     });
//   } else {
//     db.run(`SELECT comp FROM guild${member.guild.id} WHERE id = '${member.id}'`, (err, row) => {
//       if (err) {
//         throw err;
//       }
//       if (row !== undefined) db.run(`DELETE FROM guild${member.guild.id} WHERE id = '${member.id}'`);
//     });
//   }
// });


//////////////////////////////INFO

// if (message.content.startsWith(`${guilds[message.guild.id].prefix}info`) && message.author.id === '267326195178274816') {
  //   db.all("select name from sqlite_master where type = 'table'", (err, tables) => {
  //     if (err) {
  //       throw err;
  //     }
  //     let count = 1;
  //     let count2 = 0;
  //     let conn = 0;
  //     tables.forEach((table) => {
  //       db.each(`select count(id) from ${table.name}`, (err, res) => {
  //         const arr = Object.values(res);
  //         conn += arr[0];
  //         count2 += 1;
  //         if (count2 === tables.length) {
  //           let result = '```Elm\nCurrent information\n=====================================================================\n';
  //           client.guilds.forEach((guild) => {
  //             result += `${count}) ${guild.name} - ${guild.memberCount} members;\n`;
  //             count += 1;
  //           });
  //           message.guild.channels.get('595931843354820619').send(`${result}=====================================================================\n${client.guilds.size} guilds!   ${conn} playlists!    ${client.voiceConnections.size} connections!\n\`\`\``);
  //         }
  //       });
  //     });
  //   });
  // }

//////////////////////////////PREFIX

// if (message.content.startsWith(`${guilds[message.guild.id].prefix}prefix`)) {
//   const prefix = message.content.slice(8);
//   if (prefix.length === 0) {
//     message.channel.send("👎 *You didn't typed the prefix*");
//     return;
//   }
//   guilds[message.guild.id].prefix = prefix;
//   message.channel.send(`👍 *Prefix has been changed to '${guilds[message.guild.id].prefix}'*`);
// }

/////////options

// if (message.author.id === client.user.id && guilds[message.guild.id].optionFlag) {
//   guilds[message.guild.id].optionMessage = message;
//   guilds[message.guild.id].optionFlag = false;
//   optionEmoji(message);

//   optionsEmojis.forEach((emoji) => {
//     const optionFilter = (reaction, user) => {
//       if (!user.bot) {
//         return reaction.emoji.name === emoji;
//       }
//     };
//     const optionCollector = message.createReactionCollector(optionFilter, { time: 60000 });

//   });

//   const optionFilter1 = (reaction, user) => {
//     if (!user.bot) return reaction.emoji.name === '1⃣';
//   };
//   const optionFilter2 = (reaction, user) => {
//     if (!user.bot) return reaction.emoji.name === '2⃣';
//   };

//   const optionCollector1 = message.createReactionCollector(optionFilter1, { time: 60000 });
//   const optionCollector2 = message.createReactionCollector(optionFilter2, { time: 60000 });

//   optionCollector1.on('collect', (reaction) => {
//     reacNull(message, reaction);
//     if (guilds[message.guild.id].botVoice) guilds[message.guild.id].botVoice = false;
//     else guilds[message.guild.id].botVoice = true;
//     options(message, guilds[message.guild.id].optionMessage, false);
//   });
//   optionCollector2.on('collect', (reaction) => {
//     reacNull(message, reaction);
//     guilds[message.guild.id].collectorId = !guilds[message.guild.id].collectorId;
//     options(message, guilds[message.guild.id].optionMessage, false);
//   });
// }

// function options(message, opMessage, flag) {
//   let voice1 = '';
//   let collector = '';
//   if (guilds[message.guild.id].botVoice) voice1 = 'on';
//   else voice1 = 'off';

//   if (guilds[message.guild.id].collectorId) collector = 'on';
//   else collector = 'off';

//   if (flag) {
//     message.channel.send({
//       embed: {
//         color: 3447003,
//         title: '*Bot options*',
//         author: {
//           icon_url: client.user.avatarURL,
//           name: client.user.username,
//         },
//         description: `\`\`\`yaml\n1) Bot voice: ${voice1}\n\`\`\`` + `\`\`\`yaml\n2) Free acces to composition managing: ${collector}\n\`\`\``,
//         footer: {
//           icon_url: client.user.avatarURL,
//           text: 'Choose the option you want to change',
//         },
//       },
//     });
//   } else {
//     opMessage.edit({
//       embed: {
//         color: 3447003,
//         title: '*Bot options*',
//         author: {
//           icon_url: client.user.avatarURL,
//           name: client.user.username,
//         },
//         description: `\`\`\`yaml\n1) Bot voice: ${voice1}\n\`\`\`` + `\`\`\`yaml\n2) Free acces to composition managing: ${collector}\n\`\`\``,
//         footer: {
//           icon_url: client.user.avatarURL,
//           text: 'Choose the option you want to change',
//         },
//       },
//     });
//   }
// }

///////////////////////volume

// if (message.content.startsWith(`${guilds[message.guild.id].prefix}volume`)) {
//   guilds[message.guild.id].emojiVolume = true;
//   let enVol = '';

//   if (guilds[message.guild.id].streamOptions.volume === 0.1) enVol = '🔈';
//   if (guilds[message.guild.id].streamOptions.volume === 0.5) enVol = '🔉';
//   if (guilds[message.guild.id].streamOptions.volume === 1) enVol = '🔊';

//   message.channel.send({
//     embed: {
//       color: 7419530,
//       author: {
//         icon_url: client.user.avatarURL,
//         name: client.user.username,
//       },
//       description: `🎧*Current volume level: *${enVol}`,
//     },
//   });
// }

// if (message.author.id === client.user.id && guilds[message.guild.id].emojiVolume) {
//   volumeEmoji(message);
//   guilds[message.guild.id].emojiVolume = false;

//   const volumeFilter1 = (reaction, user) => {
//     if (!user.bot) return reaction.emoji.name === '🔈';
//   };
//   const volumeFilter2 = (reaction, user) => {
//     if (!user.bot) return reaction.emoji.name === '🔉';
//   };
//   const volumeFilter3 = (reaction, user) => {
//     if (!user.bot) return reaction.emoji.name === '🔊';
//   };

//   const volumeCollector1 = message.createReactionCollector(volumeFilter1);
//   const volumeCollector2 = message.createReactionCollector(volumeFilter2);
//   const volumeCollector3 = message.createReactionCollector(volumeFilter3);

//   volumeCollector1.on('collect', (reaction) => {
//     guilds[message.guild.id].streamOptions.volume = 0.1;
//     clearReaction(message, reaction);
//   });
//   volumeCollector2.on('collect', (reaction) => {
//     guilds[message.guild.id].streamOptions.volume = 0.5;
//     clearReaction(message, reaction);
//   });
//   volumeCollector3.on('collect', (reaction) => {
//     guilds[message.guild.id].streamOptions.volume = 1;
//     clearReaction(message, reaction);
//   });
// }

///////////////////////voice

// if (message.content.startsWith(`${guilds[message.guild.id].prefix}voice`)) {
//   guilds[message.guild.id].emojiVoice = true;
//   let curVoice;
//   if (guilds[message.guild.id].voice === 'en') curVoice = 'female';
//   else curVoice = 'robot';
//   message.channel.send({
//     embed: {
//       color: 3447003,
//       description: '🗣 *You can change the bot voice to 👄 ```yaml\nrobot\n``` ```Elm\nfemale\n```*',
//       author: {
//         icon_url: client.user.avatarURL,
//         name: client.user.username,
//       },
//       footer: {
//         text: `Current voice: ${curVoice}`,
//       },
//     },
//   });
// }

// if (message.author.id === client.user.id && guilds[message.guild.id].emojiVoice) {
//   guilds[message.guild.id].emojiVoice = false;
//   voiceEmoji(message);

//   const voiceFilter1 = (reaction, user) => {
//     if (!user.bot) return reaction.emoji.name === '🤖';
//   };
//   const voiceFilter2 = (reaction, user) => {
//     if (!user.bot) return reaction.emoji.name === '👩';
//   };

//   const voiceCollector1 = message.createReactionCollector(voiceFilter1, { time: 60000 });
//   const voiceCollector2 = message.createReactionCollector(voiceFilter2, { time: 60000 });

//   voiceCollector1.on('collect', (reaction) => {
//     clearReaction(message, reaction);
//     message.channel.send('🗣 *Voice has been changed to* 👄 ```yaml\nrobot\n```');
//     guilds[message.guild.id].voice = 'hr-HR';
//   });
//   voiceCollector2.on('collect', (reaction) => {
//     clearReaction(message, reaction);
//     message.channel.send('🗣 *Voice has been changed to* 👄 ```Elm\nfemale\n```');
//     guilds[message.guild.id].voice = 'en';
//   });
// }


///////////////////////clean command

// if (message.content.startsWith(`${prefix}clean`)) {
//   const voiceConnection = client.voiceConnections.get(message.guild.id);
//   if (!voiceConnection) {
//     message.channel.send('❌ *There is no voice connection!*');
//     return;
//   }
//   message.channel.send(`♻ *Voice connection has been removed from the* ***${voiceConnection.channel.name}*** *channel!*`);
//   client.voiceConnections.get(message.guild.id).disconnect();
// }