.PHONY: clean install test test-integration test-unit shrinkwrap

MOCHA_OPTS= --check-leaks
REPORTER = dot

test:
	node --version
	test-unit test-integration

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS) \
		test/unit/**

test-integration:
	@NODE_ENV=test node test/integration/runner.js

test-load:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS) \
		test/load/**

shrinkwrap:
	rm -rf node_modules
	npm cache clear
	npm install --production
	npm shrinkwrap
	npm install --production
	npm shrinkwrap
	clingwrap npmbegone

clean:
	rm -rf node_modules

install:
	npm --version
	npm install

circle-install:
	curl --remote-name https://raw.githubusercontent.com/Shyp/set-node-npm/master/set-node-npm
	chmod +x set-node-npm
	./set-node-npm

