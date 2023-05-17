const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const isDev = require('electron-is-dev');
const path = require('path');
const axios = require('axios');
const https = require('https');

require('@electron/remote/main').initialize();

var mainWindow, axiosClient, accessToken, entitlementsToken, playerUUid, riotClientVersion, myInterval;

let region = 'eu'; // na, latam, br, eu, ap, kr - Depending on region of ur account
let shard = 'eu'; // ap, kr, eu, na, pbe - Depending on shard of your account

app.whenReady().then(() => {
    axios.get('https://valorant-api.com/v1/version').then(res => {
        riotClientVersion = res.data.data.riotClientVersion;
    })
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    require('@electron/remote/main').enable(mainWindow.webContents);
    mainWindow.setMenu(null);
    mainWindow.loadURL(isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, '../build/index.html')}`);
});

ipcMain.on('localfolder' , () => {
    mainWindow.webContents.send('localfolder', process.env.LOCALAPPDATA);
})

ipcMain.on('instaLock', (event, arg1, arg2) => {
    if (arg1 == true) {
        myInterval = setInterval(() => {
            try {
                axiosClient.get(`https://glz-${region}-1.${shard}.a.pvp.net/pregame/v1/players/${playerUUid}`, {
                    headers: {
                        common: {
                            'Authorization': 'Bearer ' + accessToken,
                            'X-Riot-Entitlements-JWT': entitlementsToken
                        }
                    }
                }).then(res => {
                    if (res.data?.MatchID) {
                        clearInterval(myInterval)
                        mainWindow.webContents.send('locked')
                        setTimeout(() => {
                            axiosClient.post(`https://glz-${region}-1.${shard}.a.pvp.net/pregame/v1/matches/${res.data.MatchID}/lock/${arg2}`, {}, {
                                headers: {
                                    common: {
                                        'Authorization': 'Bearer ' + accessToken,
                                        'X-Riot-Entitlements-JWT': entitlementsToken
                                    }
                                },
                            }).catch(err => { })
                        }, 1000)
                    }
                }).catch(err => { })
            } catch (err) {

            }
        }, 1000);
    }
    else {
        clearInterval(myInterval)
    }
})

ipcMain.on('auth', (event, port, password) => {
    axiosClient = axios.create({
        baseURL: `https://127.0.0.1:${port}/`,
        timeout: 1000,
        headers: {
            common: {
                'User-Agent': 'ShooterGame/8 Windows/10.0.19042.1.768.64bit',
                'X-Riot-ClientPlatform': 'ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuNzY4LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9',
                'X-Riot-ClientVersion': riotClientVersion,
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`riot:${password}`).toString('base64')
            },
            put: {
                'Content-Type': 'application/json'
            }
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        })
    })
    axiosClient.get('entitlements/v1/token').then(res => {
        accessToken = res.data.accessToken;
        entitlementsToken = res.data.token;
        axios.get('https://auth.riotgames.com/userinfo', {
            headers: {
                common: {
                    'Authorization': 'Bearer ' + accessToken
                }
            }
        }).then(res => {
            playerUUid = res.data.sub;
            setTimeout(() => {
                mainWindow.webContents.send('userAuth', res.data);
            }, 1000)
        }).catch(err => { console.log('AxiosErr', err) })
    }).catch(err => { console.log('AxiosErr', err) })
})

ipcMain.on('equip', (event, skinUid) => {
    if (!axiosClient) return mainWindow.webContents.send('unauthorized');
    axiosClient.get(`https://pd.${shard}.a.pvp.net/personalization/v2/players/${playerUUid}/playerloadout`, {
        headers: {
            common: {
                'Authorization': 'Bearer ' + accessToken,
                'X-Riot-Entitlements-JWT': entitlementsToken
            }
        }
    }).then(res => {
        let sampleBody = res.data;
        console.log(sampleBody)
        axios.get('https://valorant-api.com/v1/weapons').then(ress => {
            const gun = ress.data.data.find(weapon => weapon.skins.some(skin => skin.uuid == skinUid));
            sampleBody.Guns.find(sampleGun => sampleGun.ID == gun.uuid).SkinID = skinUid;
            axiosClient.put(`https://pd.${shard}.a.pvp.net/personalization/v2/players/${playerUUid}/playerloadout`, sampleBody, {
                headers: {
                    common: {
                        'Authorization': 'Bearer ' + accessToken,
                        'X-Riot-Entitlements-JWT': entitlementsToken
                    }
                }
            })
        })
    });
})

process.on("unhandledRejection", async (reason, p, origin) => {
    console.log(reason.stack);
});

process.on("uncaughtExceptionMonitor", async (err, origin) => {
    console.log(err.stack);
});