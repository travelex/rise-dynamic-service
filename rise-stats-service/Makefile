include ../common/ci/Makefile-lambda

build:
	cd serverless && \
    	npm install --no-progress && \
    	SLS_DEBUG=* $(SLS_PATH) package --stage dev
	
test: default_test

deploy:
	cd serverless && \
    		SLS_DEBUG=* $(SLS_PATH) print --stage dev && \
    		SLS_DEBUG=* $(SLS_PATH) deploy --verbose --stage dev --package .serverless
