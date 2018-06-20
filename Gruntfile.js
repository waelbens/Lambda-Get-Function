var grunt = require('grunt');
grunt.loadNpmTasks('grunt-aws-lambda');

grunt.initConfig({
	lambda_invoke: {
    	default: {
        	options: {
            	file_name: 'index.js'
        	}
    	}
	},
	lambda_deploy: {
    	default: {
    		arn: 'arn:aws:lambda:us-east-2:890472922539:function:by-get-data',
		options: {
			region: 'us-east-2'
		}
    	}
    },
	lambda_package: {
    	default: {
		include_time: false,
		include_version: false	
    	}
	}
});

grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy'])
