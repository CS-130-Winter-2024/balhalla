# Balhalla

[![Release](https://img.shields.io/github/v/release/melaasar/cs130-template?label=release)](https://github.com/melaasar/cs130-template/releases/latest)

Balhalla is a viking-themed .IO game of dodgeball that has a unique ghost mechanic after being eliminated. We developed this project with an emphasis on 3D FPS accessibility for lower-performance devices and a focus on fun gameplay over graphics.

## Building

The source code for Balhalla in this repository can be triggered to build using the following methods. We highly recommend that you use Replit due to its quality-of-life features.

### Replit (Preferred)

1. Navigate to [https://replit.com/@Big-Cheung/balhalla](https://replit.com/@Big-Cheung/balhalla).
2. To build and test the program after making changes, simply click the green 'Run' button at the top of the window.
3. Click the 'New tab' button under the Webview tab in the upper right side to test changes in a player view.

### Local Development

1. Navigate to your preferred terminal and a directory where you would like to develop the game (such as a folder for your repositories).
2. Run `git clone https://github.com/CS-130-Winter-2024/balhalla.git` in the terminal to clone the repository.
3. Run `cd client` to navigate to the 'client' directory.
4. Run `npm i` in the 'client' directory to install the required packages.
5. Run `cd ..` to navigate to the 'balhalla' directory.
6. Run `npm i` in the 'balhalla' directory to install the required packages.
   1. NOTE: You may have to delete the package-lock.json files and rerun `npm i` in both directories to resolve errors.
7. Run `npm start` in the 'balhalla' directory to build the program.
8. Navigate to [http://localhost:8080/](http://localhost:8080/) on your preferred browser to view your changes.
