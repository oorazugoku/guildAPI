import fetch from 'isomorphic-fetch';
import base64 from 'base-64';
import cron from 'node-cron';
require('dotenv').config()

const client_id = process.env.NODE_ENV === "development" ? process.env.DEV_CLIENT_ID : process.env.CLIENT_ID;
const client_secret = process.env.NODE_ENV === "development" ? process.env.DEV_SECRET : process.env.SECRET;
const encodedAuth = base64.encode(client_id + ':' + client_secret);

let data: Data;

cron.schedule('*/30 * * * *', async () => {
    data = await fetchAllData();
});


export async function getServerSideProps() {
  return { props: { data } };
}


export async function getToken() {
  try {
    const res = await fetch('https://oauth.battle.net/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + encodedAuth
      },
      body: 'grant_type=client_credentials'
    });
    if (!res.ok) {
      throw new Error(`Failed to get token, status: ${res.status}`);
    }
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

interface Data {
    [endpoint: string]: any;
}

let guildData: Data = {};

export async function fetchAllData(): Promise<Data> {
  try {
      const token = await getToken();
      const URL: any = {
          Guild: `https://us.api.blizzard.com/data/wow/guild/malganis/resurgence?namespace=profile-us&locale=en_US&access_token=${token.access_token}`,
          Roster: `https://us.api.blizzard.com/data/wow/guild/malganis/resurgence/roster?namespace=profile-us&locale=en_US&access_token=${token.access_token}`
      };
      for (let endpoint in URL) {
          const res = await fetch(URL[endpoint], {
              headers: {
                  'Authorization': 'Bearer ' + token.access_token
              }
          });
          if (!res.ok) {
              throw new Error(`Failed to fetch data from API, status: ${res.status}`);
          }
          const json = await res.json();
          guildData[endpoint] = json;
      }
      const filteredMembers = guildData.Roster.members.filter((member: any) => member.character.level === 70 && member.rank < 6)
      guildData.Roster.members = filteredMembers

      guildData = await fetchToons(token, guildData);
      guildData = await fetchEquipment(token, guildData);
      guildData = await fetchKeystone(token, guildData);
      guildData = await fetchRole(token, guildData);

      return guildData;
  } catch (err) {
      console.error(err);
      throw err;
  }
}

const fetchToons = async (token: any, data: Data) => {
  if (data.Roster.members.length > 0) {
    const characters = data.Roster.members;
    let normalizedMembers: any = {};
    characters.forEach((character: any) => {
        normalizedMembers[character.character.id] = character;
    });
    data['Roster'] = normalizedMembers;
    const updateData = async (data: Data) => {
        const updatedRoster: any = {...data.Roster};
        const promises = Object.values(data.Roster).map(async (each: any) => {
            const response = await fetch(each.character.key.href + '&locale=en_US&access_token=' + token.access_token, {
              headers: {
                'Authorization': 'Bearer ' + token.access_token
              }
            });
            const json = await response.json();
            updatedRoster[each.character.id].character.key = json;
        });
        await Promise.all(promises);
        return {...data, Roster: updatedRoster};
    }
    return await updateData(data);
  }
  return data;
}

const fetchEquipment = async (token: any, data: Data) => {
  if (data.Roster) {
    const characters = Object.values(data.Roster);
    let normalizedMembers: any = {};
    characters.forEach((character: any) => {
        normalizedMembers[character.character.id] = character;
    });
    data['Roster'] = normalizedMembers;
    const updateData = async (data: Data) => {
        const updatedRoster: any = {...data.Roster};
        const promises = Object.values(data.Roster).map(async (each: any) => {
            const response = await fetch(each.character.key.equipment.href + '&locale=en_US&access_token=' + token.access_token, {
              headers: {
                'Authorization': 'Bearer ' + token.access_token
              }
            });
            const json = await response.json();
            updatedRoster[each.character.id].character.key.equipment = json;
        });
        await Promise.all(promises);
        return {...data, Roster: updatedRoster};
    }
    return await updateData(data);
  }
  return data;
}

const fetchKeystone = async (token: any, data: Data) => {
  if (data.Roster) {
    const characters = Object.values(data.Roster);
    let normalizedMembers: any = {};
    characters.forEach((character: any) => {
        normalizedMembers[character.character.id] = character;
    });
    data['Roster'] = normalizedMembers;
    const updateData = async (data: Data) => {
        const updatedRoster: any = {...data.Roster};
        const promises = Object.values(data.Roster).map(async (each: any) => {
            const response = await fetch(each.character.key.mythic_keystone_profile.href + '&locale=en_US&access_token=' + token.access_token, {
              headers: {
                'Authorization': 'Bearer ' + token.access_token
              }
            });
            const json = await response.json();
            updatedRoster[each.character.id].character.key.mythic_keystone_profile = json;
        });
        await Promise.all(promises);
        return {...data, Roster: updatedRoster};
    }
    return await updateData(data);
  }
  return data;
}

const fetchRole = async (token: any, data: Data) => {
  if (data.Roster) {
    const characters = Object.values(data.Roster);
    let normalizedMembers: any = {};
    characters.forEach((character: any) => {
        normalizedMembers[character.character.id] = character;
    });
    data['Roster'] = normalizedMembers;
    const updateData = async (data: Data) => {
        const updatedRoster: any = {...data.Roster};
        const promises = Object.values(data.Roster).map(async (each: any) => {
            const response = await fetch(each.character.key.active_spec.key.href + '&locale=en_US&access_token=' + token.access_token, {
              headers: {
                'Authorization': 'Bearer ' + token.access_token
              }
            });
            const json = await response.json();
            updatedRoster[each.character.id].character.key.active_spec.key = json;
        });
        await Promise.all(promises);
        return {...data, Roster: updatedRoster};
    }
    return await updateData(data);
  }
  return data;
}
