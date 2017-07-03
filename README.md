# Storybook Vue Demo

This is a demo app to test VueJs integration with Storybook.

 1. `git clone ...`
 2. Install and upgrade nodejs
		
		apt-get install nodejs-legacy npm
		
		curl -o- https://raw.githubusercontent.com/creationix/n~/.profilevm/v0.33.2/install.sh | bash

		gedit ~/.profile

		export NVM_DIR="$HOME/.nvm"
		[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

		nvm run node --version

 2. Install yarn globally (`npm install -g -dd yarn`)
 3. Install the storybook CLI globally (`npm i -g @storybook/cli`) 
 4. Install dependencies (`yarn install`, it uses same repositories as npm)
 5. Run the dev storybook server (`yarn storybook`)
 6. Build for storybook production (`yarn build-storybook`)
 7. Run dev App (`yarn dev`)
 7. Build for production App (`yarn build`)


> Written with [StackEdit](https://stackedit.io/).
