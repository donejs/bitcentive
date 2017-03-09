publish-docs:
	npm install
	git checkout -b gh-pages
	npm run document
	git add -f docs/
	git add -f test/
	git add -f public/node_modules/can-*
	git add -f public/node_modules/steal
	git add -f public/node_modules/steal-*
	git add -f public/node_modules/done-component
	git add -f public/node_modules/feathers
	git add -f public/node_modules/feathers-*
	git add -f public/node_modules/jwt-decode
	git add -f public/node_modules/socket.io-client
	git add -f public/node_modules/bootstrap
	git add -f public/node_modules/rubberduck
	git add -f public/node_modules/debug
	git add -f public/node_modules/events
	git add -f public/node_modules/ms
	git add -f public/node_modules/moment
	git add -f public/node_modules/less
	git add -f public/node_modules/uberproto
	git commit -m "Publish docs"
	git push -f origin gh-pages
	git rm -q -r --cached public/node_modules
	git checkout -
	git branch -D gh-pages

