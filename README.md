# RaphValo
A Valorant API tool to modify your skin collection, Instant lock agents in matches and modify your rank!

# ℹ️ Information
For a better understanding of this project and the Valorant API, Visit [here](https://valapidocs.techchrism.me/)

# 🌟 Features
* Agent Instant Locker
* Skin Changer

# 🔧 Usage
You can run / build the source or get the compiled release [here](https://github.com/raph-exe/RaphValo/releases)!

### 📝 Using the source
Install the required dependencies using the following command:
```
npm i
```

Run the client side of the application using:
```
npm run dev
```

Run the application (server side) using the following command:
```
electron .
```
If electron is not installed on your device you can install it globally using `npm i electron -g`

### 📦 Compiling the source
Install `electron-builder` globally using `npm i electron-builder -g`

* Run `npm run build` to compile the client side [Creates directory called "dist"].
* Rename the directory `dist` to `build`.
* Run `electron-builder` in the directory.

# 🔥 Note
This tool just contacts the API to set your collection and may not change your skins ingame, However in rare chances the API may grant you the skins ingame due to issues in verifying whether you own the item or not.
